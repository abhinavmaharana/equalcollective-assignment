# Vercel Deployment Configuration for Dashboard

## ✅ Fixed Issues

1. Added `@xray/sdk` as a dependency to the dashboard package
2. Added `prebuild` hook to build SDK before dashboard
3. Fixed all TypeScript errors (implicit `any` types)

## 📋 Vercel Configuration

### Option A: Using Vercel Dashboard (Recommended)

1. Go to your Vercel project dashboard
2. Go to **Settings** → **General**
3. Under **"Build & Development Settings"**:
   - **Root Directory:** `packages/xray-dashboard`
   - **Build Command:** `npm run build` (default - the prebuild hook will handle SDK)
   - **Output Directory:** `dist` (default)
   - **Install Command:** `npm install` (default)
4. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL` = `https://your-render-backend-url.onrender.com/api`
   - **Important**: Include `/api` in the URL since the backend routes are mounted at `/api`
5. Click **Save**

### Option B: Using vercel.json (Alternative)

If you prefer configuration via file, create `vercel.json` in the **project root**:

```json
{
  "buildCommand": "cd packages/xray-dashboard && npm install && npm run build",
  "outputDirectory": "packages/xray-dashboard/dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

Then in Vercel dashboard:
- **Root Directory:** Leave empty (project root)
- **Build Command:** (will use vercel.json)

### ⚠️ Important Notes

1. **Root Directory:** Should be `packages/xray-dashboard` for Option A, or project root for Option B
2. **Environment Variable:** Must set `VITE_API_BASE_URL` to your deployed backend URL
3. **The prebuild hook** will automatically build the SDK before building the dashboard

## 🔄 After Deployment

1. Test the dashboard: `https://your-vercel-app.vercel.app`
2. Make sure it can connect to your Render backend
3. Run the demo app to generate execution data
4. View the executions in the deployed dashboard

## 🚀 Quick Deploy

If using Vercel CLI:
```bash
cd packages/xray-dashboard
vercel
```

Make sure to set `VITE_API_BASE_URL` environment variable in Vercel dashboard after deployment.

