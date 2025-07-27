# Render Setup Guide - Step by Step

## 🚀 Complete Render Deployment Setup

### Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Verify your repository structure:**
   ```
   my-app/
   ├── app/
   ├── public/
   ├── scripts/
   ├── package.json
   ├── next.config.ts
   ├── render.yaml
   ├── DEPLOYMENT.md
   └── README.md
   ```

### Step 2: Create Render Account

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Sign up with GitHub account
3. Authorize Render to access your repositories

### Step 3: Deploy Static Site

1. **Click "New +" → "Static Site"**

2. **Connect Repository:**
   - Select your GitHub repository
   - Choose the branch (usually `main`)

3. **Configure Build Settings:**
   ```
   Name: news-scraper-frontend
   Build Command: npm ci && npm run build
   Publish Directory: out
   ```

4. **Set Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   
   **Required Variables:**
   ```
   NEXT_PUBLIC_API_URL = https://beackkayq.onrender.com
   NODE_ENV = production
   ```
   
   **Optional Variables:**
   ```
   NEXT_PUBLIC_APP_NAME = News Scraper
   NEXT_PUBLIC_APP_VERSION = 1.0.0
   ```

5. **Advanced Settings:**
   - **Auto-Deploy**: ✅ Enabled
   - **Branch**: `main`
   - **Build Filter**: Leave empty

6. **Click "Create Static Site"**

### Step 4: Monitor Deployment

1. **Watch Build Logs:**
   - Monitor the build process in real-time
   - Look for any errors or warnings

2. **Expected Build Output:**
   ```
   ✓ Installing dependencies
   ✓ Type checking
   ✓ Linting
   ✓ Building project
   ✓ Static files generated in 'out' directory
   ```

3. **Deployment URL:**
   - Your site will be available at: `https://your-app-name.onrender.com`
   - Save this URL for future reference

### Step 5: Verify Deployment

1. **Test the deployed site:**
   - Visit your Render URL
   - Check if the app loads correctly
   - Test navigation between pages

2. **API Connection Test:**
   - Visit `/api-test` on your deployed site
   - Verify all API endpoints are working
   - Check response times

3. **Functionality Tests:**
   - ✅ Home page loads articles
   - ✅ Article detail pages work
   - ✅ Settings/keywords management works
   - ✅ Dark/light theme switching
   - ✅ Mobile responsiveness

### Step 6: Custom Domain (Optional)

1. **Add Custom Domain:**
   - Go to your site settings in Render
   - Click "Custom Domain"
   - Add your domain name

2. **Update DNS:**
   - Point your domain to Render's nameservers
   - Or add CNAME record pointing to your Render URL

### Step 7: Monitoring and Maintenance

1. **Set up Monitoring:**
   - Enable Render's built-in monitoring
   - Set up uptime alerts
   - Monitor build logs

2. **Regular Health Checks:**
   ```bash
   # Run health check locally
   npm run health-check
   
   # Or visit /api-test on your deployed site
   ```

3. **Update Deployment:**
   - Push changes to GitHub
   - Render will automatically redeploy
   - Monitor build status

## 🔧 Troubleshooting

### Build Fails

**Common Issues:**
- Node.js version too old (need 18+)
- Missing dependencies
- TypeScript errors
- Environment variables not set

**Solutions:**
```bash
# Check Node.js version
node --version

# Run locally to test
npm run type-check
npm run lint
npm run build
```

### API Connection Issues

**Check:**
1. API URL is correct in environment variables
2. API server is running and accessible
3. CORS is configured on the API
4. Network connectivity

**Test:**
```bash
# Test API directly
curl https://beackkayq.onrender.com/api/articles/

# Run health check
npm run health-check
```

### Environment Variables Not Working

**Verify:**
1. Variables start with `NEXT_PUBLIC_` for client-side access
2. No typos in variable names
3. Redeploy after changing variables
4. Check build logs for variable usage

## 📊 Performance Optimization

### Render Settings

1. **Enable Caching:**
   - Static assets are automatically cached
   - API responses should be cached on the backend

2. **CDN:**
   - Render automatically provides CDN
   - Global distribution for fast loading

3. **Compression:**
   - Gzip compression is enabled by default
   - Reduces file sizes for faster loading

### Monitoring Performance

1. **Lighthouse Audit:**
   - Run Lighthouse on your deployed site
   - Check performance, accessibility, SEO scores

2. **Real User Monitoring:**
   - Consider adding analytics (Google Analytics, etc.)
   - Monitor page load times and user experience

## 🔒 Security Considerations

### Security Headers

Your app includes these security headers:
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` - Restricts browser features

### Environment Variables

- Never commit sensitive data to Git
- Use Render's environment variable system
- Rotate API keys regularly
- Monitor for security vulnerabilities

## 📈 Scaling Considerations

### Current Setup

- **Static Site**: Fast, scalable, cost-effective
- **API Integration**: External API for dynamic data
- **CDN**: Global content delivery

### Future Scaling

1. **Traffic Increase:**
   - Static sites handle high traffic well
   - Consider API caching strategies
   - Monitor API response times

2. **Feature Expansion:**
   - Add server-side features if needed
   - Consider serverless functions
   - Implement proper caching strategies

## 🎯 Success Checklist

- [ ] Repository pushed to GitHub
- [ ] Render account created
- [ ] Static site deployed successfully
- [ ] Environment variables configured
- [ ] API connection working
- [ ] All pages loading correctly
- [ ] Mobile responsiveness verified
- [ ] Performance optimized
- [ ] Security headers in place
- [ ] Monitoring set up
- [ ] Documentation updated

## 📞 Support

If you encounter issues:

1. **Check Render Documentation**: [Render Docs](https://render.com/docs)
2. **Review Build Logs**: Detailed error information
3. **Test Locally**: Reproduce issues locally first
4. **Health Check**: Use `/api-test` page for API issues
5. **Community**: Render community forums and GitHub issues

---

**Your News Scraper Frontend is now ready for production! 🎉** 