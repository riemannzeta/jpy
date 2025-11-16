import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchUSDJPYData, fetchJGBData, fetchBOJData, fetchHistoricalRates } from '../../lib/dataFetchers';
import { calculateCarryTradeMetrics, calculateStressIndicators } from '../../lib/stressCalculator';
import { DashboardData } from '../../lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardData | { error: string }>
) {
  // Enable CORS for client-side requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch all data in parallel
    const [fx, jgb, boj, historicalRates] = await Promise.all([
      fetchUSDJPYData(),
      fetchJGBData(),
      fetchBOJData(),
      fetchHistoricalRates(30),
    ]);

    // Calculate metrics
    const carryTrade = calculateCarryTradeMetrics(fx, jgb, boj, historicalRates);
    const stress = calculateStressIndicators(fx, jgb, boj, carryTrade, historicalRates);

    const dashboardData: DashboardData = {
      fx,
      jgb,
      boj,
      carryTrade,
      stress,
      historicalRates,
    };

    // Cache for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

    return res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error in dashboard API:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
}
