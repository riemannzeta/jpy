import axios from 'axios';
import { FXData, JGBData, BOJData } from './types';

/**
 * Fetch USD/JPY exchange rate data
 * Uses exchangerate-api.com (free tier: 1500 requests/month)
 */
export async function fetchUSDJPYData(): Promise<FXData> {
  try {
    // Free API - no key required for basic usage
    const response = await axios.get('https://open.er-api.com/v6/latest/USD');
    const rate = response.data.rates.JPY;

    // For change calculation, we'd need historical data
    // Using a simple mock for now - in production, store previous values
    const change24h = 0; // Would compare with yesterday's rate
    const changePercent24h = 0;

    return {
      timestamp: new Date().toISOString(),
      rate,
      change24h,
      changePercent24h,
    };
  } catch (error) {
    console.error('Error fetching USD/JPY data:', error);
    // Return fallback data
    return {
      timestamp: new Date().toISOString(),
      rate: 150.0,
      change24h: 0,
      changePercent24h: 0,
    };
  }
}

/**
 * Fetch JGB yield data
 * Uses Yahoo Finance or mock data (free APIs for bonds are limited)
 */
export async function fetchJGBData(): Promise<JGBData> {
  try {
    // Note: Real JGB data would require scraping MOF website or premium APIs
    // For demo purposes, using realistic mock data
    // In production, you could:
    // 1. Scrape https://www.mof.go.jp/english/policy/jgbs/auction/index.html
    // 2. Use Bloomberg API (paid)
    // 3. Use investing.com data (scraping with rate limits)

    // Mock data with realistic ranges
    const baseYields = {
      yield2y: 0.15,
      yield5y: 0.35,
      yield10y: 0.75,
      yield30y: 1.85,
    };

    // Add small random variation to simulate real data
    const variation = () => (Math.random() - 0.5) * 0.1;

    return {
      timestamp: new Date().toISOString(),
      yield2y: baseYields.yield2y + variation(),
      yield5y: baseYields.yield5y + variation(),
      yield10y: baseYields.yield10y + variation(),
      yield30y: baseYields.yield30y + variation(),
    };
  } catch (error) {
    console.error('Error fetching JGB data:', error);
    return {
      timestamp: new Date().toISOString(),
      yield2y: 0.15,
      yield5y: 0.35,
      yield10y: 0.75,
      yield30y: 1.85,
    };
  }
}

/**
 * Fetch Bank of Japan policy data
 */
export async function fetchBOJData(): Promise<BOJData> {
  try {
    // BOJ policy rate is relatively static, updated during policy meetings
    // Real implementation could scrape: https://www.boj.or.jp/en/
    // Or use RSS feed: https://www.boj.or.jp/en/rss/index.htm

    return {
      timestamp: new Date().toISOString(),
      policyRate: -0.10, // Current BOJ policy rate (as of 2024)
      lastUpdate: '2024-01-23',
      recentAnnouncements: [
        'BOJ maintains negative interest rate policy',
        'Yield curve control adjusted for 10-year JGB',
        'Monitoring FX market developments',
      ],
    };
  } catch (error) {
    console.error('Error fetching BOJ data:', error);
    return {
      timestamp: new Date().toISOString(),
      policyRate: -0.10,
      lastUpdate: new Date().toISOString(),
      recentAnnouncements: [],
    };
  }
}

/**
 * Fetch historical USD/JPY rates for trend analysis
 */
export async function fetchHistoricalRates(days: number = 30): Promise<Array<{ timestamp: string; rate: number }>> {
  try {
    // Generate mock historical data
    // In production, use a time-series API or database
    const data = [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    for (let i = days; i >= 0; i--) {
      const timestamp = new Date(now - i * dayMs).toISOString();
      const baseRate = 150;
      const variation = Math.sin(i / 5) * 3 + (Math.random() - 0.5) * 2;
      data.push({
        timestamp,
        rate: baseRate + variation,
      });
    }

    return data;
  } catch (error) {
    console.error('Error fetching historical rates:', error);
    return [];
  }
}
