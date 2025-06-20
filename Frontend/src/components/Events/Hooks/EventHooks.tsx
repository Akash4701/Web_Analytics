import axios from "axios";



export const generateRandomUser = () => {
  const firstNames = ['John', 'Jane', 'Alex', 'Sarah', 'Mike', 'Emily', 'David', 'Lisa', 'Chris', 'Anna'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const userId = `user_${Math.random().toString(36).substr(2, 9)}`;
  const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${Math.floor(Math.random() * 1000)}`;
  const fullName = `${firstName} ${lastName}`;
  
  return { userId, username, fullName };
};



const eventTrackingAPI = {
  createEvent: async (
    eventName: string,
    page: string,
    customProperties: Record<string, any> = {}
  ) => {
    try {
      const response = await axios.post('http://localhost:8000/api/events/create', {
        eventName,
        page,
        customProperties,
      });

      console.log('Event tracked successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error tracking event:', error);
      return { success: false, error: error.message };
    }
  },
};

export default eventTrackingAPI;

// Event tracking hook
export const useEventTracking = (pageName: any) => {
  const trackEvent = async (eventName: any, customProperties = {}) => {
    await eventTrackingAPI.createEvent(eventName, pageName, customProperties);
  };
  
  return { trackEvent };
};