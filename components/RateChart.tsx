import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface RateChartProps {
  data: Array<{ timestamp: string; rate: number }>;
  title: string;
}

export default function RateChart({ data, title }: RateChartProps) {
  const formattedData = data.map((point) => ({
    ...point,
    date: format(new Date(point.timestamp), 'MMM dd'),
  }));

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => value.toFixed(2)}
            labelStyle={{ color: '#000' }}
          />
          <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
