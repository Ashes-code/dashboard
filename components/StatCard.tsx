
import React from 'react';
import { MoreVertical } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { StatData } from '../types';

interface StatCardProps {
  data: StatData;
}

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  return (
    <div className="bg-[#18181b] p-6 rounded-2xl border border-white/5 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-white/5 p-2 rounded-lg">
          {data.icon}
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
          <span>Daily</span>
          <MoreVertical className="w-4 h-4 cursor-pointer" />
        </div>
      </div>
      
      <p className="text-gray-400 text-sm mb-1">{data.title}</p>
      
      <div className="h-16 w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.chartData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={data.color} 
              strokeWidth={2} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-end">
        <span className="text-2xl font-bold text-gray-200">{data.value}</span>
        <span className={`text-xs font-semibold ${data.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {data.change}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
