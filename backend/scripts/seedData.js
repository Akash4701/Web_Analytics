import { connect } from 'mongoose';
import { Event } from '../src/models/events.models.js';  
import { User } from '../src/models/user.models.js';     
import dotenv from 'dotenv';
import { DB_NAME } from '../src/constants.js';  

dotenv.config();


const eventNames = [
  'page_view', 'button_click', 'form_submit', 'video_play', 'video_pause',
  'download', 'signup', 'login', 'logout', 'purchase', 'add_to_cart',
  'search', 'filter_applied', 'modal_open', 'modal_close'
];

const pages = [
  '/', '/about', '/products', '/contact', '/login', '/signup',
  '/dashboard', '/profile', '/settings', '/checkout', '/cart',
  '/product/123', '/product/456', '/blog', '/blog/post-1'
];

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


function generateUserData(index) {
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emma', 'Chris', 'Lisa', 'Tom', 'Amy'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Miller', 'Moore', 'Taylor', 'Anderson', 'Thomas'];
  
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  
  return {
    UserId: `user_${index}_${Math.random().toString(36).substr(2, 6)}`,
    username: `${firstName.toLowerCase()}${lastName.toLowerCase()}${index}`,
    fullName: `${firstName} ${lastName}`
  };
}

async function seedData() {
  try {
 
    await connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("Connected to DB:", DB_NAME);

  
    await Event.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing events and users');


    const users = [];
    const numberOfUsers = 50;
    
    for (let i = 0; i < numberOfUsers; i++) {
      const userData = generateUserData(i);
      users.push(userData);
    }

 
    const insertedUsers = await User.insertMany(users);
    console.log(`Created ${insertedUsers.length} users`);

    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const events = [];

    
    for (let i = 0; i < 1000; i++) {
     
      const randomUser = getRandomElement(insertedUsers);
      
      const event = {
        eventName: getRandomElement(eventNames),
        timestamp: getRandomDate(startDate, endDate),
        userId: randomUser._id,
        page: getRandomElement(pages),
        userAgent: getRandomElement(userAgents),
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        customProperties: {
          referrer: Math.random() > 0.7 ? 'https://google.com' : null,
          device: getRandomElement(['desktop', 'mobile', 'tablet']),
          browser: getRandomElement(['chrome', 'firefox', 'safari', 'edge']),
          version: Math.floor(Math.random() * 10) + 1
        }
      };

     
      if (event.eventName === 'purchase') {
        event.customProperties.amount = Math.floor(Math.random() * 1000) + 10;
        event.customProperties.currency = 'USD';
      } else if (event.eventName === 'search') {
        event.customProperties.query = getRandomElement(['shoes', 'laptop', 'phone', 'book', 'music']);
      }

      events.push(event);
    }

   
    const batchSize = 100;
    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize);
      await Event.insertMany(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(events.length / batchSize)}`);
    }

    console.log(`Successfully seeded ${events.length} events`);

    await Event.createIndexes();
    await User.createIndexes();
    console.log('Created database indexes');

   
    const eventStats = await Event.aggregate([
      {
        $group: {
          _id: '$eventName',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\nEvent statistics:');
    eventStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count}`);
    });

  
    const userEventStats = await Event.aggregate([
      {
        $group: {
          _id: '$userId',
          eventCount: { $sum: 1 }
        }
      },
      { $sort: { eventCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      }
    ]);

    console.log('\nTop 5 most active users:');
    userEventStats.forEach(stat => {
      const user = stat.user[0];
      console.log(`${user.fullName} (${user.username}): ${stat.eventCount} events`);
    });

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
   
    process.exit(0);
  }
}


seedData();