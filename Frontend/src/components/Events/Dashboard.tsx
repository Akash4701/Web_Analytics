import { useEffect, useState } from "react";
import { useEventTracking } from "./Hooks/EventHooks";



const Dashboard = ({ onNavigate, currentUser }) => {
  const { trackEvent } = useEventTracking('dashboard');
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    trackEvent('page_view');
  }, []);
  
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    trackEvent('tab_change', { tabName, previousTab: activeTab });
  };
  
  const handleDownload = (fileType: string) => {
    trackEvent('file_download', { fileType });
  };
  
  const handlePlay = (mediaType: string) => {
    trackEvent('media_play', { mediaType });
  };
  
  const handleShare = (platform: string) => {
    trackEvent('share_click', { platform });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">User: {currentUser.username}</span>
              <button
                onClick={() => {
                  trackEvent('navigation_click', { destination: 'homepage' });
                  onNavigate('homepage');
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'analytics', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content based on active tab */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stats Cards */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Events', value: '1,234' },
                { label: 'Page Views', value: '567' },
                { label: 'Button Clicks', value: '89' },
                { label: 'User Sessions', value: '45' }
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-2xl font-bold text-indigo-600">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-4">
              {[
                { icon: Download, label: 'Download Report', action: () => handleDownload('pdf') },
                { icon: Play, label: 'Watch Tutorial', action: () => handlePlay('video') },
                { icon: Share2, label: 'Share Dashboard', action: () => handleShare('email') }
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-md transition-colors"
                >
                  <action.icon className="h-5 w-5 text-gray-400" />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                'User clicked "Get Started" button',
                'Page view recorded for homepage',
                'Feature click: User Management',
                'Search performed: "analytics dashboard"',
                'Tab changed to Analytics'
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-sm text-gray-700">{activity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;