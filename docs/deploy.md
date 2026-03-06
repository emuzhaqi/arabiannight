# Deployment Guide: Vercel + Fly.io + Supabase (Terraform)

## Architecture

```
Browser
  │
  ├── GET https://<app>.vercel.app       → Vercel (React static build)
  │     VITE_KEYCLOAK_URL baked in at build time
  │
  └── OIDC flow → https://keycloak-agrabah.fly.dev
                          │
                          └── JDBC → Supabase PostgreSQL
```

| Component  | Platform      | What runs there                              |
|------------|---------------|----------------------------------------------|
| Frontend   | Vercel        | React (Vite) static build, served from CDN   |
| Keycloak   | Fly.io        | Custom Docker image, Keycloak 26 + realm file |
| Database   | Supabase      | PostgreSQL — Keycloak backend only            |

---

## Prerequisites

Install these tools before starting:

```bash
brew install terraform flyctl
npm install -g vercel          # or: brew install vercel-cli
```

Create accounts (free tier for all):
- [supabase.com](https://supabase.com) — get your **org ID** from Settings > General
- [fly.io](https://fly.io) — run `fly auth signup`
- [vercel.com](https://vercel.com) — connect your GitHub account

Get API tokens:
- **Supabase**: Settings > Access Tokens → generate a personal access token
- **Fly.io**: `fly auth token` (prints your token)
- **Vercel**: Settings > Tokens → create a token with full scope

> **Fly.io memory note:** Keycloak requires at least 512 MB RAM. Fly.io's free allowance provides 256 MB shared VMs, which is not enough with default JVM settings. The Keycloak Dockerfile below includes aggressive JVM tuning (`-Xms64m -Xmx256m`) that makes it run in ~300 MB. The machine size used in Terraform is `shared-cpu-1x` with 512 MB, which falls within Fly.io's pay-as-you-go pricing (~$3/month if it runs 24/7, less if idle).

---

## Final directory structure

After following this guide your repo will look like:

```
arabiannight/
  docs/
    DEPLOY.md              ← this file
    AUTH_WORKFLOW.md
  frontend/
    src/
    Dockerfile
    nginx.conf
    ...
  keycloak/
    realm-export.json      ← update redirectUris before deploying (see Step 1)
    Dockerfile             ← new: custom image for Fly.io
    fly.toml               ← new: Fly.io app config
  terraform/
    providers.tf
    variables.tf
    supabase.tf
    fly.tf
    vercel.tf
    outputs.tf
    terraform.tfvars       ← gitignored, contains your tokens
    terraform.tfvars.example
```

---

## Step 1 — Choose your URLs and update realm-export.json

Before writing any Terraform, decide on your app names — you need them upfront because they determine URLs, and those URLs must be in the realm config before the image is built.

| Service  | Name you choose     | Resulting URL                             |
|----------|--------------------|--------------------------------------------|
| Fly.io   | `keycloak-agrabah` | `https://keycloak-agrabah.fly.dev`         |
| Vercel   | `arabiannight`     | `https://arabiannight.vercel.app`          |

Update `keycloak/realm-export.json` — replace the `clients` block with production URLs:

```json
"clients": [
  {
    "clientId": "city-app",
    "enabled": true,
    "publicClient": true,
    "standardFlowEnabled": true,
    "directAccessGrantsEnabled": false,
    "redirectUris": [
      "https://arabiannight.vercel.app/*"
    ],
    "webOrigins": [
      "https://arabiannight.vercel.app"
    ],
    "attributes": {
      "post.logout.redirect.uris": "https://arabiannight.vercel.app"
    }
  }
]
```

Also set `"sslRequired": "external"` at the top of the realm JSON (Keycloak will enforce HTTPS for external clients).

---

## Step 2 — Create the Keycloak Dockerfile for Fly.io

Create `keycloak/Dockerfile`:

```dockerfile
# Stage 1: build Keycloak with postgres provider optimised
FROM quay.io/keycloak/keycloak:26.0 AS builder
ENV KC_DB=postgres
RUN /opt/keycloak/bin/kc.sh build

# Stage 2: runtime image
FROM quay.io/keycloak/keycloak:26.0
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Bake the realm file into the image — imported once on first boot
COPY realm-export.json /opt/keycloak/data/import/realm-export.json

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--import-realm"]
```

Create `keycloak/fly.toml`:

```toml
app = "keycloak-agrabah"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1

  [http_service.concurrency]
    type = "connections"
    hard_limit = 100
    soft_limit = 80

[[vm]]
  memory = "512mb"
  cpu_kind = "shared"
  cpus = 1
```

The `auto_stop_machines = false` and `min_machines_running = 1` keep Keycloak always running so SSO sessions persist. If you are comfortable with cold starts and don't need persistent sessions across machine restarts, you can set `auto_stop_machines = true`.

---

## Step 3 — Terraform: providers

Create `terraform/providers.tf`:

```hcl
terraform {
  required_version = ">= 1.6"

  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
    fly = {
      source  = "fly-apps/fly"
      version = "~> 0.0.23"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
  }
}

provider "supabase" {
  access_token = var.supabase_access_token
}

provider "fly" {
  fly_api_token = var.fly_api_token
}

provider "vercel" {
  api_token = var.vercel_api_token
}
```

---

## Step 4 — Terraform: variables

Create `terraform/variables.tf`:

```hcl
variable "supabase_access_token" {
  description = "Supabase personal access token"
  type        = string
  sensitive   = true
}

variable "supabase_org_id" {
  description = "Supabase organisation ID (Settings > General)"
  type        = string
}

variable "fly_api_token" {
  description = "Fly.io API token (fly auth token)"
  type        = string
  sensitive   = true
}

variable "vercel_api_token" {
  description = "Vercel API token"
  type        = string
  sensitive   = true
}

variable "fly_app_name" {
  description = "Fly.io app name for Keycloak"
  type        = string
  default     = "keycloak-agrabah"
}

variable "vercel_project_name" {
  description = "Vercel project name"
  type        = string
  default     = "arabiannight"
}

variable "keycloak_admin_password" {
  description = "Keycloak admin console password"
  type        = string
  sensitive   = true
}
```

---

## Step 5 — Terraform: Supabase

Create `terraform/supabase.tf`:

```hcl
resource "supabase_project" "keycloak_db" {
  organization_id   = var.supabase_org_id
  name              = "arabiannight-keycloak"
  database_password = random_password.db_password.result
  region            = "us-east-1"
}

resource "random_password" "db_password" {
  length  = 32
  special = false
}

locals {
  # Supabase connection pooler URL (port 5432 = direct, 6543 = pooler)
  # Keycloak needs a direct connection (no PgBouncer in transaction mode)
  keycloak_db_url = "jdbc:postgresql://db.${supabase_project.keycloak_db.id}.supabase.co:5432/postgres"
}

output "supabase_project_id" {
  value = supabase_project.keycloak_db.id
}
```

Add `random` to providers.tf required_providers block:

```hcl
random = {
  source  = "hashicorp/random"
  version = "~> 3.0"
}
```

---

## Step 6 — Terraform: Fly.io (Keycloak)

Create `terraform/fly.tf`:

```hcl
resource "fly_app" "keycloak" {
  name = var.fly_app_name
  org  = "personal"
}

resource "fly_ip" "keycloak_ipv4" {
  app        = fly_app.keycloak.name
  type       = "v4"
  depends_on = [fly_app.keycloak]
}

resource "fly_ip" "keycloak_ipv6" {
  app        = fly_app.keycloak.name
  type       = "v6"
  depends_on = [fly_app.keycloak]
}

# Secrets are stored encrypted by Fly.io and injected as env vars at runtime
resource "fly_secret" "keycloak_db_url" {
  app   = fly_app.keycloak.name
  name  = "KC_DB_URL"
  value = local.keycloak_db_url
}

resource "fly_secret" "keycloak_db_username" {
  app   = fly_app.keycloak.name
  name  = "KC_DB_USERNAME"
  value = "postgres"
}

resource "fly_secret" "keycloak_db_password" {
  app   = fly_app.keycloak.name
  name  = "KC_DB_PASSWORD"
  value = random_password.db_password.result
}

resource "fly_secret" "keycloak_admin_password" {
  app   = fly_app.keycloak.name
  name  = "KEYCLOAK_ADMIN_PASSWORD"
  value = var.keycloak_admin_password
}
```

> **Note on machine deployment:** The `fly-apps/fly` Terraform provider creates the app and allocates IPs, but deploying the actual machine (building the Docker image and running the container) is done separately with `fly deploy`. This is a limitation of the current provider. See Step 8 for the deployment command.

---

## Step 7 — Terraform: Vercel

Create `terraform/vercel.tf`:

```hcl
resource "vercel_project" "frontend" {
  name      = var.vercel_project_name
  framework = "vite"

  git_repository = {
    type = "github"
    repo = "<your-github-username>/arabiannight"   # update this
  }

  root_directory = "frontend"
}

# Build-time env vars — Vite bakes these into the JS bundle
resource "vercel_project_environment_variable" "keycloak_url" {
  project_id = vercel_project.frontend.id
  key        = "VITE_KEYCLOAK_URL"
  value      = "https://${var.fly_app_name}.fly.dev"
  target     = ["production", "preview"]
}

resource "vercel_project_environment_variable" "keycloak_realm" {
  project_id = vercel_project.frontend.id
  key        = "VITE_KEYCLOAK_REALM"
  value      = "agrabah"
  target     = ["production", "preview"]
}

resource "vercel_project_environment_variable" "keycloak_client_id" {
  project_id = vercel_project.frontend.id
  key        = "VITE_KEYCLOAK_CLIENT_ID"
  value      = "city-app"
  target     = ["production", "preview"]
}
```

---

## Step 8 — Terraform: outputs

Create `terraform/outputs.tf`:

```hcl
output "keycloak_url" {
  value = "https://${var.fly_app_name}.fly.dev"
}

output "frontend_url" {
  value = "https://${var.vercel_project_name}.vercel.app"
}

output "keycloak_admin_url" {
  value = "https://${var.fly_app_name}.fly.dev/admin"
}
```

---

## Step 9 — Variables file

Create `terraform/terraform.tfvars.example` (commit this):

```hcl
supabase_access_token   = "sbp_..."
supabase_org_id         = "abcdefghij"
fly_api_token           = "fo1_..."
vercel_api_token        = "..."
fly_app_name            = "keycloak-agrabah"
vercel_project_name     = "arabiannight"
keycloak_admin_password = "choose-a-strong-password"
```

Copy to `terraform/terraform.tfvars` and fill in real values. Add to `.gitignore`:

```
terraform/terraform.tfvars
terraform/.terraform/
terraform/.terraform.lock.hcl
terraform/terraform.tfstate
terraform/terraform.tfstate.backup
```

---

## Step 10 — Deploy (in order)

Dependencies must be created in this order: Supabase → Fly.io secrets → Keycloak image deploy → Vercel.

### 10a. Initialise and apply Terraform

```bash
cd terraform
terraform init
terraform apply
```

This creates:
1. Supabase project + DB
2. Fly.io app + IPs + secrets (DB URL/creds injected)
3. Vercel project + env vars

### 10b. Deploy Keycloak to Fly.io

Terraform created the app shell. Now build and deploy the Docker image:

```bash
cd ../keycloak
fly deploy --app keycloak-agrabah
```

Fly.io builds the Dockerfile locally (or on Fly's remote builders), pushes the image to its registry, and starts the machine. On first boot, Keycloak:
1. Connects to Supabase PostgreSQL
2. Creates the schema
3. Imports `realm-export.json` (the `agrabah` realm with all 3 users)

Watch logs to confirm successful import:
```bash
fly logs --app keycloak-agrabah
```

Look for: `Realm 'agrabah' imported`

### 10c. Trigger Vercel deployment

Vercel auto-deploys on push to your connected GitHub branch. Either push a commit or trigger manually from the Vercel dashboard. The env vars (`VITE_KEYCLOAK_URL`, etc.) are already set by Terraform and will be used in the build.

---

## Step 11 — Verify

```bash
# Check Keycloak is up
curl https://keycloak-agrabah.fly.dev/health/ready

# Check realm is accessible
curl https://keycloak-agrabah.fly.dev/realms/agrabah/.well-known/openid-configuration

# Open the app
open https://arabiannight.vercel.app
```

Try logging in as `aladdin` / `monkeyabu`. You should land on the Agrabah page with only the Bazaar nav card visible.

---

## Keycloak environment variables reference

These are the variables set via `fly_secret` resources. They are passed to the `start` command and Keycloak reads them automatically:

| Variable                 | Value                                      | Purpose                                     |
|--------------------------|--------------------------------------------|---------------------------------------------|
| `KC_DB`                  | `postgres` (baked into image at build)     | DB provider                                 |
| `KC_DB_URL`              | `jdbc:postgresql://db.<ref>.supabase.co/postgres` | Supabase connection string           |
| `KC_DB_USERNAME`         | `postgres`                                 | Supabase DB user                            |
| `KC_DB_PASSWORD`         | generated                                  | Supabase DB password                        |
| `KC_HOSTNAME`            | set by fly.toml via `[env]` block (optional) | Public URL — Fly.io infers from `force_https` |
| `KEYCLOAK_ADMIN`         | `admin`                                    | Admin console username                      |
| `KEYCLOAK_ADMIN_PASSWORD`| from tfvars                                | Admin console password                      |

If Keycloak logs show hostname mismatches, add this to `fly.toml` under `[env]`:

```toml
[env]
  KC_HOSTNAME         = "keycloak-agrabah.fly.dev"
  KC_HOSTNAME_STRICT  = "false"
  KC_HTTP_ENABLED     = "true"
  KC_PROXY_HEADERS    = "xforwarded"
  KEYCLOAK_ADMIN      = "admin"
  JAVA_OPTS_APPEND    = "-Xms64m -Xmx256m"
```

`JAVA_OPTS_APPEND` limits JVM heap to fit in the 512 MB Fly.io VM.

---

## Secrets and security notes

- `terraform.tfvars` is gitignored — never commit it.
- Terraform state (`terraform.tfstate`) contains secrets in plaintext. For a shared team, use a remote backend (Terraform Cloud free tier, or S3 + DynamoDB).
- The `realm-export.json` contains plaintext passwords for the test users (`monkeyabu`, etc.). These are fine for a demo but should be changed or removed before using this for anything real. In production, use temporary passwords and force a reset on first login (`"temporary": true`).
- Keycloak's admin console will be publicly accessible at `/admin`. Restrict it with a Fly.io firewall rule or change `KC_HOSTNAME_ADMIN` to a separate domain.
