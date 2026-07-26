# GitHub Secrets Quick Reference Card

## Where to Find Each Secret

### 🔗 RENDER_DEPLOY_HOOK
**Location:** Render Dashboard → Your Service → Settings → Deploy Hook
**Format:** `https://api.render.com/deploy/srv-XXXXXX?key=XXXXXX`
**How to get it:**
1. Go to https://render.com/dashboard
2. Click your backend service
3. Scroll to "Deploy Hook" section
4. Click "Copy"

---

### 🎫 VERCEL_TOKEN
**Location:** Vercel → Account → Tokens
**Format:** `vercel_abc123...`
**How to get it:**
1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name: `github-ci-deployment`
4. Copy immediately (won't show again!)

---

### 🏢 VERCEL_ORG_ID
**Location:** Vercel → Account → Team/Username
**Format:** `your-username` OR `org-abc123`
**How to get it:**
1. Go to https://vercel.com/account/general
2. Look at "Team" section
3. Use your username OR organization name
4. OR check URL: `vercel.com/dashboard/org-XXXXX`

---

### 📦 VERCEL_PROJECT_ID
**Location:** Vercel Project → Settings → General
**Format:** `prj_abc123def456`
**How to get it:**
1. Go to https://vercel.com/dashboard
2. Click your project
3. Click Settings → General
4. Find "Project ID"
5. Copy it

---

## Step-by-Step: Add to GitHub

1. **Go to:** GitHub → Your Repo → Settings → Secrets and variables → Actions

2. **Click:** "New repository secret"

3. **Add 4 secrets:**

| Secret Name | Value Source |
|-------------|--------------|
| `RENDER_DEPLOY_HOOK` | From Render (step 1 above) |
| `VERCEL_TOKEN` | From Vercel (step 2 above) |
| `VERCEL_ORG_ID` | From Vercel (step 3 above) |
| `VERCEL_PROJECT_ID` | From Vercel (step 4 above) |

---

## Test It

```bash
# Make a test commit
git add -A
git commit -m "Test deployment"
git push origin main

# Watch progress
# 1. GitHub Actions tab → see workflow run
# 2. Render dashboard → see backend deploy
# 3. Vercel dashboard → see frontend deploy
```

---

## Verify It Works

✅ **Backend:** `https://your-backend.onrender.com/api/offerings/`
✅ **Frontend:** `https://your-app.vercel.app/`

---

## Troubleshooting Checklist

- [ ] All 4 secrets added to GitHub
- [ ] Secret names match EXACTLY (case sensitive)
- [ ] Values copied completely (no extra spaces)
- [ ] Backend environment variables set in Render
- [ ] Frontend VITE_API_BASE_URL set in Vercel
- [ ] GitHub Actions workflow updated (.github/workflows/deploy.yml)
- [ ] Test commit pushed to main
- [ ] Render logs show no errors
- [ ] Vercel deployment logs show no errors

---

## Still Having Issues?

Check these logs in order:

1. **GitHub Actions** (most common errors):
   - Go to Actions tab
   - Click failed workflow
   - See error message

2. **Render Logs**:
   - Dashboard → Service → Logs tab
   - Scroll down for error details

3. **Vercel Logs**:
   - Dashboard → Project → Deployments
   - Click latest build
   - View build output

---

## Important Security Notes

⚠️ **NEVER:**
- Share tokens in Slack/email/documents
- Commit tokens to git
- Post tokens in issues/PRs
- Use same token in multiple places

✅ **DO:**
- Regenerate tokens regularly
- Use tokens with expiration dates
- Rotate secrets quarterly
- Check token usage in dashboards

