# Cloudflare, Railway & MongoDB Deployment Guide

This guide details the network and deployment steps to protect the KJSSE Council & Abhiyantriki platform from volumetric abuse, unauthorized modifications, and credential leaks.

---

## 1. Network Layer — Cloudflare DDoS & WAF Proxy Setup (~15 mins)

Railway does not provide native DDoS absorption. Placing Cloudflare in front guarantees attack traffic never exhausts Railway compute or MongoDB connection pools.

### Step 1: Add Domain to Cloudflare
1. Sign in to [Cloudflare](https://dash.cloudflare.com) (Free Plan is sufficient).
2. Click **Add a site** and enter your domain (e.g. `kjsse-council.somaiya.edu` or custom domain).
3. Cloudflare will scan existing DNS records.

### Step 2: Delegate Nameservers
1. Log into your domain registrar (e.g., GoDaddy, Namecheap, or Somaiya IT DNS Manager).
2. Replace current nameservers with the two designated Cloudflare nameservers provided (e.g. `ns1.cloudflare.com`, `ns2.cloudflare.com`).
3. Allow standard DNS propagation.

### Step 3: Enable Orange-Cloud Proxying
1. Under Cloudflare **DNS** records:
   - Add/edit the `CNAME` or `A` record pointing to your Railway frontend or backend domain.
   - Ensure the Proxy Status cloud icon is **Orange (Proxied)**, NOT Grey (DNS-only).
   - **Crucial**: Never publicize the raw `*.up.railway.app` URL anywhere public. All client traffic must route through your Cloudflare-proxied domain.

### Step 4: Turn On Bot Fight Mode & Rate Limiting Rules
1. In Cloudflare Dashboard, navigate to **Security** → **Bots**:
   - Enable **Bot Fight Mode** (blocks automated scraper / curl flood scripts).
2. Navigate to **Security** → **WAF** → **Rate limiting rules**:
   - Create Rule: `Abuse Protection on /api`
   - Field: `URI Path` starts with `/api/`
   - Requests: `> 60 requests per 1 minute per IP`
   - Action: `Block` for `1 hour` (or `Managed Challenge`).
3. **Emergency Toggle**: If a DDoS spike occurs during fest registration peaks, flip on **"I'm Under Attack Mode"** (Security Overview) to enforce an instant cryptographic challenge before any request reaches Railway.

---

## 2. Railway Deployment

The backend service in `server/` is preconfigured with `Procfile` and `railway.json`.

### Steps:
1. In the [Railway Dashboard](https://railway.com), click **New Project** → **Deploy from GitHub repo**.
2. Select your repository, and set the **Root Directory** to `/server`.
3. In **Variables**, add the following environment variables (from `server/.env.example`):
   ```env
   PORT=5000
   NODE_ENV=production
   ALLOWED_ORIGINS=https://your-fest-domain.com,https://abhiyantriki2026.somaiya.edu
   MONGODB_URI=mongodb+srv://<db_user>:<db_pass>@cluster0.xxxxx.mongodb.net/kjsse_council?retryWrites=true&w=majority
   SUPABASE_URL=https://<your-project-id>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key-never-shared>
   ALERT_WEBHOOK_URL=https://discord.com/api/webhooks/...
   INITIAL_GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/1FAIpQLSedXlK3LEjnhzmK-MYlxT1kH8sscxsm9aZMcHIiBMzygT5raQ/viewform?usp=publish-editor
   ```
4. Deploy service. Railway will automatically build via Nixpacks and run `npm start`.

---

## 3. MongoDB Atlas Hardening

1. **Least-Privilege Database User**:
   - In MongoDB Atlas → **Database Access** → **Add New Database User**.
   - Role: Restrict to `readWrite` on only the `kjsse_council` database (do NOT grant `atlasAdmin` or cluster-wide admin).
2. **Network Access / IP Allowlisting**:
   - In MongoDB Atlas → **Network Access**:
   - Whitelist Railway's outbound static IPs (or if using dynamic IPs, require strong certificate / SCRAM authentication and maintain strict app-layer rate limiting).
3. **TLS Encryption & Connection String**:
   - Atlas clusters enforce TLS 1.2+ encryption in transit by default with `mongodb+srv://`.
4. **Data Isolation**:
   - Registrations are bound by `userId` to the authenticated Supabase user session.
   - High-privilege actions (Google Form modification) are logged in the immutable `AuditLog` collection.

---

## 4. Google Form URL Defense & Alerting

1. **Allowlist Enforcement**:
   - The backend strictly enforces `hostname === "docs.google.com"` and `pathname.startsWith("/forms/")`.
   - Any phishing redirect attempt is rejected with HTTP 400.
2. **Re-Authentication Gate**:
   - Every mutation requires providing account credentials in `reauthPassword`.
3. **Real-time Incident Webhook**:
   - Providing `ALERT_WEBHOOK_URL` (e.g. Discord or Slack incoming webhook) dispatches a real-time embed immediately when the Google Form URL or an admin privilege is updated.
