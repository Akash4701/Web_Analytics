import { Calendar, Heart, MessageSquare, Search, ShoppingCart, Star, User } from "lucide-react";
import { use, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEventTracking } from "./Hooks/EventHooks";

const Homepage = ({ onNavigate, currentUser }) => {
    const navigate=useNavigate();
    console.log('currentUser:', currentUser);
  const { trackEvent } = useEventTracking('homepage');
  
  useEffect(() => {
    trackEvent('page_view');
  }, []);
  
  const handleButtonClick = (buttonName: string) => {
    trackEvent('button_click', { buttonName, section: 'hero' });
  };
  
  const handleFeatureClick = (featureName: string) => {
    trackEvent('feature_click', { featureName });
  };
  
  const handleSearch = (searchTerm: any) => {
    trackEvent('search', { query: searchTerm });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">EventTracker Demo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {currentUser.fullName}</span>
              <button
                onClick={() => {
                  trackEvent('navigation_click', { destination: 'dashboard' });
                  onNavigate('');
                    navigate('/');
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to Our Event Tracking Demo
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            This demo showcases various UI interactions that trigger different event types for analytics tracking.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for features..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e.target.value);
                  }
                }}
              />
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleButtonClick('get_started')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={() => handleButtonClick('learn_more')}
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Interactive Features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: User, name: 'User Management', description: 'Manage user profiles' },
              { icon: Calendar, name: 'Event Scheduling', description: 'Schedule and track events' },
              { icon: ShoppingCart, name: 'E-commerce', description: 'Shopping cart functionality' },
              { icon: Heart, name: 'Favorites', description: 'Save favorite items' },
              { icon: Star, name: 'Reviews', description: 'Rate and review' },
              { icon: MessageSquare, name: 'Chat', description: 'Real-time messaging' }
            ].map((feature, index) => (
              <div
                key={index}
                onClick={() => handleFeatureClick(feature.name)}
                className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <feature.icon className="h-8 w-8 text-indigo-600 mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.name}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage