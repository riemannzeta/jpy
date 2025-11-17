import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import MetricCard from '../components/MetricCard';
import AlertPanel from '../components/AlertPanel';
import StressGauge from '../components/StressGauge';
import RateChart from '../components/RateChart';
import { DashboardData } from '../lib/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch dashboard data with auto-refresh every 5 minutes
  const { data, error, isLoading } = useSWR<DashboardData>('/api/dashboard', fetcher, {
    refreshInterval: 300000, // 5 minutes
    revalidateOnFocus: true,
  });

  useEffect(() => {
    if (data) {
      setLastUpdate(new Date());
    }
  }, [data]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-red-500">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Dashboard</h1>
          <p className="text-gray-600">Failed to fetch market data. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4 mx-auto"></div>
          <p className="text-gray-600 text-lg">Loading market data...</p>
        </div>
      </div>
    );
  }

  const overallSeverity = data.stress.overall;

  return (
    <>
      <Head>
        <title>Yen Market Stress Dashboard</title>
        <meta name="description" content="Real-time monitoring of JPY market stress indicators" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              🇯🇵 Japanese Market Stress Dashboard
            </h1>
            <p className="text-gray-600">
              Real-time monitoring of JGB auctions, BOJ policy, and yen carry trade dynamics
            </p>
            <div className="mt-3 flex flex-wrap gap-3 items-center text-sm text-gray-500">
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
              <span className="hidden md:inline">•</span>
              <span className={`px-3 py-1 rounded-full font-medium ${
                overallSeverity === 'critical' ? 'bg-red-100 text-red-800' :
                overallSeverity === 'high' ? 'bg-orange-100 text-orange-800' :
                overallSeverity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                Overall Stress: {overallSeverity.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Alerts */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">🔔 Active Alerts</h2>
            <AlertPanel alerts={data.stress.alerts} />
          </div>

          {/* Main Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="USD/JPY Rate"
              value={data.fx.rate.toFixed(2)}
              subtitle={`${data.fx.changePercent24h >= 0 ? '+' : ''}${data.fx.changePercent24h.toFixed(2)}% (24h)`}
              trend={data.fx.changePercent24h > 0 ? 'up' : data.fx.changePercent24h < 0 ? 'down' : 'neutral'}
              severity={data.fx.rate > 160 ? 'critical' : data.fx.rate > 155 ? 'high' : data.fx.rate > 150 ? 'medium' : 'low'}
            />
            <MetricCard
              title="JGB 10Y Yield"
              value={`${data.jgb.yield10y.toFixed(2)}%`}
              subtitle={`2Y: ${data.jgb.yield2y.toFixed(2)}% | 30Y: ${data.jgb.yield30y.toFixed(2)}%`}
              severity={data.jgb.yield10y > 1.0 ? 'high' : data.jgb.yield10y > 0.85 ? 'medium' : 'low'}
            />
            <MetricCard
              title="BOJ Policy Rate"
              value={`${data.boj.policyRate.toFixed(2)}%`}
              subtitle={`Last update: ${new Date(data.boj.lastUpdate).toLocaleDateString()}`}
            />
            <MetricCard
              title="Interest Differential"
              value={`${data.carryTrade.interestDifferential.toFixed(2)}%`}
              subtitle={`US - Japan 10Y`}
              severity={data.carryTrade.interestDifferential < 2 ? 'high' : 'low'}
            />
          </div>

          {/* Stress Indicators */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Stress Indicators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StressGauge title="Carry Trade Risk" value={data.stress.carryTradeRisk} />
              <StressGauge title="Yield Curve Stress" value={data.stress.yieldCurveStress} />
              <StressGauge title="Currency Pressure" value={data.stress.currencyPressure} />
              <StressGauge title="BOJ Intervention Risk" value={data.stress.bojInterventionRisk} />
            </div>
          </div>

          {/* Historical Chart */}
          <RateChart data={data.historicalRates} title="USD/JPY - 30 Day History" />

          {/* BOJ Announcements */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🏦 Recent BOJ Announcements</h2>
            <ul className="space-y-2">
              {data.boj.recentAnnouncements.map((announcement, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-gray-700">{announcement}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Metrics Explanation */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ℹ️ Understanding the Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Carry Trade Risk</h3>
                <p className="text-gray-700">
                  Measures the risk of carry trade unwinding based on interest rate differentials and FX volatility.
                  High values indicate potential for rapid JPY strengthening.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Yield Curve Stress</h3>
                <p className="text-gray-700">
                  Monitors JGB yield levels and curve shape. Flattening or inversion can signal market stress.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Currency Pressure</h3>
                <p className="text-gray-700">
                  Tracks USD/JPY absolute levels and rate of change. Values above 150-160 historically trigger BOJ concern.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">BOJ Intervention Risk</h3>
                <p className="text-gray-700">
                  Estimates probability of BOJ currency intervention based on FX levels, volatility, and policy signals.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 py-4">
            <p>Data refreshes every 5 minutes • For informational purposes only • Not financial advice</p>
          </div>
        </div>
      </main>
    </>
  );
}
