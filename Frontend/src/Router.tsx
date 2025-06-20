// src/Router.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainDashboard from './MainDashboard';
import EventTrackingDemo from './components/Events/Main';

const AppRouter= () => {
  return (
    <Router>
    

      <Routes>
        <Route path="/" element={<MainDashboard />} />
        <Route path="/events" element={<EventTrackingDemo />}/>

      </Routes>
    </Router>
  );
};

export default AppRouter;
