
import './App.css'

import Header from './components/header';
import EventsOverTimeChart from './components/filters/EventsChart';
import EventTypesChart from './components/filters/Eventtypes';
import RecentEventsTable from './components/RecentEvents';
import MetricsCards from './components/metricsCard';

const Dashboard= () => {
  return (
    
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="px-6 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <MetricsCards />
            <EventsOverTimeChart />
            <EventTypesChart />
            <RecentEventsTable />
          </div>
        </main>
      </div>
    
  );
};

export default Dashboard;


