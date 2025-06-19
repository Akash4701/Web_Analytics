import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Users, Globe, TrendingUp, Filter } from 'lucide-react';
import axios from 'axios';

interface EventData {
  eventName: string;
  count: number;
  userCount: number;
  pageCount: number;
 
  
}

const TopEventsPieChart = () => {
  const [data, setData] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventFilter, setEventFilter] = useState('');
  const [limit, setLimit] = useState(5);
  const [summary, setSummary] = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState<'count' | 'userCount' | 'pageCount' >('count');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
     
      const response = await axios.get('http://localhost:8000/api/events/top',{
        params:{
          prop: eventFilter.trim(),
          limit: limit
        }
      });
      console.log(response.data);

  
      
    
      
      if (response.data.success) {
        setData(response.data.data);
        setSummary(response.data.summary);
      } else {
        throw new Error('Failed to fetch data');
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
  }, [eventFilter, limit]);

  
  const getChartData = () => {
    return data.map((item, index) => ({
      name: item.eventName,
      value: item[selectedMetric],
      count: item.count,
      userCount: item.userCount,
      pageCount: item.pageCount,
    
     
      color: COLORS[index % COLORS.length]
    }));
  };

 
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{data.name}</p>
          <div className="space-y-1 text-sm">
            <p className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span>Events: {data.count.toLocaleString()}</span>
            </p>
            <p className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <span>Users: {data.userCount.toLocaleString()}</span>
            </p>
            <p className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-purple-500" />
              <span>Pages: {data.pageCount.toLocaleString()}</span>
            </p>
           
           
          </div>
        </div>
      );
    }
    return null;
  };

 
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; 
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'count': return 'Event Count';
      case 'userCount': return 'User Count';
      case 'pageCount': return 'Page Count';
      
      default: return 'Count';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Top Events Analytics</h2>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
       
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Event Filter
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              placeholder="Filter by event name..."
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">
            Limit
          </label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={3}>Top 3</option>
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={15}>Top 15</option>
          </select>
        </div>

     
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">
            Chart Metric
          </label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="count">Event Count</option>
            <option value="userCount">User Count</option>
            <option value="pageCount">Page Count</option>
         
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

      
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-700">Total Events</h3>
            <p className="text-2xl font-bold text-blue-900">
              {summary.totalEventCount.toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-700">Unique Event Types</h3>
            <p className="text-2xl font-bold text-green-900">
              {summary.totalUniqueEvents}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-700">Avg per Type</h3>
            <p className="text-2xl font-bold text-purple-900">
              {summary.avgEventsPerType.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Distribution by {getMetricLabel(selectedMetric)}
          </h3>
          <div className="h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-red-500 text-center">
                  <p className="font-medium">Error loading data</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            ) : data.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500 text-center">
                  <p className="font-medium">No events found</p>
                  <p className="text-sm mt-1">Try adjusting your filters</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Details</h3>
          <div className="overflow-x-auto">
            {data.length > 0 ? (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-medium text-gray-700">Event</th>
                    <th className="text-right py-2 font-medium text-gray-700">Count</th>
                    <th className="text-right py-2 font-medium text-gray-700">Users</th>
                    <th className="text-right py-2 font-medium text-gray-700">Pages</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr 
                      key={item.eventName} 
                      className="border-b border-gray-100 hover:bg-white transition-colors"
                    >
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="font-medium truncate max-w-32" title={item.eventName}>
                            {item.eventName}
                          </span>
                        </div>
                      </td>
                      <td className="text-right py-2 font-mono">{item.count.toLocaleString()}</td>
                      <td className="text-right py-2 font-mono">{item.userCount.toLocaleString()}</td>
                      <td className="text-right py-2 font-mono">{item.pageCount.toLocaleString()}</td>
                     
                     
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No data to display
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopEventsPieChart;