# Deployment Guide

This guide will help you deploy the Japanese Market Stress Dashboard to Vercel's free tier.

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Git installed locally

## Method 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git add .
   git commit -m "Initial commit: Japanese Market Stress Dashboard"
   git branch -M main
   git remote add origin https://github.com/yourusername/jpy.git
   git push -u origin main
   ```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

That's it! Your dashboard will be live in ~2 minutes.

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
# From the project directory
vercel

# For production deployment
vercel --prod
```

Follow the CLI prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N** (first time)
- What's your project's name? **jpy** (or your preference)
- In which directory is your code located? **./**
- Want to override settings? **N**

## Method 3: Deploy via GitHub Integration

### Step 1: Enable Vercel GitHub Integration

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Click "Import Git Repository"
4. Authorize Vercel to access your GitHub account

### Step 2: Configure Auto-Deployment

Once connected, Vercel will automatically:
- Deploy every push to `main` branch
- Create preview deployments for PRs
- Show deployment status in GitHub

## Environment Variables

Currently, the dashboard works without any environment variables. If you add premium data sources in the future:

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add variables:
   - `ALPHA_VANTAGE_API_KEY` (if using Alpha Vantage)
   - `EXCHANGE_RATE_API_KEY` (if upgrading FX API)

## Custom Domain (Optional)

### Step 1: Add Domain in Vercel

1. Go to your project → "Settings" → "Domains"
2. Enter your domain name
3. Follow DNS configuration instructions

### Step 2: Update DNS

Add these records to your DNS provider:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Post-Deployment

### Verify Deployment

1. **Check Homepage**: Visit your deployment URL
2. **Test API**: Visit `your-url.vercel.app/api/dashboard`
3. **Health Check**: Visit `your-url.vercel.app/api/health`

### Monitor Performance

1. Go to Vercel Dashboard → Your Project
2. View:
   - **Analytics**: Page views, visitors
   - **Deployments**: Build logs, deploy history
   - **Functions**: Serverless function execution logs

## Troubleshooting

### Build Fails

**Issue**: TypeScript errors during build

**Solution**: Run locally first
```bash
npm run build
```
Fix any errors, then redeploy.

---

**Issue**: Missing dependencies

**Solution**: Ensure `package.json` is committed
```bash
git add package.json
git commit -m "Add package.json"
git push
```

### Runtime Errors

**Issue**: API routes return 500

**Solution**: Check Vercel Function logs
1. Dashboard → Project → Functions
2. Click on failed function
3. View error logs

**Issue**: CORS errors

**Solution**: API routes already include CORS headers. If issues persist, check `pages/api/dashboard.ts`

### Performance Issues

**Issue**: Slow API responses

**Solution**:
- API routes cache responses for 5 minutes
- Increase cache time in `pages/api/dashboard.ts`:
  ```typescript
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
  ```

## Monitoring & Alerts

### Set Up Vercel Monitoring

1. Enable Vercel Analytics (free on hobby plan)
2. Add to `pages/_app.tsx`:
   ```typescript
   import { Analytics } from '@vercel/analytics/react';

   export default function App({ Component, pageProps }: AppProps) {
     return (
       <>
         <Component {...pageProps} />
         <Analytics />
       </>
     );
   }
   ```

### Configure Uptime Monitoring

Use free services:
- [UptimeRobot](https://uptimerobot.com) - Free for 50 monitors
- [Pingdom](https://www.pingdom.com) - Free tier available
- [StatusCake](https://www.statuscake.com) - Free monitoring

## Scaling Considerations

### Vercel Free Tier Limits

- ✅ 100 GB bandwidth/month
- ✅ 100 GB-hours serverless function execution
- ✅ 6,000 builds/month
- ✅ Unlimited API requests

### If You Exceed Limits

1. **Upgrade to Pro** ($20/month)
   - 1 TB bandwidth
   - Unlimited builds
   - Priority support

2. **Optimize Usage**
   - Increase API cache time
   - Reduce auto-refresh frequency
   - Implement CDN for static assets

## Backup & Disaster Recovery

### Database Backup (If Added Later)

If you add a database:
- Use Vercel Postgres (built-in backups)
- Or use external DB with backup solution

### Code Backup

Your code is already backed up on GitHub. For extra safety:
1. Enable GitHub repository backup
2. Clone repository locally regularly
3. Consider GitLab/Bitbucket mirrors

## Security Best Practices

### 1. Environment Variables

Never commit sensitive keys:
```bash
# Add to .gitignore (already included)
.env.local
.env
```

### 2. API Rate Limiting

Already implemented via API response caching. For additional protection, consider:
- Vercel Edge Middleware
- Upstash Redis rate limiting

### 3. HTTPS

Vercel provides automatic HTTPS for all deployments.

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Community**: [GitHub Discussions](https://github.com/vercel/next.js/discussions)

---

**Deployment takes ~2 minutes. Happy monitoring! 📊**
