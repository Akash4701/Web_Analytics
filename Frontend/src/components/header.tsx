import { BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-sm text-gray-500">
                Monitor your application events and user behavior
              </p>
            </div>
          </div>

         
          <Link
            to="/events"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Track Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
