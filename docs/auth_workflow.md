# Authentication Flow — Keycloak + React (keycloak-js)

## Actors involved

| Actor | What it is |
|---|---|
| **Browser** | The user's browser running the React app |
| **Frontend (Nginx)** | Serves the built React/JS files on `localhost:3000` |
| **Keycloak** | The auth server running on `localhost:8080` |
| **Realm (`agrabah`)** | A tenant/namespace inside Keycloak — isolates users, clients, settings |
| **Client (`city-app`)** | The registered app inside the realm — Keycloak knows this app exists and trusts it |
| **Users** | Three accounts stored in Keycloak's user database (see table below) |

### Users & roles

| Username | Password | Roles | Pages accessible |
|---|---|---|---|
| `aladdin` | `monkeyabu` | `agrabah-access`, `bazaar-access` | Agrabah, Bazaar |
| `jasmine` | `royalpalace` | `agrabah-access`, `palace-access` | Agrabah, Palace |
| `genie` | `threewishes` | `agrabah-access`, `bazaar-access`, `palace-access` | All three |

### Realm roles

| Role | Guards |
|---|---|
| `agrabah-access` | `/` — Agrabah (index, all users) |
| `bazaar-access` | `/bazaar` — The Grand Bazaar |
| `palace-access` | `/palace` — The Royal Palace |

---

## Step 1 — Browser requests the app

User navigates to `http://localhost:3000`.

Nginx serves `index.html` + the compiled JS bundle. React mounts in the browser.

---

## Step 2 — KeycloakProvider initializes

`main.jsx` wraps the entire React tree with `<KeycloakProvider>`, which immediately calls:

```js
keycloak.init({ onLoad: 'login-required', checkLoginIframe: false })
```

The `keycloak-js` library checks the browser for an existing session:
- Looks for an active SSO session cookie for the `agrabah` realm
- Checks `sessionStorage` for a previously stored token

Nothing is found — this is a fresh visit.

While this check runs, `LoginPage` renders ("Seeking the cave of wonders...").

---

## Step 3 — Keycloak JS redirects the browser to Keycloak

Because `onLoad: 'login-required'` and no session was found, `keycloak-js` constructs an **Authorization Request URL** and redirects the browser to it:

```
http://localhost:8080
  /realms/agrabah
  /protocol/openid-connect/auth
  ?client_id=city-app
  &redirect_uri=http%3A%2F%2Flocalhost%3A3000
  &response_type=code
  &scope=openid
  &state=<random string>
  &nonce=<random string>
  &code_challenge=<PKCE hash>
  &code_challenge_method=S256
```

Key parameters:
- `client_id=city-app` — tells Keycloak which app is asking
- `redirect_uri` — where Keycloak should send the user back after login
- `response_type=code` — Authorization Code flow (not tokens directly)
- `state` — random value to prevent CSRF; keycloak-js stores it locally to verify later
- `code_challenge` / `code_challenge_method` — **PKCE** (Proof Key for Code Exchange); prevents code interception attacks since this is a public client with no secret

---

## Step 4 — Keycloak serves its login page

The browser is now fully on `http://localhost:8080`. Keycloak renders its login form.

Keycloak looks up the `agrabah` realm, finds the `city-app` client, verifies the `redirect_uri` is in the allowed list (`http://localhost/*`), and shows the form.

---

## Step 5 — User submits credentials

Example: user types `aladdin` / `monkeyabu` and submits.

Keycloak:
1. Looks up `aladdin` in the `agrabah` realm's user database
2. Hashes the submitted password and compares it to the stored hash
3. Checks the account is enabled and not locked
4. **Credentials valid** — generates a short-lived **Authorization Code** (random opaque string, ~1 minute TTL, single-use)
5. Reads the roles assigned to `aladdin` (`agrabah-access`, `bazaar-access`) — these will be embedded in the access token

---

## Step 6 — Keycloak redirects back to the app with the code

Keycloak redirects the browser back to the `redirect_uri` with the code attached:

```
http://localhost:3000
  ?code=eyJhbGciOi...  (the authorization code)
  &state=<same random string from step 3>
  &session_state=<keycloak session id>
```

The browser is now back on the frontend app. React re-mounts, `keycloak-js` runs again.

---

## Step 7 — keycloak-js detects the code in the URL

`keycloak-js` sees `?code=...` in the URL and:
1. Verifies the `state` parameter matches what it stored in step 3 (CSRF check)
2. Cleans the code out of the URL (replaces browser history so it's not visible)

---

## Step 8 — keycloak-js exchanges the code for tokens

`keycloak-js` makes a **POST request directly from the browser** to Keycloak's token endpoint:

```
POST http://localhost:8080/realms/agrabah/protocol/openid-connect/token

client_id=city-app
grant_type=authorization_code
code=eyJhbGciOi...
redirect_uri=http://localhost:3000
code_verifier=<original PKCE secret from step 3>
```

The `code_verifier` is the pre-image of the `code_challenge` sent in step 3. Keycloak hashes it and checks it matches — this proves the same browser that started the flow is completing it.

Keycloak responds with **three tokens** (JSON):

```json
{
  "access_token":  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id_token":      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in":    300,
  "token_type":    "Bearer"
}
```

| Token | Purpose | TTL |
|---|---|---|
| **Access Token** (JWT) | Proves identity; contains user roles (`realm_access.roles`), email, sub | 5 min |
| **Refresh Token** (JWT) | Used to get a new access token when it expires, without re-login | 30 min |
| **ID Token** (JWT) | Contains user profile info (name, email) — for the client app only | 5 min |

The decoded `realm_access` claim inside the access token looks like this (for `aladdin`):

```json
{
  "realm_access": {
    "roles": ["agrabah-access", "bazaar-access"]
  },
  "preferred_username": "aladdin"
}
```

---

## Step 9 — keycloak-js validates the tokens

Before trusting the tokens, `keycloak-js`:
1. Fetches Keycloak's **public signing key** from `http://localhost:8080/realms/agrabah/protocol/openid-connect/certs` (JWKS endpoint)
2. Verifies the JWT **signature** on the access token and ID token using that public key — ensures Keycloak actually signed them and they weren't tampered with
3. Verifies the `nonce` claim inside the ID token matches the nonce from step 3
4. Verifies `iss` (issuer) matches `http://localhost:8080/realms/agrabah`
5. Verifies `aud` (audience) matches `city-app`

---

## Step 10 — KeycloakProvider unlocks the app

`keycloak.init()` resolves with `authenticated = true`.

`KeycloakProvider` sets `status = 'authenticated'` and renders the React Router tree.

`keycloak-js` stores the tokens in **memory** (not localStorage, for security) and sets up an automatic timer to silently refresh the access token using the refresh token before it expires.

---

## Step 11 — Role-based routing (ProtectedRoute)

React Router renders the route matching the current URL. Every protected route is wrapped with `<ProtectedRoute role="...">`, which calls:

```js
keycloak.hasRealmRole('agrabah-access')  // checks realm_access.roles in the token
```

### Route table

| URL | Required role | Who gets in |
|---|---|---|
| `/` | `agrabah-access` | aladdin, jasmine, genie |
| `/bazaar` | `bazaar-access` | aladdin, genie |
| `/palace` | `palace-access` | jasmine, genie |

**If the role check passes** → the page component renders.

**If the role check fails** → `<Navigate to="/unauthorized" />` — the user sees the "palace guards bar your way" page.

### What each user sees on `/`

After login all users land on `/` (Agrabah — the index page). The `<NavCards>` component then calls `keycloak.hasRealmRole()` again to decide which destination cards to show:

| User | Nav cards visible |
|---|---|
| `aladdin` | The Bazaar |
| `jasmine` | The Palace |
| `genie` | The Bazaar + The Palace |

---

## SSO — What happens if the user revisits later

Keycloak sets an **SSO session cookie** (`KEYCLOAK_SESSION`) in the browser scoped to `localhost:8080`. If the user closes and reopens the browser:

- Step 2: `keycloak.init()` runs again
- `keycloak-js` silently loads an invisible iframe pointing to Keycloak's check-session endpoint
- Keycloak sees the SSO cookie, recognizes the active session, and returns fresh tokens silently
- User never sees a login form — they land directly on the Agrabah page with their roles intact

---

## Summary diagram

```
  Browser                  Nginx (Frontend)         Keycloak               Postgres
     │                            │                     │                      │
     │                            │                     │                      │
     │  ── GET / ────────────────►│                     │                      │
     │  ◄── index.html + JS ──────│                     │                      │
     │                            │                     │                      │
     │  (1) keycloak.init() runs — no existing session found                   │
     │                            │                     │                      │
     │  ── redirect ──────────────┼────────────────────►│                      │
     │       GET /realms/agrabah/protocol/openid-connect/auth                  │
     │            ?client_id=city-app&response_type=code                     │
     │            &code_challenge=<PKCE hash>&state=<random>                   │
     │  ◄── Keycloak login form ──┼─────────────────────│                      │
     │                            │                     │                      │
     │  (2) user types aladdin / monkeyabu              │                      │
     │                            │                     │                      │
     │  ── POST credentials ──────┼────────────────────►│                      │
     │                            │                     │── lookup user ──────►│
     │                            │                     │◄── user + roles ─────│
     │                            │                     │    (agrabah-access,   │
     │                            │                     │     bazaar-access)    │
     │  ◄── 302 redirect ─────────┼─────────────────────│                      │
     │       Location: localhost:3000?code=XYZ&state=<same>                    │
     │                            │                     │                      │
     │  (3) keycloak-js: verifies state, strips code from URL                  │
     │                            │                     │                      │
     │  ── POST /token ───────────┼────────────────────►│                      │
     │       code=XYZ                                   │                      │
     │       code_verifier=<PKCE pre-image>             │                      │
     │  ◄── tokens ───────────────┼─────────────────────│                      │
     │       { access_token  (JWT, 5 min)               │                      │
     │         refresh_token (JWT, 30 min)              │                      │
     │         id_token      (JWT, 5 min) }             │                      │
     │                            │                     │                      │
     │  (4) keycloak-js: fetches JWKS, validates JWT signatures                │
     │      keycloak.init() resolves → authenticated = true                    │
     │                            │                     │                      │
     │  (5) React Router renders /                      │                      │
     │      ProtectedRoute: hasRealmRole('agrabah-access') → PASS              │
     │      <Agrabah /> renders; NavCards shows role-filtered destinations      │
     │                            │                     │                      │
     │  (6) user clicks "The Bazaar"                    │                      │
     │      ProtectedRoute: hasRealmRole('bazaar-access') → PASS               │
     │      <Bazaar /> renders    │                     │                      │
     │                            │                     │                      │
```
