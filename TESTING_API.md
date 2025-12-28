# Testing the Backend API

## 🎯 Quick Tests

### 1. Test Render Backend Directly

#### Health Check
```bash
curl https://your-render-backend-url.onrender.com/health
```

Expected response:
```json
{"status":"ok"}
```

#### Get All Executions (should return empty array initially)
```bash
curl https://your-render-backend-url.onrender.com/api/executions
```

Expected response:
```json
[]
```

#### Get Specific Execution
```bash
curl https://your-render-backend-url.onrender.com/api/executions/execution-id-here
```

### 2. Test from Browser

Open these URLs directly in your browser:

1. **Health Check:**
   ```
   https://your-render-backend-url.onrender.com/health
   ```

2. **Get Executions:**
   ```
   https://your-render-backend-url.onrender.com/api/executions
   ```

You should see JSON responses.

### 3. Test from Vercel Dashboard (Network Tab)

1. Open your Vercel dashboard in browser (Chrome DevTools)
2. Press `F12` or `Cmd+Option+I` to open Developer Tools
3. Go to **Network** tab
4. Refresh the page or click "Refresh" button in dashboard
5. Look for requests to `/api/executions` or your full Render URL
6. Click on the request to see:
   - **Request URL**: Should be your Render backend URL
   - **Status Code**: Should be `200` (success) or `404` (if no data)
   - **Response**: Should show JSON data

### 4. Test with Demo App

Run the demo app pointing to your Render backend:

```bash
cd packages/demo-app
API_BASE=https://your-render-backend-url.onrender.com npm run dev
```

This will:
- Create an execution
- Send it to your Render backend
- Show success message if it works

Then check the API:
```bash
curl https://your-render-backend-url.onrender.com/api/executions
```

You should see the execution you just created!

### 5. Test POST Request (Store Execution)

```bash
curl -X POST https://your-render-backend-url.onrender.com/api/executions \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-exec-123",
    "startedAt": "2024-01-01T00:00:00.000Z",
    "steps": [
      {
        "id": "step-1",
        "name": "Test Step",
        "input": {"test": "data"},
        "startedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }'
```

Expected response:
```json
{"id":"test-exec-123","message":"Execution stored successfully"}
```

### 6. Check CORS Issues

If you see CORS errors in the browser console, check:

1. **Backend CORS configuration** - Should allow your Vercel domain
2. **Browser console** - Look for CORS error messages
3. **Network tab** - Check if request shows CORS errors

Common CORS error:
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Fix**: Update backend CORS to allow your Vercel domain, or use `ALLOWED_ORIGINS` environment variable.

## 🔍 Debugging Steps

### Check Environment Variable in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify `VITE_API_BASE_URL` is set correctly:
   - Should be: `https://your-render-backend-url.onrender.com/api`
   - Must include `/api` at the end
3. **Important**: After changing env vars, redeploy!

### Check Browser Console

1. Open Vercel dashboard
2. Open DevTools (F12)
3. Go to **Console** tab
4. Look for:
   - Network errors (red)
   - API errors
   - CORS errors

### Check Network Requests

In DevTools → Network tab:
- Filter by "XHR" or "Fetch"
- Look for requests to your Render URL
- Check status codes:
  - `200` = Success ✅
  - `404` = Not found (might be normal if no data)
  - `500` = Server error ❌
  - `CORS error` = CORS configuration issue ❌

### Test Locally First

Before testing production:

```bash
# Terminal 1: Start backend
npm run dev:server

# Terminal 2: Start dashboard
npm run dev:dashboard

# Terminal 3: Run demo
npm run dev:demo
```

If local works but production doesn't, it's likely:
- Environment variable not set correctly
- CORS configuration
- Backend not accessible

## 📝 Quick Test Checklist

- [ ] Render backend `/health` endpoint returns `{"status":"ok"}`
- [ ] Render backend `/api/executions` returns `[]` or execution data
- [ ] Vercel dashboard shows network requests to Render backend
- [ ] No CORS errors in browser console
- [ ] Environment variable `VITE_API_BASE_URL` is set correctly
- [ ] Demo app can send data to Render backend
- [ ] Dashboard can fetch executions from Render backend

## 🚨 Common Issues

### Issue: 404 Not Found
**Cause**: Wrong URL or environment variable not set
**Fix**: Check `VITE_API_BASE_URL` includes `/api`

### Issue: CORS Error
**Cause**: Backend not allowing Vercel domain
**Fix**: Update backend CORS or set `ALLOWED_ORIGINS` environment variable

### Issue: Network Error
**Cause**: Backend not running or wrong URL
**Fix**: Test backend directly with curl first

### Issue: Empty Array Returned
**Status**: ✅ This is normal if no executions exist yet!
**Next**: Run demo app to create test data

