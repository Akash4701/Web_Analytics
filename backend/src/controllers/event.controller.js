
import { Event } from "../models/events.models.js";

export const createEvent=async(req,res)=>{

  try {
    const { eventName, page, customProperties = {} } = req.body;

    
    if (!eventName) {
      return res.status(400).json({ 
        error: 'eventName is required',
        success: false 
      });
    }

    console.log(eventName, page, customProperties);

   
    const eventData = {
      eventName: eventName.trim(),
      timestamp: new Date(),
      
      page: page?.trim(),
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      customProperties
    };

    const totalCount = await Event.countDocuments();
    console.log('Total documents in Event collection:', totalCount);

 
    const event = new Event(eventData);
    await event.save();

    res.status(201).json({ 
      success: true, 
      eventId: event._id,
      message: 'Event collected successfully'
    });

  } catch (error) {
    console.error('Error collecting event:', error);
    res.status(500).json({ 
      error: 'Failed to collect event',
      success: false 
    });
  }
};




export const getDashboardMetrics = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const latestEvent = await Event.findOne().sort({ timestamp: -1 });
    const uniqueUsers = await Event.distinct('userId');

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(now.getDate() - 60);

    const last30DaysEvents = await Event.countDocuments({
      timestamp: { $gte: thirtyDaysAgo }
    });

    const last60DaysEvents = await Event.countDocuments({
      timestamp: { $gte: sixtyDaysAgo }
    });

    const topEventTypes = await Event.aggregate([
      { $group: { _id: '$eventName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        latestEventTimestamp: latestEvent?.timestamp || null,
        totalUniqueUsers: uniqueUsers.length,
        last30DaysEvents,
        last60DaysEvents,
        topEventTypes
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard metrics'
    });
  }
};



export const getTimeInterval = async (req, res) => {
   try {
    const { start, end, interval = 'day' } = req.query;

    // Build match stage
    const matchStage = {};
    
    if (start || end) {
      matchStage.timestamp = {};
      if (start) matchStage.timestamp.$gte = new Date(start);
      if (end) matchStage.timestamp.$lte = new Date(end);
    }
    
  

    // Define grouping format based on interval
    let dateGroupFormat;
    switch (interval) {
      case 'hour':
        dateGroupFormat = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' },
          hour: { $hour: '$timestamp' }
        };
        break;
      case 'day':
        dateGroupFormat = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' }
        };
        break;
      case 'month':
        dateGroupFormat = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' }
        };
        break;
      default:
        dateGroupFormat = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' }
        };
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: dateGroupFormat,
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 } }
    ];

    const results = await Event.aggregate(pipeline);

    // Format results for easier consumption
    const formattedResults = results.map(item => ({
      period: item._id,
      count: item.count,
      date: formatDateFromGroup(item._id)
    }));

    res.json({
      success: true,
      data: formattedResults,
      total: results.length,
      interval,
      filters: { start, end }
    });

  } catch (error) {
    console.error('Error getting event counts:', error);
    res.status(500).json({ 
      error: 'Failed to get event counts',
      success: false 
    });
  }
}

// Helper function to format date from group
const formatDateFromGroup = (group, interval) => {
  const { year, month, day, hour } = group;
  
  switch (interval) {
    case 'hour':
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:00`;
    case 'day':
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    case 'month':
      return `${year}-${String(month).padStart(2, '0')}`;
    default:
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
};


export const getTopEvents = async (req, res) => {
  try {
    const { prop, limit = 5 } = req.query;
    
    const matchStage = {};
    if (prop) {
      matchStage.eventName = { $regex: prop, $options: 'i' };
    }

    const pipeline = [
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      
      {
        $group: {
          _id: '$eventName',
          count: { $sum: 1 },
          users: { 
            $addToSet: {
              userId: '$userId',
              timestamp: '$timestamp',
              page: '$page',
             
            }
          },
          pages: { $addToSet: '$page' },
        
        }
      },
      
      {
        $addFields: {
          userCount: { $size: '$users' },
          pageCount: { $size: '$pages' },
      
        }
      },
      
      {
        $project: {
          eventName: '$_id',
          count: 1,
          userCount: 1,
          pageCount: 1,
        
          topPages: { $slice: ['$pages', 3] }, // Show top 3 pages
          _id: 0
        }
      },
      
      { $sort: { count: -1 } },
      { $limit: parseInt(limit) }
    ];

    const results = await Event.aggregate(pipeline);
    const totalEvents = results.reduce((sum, item) => sum + item.count, 0);
    
    const formattedResults = results.map(item => ({
      ...item,
      percentage: totalEvents > 0 ? Math.round((item.count / totalEvents) * 100 * 100) / 100 : 0
    }));

    res.json({
      success: true,
      data: formattedResults,
      total: results.length,
      totalEvents,
      filters: { prop, limit: parseInt(limit) }
    });

  } catch (error) {
    console.error('Error getting detailed top events:', error);
    res.status(500).json({
      error: 'Failed to get detailed top events',
      success: false
    });
  }
};

export const getRecentEvents = async (req, res) => {
  try {
    // Get limit from query params, default to 50
    const limit = parseInt(req.query.limit) || 50;
    
    // Fetch recent events sorted by timestamp (newest first)
    const recentEvents = await Event.find({})
      .select('timestamp userId eventName page') // Only select required fields
      .sort({ timestamp: -1 }) // Sort by newest first
      .limit(limit)
      .lean(); // Use lean() for better performance
    
    res.json({
      success: true,
      data: {
        events: recentEvents,
        totalReturned: recentEvents.length
      }
    });
    
  } catch (error) {
    console.error('Error getting recent events:', error);
    res.status(500).json({
      error: 'Failed to get recent events',
      success: false
    });
  }
};



