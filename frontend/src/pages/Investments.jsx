import API from '../services/api';np
import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { ArrowUpRight, Plus } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  LineChart,
  Line,
  YAxis
} from 'recharts';

const Investments = () => {
  const [timeframe, setTimeframe] = useState('1W');
  const [chartData, setChartData] = useState([]);

  // FETCH FROM BACKEND
  const fetchHistory = async (selectedTimeframe) => {
    try {
      const res = await API.get(
        `/investments/history?timeframe=${selectedTimeframe}`
      );

      const formatted = res.data.map(item => ({
        name: item.record_date,
        value: item.portfolio_value
      }));

      setChartData(formatted);
      setTimeframe(selectedTimeframe);

    } catch (error) {
      console.error("API Error:", error);
    }
  };

  // LOAD DEFAULT DATA
  useEffect(() => {
    fetchHistory("1W");
  }, []);

  return (
    <DashboardLayout title="Investments">
      <div className="space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Portfolio Performance</h1>

          {/* TIMEFRAME BUTTONS */}
          <div className="flex gap-2">
            {['1W', '1M', '1Y'].map((t) => (
              <button
                key={t}
                onClick={() => fetchHistory(t)}
                className={`px-4 py-2 rounded-lg text-sm font-bold ${
                  timeframe === t
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* LINE CHART */}
        <div className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Investments;