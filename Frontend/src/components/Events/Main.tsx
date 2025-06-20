import { useEffect, useState } from "react";
import Homepage from "./HomePage";
import Dashboard from "./Dashboard";
import { generateRandomUser } from "./Hooks/EventHooks";

const EventTrackingDemo = () => {
  const [currentPage, setCurrentPage] = useState('homepage');
  type User = {
    userId: string;
    username: string;
    fullName: string;
  };
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Generate random user on component mount
    const user = generateRandomUser();
    setCurrentUser(user);
    
    // In a real app, you might want to create this user in your backend
    console.log('Generated user:', user);
  }, []);
  
  const handleNavigation = (page:String) => {
    setCurrentPage(page);
  };
  
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing user session...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-xs">
       
      </div>
      
      {currentPage === 'homepage' && (
        <Homepage onNavigate={handleNavigation} currentUser={currentUser} />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard onNavigate={handleNavigation} currentUser={currentUser} />
      )}
    </div>
  );
};

export default EventTrackingDemo;