
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type TrendItem = { name: string; value: number; percentage?: number; color?: string };

interface VaccineTrendsProps {
  data?: TrendItem[];
}

const COLORS = ['#3b82f6', '#f97316', '#22c55e', '#ef4444', '#a78bfa', '#14b8a6'];

const VaccineTrends: React.FC<VaccineTrendsProps> = ({ data = [] }) => {
  const trends = data.map((t, i) => ({
    ...t,
    color: t.color ?? COLORS[i % COLORS.length],
  }));
  const total = trends.reduce((sum, t) => sum + (t.value || 0), 0);
  const growthText = total > 0 ? `${Math.min(99, Math.max(1, Math.round((trends[0]?.value || 0) / total * 100)))}%` : '0%';
  return (
    <div className="bg-[#18181b] p-6 rounded-2xl border border-white/5 flex flex-col">
      <h3 className="text-gray-300 text-lg font-medium mb-6">Vaccine Trends</h3>
      
      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={trends}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {trends.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color!} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-white">{growthText}</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">Growth</span>
        </div>
      </div>

      <div className="space-y-3 mt-6">
        {trends.map((trend) => (
          <div key={trend.name} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: trend.color! }}></div>
              <div>
                <p className="text-sm font-medium text-gray-300">{trend.name}</p>
                <p className="text-xs text-gray-500">{trend.value}</p>
              </div>
            </div>
            {typeof trend.percentage === 'number' && (
              <span className="text-sm font-bold text-gray-400">%{trend.percentage}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VaccineTrends;
