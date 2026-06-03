# AR Drop

Upload a `.glb` 3D model → get a QR code → anyone scans it and the model appears in their real world via AR.

## Deploy to Netlify (2 minutes)

### Option A — Netlify Drop (fastest, no account needed for a test)
1. Go to **https://app.netlify.com/drop**
2. Drag the entire `ar-drop` **folder** onto the page
3. Netlify gives you a live URL — done!

> ⚠️ Netlify Drop doesn't support serverless functions (Blobs won't work).  
> For full functionality use Option B below.

---

### Option B — GitHub + Netlify (recommended, free)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "init"
   gh repo create ar-drop --public --push
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com → "Add new site" → "Import from Git"
   - Select your repo
   - Build settings are auto-detected from `netlify.toml`
   - Click **Deploy site**

3. **Done.** Your app is live at `https://your-site-name.netlify.app`

---

## How it works

```
/                          → Upload page (HTML)
/upload         POST       → Netlify Function: receives .glb, stores in Netlify Blobs, returns { id }
/model/:id      GET        → Netlify Function: streams model bytes from Blobs by ID
/?m=<id>&n=<name>          → Viewer page (same HTML, AR mode activated by query params)
```

## File size limit
40 MB per model. Compress at https://gltf.report if needed.

## AR support
| Platform | Browser | AR Mode |
|----------|---------|---------|
| Android  | Chrome  | WebXR / Scene Viewer |
| iPhone/iPad | Safari | AR Quick Look |
| Desktop  | Any | 3D preview only (no AR) |
