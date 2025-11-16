# Live Data Integration Guide

This guide will help you integrate live data sources into your Japanese Market Stress Dashboard.

## Overview

The dashboard now supports multiple live data sources:

1. **USD/JPY Exchange Rates**: Real-time rates with 24-hour change tracking
2. **JGB Yields**: Live Japanese Government Bond yields
3. **BOJ Announcements**: Latest Bank of Japan policy updates from RSS feed
4. **Historical Data**: 30-day historical FX trends

## Data Sources

### 1. Alpha Vantage (Recommended - Free)

Alpha Vantage provides:
- Real-time and historical FX data
- 24-hour change calculations for USD/JPY
- Historical trend data (30+ days)

**Free Tier Limits:**
- 500 API calls per day
- 5 API calls per minute
- No credit card required

**Get Your API Key:**
1. Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Enter your email and agree to terms
3. Copy your API key (it's sent immediately)

### 2. FRED API (Optional - Free)

The Federal Reserve Economic Data API provides:
- Japanese Government Bond yields (10-year available)
- Historical bond market data
- Other international economic indicators

**Free Tier:**
- Unlimited requests for reasonable use
- No rate limits for typical dashboard usage
- No credit card required

**Get Your API Key:**
1. Visit [FRED API Keys](https://fredaccount.stlouisfed.org/apikeys)
2. Create a free account
3. Request an API key from your account dashboard

### 3. BOJ RSS Feed (Automatic)

The Bank of Japan's RSS feed is fetched automatically:
- No API key required
- Updates with latest BOJ announcements
- Falls back to default announcements if unavailable

## Setup Instructions

### Step 1: Get API Keys

Follow the instructions above to obtain:
- Alpha Vantage API key (required for live FX data)
- FRED API key (optional but recommended for bond yields)

### Step 2: Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` with your API keys:**
   ```bash
   # Required for live FX historical data and 24h changes
   ALPHA_VANTAGE_API_KEY=your_actual_alpha_vantage_key_here

   # Optional but recommended for live JGB yield data
   FRED_API_KEY=your_actual_fred_key_here

   NODE_ENV=development
   ```

3. **Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

### Step 3: Install Dependencies

Install the required packages:

```bash
npm install
```

New dependencies added for live data:
- `xml2js`: Parse BOJ RSS feed
- `cheerio`: Web scraping capabilities (for future enhancements)
- `node-cache`: In-memory caching to reduce API calls

### Step 4: Test the Integration

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Verify live data is loading:**
   - Check the USD/JPY rate (should show real values)
   - Look for non-zero 24h change values
   - Review recent BOJ announcements
   - Verify the historical chart shows real data

### Step 5: Monitor API Usage

**Alpha Vantage:**
- 500 calls/day = roughly 1 call every 3 minutes
- Dashboard auto-refreshes every 5 minutes by default
- Built-in caching reduces API calls

**FRED:**
- No strict limits, but be reasonable
- Dashboard caches results for 5 minutes

**Check your console** for any API errors or rate limit warnings.

## How It Works

### Intelligent Fallback System

The dashboard uses a smart fallback approach:

1. **Primary Data Source**: Tries to fetch from live APIs
2. **Caching Layer**: Stores responses for 5 minutes to reduce API calls
3. **Fallback Data**: If APIs fail, uses realistic mock data
4. **Graceful Degradation**: Dashboard continues working even if some APIs are down

### Data Fetching Flow

```
User Request
    ↓
Check Cache (5 min TTL)
    ↓
Cache Hit? → Return Cached Data
    ↓
Cache Miss? → Fetch from Live API
    ↓
API Success? → Cache & Return Data
    ↓
API Failure? → Return Fallback Data
```

### Caching Strategy

All API responses are cached for 5 minutes:
- **FX Current Rate**: Updated every 5 minutes
- **FX Historical Data**: Cached for 5 minutes
- **JGB Yields**: Cached for 5 minutes
- **BOJ Announcements**: Cached for 5 minutes

This ensures:
- Fast dashboard loading
- Minimal API usage
- Staying within free tier limits

## Troubleshooting

### Problem: No live data showing

**Solutions:**
1. Verify API keys are correctly set in `.env.local`
2. Check console for error messages
3. Ensure you're not over the API rate limits
4. Try clearing browser cache and reloading

### Problem: "Invalid API key" error

**Solutions:**
1. Double-check your API key has no extra spaces
2. Ensure `.env.local` uses the exact variable names
3. Restart the development server after changing `.env.local`
4. Verify the API key is active on the provider's website

### Problem: Rate limit errors

**Solutions:**
1. Reduce refresh frequency in the dashboard
2. The built-in cache should prevent this - ensure it's working
3. Consider upgrading to a paid API tier if needed
4. Check if multiple instances are running

### Problem: BOJ announcements not loading

**Solutions:**
1. BOJ RSS feed may be temporarily unavailable
2. Check your internet connection
3. The dashboard will use fallback announcements automatically
4. Try again in a few minutes

## API Rate Limit Management

### Alpha Vantage (500 calls/day)

With default settings:
- Dashboard refresh: every 5 minutes
- FX data calls: ~2 per refresh (current + historical)
- Daily usage: ~576 calls (if running 24/7)

**Recommendations:**
- Let caching do its job (don't force refresh constantly)
- Dashboard refresh interval is optimized for free tier
- One instance per API key

### FRED (No strict limits)

- Reasonable use is allowed
- Caching prevents excessive calls
- Typically uses <100 calls per day

## Deployment Considerations

### Vercel Deployment

When deploying to Vercel:

1. **Add environment variables in Vercel dashboard:**
   - Go to Project Settings → Environment Variables
   - Add `ALPHA_VANTAGE_API_KEY`
   - Add `FRED_API_KEY` (optional)

2. **Redeploy after adding variables:**
   ```bash
   vercel --prod
   ```

### Environment Variable Security

- **Never** commit API keys to Git
- Use Vercel's environment variables for production
- Use `.env.local` for local development
- `.env.local` is automatically ignored by Git

## Data Quality Notes

### FX Data
- **Current rates**: Real-time from Open Exchange Rates
- **24h changes**: Calculated from Alpha Vantage daily data
- **Historical**: 30 days of actual market data

### JGB Yields
- **10-year yield**: Live from FRED when available
- **Other maturities**: Estimated from 10Y yield curve relationships
- **Fallback**: Realistic mock data based on current market ranges

### BOJ Data
- **Policy rate**: Updated during BOJ policy meetings (manual)
- **Announcements**: Live from BOJ RSS feed
- **Fallback**: Recent significant announcements

## Future Enhancements

Potential improvements for live data:

- [ ] Database storage for historical data
- [ ] Websocket connections for real-time updates
- [ ] Additional data sources for redundancy
- [ ] Web scraping for Ministry of Finance JGB auction data
- [ ] Premium API integration (Bloomberg, Refinitiv)
- [ ] Alert notifications via email/SMS
- [ ] Export historical data to CSV

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review console logs for specific errors
3. Verify API keys are valid and active
4. Open a GitHub issue with error details

## Resources

- [Alpha Vantage Documentation](https://www.alphavantage.co/documentation/)
- [FRED API Documentation](https://fred.stlouisfed.org/docs/api/fred/)
- [BOJ Website](https://www.boj.or.jp/en/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**Happy monitoring! 📊**
