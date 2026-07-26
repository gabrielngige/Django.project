# GitHub Secrets Setup Guide
## Render & Vercel Integration for CI/CD

This guide will walk you through getting all necessary secrets from Render and Vercel, then adding them to GitHub for automated deployment.

---

## Part 1: Render Backend Deployment Hook

### Step 1: Log in to Render
1. Go to https://render.com
2. Log in with your account
3. Go to your **Dashboard**

### Step 2: Create/Access Your Backend Service
1. Click on your backend service (if it exists)
   - OR click **"New +"** → **"Web Service"** to create one
2. Connect your GitHub repository when prompted

### Step 3: Get the Deploy Hook
1. In your service page, go to **Settings** (bottom tab)
2. Scroll down to **"Deploy Hook"**
3. Click **"Copy Deploy Hook"** button
4. You'll get something like:
   ```
   https://api.render.com/deploy/srv-abc123def456?key=xyz789
   ```

### Step 4: Configure Render Environment Variables
1. In your service, go to **Environment**
2. Add these variables (click **"Add Environment Variable"**):
   ```
   DJANGO_SECRET_KEY=your-very-secret-key-here
   DJANGO_DEBUG=False
   DJANGO_ALLOWED_HOSTS=your-domain.onrender.com
   DB_NAME=tavern109_db
   DB_USER=tavern109
   DB_PASSWORD=your-db-password
   DB_HOST=your-render-db-host
   DB_PORT=5432
   CORS_ALLOWED_ORIGINS=https://your-frontend-url.com
   TAVERN_WHATSAPP_NUMBER=254700000000
   ```

### Step 5: Save for GitHub
✅ Copy and save this URL:
```
RENDER_DEPLOY_HOOK=https://api.render.com/deploy/srv-abc123def456?key=xyz789
```

---

## Part 2: Vercel Frontend Deployment

### Step 1: Log in to Vercel
1. Go to https://vercel.com
2. Log in with your account
3. Go to your **Dashboard**

### Step 2: Access Your Frontend Project
1. Click on your frontend project (if it exists)
   - OR click **"Add New"** → **"Project"** to create one
2. Import from GitHub when prompted

### Step 3: Get Your Vercel Token

#### Method A: Personal Access Token (Recommended)
1. Go to https://vercel.com/account/tokens
2. Click **"Create Token"**
3. Give it a name: `github-ci-deployment`
4. Set expiration to 90 days or longer
5. Copy the token immediately (you won't see it again!)
   ```
   Example: abc123def456xyz789...
   ```

#### Method B: Using Vercel CLI
```bash
npm install -g vercel
vercel login
# This will create a token in your local config
```

### Step 4: Get Your Vercel Project ID

#### Method A: From Dashboard
1. Go to your project in Vercel
2. Click **Settings** → **General**
3. Scroll to **"Project ID"**
4. Copy it (looks like: `prj_abc123def456`)

#### Method B: Using Vercel CLI
```bash
vercel whoami
vercel projects list
# Find your project and note the ID
```

### Step 5: Get Your Organization ID
1. Go to https://vercel.com/account/general
2. Under **"Team"** section, find your team/organization
3. The URL will show: `https://vercel.com/dashboard/org-123abc`
4. Your org ID is: `org-123abc`

OR if using personal account:
1. Go to **Settings** → **General**
2. Find **"Vercel URL"** showing your username
3. Your org ID is your username

### Step 6: Configure Vercel Environment Variables
1. In your project, go to **Settings** → **Environment Variables**
2. Add:
   ```
   VITE_API_BASE_URL=https://your-backend-api.onrender.com/api
   ```
3. Click **"Save"**

### Step 7: Save for GitHub
✅ Copy and save these:
```
VERCEL_TOKEN=abc123def456xyz789...
VERCEL_ORG_ID=your-org-id-or-username
VERCEL_PROJECT_ID=prj_abc123def456
```

---

## Part 3: Add Secrets to GitHub

### Step 1: Go to Your GitHub Repository
1. Navigate to https://github.com/your-username/109-TAVERN
2. Click **Settings** (top right)
3. In left sidebar, click **Secrets and variables** → **Actions**

### Step 2: Add Render Secret
1. Click **"New repository secret"**
2. **Name:** `RENDER_DEPLOY_HOOK`
3. **Value:** (Paste your Render deploy hook URL)
4. Click **"Add secret"**

### Step 3: Add Vercel Secrets (3 total)

#### Secret 1: Vercel Token
1. Click **"New repository secret"**
2. **Name:** `VERCEL_TOKEN`
3. **Value:** (Paste your Vercel token)
4. Click **"Add secret"**

#### Secret 2: Vercel Organization ID
1. Click **"New repository secret"**
2. **Name:** `VERCEL_ORG_ID`
3. **Value:** (Paste your Vercel org ID)
4. Click **"Add secret"**

#### Secret 3: Vercel Project ID
1. Click **"New repository secret"**
2. **Name:** `VERCEL_PROJECT_ID`
3. **Value:** (Paste your Vercel project ID)
4. Click **"Add secret"**

### Step 4: Verify All Secrets Added
Your secrets list should now show:
```
✅ RENDER_DEPLOY_HOOK
✅ VERCEL_TOKEN
✅ VERCEL_ORG_ID
✅ VERCEL_PROJECT_ID
```

---

## Part 4: Test the Deployment

### Step 1: Make a Test Commit
```bash
cd /home/gabriel/AXLE/109\ TAVERN
git add -A
git commit -m "Test CI/CD deployment pipeline"
git push origin main
```

### Step 2: Watch GitHub Actions
1. Go to your GitHub repo
2. Click **Actions** tab
3. You should see your workflow running
4. Wait for it to complete

### Step 3: Check Deployment Status

#### For Backend (Render)
1. Go to https://render.com dashboard
2. Click your backend service
3. Check **Deploys** tab
4. You should see a new deployment starting
5. Watch logs for build progress

#### For Frontend (Vercel)
1. Go to https://vercel.com dashboard
2. Click your project
3. Check **Deployments** tab
4. You should see a new deployment starting
5. Watch for build completion

### Step 4: Verify URLs Work
- **Backend:** `https://your-backend.onrender.com/api/offerings/`
  - Should return JSON list of offerings
- **Frontend:** `https://your-frontend.vercel.app/`
  - Should load your site

---

## Part 5: Environment Variables Checklist

### Backend (.env on Render)
```
✅ DJANGO_SECRET_KEY=
✅ DJANGO_DEBUG=False
✅ DJANGO_ALLOWED_HOSTS=
✅ DB_NAME=
✅ DB_USER=
✅ DB_PASSWORD=
✅ DB_HOST=
✅ DB_PORT=5432
✅ CORS_ALLOWED_ORIGINS=
✅ TAVERN_WHATSAPP_NUMBER=
```

### Frontend (.env on Vercel)
```
✅ VITE_API_BASE_URL=https://your-backend-api.onrender.com/api
```

### GitHub Secrets
```
✅ RENDER_DEPLOY_HOOK=
✅ VERCEL_TOKEN=
✅ VERCEL_ORG_ID=
✅ VERCEL_PROJECT_ID=
```

---

## Troubleshooting

### ❌ GitHub Actions showing errors?

**Check 1: Secrets not found**
- Verify secret names match exactly:
  - `RENDER_DEPLOY_HOOK` (not `render_deploy_hook`)
  - `VERCEL_TOKEN` (not `vercel_token`)
- Go to Settings → Secrets and verify all 4 are there

**Check 2: Deploy hook not working**
- Go to Render dashboard
- Click your service
- Check **Logs** tab for error messages
- Common issues:
  - Wrong DB credentials
  - Missing environment variables
  - Port already in use

**Check 3: Vercel deployment failing**
- Go to Vercel dashboard
- Click your project
- Check **Deployments** → latest build
- Click to see full build logs
- Common issues:
  - Missing `VITE_API_BASE_URL`
  - Frontend trying to reach wrong backend URL

### ❌ Backend not accessible after deployment?

**Solution:**
1. Go to Render dashboard
2. Click your service
3. Copy the service URL
4. Update GitHub secret: `VERCEL_ORG_ID` with new URL if domain changed
5. Redeploy frontend

### ❌ CORS errors in browser console?

**Solution:**
1. Get your Vercel frontend URL: `https://your-app.vercel.app`
2. Go to Render backend settings
3. Update `CORS_ALLOWED_ORIGINS` to include it
4. Redeploy backend

---

## Complete Workflow Example

```bash
# 1. Make changes
vim backend/core_api/models.py

# 2. Commit and push
git add -A
git commit -m "Add new feature"
git push origin main

# 3. GitHub Actions automatically:
#    ✓ Runs tests
#    ✓ Runs linting
#    ✓ Triggers Render deploy hook
#    ✓ Triggers Vercel deploy

# 4. Check progress:
#    - GitHub: Actions tab
#    - Render: Dashboard → Deploys
#    - Vercel: Dashboard → Deployments

# 5. View live at:
#    - Backend: https://your-backend.onrender.com
#    - Frontend: https://your-app.vercel.app
```

---

## Security Best Practices

✅ **DO:**
- Use Vercel tokens that expire (90 days)
- Regenerate tokens regularly
- Keep secrets secret (never commit to git)
- Use different tokens for different services
- Rotate secrets quarterly

❌ **DON'T:**
- Commit secrets to git
- Share secrets in Slack/email
- Use same token in multiple projects
- Keep tokens without expiration
- Log secrets in error messages

---

## Quick Reference

### Render Deploy Hook Format
```
https://api.render.com/deploy/srv-XXXXXXXXXX?key=XXXXXXXXXX
```

### Vercel Token Format
```
vercel_abc123def456xyz789...
```

### Vercel Project ID Format
```
prj_abc123def456
```

### Vercel Org ID Format
```
Either: your-username
Or:     your-org-name
```

---

## Next Steps

1. ✅ Get all secrets from Render and Vercel (steps above)
2. ✅ Add secrets to GitHub repository
3. ✅ Make a test commit to trigger CI/CD
4. ✅ Monitor GitHub Actions, Render, and Vercel for success
5. ✅ Check that your live URLs work
6. ✅ Celebrate! 🎉

