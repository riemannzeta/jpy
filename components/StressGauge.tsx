import React from 'react';

interface StressGaugeProps {
  title: string;
  value: number;
  max?: number;
}

export default function StressGauge({ title, value, max = 100 }: StressGaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);

  let color = 'bg-success';
  let textColor = 'text-success';
  if (percentage > 75) {
    color = 'bg-red-600';
    textColor = 'text-red-600';
  } else if (percentage > 50) {
    color = 'bg-danger';
    textColor = 'text-danger';
  } else if (percentage > 25) {
    color = 'bg-warning';
    textColor = 'text-warning';
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <span className={`text-lg font-bold ${textColor}`}>{value.toFixed(0)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 ${color} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
        <span>Critical</span>
      </div>
    </div>
  );
}
