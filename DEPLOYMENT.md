# Deployment Guide for Render

## Prerequisites
- A Render account
- Your Next.js app ready for deployment
- Node.js 18+ and npm 8+

## Environment Variables

Set the following environment variables in your Render dashboard:

### Required Variables:
- `NEXT_PUBLIC_API_URL`: `https://beackkayq.onrender.com`
- `NODE_ENV`: `production`

### Optional Variables:
- `NEXT_PUBLIC_APP_NAME`: `News Scraper`
- `NEXT_PUBLIC_APP_VERSION`: `1.0.0`

## Deployment Steps

### 1. **Connect your repository to Render**
   - Go to your Render dashboard
   - Click "New +" and select "Static Site"
   - Connect your GitHub repository

### 2. **Configure the build settings**
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `out`
   - **Node Version**: 18.x (or latest LTS)

### 3. **Set Environment Variables**
   - In the Environment section, add all required variables
   - Make sure to use the exact values shown above

### 4. **Advanced Settings (Optional)**
   - **Auto-Deploy**: Enable for automatic deployments on git push
   - **Branch**: Set to `main` or your default branch
   - **Build Filter**: Leave empty for all commits

### 5. **Deploy**
   - Click "Create Static Site"
   - Render will automatically build and deploy your app

## Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp env.example .env.local
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run export` - Build static export
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean build directories

## API Endpoints

The app connects to the following API endpoints:

- **Main API**: `https://beackkayq.onrender.com/`
- **Articles**: `https://beackkayq.onrender.com/api/articles/`
- **Keywords**: `https://beackkayq.onrender.com/api/keywords/`
- **Individual Article**: `https://beackkayq.onrender.com/api/articles/{id}/`

## Security Features

The app includes the following security headers:
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Permissions-Policy` - Restricts browser features

## Performance Optimizations

- Static site generation for fast loading
- Optimized CSS with Tailwind
- Console logs removed in production
- Image optimization disabled for static export
- Trailing slashes for better SEO

## Monitoring and Debugging

### 1. **API Test Page**
   - Visit `/api-test` after deployment to verify API connectivity
   - Shows real-time status of all API endpoints

### 2. **Build Logs**
   - Check Render dashboard for build logs
   - Look for any errors in the build process

### 3. **Environment Variables**
   - Verify all environment variables are set correctly
   - Use the API test page to confirm API connectivity

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors with `npm run type-check`

2. **API Connection Issues**
   - Verify `NEXT_PUBLIC_API_URL` is set correctly
   - Check if the API is running and accessible
   - Test API endpoints directly in browser

3. **CORS Errors**
   - Ensure API allows requests from your domain
   - Check if API is configured for cross-origin requests

4. **Environment Variables Not Working**
   - Make sure variables start with `NEXT_PUBLIC_` for client-side access
   - Redeploy after changing environment variables

### Debug Commands:
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Type checking
npm run type-check

# Linting
npm run lint

# Clean build
npm run clean && npm run build
```

## Post-Deployment Checklist

- [ ] App loads without errors
- [ ] API test page shows successful connections
- [ ] Articles are loading correctly
- [ ] Keywords management works
- [ ] Dark/light theme switching works
- [ ] All navigation links work
- [ ] Mobile responsiveness is good
- [ ] Security headers are present (check browser dev tools)

## Custom Domain (Optional)

1. **Add Custom Domain in Render:**
   - Go to your site settings
   - Click "Custom Domain"
   - Add your domain name

2. **Update DNS:**
   - Point your domain to Render's nameservers
   - Or add CNAME record pointing to your Render URL

## Analytics and Monitoring (Optional)

Consider adding:
- Google Analytics for user tracking
- Sentry for error monitoring
- Uptime monitoring services

## Backup and Recovery

- Keep your code in version control (GitHub)
- Document your environment variables
- Test deployments on staging environment first
- Keep backup of your database/API data 