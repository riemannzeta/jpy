export interface FXData {
  timestamp: string;
  rate: number;
  change24h: number;
  changePercent24h: number;
}

export interface JGBData {
  timestamp: string;
  yield2y: number;
  yield5y: number;
  yield10y: number;
  yield30y: number;
}

export interface BOJData {
  timestamp: string;
  policyRate: number;
  lastUpdate: string;
  recentAnnouncements: string[];
}

export interface CarryTradeMetrics {
  interestDifferential: number;
  volatility: number;
  riskScore: number;
}

export interface StressIndicators {
  overall: 'low' | 'medium' | 'high' | 'critical';
  carryTradeRisk: number;
  yieldCurveStress: number;
  currencyPressure: number;
  bojInterventionRisk: number;
  alerts: Alert[];
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  metric: string;
}

export interface DashboardData {
  fx: FXData;
  jgb: JGBData;
  boj: BOJData;
  carryTrade: CarryTradeMetrics;
  stress: StressIndicators;
  historicalRates: Array<{ timestamp: string; rate: number }>;
}
