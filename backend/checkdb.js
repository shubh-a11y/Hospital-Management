const { MongoClient } = require('mongodb');

async function checkDatabase() {
  try {
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('jungleSafari');
    const users = await db.collection('users').find().toArray();
    console.log('Users in database:', users);
    
    await client.close();
  } catch (err) {
    console.error('Error checking database:', err);
  }
}

checkDatabase();
