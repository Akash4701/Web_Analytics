import axios from "axios";
import { Activity, BarChart3,  Users, Calendar, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";


interface DashboardMetrics {
  success: boolean;
  data: {
    totalEvents: number;
    latestEventTimestamp: string;
    totalUniqueUsers: number;
    last30DaysEvents: number;
    last60DaysEvents: number;
    topEventTypes: Array<{
      _id: string;
      count: number;
    }>;
  };
}

const MetricsCards = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    
    try {
        const response = await axios.get('http://localhost:8000/api/events/dashboard');
      console.log('metrics data:', response.data);
      setMetrics(response.data);
      setLoading(false);
      
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setError('Failed to load metrics');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 font-medium">{error}</p>
        <button 
          onClick={fetchMetrics} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!metrics || !metrics.success) {
    return <div className="text-center py-8 text-gray-500">No metrics data available</div>;
  }

  const { data } = metrics;
  

  
  

  
  const cards = [
    {
      title: 'Total Events',
      value: data.totalEvents.toLocaleString(),
      icon: Activity,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Users',
      value: data.totalUniqueUsers.toLocaleString(),
      icon: Users,
      color: 'bg-green-500',
    
      changeColor: 'text-green-600',
    },
    {
      title: 'Last 30 Days',
      value: data.last30DaysEvents.toLocaleString(),
      icon: Calendar,
      color: 'bg-purple-500',
    
      changeColor: 'text-green-600',
    },
    {
      title: 'Top Event Type',
      value: data.topEventTypes[0]?.count.toLocaleString() || '0',
      icon: BarChart3,
      color: 'bg-orange-500',
      change: data.topEventTypes[0]?._id.replace('_', ' ') || 'N/A',
      changeColor: 'text-gray-600',
    },
  ];

  return (
          <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {new Date(data.latestEventTimestamp).toLocaleString()}
          </div>
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                <p className={`text-sm mt-1 font-medium ${card.changeColor}`}>
                  {card.change}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg shadow-sm`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
     
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Event Types</h3>
        <div className="space-y-3">
          {data.topEventTypes.map((event, index) => (
            <div key={event._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="flex items-center justify-center w-6 h-6 bg-gray-600 text-white text-xs font-medium rounded-full">
                  {index + 1}
                </span>
                <span className="font-medium text-gray-900 capitalize">
                  {event._id.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-900">{event.count}</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(event.count / data.topEventTypes[0].count) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsCards;