import React from 'react';
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-800 border border-white/10 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg font-bold text-white">{payload[0].value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const BarChart = ({ data, dataKey = 'value', color = '#6c3bff' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBar data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
      </RechartsBar>
    </ResponsiveContainer>
  );
};

export default BarChart;
