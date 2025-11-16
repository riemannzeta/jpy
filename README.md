# 🇯🇵 Japanese Yen Market Stress Dashboard

A real-time monitoring system that tracks Japanese Government Bond (JGB) auction results, Bank of Japan (BOJ) policy signals, and yen carry trade dynamics. The dashboard aggregates data from multiple sources, calculates stress indicators, and generates alerts when conditions emerge for potential JPY/USD devaluation.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Japanese+Market+Stress+Dashboard)

## 🌟 Features

- **Real-time FX Monitoring**: Track USD/JPY exchange rates with historical trends
- **JGB Yield Tracking**: Monitor 2Y, 5Y, 10Y, and 30Y Japanese Government Bond yields
- **BOJ Policy Signals**: Track Bank of Japan policy rates and announcements
- **Carry Trade Risk Analysis**: Calculate interest rate differentials and volatility metrics
- **Comprehensive Stress Indicators**:
  - Carry Trade Risk Score
  - Yield Curve Stress Level
  - Currency Pressure Index
  - BOJ Intervention Risk Assessment
- **Smart Alerts**: Automatic notifications when critical thresholds are reached
- **Auto-refresh**: Data updates every 5 minutes automatically
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## 🎯 What It Monitors

### 1. Currency Metrics
- **USD/JPY Exchange Rate**: Current rate, 24h change, and historical trends
- **Volatility Analysis**: Rolling volatility calculations
- **Momentum Indicators**: Rate of change detection

### 2. Bond Market Indicators
- **JGB Yields**: 2-year, 5-year, 10-year, and 30-year yields
- **Yield Curve Shape**: Detect flattening, steepening, or inversion
- **Spread Analysis**: Monitor term spreads for stress signals

### 3. Policy Signals
- **BOJ Policy Rate**: Current policy rate tracking
- **Recent Announcements**: Latest BOJ communications
- **Intervention Thresholds**: Historical intervention level monitoring

### 4. Carry Trade Dynamics
- **Interest Rate Differential**: US-Japan 10Y spread
- **Risk-Adjusted Returns**: Volatility-adjusted carry metrics
- **Unwinding Risk**: Early warning signals for carry trade reversals

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jpy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy to Vercel (Free)

This dashboard is designed to run on Vercel's free tier with zero configuration needed.

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/jpy)

### Manual Deploy

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts**
   - Link to existing project or create new
   - Select your preferred settings
   - Deploy!

Your dashboard will be live at `https://your-project.vercel.app`

### Vercel Free Tier Limits
- ✅ 100 GB bandwidth/month
- ✅ 100 deployments/day
- ✅ Serverless function executions
- ✅ Automatic HTTPS
- ✅ Custom domains

## 📊 Understanding Stress Indicators

### Carry Trade Risk (0-100)
Measures the probability of yen carry trade unwinding:
- **0-25 (Low)**: Stable carry trade environment
- **25-50 (Medium)**: Elevated monitoring required
- **50-75 (High)**: Significant unwinding risk
- **75-100 (Critical)**: Imminent carry trade reversal likely

**Triggers**:
- Interest rate differential < 2%
- FX volatility > 10%
- Rapid JPY appreciation

### Yield Curve Stress (0-100)
Monitors JGB market health:
- **Indicators**: Absolute yield levels, curve shape, spread compression
- **Critical Levels**: 10Y yield > 1.0%, 2-10 spread < 0.3%

### Currency Pressure (0-100)
Tracks USD/JPY stress:
- **Key Levels**:
  - 150 = Elevated concern
  - 155 = High alert
  - 160+ = Intervention threshold

### BOJ Intervention Risk (0-100)
Estimates probability of BOJ FX intervention:
- **Historical Context**: BOJ has intervened around 145-160 levels
- **Factors**: FX level, rate of change, yield stress, policy signals

## 🔧 Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│   Next.js Frontend (React)  │
│   - Dashboard UI            │
│   - Charts (Recharts)       │
│   - Auto-refresh (SWR)      │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│   API Routes (Serverless)   │
│   /api/dashboard            │
│   /api/health               │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│   Data Fetchers             │
│   - FX API (open.er-api)    │
│   - JGB Data (mock/scrape)  │
│   - BOJ Policy (static)     │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│   Stress Calculator         │
│   - Carry trade metrics     │
│   - Alert generation        │
│   - Risk scoring            │
└─────────────────────────────┘
```

## 📁 Project Structure

```
jpy/
├── components/           # React components
│   ├── MetricCard.tsx   # Metric display cards
│   ├── AlertPanel.tsx   # Alert notifications
│   ├── StressGauge.tsx  # Stress level gauges
│   └── RateChart.tsx    # Historical rate charts
├── lib/                 # Core logic
│   ├── types.ts         # TypeScript interfaces
│   ├── dataFetchers.ts  # Data source integrations
│   └── stressCalculator.ts # Stress indicator logic
├── pages/
│   ├── api/
│   │   ├── dashboard.ts # Main API endpoint
│   │   └── health.ts    # Health check
│   ├── _app.tsx         # Next.js app wrapper
│   └── index.tsx        # Main dashboard page
├── public/              # Static assets
├── styles/              # Global styles
│   └── globals.css
└── package.json         # Dependencies
```

## 🔌 Data Sources

### Current Implementation

1. **FX Rates**: [Open Exchange Rates API](https://open.er-api.com/)
   - Free tier: 1,500 requests/month
   - No API key required
   - Real-time USD/JPY rates

2. **JGB Yields**: Mock data with realistic ranges
   - Simulates real JGB market conditions
   - Ready to integrate with live data sources

3. **BOJ Policy**: Static policy rate with recent announcements
   - Updated during BOJ policy meetings

### Upgrade to Live Data (Optional)

To integrate real JGB and enhanced FX data:

1. **Alpha Vantage** (Free tier: 500 requests/day)
   ```bash
   # Get free API key: https://www.alphavantage.co/support/#api-key
   # Add to .env.local:
   ALPHA_VANTAGE_API_KEY=your_key_here
   ```

2. **JGB Data Scraping**
   - Ministry of Finance Japan: https://www.mof.go.jp/english/policy/jgbs/
   - Investing.com JGB data (requires scraping)

3. **BOJ RSS Feed**
   - https://www.boj.or.jp/en/rss/index.htm

## 🎨 Customization

### Modify Alert Thresholds

Edit `lib/stressCalculator.ts`:

```typescript
// Example: Change FX intervention threshold
if (fx.rate > 160) {  // Change this value
  alerts.push({
    severity: 'critical',
    message: 'USD/JPY intervention threshold reached'
  });
}
```

### Add New Metrics

1. Define type in `lib/types.ts`
2. Create fetcher in `lib/dataFetchers.ts`
3. Add calculation in `lib/stressCalculator.ts`
4. Display in `pages/index.tsx`

### Styling

The project uses Tailwind CSS. Modify theme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      danger: '#ef4444',  // Customize colors
      warning: '#f59e0b',
      success: '#10b981',
    },
  },
}
```

## 🚨 Alert Configuration

Alerts are triggered automatically based on:

- **FX Levels**: USD/JPY > 155 (warning), > 160 (critical)
- **Carry Trade Risk**: Score > 50 (warning), > 70 (critical)
- **JGB Yields**: 10Y > 0.85% (warning), > 1.0% (critical)
- **Volatility**: Annualized > 10% (warning), > 15% (critical)

## 📈 Future Enhancements

- [ ] Email/SMS alert notifications
- [ ] Historical data storage (database)
- [ ] Machine learning predictions
- [ ] Multi-currency monitoring
- [ ] Options market sentiment
- [ ] News sentiment analysis
- [ ] Export to CSV/PDF
- [ ] Customizable alert thresholds via UI

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This dashboard is for informational and educational purposes only. It does not constitute financial advice, investment advice, trading advice, or any other sort of advice. You should not treat any of the dashboard's content as such. Do your own research and consult with financial professionals before making any investment decisions.

The data sources used may have limitations, delays, or inaccuracies. Always verify critical information from official sources.

## 🙏 Acknowledgments

- Data provided by Open Exchange Rates API
- Built with Next.js, React, and Tailwind CSS
- Charts powered by Recharts
- Hosted on Vercel

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ for financial markets monitoring**
