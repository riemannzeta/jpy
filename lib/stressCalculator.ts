import { FXData, JGBData, BOJData, CarryTradeMetrics, StressIndicators, Alert } from './types';

/**
 * Calculate carry trade metrics
 */
export function calculateCarryTradeMetrics(
  fx: FXData,
  jgb: JGBData,
  boj: BOJData,
  historicalRates: Array<{ timestamp: string; rate: number }>
): CarryTradeMetrics {
  // US Treasury yields (approximate)
  const usTreasury10y = 4.5; // Current approximate US 10Y yield

  // Interest rate differential (US - Japan)
  const interestDifferential = usTreasury10y - jgb.yield10y;

  // Calculate volatility from historical rates
  const volatility = calculateVolatility(historicalRates);

  // Risk score: high differential + low volatility = attractive carry trade
  // High volatility or narrowing differential = risky
  const riskScore = calculateRiskScore(interestDifferential, volatility);

  return {
    interestDifferential,
    volatility,
    riskScore,
  };
}

/**
 * Calculate volatility from historical price data
 */
function calculateVolatility(historicalRates: Array<{ timestamp: string; rate: number }>): number {
  if (historicalRates.length < 2) return 0;

  const returns = [];
  for (let i = 1; i < historicalRates.length; i++) {
    const dailyReturn = (historicalRates[i].rate - historicalRates[i - 1].rate) / historicalRates[i - 1].rate;
    returns.push(dailyReturn);
  }

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance) * Math.sqrt(252); // Annualized volatility

  return volatility * 100; // Return as percentage
}

/**
 * Calculate risk score for carry trade unwinding
 */
function calculateRiskScore(differential: number, volatility: number): number {
  // Lower differential = higher risk of carry trade unwinding
  // Higher volatility = higher risk

  let score = 0;

  // Interest differential component (0-40 points)
  if (differential < 2.0) score += 40;
  else if (differential < 3.0) score += 30;
  else if (differential < 4.0) score += 20;
  else score += 10;

  // Volatility component (0-40 points)
  if (volatility > 15) score += 40;
  else if (volatility > 10) score += 30;
  else if (volatility > 7) score += 20;
  else score += 10;

  return score;
}

/**
 * Calculate comprehensive stress indicators
 */
export function calculateStressIndicators(
  fx: FXData,
  jgb: JGBData,
  boj: BOJData,
  carryTrade: CarryTradeMetrics,
  historicalRates: Array<{ timestamp: string; rate: number }>
): StressIndicators {
  const alerts: Alert[] = [];

  // 1. Carry Trade Risk (0-100)
  const carryTradeRisk = carryTrade.riskScore;

  if (carryTradeRisk > 70) {
    alerts.push({
      id: `carry-${Date.now()}`,
      severity: 'critical',
      message: `High carry trade unwinding risk: Interest differential ${carryTrade.interestDifferential.toFixed(2)}%, Volatility ${carryTrade.volatility.toFixed(2)}%`,
      timestamp: new Date().toISOString(),
      metric: 'carryTrade',
    });
  } else if (carryTradeRisk > 50) {
    alerts.push({
      id: `carry-${Date.now()}`,
      severity: 'warning',
      message: `Elevated carry trade risk: Monitor for position unwinding`,
      timestamp: new Date().toISOString(),
      metric: 'carryTrade',
    });
  }

  // 2. Yield Curve Stress (0-100)
  const yieldCurveStress = calculateYieldCurveStress(jgb);

  if (yieldCurveStress > 70) {
    alerts.push({
      id: `yield-${Date.now()}`,
      severity: 'critical',
      message: 'JGB yield curve showing significant stress',
      timestamp: new Date().toISOString(),
      metric: 'yieldCurve',
    });
  }

  // 3. Currency Pressure (0-100)
  const currencyPressure = calculateCurrencyPressure(fx, historicalRates);

  if (fx.rate > 155) {
    alerts.push({
      id: `fx-${Date.now()}`,
      severity: 'warning',
      message: `USD/JPY at ${fx.rate.toFixed(2)} - approaching intervention threshold`,
      timestamp: new Date().toISOString(),
      metric: 'fx',
    });
  }

  if (fx.rate > 160) {
    alerts.push({
      id: `fx-critical-${Date.now()}`,
      severity: 'critical',
      message: `USD/JPY above 160 - high probability of BOJ intervention`,
      timestamp: new Date().toISOString(),
      metric: 'fx',
    });
  }

  // 4. BOJ Intervention Risk (0-100)
  const bojInterventionRisk = calculateBOJInterventionRisk(fx, jgb, historicalRates);

  if (bojInterventionRisk > 75) {
    alerts.push({
      id: `boj-${Date.now()}`,
      severity: 'critical',
      message: 'High probability of BOJ currency intervention',
      timestamp: new Date().toISOString(),
      metric: 'boj',
    });
  }

  // Overall stress level
  const avgStress = (carryTradeRisk + yieldCurveStress + currencyPressure + bojInterventionRisk) / 4;

  let overall: 'low' | 'medium' | 'high' | 'critical';
  if (avgStress > 75) overall = 'critical';
  else if (avgStress > 50) overall = 'high';
  else if (avgStress > 25) overall = 'medium';
  else overall = 'low';

  return {
    overall,
    carryTradeRisk,
    yieldCurveStress,
    currencyPressure,
    bojInterventionRisk,
    alerts,
  };
}

/**
 * Calculate yield curve stress
 */
function calculateYieldCurveStress(jgb: JGBData): number {
  let stress = 0;

  // Check for yield spikes
  if (jgb.yield10y > 1.0) stress += 30;
  else if (jgb.yield10y > 0.85) stress += 20;

  // Check for curve inversion or flattening
  const curve2_10 = jgb.yield10y - jgb.yield2y;
  if (curve2_10 < 0.3) stress += 30; // Flattening curve

  // Check 10-30 spread
  const curve10_30 = jgb.yield30y - jgb.yield10y;
  if (curve10_30 < 0.5) stress += 20;

  return Math.min(stress, 100);
}

/**
 * Calculate currency pressure
 */
function calculateCurrencyPressure(
  fx: FXData,
  historicalRates: Array<{ timestamp: string; rate: number }>
): number {
  let pressure = 0;

  // Absolute level
  if (fx.rate > 160) pressure += 50;
  else if (fx.rate > 155) pressure += 40;
  else if (fx.rate > 150) pressure += 30;
  else if (fx.rate > 145) pressure += 20;

  // Rate of change
  if (historicalRates.length >= 5) {
    const recentRates = historicalRates.slice(-5);
    const change = fx.rate - recentRates[0].rate;
    const percentChange = (change / recentRates[0].rate) * 100;

    if (Math.abs(percentChange) > 3) pressure += 30;
    else if (Math.abs(percentChange) > 2) pressure += 20;
  }

  return Math.min(pressure, 100);
}

/**
 * Calculate BOJ intervention risk
 */
function calculateBOJInterventionRisk(
  fx: FXData,
  jgb: JGBData,
  historicalRates: Array<{ timestamp: string; rate: number }>
): number {
  let risk = 0;

  // FX level (historical intervention around 150-160 range)
  if (fx.rate > 160) risk += 60;
  else if (fx.rate > 155) risk += 40;
  else if (fx.rate > 150) risk += 25;

  // Rapid depreciation
  if (historicalRates.length >= 10) {
    const tenDaysAgo = historicalRates[historicalRates.length - 10].rate;
    const change = fx.rate - tenDaysAgo;
    if (change > 5) risk += 30;
    else if (change > 3) risk += 20;
  }

  // JGB yield stress (may trigger action)
  if (jgb.yield10y > 1.0) risk += 10;

  return Math.min(risk, 100);
}
