# Deployment Guide

This document provides instructions for deploying the TalentFlow application to various platforms.

## Quick Deploy Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

   Or simply push to GitHub and import the repository on [vercel.com](https://vercel.com)

### Option 2: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
   
   Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

### Option 3: GitHub Pages

1. **Add to `vite.config.ts`:**
   ```typescript
   export default defineConfig({
     base: '/repository-name/',
     // ... rest of config
   });
   ```

2. **Build and deploy**
   ```bash
   npm run build
   npm install -g gh-pages
   gh-pages -d dist
   ```

### Option 4: Static Hosting (Any Provider)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder** to any static hosting provider:
   - AWS S3 + CloudFront
   - Google Cloud Storage
   - Azure Static Web Apps
   - Firebase Hosting

## Build Configuration

The build creates an optimized production bundle in the `dist` folder:

- Minified JavaScript and CSS
- Tree-shaken dependencies
- Optimized assets
- Source maps (optional)

## Environment-Specific Configuration

### Production Build
```bash
npm run build
```

### Preview Production Build Locally
```bash
npm run preview
```

## Important Notes

### Service Worker
The application uses Mock Service Worker (MSW) for API mocking. The `public/mockServiceWorker.js` file is required for the app to work.

### IndexedDB
All data is stored in the browser's IndexedDB. Users will need to re-seed data if they:
- Clear browser data
- Use incognito/private mode
- Switch browsers or devices

### Browser Compatibility
Ensure your hosting platform serves the app with proper headers for:
- CORS (if needed)
- Content-Type for JavaScript modules
- Cache control for static assets

## Verification Checklist

After deployment, verify:

- ✅ Application loads without errors
- ✅ All routes work correctly (`/jobs`, `/candidates`, `/kanban`, `/assessments`)
- ✅ Data loads (1200 candidates, jobs, assessments)
- ✅ Drag-and-drop functionality works
- ✅ Forms submit correctly
- ✅ MSW intercepts API calls (check Network tab)

## Troubleshooting

### Issue: "Failed to register service worker"
- Ensure `mockServiceWorker.js` is in the `public` folder
- Check browser console for specific errors
- Verify the app is served over HTTPS (required for service workers in production)

### Issue: No data appears
- Check browser console for IndexedDB errors
- Verify seed function runs on first load
- Clear IndexedDB and refresh

### Issue: Routes don't work (404 on refresh)
- Configure hosting platform to redirect all routes to `index.html`
  - **Vercel**: Add `vercel.json` with rewrites
  - **Netlify**: Add `_redirects` file: `/* /index.html 200`
  - **Apache**: Add `.htaccess` with rewrite rules
  - **Nginx**: Configure try_files directive

## Example: Vercel Configuration

Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## Example: Netlify Configuration

Create `public/_redirects`:
```
/* /index.html 200
```

## Performance Optimization

For production, consider:

1. **Enable compression** (gzip/brotli) on hosting platform
2. **Set cache headers** for static assets
3. **Use CDN** for faster global delivery
4. **Monitor bundle size** with `npm run build -- --stats`

## Security

Since this is a front-end only application with no backend:
- No API keys to secure
- No server-side authentication
- All data is local to the user's browser

However, ensure your hosting platform uses **HTTPS** for:
- Service Worker compatibility
- Security best practices
- Professional appearance

---

For questions or issues, please refer to the main README.md





