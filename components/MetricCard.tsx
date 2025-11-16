import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export default function MetricCard({ title, value, subtitle, trend, severity }: MetricCardProps) {
  const severityColors = {
    low: 'border-success bg-success/5',
    medium: 'border-warning bg-warning/5',
    high: 'border-danger bg-danger/5',
    critical: 'border-danger bg-danger/10 animate-pulse',
  };

  const trendColors = {
    up: 'text-danger',
    down: 'text-success',
    neutral: 'text-gray-500',
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${severity ? severityColors[severity] : 'border-gray-200 bg-white'}`}>
      <div className="text-sm text-gray-600 font-medium mb-1">{title}</div>
      <div className="flex items-baseline gap-2">
        <div className={`text-3xl font-bold ${severity && severity !== 'low' ? 'text-danger' : 'text-gray-900'}`}>
          {value}
        </div>
        {trend && (
          <div className={`text-sm ${trendColors[trend]}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </div>
        )}
      </div>
      {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );
}
