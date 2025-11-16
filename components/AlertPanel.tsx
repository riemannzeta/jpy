import React from 'react';
import { Alert } from '../lib/types';

interface AlertPanelProps {
  alerts: Alert[];
}

export default function AlertPanel({ alerts }: AlertPanelProps) {
  const severityConfig = {
    critical: {
      bg: 'bg-red-50 border-red-500',
      text: 'text-red-800',
      icon: '🔴',
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-500',
      text: 'text-yellow-800',
      icon: '⚠️',
    },
    info: {
      bg: 'bg-blue-50 border-blue-500',
      text: 'text-blue-800',
      icon: 'ℹ️',
    },
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✅</span>
          <span className="text-green-800 font-medium">No active alerts - Markets operating normally</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const config = severityConfig[alert.severity];
        return (
          <div key={alert.id} className={`${config.bg} border-2 rounded-lg p-4`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{config.icon}</span>
              <div className="flex-1">
                <div className={`${config.text} font-medium`}>{alert.message}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {new Date(alert.timestamp).toLocaleString()} · {alert.metric}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
