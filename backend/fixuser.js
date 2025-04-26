const { MongoClient } = require('mongodb');

async function fixUserAccount() {
  try {
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('jungleSafari');
    
    // Delete existing user account if it exists
    const result = await db.collection('users').deleteOne({ username: 'user' });
    console.log('Deleted user:', result.deletedCount);
    
    // Create new user account
    const insertResult = await db.collection('users').insertOne({
      username: 'user',
      password: 'user123',
      role: 'user',
      isActive: true,
      loginCount: 0,
      lastLogin: null,
      loginHistory: []
    });
    
    console.log('User created:', insertResult.acknowledged);
    
    // Verify user exists
    const users = await db.collection('users').find().toArray();
    console.log('Users in database:', users);
    
    await client.close();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Error fixing user account:', err);
  }
}

fixUserAccount(); 