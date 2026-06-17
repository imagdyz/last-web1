# Deploy STOMACH on Hostinger

## 1. MySQL database

1. In hPanel, create a MySQL database and user.
2. Open **phpMyAdmin** and import `database.sql` (and optionally `seed.sql` if you use it).
3. If the database already existed, use **phpMyAdmin → Import** on `backend/migrations/hostinger_upgrade.sql`. If copy-paste breaks line endings, use `hostinger_upgrade_one_line.sql` instead (one line, four statements). Ignore **#1060 Duplicate column** if that column already exists.

## 2. Backend (PHP API)

1. Upload the **`backend`** folder to your hosting document root so the API URL is:

   `https://YOUR-DOMAIN/backend/api/`

2. Copy `backend/config.local.example.php` to **`backend/config.local.php`** and set:

   - `db_name`, `db_user`, `db_pass` from hPanel  
   - `gemini_api_key` for the AI chatbot **or** set environment variable `GEMINI_API_KEY` in hPanel (recommended).

3. Ensure PHP has the **cURL** extension enabled (usually on by default on Hostinger).

4. Test: open `https://YOUR-DOMAIN/backend/api/chatbot.php` — you should see JSON `status: ok`.

## 3. Frontend (React build)

1. On your PC, in the **`form`** folder:

   ```bash
   npm install
   npm run build
   ```

2. Optional: create **`form/.env.production`** if the API is **not** on the same domain:

   ```env
   VITE_API_URL=https://YOUR-DOMAIN/backend/api
   ```

   If you omit this, the built app uses **`https://current-site/backend/api`** (same origin).

3. Upload **everything inside** `form/dist/` into **`public_html`** (or your domain’s web root), so `index.html` sits next to the `assets` folder.

4. Confirm **`public/.htaccess`** was copied into the build (Vite copies `public/` → `dist/`). It is required so React Router URLs refresh correctly.

## 4. Folder layout (typical)

```text
public_html/
  index.html          ← from form/dist
  assets/             ← from form/dist
  .htaccess           ← SPA rewrite, from form/dist
  backend/
    config.php
    config.local.php  ← you create this; not from git
    api/
      auth.php
      ...
```

## 5. HTTPS and mixed content

Use **https://** for your site so the browser allows the microphone (chatbot voice) and avoids blocked API calls.

## 6. Admin accounts

Admin role is assigned in `backend/api/auth.php` by email list (`abdo@admin.com`, `magdy@admin.com`). Change those emails or add a proper `role` column later if you need more admins.
