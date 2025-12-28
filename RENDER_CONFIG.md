# Render Configuration - Final Fix

## The Issue

Render is still using the old build command. The build logs show:
- Build command: `npm install && npm run build` (OLD)
- It should be: `npm install && npm run build` (but with Root Directory = `.`)

OR if Root Directory is `packages/xray-server`, the prebuild hook will handle it.

## Solution (Two Options)

### Option A: Root Directory = `.` (Project Root) - RECOMMENDED ✅

**In Render Dashboard:**

1. **Root Directory:** `.` (or leave empty - this means project root)
2. **Build Command:** 
   ```bash
   npm install && npm run build:server
   ```
   OR use the deploy script (includes npm install):
   ```bash
   npm run build:server:deploy
   ```
3. **Start Command:**
   ```bash
   cd packages/xray-server && npm start
   ```

---

### Option B: Root Directory = `packages/xray-server` (Current Setting)

I've added a `prebuild` hook that automatically builds the SDK before the server.

**In Render Dashboard:**

1. **Root Directory:** `packages/xray-server` (keep as is)
2. **Build Command:** 
   ```bash
   npm install && npm run build
   ```
   The `prebuild` hook will automatically build the SDK first!
3. **Start Command:**
   ```bash
   npm start
   ```

**BUT WAIT** - There's still a problem: `npm install` in the subdirectory won't install the SDK workspace dependency properly.

So you MUST use **Option A** or update the build command to:

**Build Command:**
```bash
cd ../.. && npm install && cd packages/xray-server && npm run build
```

---

## ✅ RECOMMENDED: Use Option A

**Root Directory:** `.` (project root - leave empty or enter `.`)

**Build Command:**
```bash
npm install && npm run build:server
```

**Start Command:**
```bash
cd packages/xray-server && npm start
```

This is the cleanest solution and will work reliably.

---

## 🚨 IMPORTANT: Update Render Settings

**The build command in Render MUST be updated!** 

The logs show it's currently running `npm run build` which builds ALL workspaces (including demo-app and dashboard that fail because SDK isn't ready).

### Step-by-Step in Render

1. Go to your service in Render
2. Click **Settings** tab
3. Scroll to **"Build & Deploy"** section
4. **Update these EXACT values:**
   - **Root Directory:** `.` (or leave EMPTY - means project root)
   - **Build Command:** `npm install && npm run build:server` ⚠️ **MUST CHANGE THIS**
   - **Start Command:** `cd packages/xray-server && npm start`
5. Click **Save Changes**
6. Render will automatically redeploy

**The build command is currently:** `npm install && npm run build` ❌  
**It should be:** `npm install && npm run build:server` ✅

After updating, the build should succeed! ✅

