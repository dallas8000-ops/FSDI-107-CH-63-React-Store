# Deploy React Store Catalog on Render

This guide walks through **PostgreSQL**, the **Express API** (Web Service), and the **Vite static frontend** (Static Site). Render’s UI changes occasionally; if a label differs, use the equivalent in your dashboard.

---

## 1. Prerequisites

- GitHub repo connected to Render (this project).
- A **paid or free** Render account; free tiers **spin down** Web Services after inactivity (first request can take ~30–60s).
- You will set **secrets only in the Render dashboard** — never commit `server/.env` or root `.env` with real passwords.

---

## 2. Create PostgreSQL

1. Dashboard → **New +** → **PostgreSQL**.
2. **Name** — e.g. `catalog-db`.
3. **Database** / **User** — defaults are fine; note them.
4. **Region** — choose the **same region** you plan for the API (lower latency).
5. **Plan** — Free or paid per your needs.
6. Click **Create Database** and wait until status is **Available**.

### Get the connection string

- Open the database → **Connections** (or **Info**).
- Copy **Internal Database URL**  
  - Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`  
  - Use **internal** when your **API runs on Render** in the same account/region so traffic stays on Render’s network.
- Use **External Database URL** only if the API runs **outside** Render (e.g. your laptop hitting cloud Postgres) or Render docs say internal is not reachable from your service type.

You will paste this value as **`DATABASE_URL`** on the API service (section 4).

---

## 3. Plan your URLs

Write these down before configuring CORS and the frontend build:

| Piece | Example | Used for |
|--------|---------|----------|
| API public URL | `https://catalog-api-xxxx.onrender.com` | Browser calls, `VITE_API_URL` |
| Static site URL | `https://catalog-web-xxxx.onrender.com` | User visits app; must appear in **`CORS_ORIGIN`** |

Rules:

- Always **`https://`** in production.
- **No trailing slash** on `VITE_API_URL` (the app appends `/api/...`).
- **`CORS_ORIGIN`** must match the **exact** origin the browser uses (scheme + host + port if non-default).

---

## 4. Create the API (Web Service)

1. **New +** → **Web Service** → **Build and deploy from a Git repository** → authorize GitHub → select **React-Store-Catalog**.
2. **Name** — e.g. `catalog-api`.
3. **Region** — same as Postgres when possible.
4. **Branch** — `main` (or your deploy branch).
5. **Root directory** — leave **empty** (repo root). The API lives under `server/`.
6. **Runtime** — **Node**.
7. **Build command:**

   ```bash
   cd server && npm ci
   ```

8. **Start command:**

   ```bash
   cd server && node index.js
   ```

   Render injects **`PORT`**; this app reads `process.env.PORT` — do **not** hardcode a port in Render for the HTTP server.

9. **Instance type** — Free or paid.

10. **Health check path** (optional but recommended):  
    `/api/health`  
    Render will GET this URL on your service hostname to decide if the deploy is healthy.

### Environment variables (API service)

Open **Environment** for this Web Service and add:

| Key | Required | Notes |
|-----|----------|--------|
| `DATABASE_URL` | Yes | Internal (or External) URL from Postgres |
| `JWT_SECRET` | Yes | Long random string, **≥ 16 characters** |
| `ADMIN_USERNAME` | Optional | Defaults to `admin` in code if unset |
| `ADMIN_PASSWORD` | Yes | **≥ 5 characters** in this repo’s rules; use a strong password in production |
| `CORS_ORIGIN` | Yes for browser from another hostname | Static site URL, e.g. `https://catalog-web-xxxx.onrender.com`. Comma-separated for multiple origins. |
| `DATABASE_SSL` | Optional | `false` / `true` to override auto SSL detection (see `server/db.js`) |
| `PGPOOL_MAX` | Optional | Default `10` |
| `IMAGES_DIR` | Optional | Only if `public/images` is not next to the server the way Render runs it; ephemeral disk unless you add a **persistent disk** |

Do **not** set `PORT` yourself unless you know Render’s behavior for your plan; Render sets it.

Click **Save** and **Deploy**. Wait for **Live**.

### First-time database setup (migrate + seed)

The API does **not** run migrations automatically on boot. After the first successful deploy:

1. Open the Web Service → **Shell** (or **SSH** if enabled).
2. Run:

   ```bash
   cd server && npm run db:setup
   ```

   That runs `migrate.js` (creates tables) and `seed.js` (loads `server/seed/products.json` if the products table is empty).

3. Re-run only migrations later if you add new SQL:

   ```bash
   cd server && npm run migrate
   ```

### Verify the API

- Browser or curl: `https://YOUR-API.onrender.com/api/health` → JSON with `"status":"ok"`.
- Login check (replace host and body as needed):

  ```bash
  curl -s -X POST https://YOUR-API.onrender.com/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"YOUR_ADMIN_USER","password":"YOUR_ADMIN_PASSWORD"}'
  ```

You should get JSON with a **`token`** field.

---

## 5. Create the static frontend (Static Site)

The UI is a **Vite** SPA: build outputs **`dist/`**. The browser must know the **API origin** at **build time** via **`VITE_API_URL`**.

1. **New +** → **Static Site** → same GitHub repo.
2. **Name** — e.g. `catalog-web`.
3. **Branch** — `main`.
4. **Root directory** — empty (repo root).
5. **Build command:**

   ```bash
   npm ci && npm run build
   ```

6. **Publish directory:**

   ```text
   dist
   ```

### Environment variables (Static Site — build-time)

Add **before** the first build (or trigger **Clear build cache & deploy** after changing):

| Key | Required | Example |
|-----|----------|---------|
| `VITE_API_URL` | Yes for cross-origin API | `https://catalog-api-xxxx.onrender.com` |

- No trailing slash.
- Must be the **public** API URL the user’s browser can reach.

Save and deploy. Open the static URL; test **Catalog** and **`/admin`**.

### If the catalog loads but admin fails

- **CORS** — Browser console may show blocked requests. Fix **`CORS_ORIGIN`** on the **API** to exactly your static origin (`https://…`).
- **Wrong API URL** — Rebuild static site after changing **`VITE_API_URL`**.
- **401 on login** — Wrong `ADMIN_*` or API not reading env (redeploy API after env changes).

---

## 6. Order of operations (checklist)

1. Create **PostgreSQL** → copy **Internal Database URL**.
2. Create **Web Service** (API) → build/start commands → set **`DATABASE_URL`**, **`JWT_SECRET`**, **`ADMIN_PASSWORD`**, **`CORS_ORIGIN`** (use placeholder static URL if needed, then update after step 3).
3. Deploy API → **Shell** → `cd server && npm run db:setup`.
4. Confirm **`/api/health`** and login **`/api/auth/login`**.
5. Create **Static Site** → set **`VITE_API_URL`** to API URL → deploy.
6. Set **`CORS_ORIGIN`** on API to the **final** static URL → **Manual Deploy** API if you had a placeholder.

---

## 7. Free tier and cold starts

- **Web Services** on the free tier **sleep** after idle time. The first request wakes the process (slow).
- **Static sites** do not sleep the same way; the **API** does.
- For a demo, that’s often acceptable; for production, consider a **paid** Web Service to reduce sleep or eliminate it.

---

## 8. Custom domains (optional)

- **Static Site** → **Settings** → **Custom Domain** — add your domain; follow Render DNS instructions.
- **Web Service** — same for `api.yourdomain.com`.
- Update **`CORS_ORIGIN`** and **`VITE_API_URL`** to match, then **redeploy** both.

---

## 9. Images and uploads

- **`GET /api/images`** reads from disk (`public/images` relative to the repo, or **`IMAGES_DIR`**).
- On Render, the filesystem is **ephemeral** unless you attach a **persistent disk** and point **`IMAGES_DIR`** at it.
- For durable images in production, use **S3**, **Cloudinary**, or similar and store URLs in the database (would require app changes beyond this doc).

---

## 10. Troubleshooting

| Symptom | Things to check |
|---------|-------------------|
| API build fails | `cd server && npm ci` locally on same Node major as Render (e.g. 22). |
| API crashes on start | Logs: missing **`DATABASE_URL`**, **`JWT_SECRET`** too short, **`ADMIN_PASSWORD`** too short. |
| Postgres connection errors | **`DATABASE_SSL`**: try `true` if SSL errors persist; confirm URL is internal vs external. |
| `502` / connection refused from browser | API sleeping, wrong **`VITE_API_URL`**, or typo in host. |
| CORS errors in console | **`CORS_ORIGIN`** must include exact static origin (scheme + host, no path). |
| Admin 401 | Wrong admin password; env not saved; need redeploy after env change. |
| Empty catalog from API | Migrations/seed not run; check DB tables in Render Postgres **Connect** / external client. |

---

## 11. Repo reference

- **`server/env.example`** — all server env keys with comments.
- **`server/db.js`** — SSL behavior for hosted Postgres.
- **Root `.env.example`** — `VITE_API_URL`, `API_PROXY_TARGET` (local dev only; production static site uses Render env UI).

For a shorter overview, see **README.md** → section **Deploying on Render**.
