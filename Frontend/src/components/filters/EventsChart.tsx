import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Clock } from 'lucide-react';
import axios from 'axios';

interface EventData {
  period: {
    year: number;
    month: number;
    day: number;
    hour?: number;
  };
  count: number;
  date: string;
}

const EventAnalyticsChart = () => {
  const [data, setData] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
 
  const [interval, setInterval] = useState('day');
  const getDateRange = (period: string) => {
    const now = new Date();
    const start = new Date();
    
    switch (period) {
      case '7days':
        start.setDate(now.getDate() - 7);
        return { start: start.toISOString().split('T')[0], end: now.toISOString().split('T')[0] };
      case '30days':
        start.setDate(now.getDate() - 30);
        return { start: start.toISOString().split('T')[0], end: now.toISOString().split('T')[0] };
      case '60days':
        start.setDate(now.getDate() - 60);
        return { start: start.toISOString().split('T')[0], end: now.toISOString().split('T')[0] };
      case 'custom':
        return { start: customStartDate, end: customEndDate };
      default:
        return { start: '', end: '' };
    }
  };

  // Fetch data from API
 const fetchData = async () => {
  setLoading(true);
  setError(null);

  try {
    const { start, end } = getDateRange(selectedPeriod);

    const response = await axios.get('http://localhost:8000/api/events/count', {
      params: {
        start,
        end,
        interval, 
      },
    });

    const result = response.data; 

    if (result.success) {
      const sortedData = result.data.sort((a:any, b:any) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      setData(sortedData);
    } else {
      throw new Error('API returned unsuccessful response');
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch data');
    console.error('Error fetching data:', err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchData();
  }, [selectedPeriod, customStartDate, customEndDate, interval]);

 
  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    
    switch (interval) {
      case 'hour':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit'
        });
      case 'day':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      case 'month':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        });
      default:
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
    }
  };


  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{`Date: ${label}`}</p>
          <p className="text-blue-600">
            {`Events: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
 
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Event Analytics</h2>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Time Period
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="60days">Last 60 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

      
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">
            Interval
          </label>
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="hour">Hourly</option>
            <option value="day">Daily</option>
            <option value="month">Monthly</option>
          </select>
        </div>

        

      
        <div className="flex flex-col justify-end">
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

     
      {selectedPeriod === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Start Date
            </label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      
      <div className="h-96 w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading chart data...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500 text-center">
              <p className="font-medium">Error loading data</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={fetchData}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 text-center">
              <p className="font-medium">No data available</p>
              <p className="text-sm mt-1">Try adjusting your filters or date range</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxisLabel}
                angle={-45}
                textAnchor="end"
                height={80}
                interval="preserveStartEnd"
                stroke="#666"
              />
              <YAxis
                stroke="#666"
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                name="Event Count"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

    
      {data.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-700">Total Events</h3>
            <p className="text-2xl font-bold text-blue-900">
              {data.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-700">Average per Period</h3>
            <p className="text-2xl font-bold text-green-900">
              {Math.round(data.reduce((sum, item) => sum + item.count, 0) / data.length).toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-700">Peak Events</h3>
            <p className="text-2xl font-bold text-purple-900">
              {Math.max(...data.map(item => item.count)).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventAnalyticsChart;