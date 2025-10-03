# Vercel Deployment Guide

## Quick Deploy

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect React and configure build settings

3. **Set Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   ```
   REACT_APP_GEMINI_API_KEY = your_gemini_api_key_here
   ```

## Manual Deploy (Alternative)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login and Deploy**
   ```bash
   vercel login
   vercel --prod
   ```

## Build Configuration

The project is configured with:
- `vercel.json` - Vercel configuration
- `_redirects` - SPA routing support
- Environment variables for API keys

## Post-Deployment

1. Test all features on the live URL
2. Verify AI analysis works with environment variables
3. Check responsive design on mobile devices

## Troubleshooting

- **Build fails**: Check package.json dependencies
- **Routing issues**: Verify _redirects file exists
- **API errors**: Confirm environment variables are set
- **Blank page**: Check browser console for errors