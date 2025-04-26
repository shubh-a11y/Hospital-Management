const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json()); // Parse JSON requests
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3003', '*'], // Allow React dev server on both 3000 and 3003
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
})); // Improved CORS settings

// Fallback data for when MongoDB is not available
const fallbackInventory = [
  { name: 'Surgical Bandages', stock: 75, price: 15, category: 'surgical' },
  { name: 'Syringes (10ml)', stock: 120, price: 5, category: 'disposable' },
  { name: 'IV Fluids (1L)', stock: 40, price: 25, category: 'medication' },
  { name: 'Medical Gloves', stock: 300, price: 10, category: 'disposable' },
  { name: 'Surgical Masks', stock: 250, price: 12, category: 'surgical' },
  { name: 'Sterile Gauze', stock: 180, price: 8, category: 'surgical' },
  { name: 'Defibrillator', stock: 3, price: 2500, category: 'emergency' },
  { name: 'Patient Monitors', stock: 8, price: 1200, category: 'equipment' },
  { name: 'Ventilators', stock: 5, price: 5000, category: 'emergency' },
  { name: 'Wheelchairs', stock: 12, price: 350, category: 'equipment' },
  { name: 'Ibuprofen (200mg)', stock: 120, price: 15, category: 'medication' },
  { name: 'Antibiotics', stock: 85, price: 45, category: 'medication' },
  { name: 'Blood Pressure Cuffs', stock: 25, price: 70, category: 'equipment' },
];

// Mock patients data
const fallbackPatients = [
  { id: 'P1001', name: 'John Smith', age: 45, gender: 'male', diagnosis: 'Hypertension', contact: '555-123-4567', address: '123 Main St', admissionDate: new Date().toISOString() },
  { id: 'P1002', name: 'Emma Johnson', age: 35, gender: 'female', diagnosis: 'Diabetes Type 2', contact: '555-234-5678', address: '456 Oak Ave', admissionDate: new Date().toISOString() },
  { id: 'P1003', name: 'Robert Davis', age: 60, gender: 'male', diagnosis: 'Arthritis', contact: '555-345-6789', address: '789 Pine Rd', admissionDate: new Date().toISOString() },
  { id: 'P1004', name: 'Sarah Wilson', age: 28, gender: 'female', diagnosis: 'Bronchitis', contact: '555-456-7890', address: '101 Cedar Ln', admissionDate: new Date().toISOString() },
  { id: 'P1005', name: 'Michael Brown', age: 52, gender: 'male', diagnosis: 'Heart Disease', contact: '555-567-8901', address: '202 Elm St', admissionDate: new Date().toISOString() },
];

// In-memory data store for fallback mode
let inMemoryInventory = [...fallbackInventory];
let inMemoryPatients = [...fallbackPatients];
let inMemorySales = [];
let useInMemoryMode = false;

// Remove deprecated options
const options = {
  // Only keep essential options
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  connectTimeoutMS: 10000 // Default value
};

// Try connecting to different MongoDB URL formats
const uris = [
  'mongodb://127.0.0.1:27017',
  'mongodb://localhost:27017'
];
let currentUriIndex = 0;
let uri = uris[currentUriIndex];
let client = new MongoClient(uri, options);

let db;
let inventoryCollection;
let patientsCollection;
let salesCollection;
let usersCollection;

// Function to connect or reconnect to MongoDB
async function connectToMongo() {
  try {
    // Try to close any existing connection
    try {
      await client.close(true);
    } catch (err) {
      // Ignore error if no connection exists
      console.log('No previous connection to close or error closing:', err.message);
    }

    // Try current URI
    client = new MongoClient(uri, options);
    await client.connect();
    
    console.log(`Connected to MongoDB at ${uri}`);
    db = client.db('hospitalDB');
    inventoryCollection = db.collection('inventory');
    patientsCollection = db.collection('patients');
    salesCollection = db.collection('billing');
    usersCollection = db.collection('users');
    
    // Create collections and indexes if they don't exist
    try {
      await db.createCollection('inventory');
      await db.createCollection('patients');
      await db.createCollection('billing');
      await db.createCollection('users');
    } catch (err) {
      // Collections may already exist, which is fine
      console.log('Collections already exist or error creating collections:', err.message);
    }
    
    useInMemoryMode = false;
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    
    // Try next URI if available
    currentUriIndex = (currentUriIndex + 1) % uris.length;
    uri = uris[currentUriIndex];
    console.log(`Trying next MongoDB URI: ${uri}`);
    
    // If we've tried all URIs, use in-memory mode
    if (currentUriIndex === 0) {
      console.log('All MongoDB connection attempts failed. Switching to in-memory mode.');
      useInMemoryMode = true;
      console.log('Using in-memory mode as fallback');
      return false;
    }
    
    // Try with next URI
    return await connectToMongo();
  }
}

// Initialize data in the database
async function initializeData() {
  try {
    if (useInMemoryMode) {
      console.log('In memory mode: skipping database initialization');
      return;
    }
    
    // Check if inventory is empty
    const invCount = await inventoryCollection.countDocuments();
    
    if (invCount === 0) {
      // Seed initial data only if collection is empty
      await inventoryCollection.insertMany(fallbackInventory);
      console.log('Inventory initialized with sample data');
    }
    
    // Check if patients collection is empty
    const patCount = await patientsCollection.countDocuments();
    
    if (patCount === 0) {
      // Seed initial patient data
      await patientsCollection.insertMany(fallbackPatients);
      console.log('Patients collection initialized with sample data');
    }

    // Check if users collection exists, if not create it with admin user
    const userCount = await usersCollection.countDocuments();
    console.log('Found', userCount, 'users in database');
    
    if (userCount === 0) {
      console.log('Creating default users in database');
      // Create admin user with new roles
      await usersCollection.insertOne({
        username: 'admin',
        password: 'admin123', // In a real app, this would be hashed
        role: 'admin',
        userType: 'doctor',
        department: 'administration',
        isActive: true,
        loginCount: 0,
        lastLogin: null,
        loginHistory: []
      });
      
      // Add different types of users with roles
      await usersCollection.insertOne({
        username: 'doctor',
        password: 'doctor123', // In a real app, this would be hashed
        role: 'user',
        userType: 'doctor',
        department: 'cardiology',
        isActive: true,
        loginCount: 0,
        lastLogin: null,
        loginHistory: []
      });
      
      await usersCollection.insertOne({
        username: 'nurse',
        password: 'nurse123', // In a real app, this would be hashed
        role: 'user',
        userType: 'nurse',
        department: 'general',
        isActive: true,
        loginCount: 0,
        lastLogin: null,
        loginHistory: []
      });
      
      await usersCollection.insertOne({
        username: 'receptionist',
        password: 'reception123', // In a real app, this would be hashed
        role: 'user',
        userType: 'receptionist',
        department: 'frontdesk',
        isActive: true,
        loginCount: 0,
        lastLogin: null,
        loginHistory: []
      });
      
      console.log('Admin and staff users created in database');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
    useInMemoryMode = true;
    console.log('Switching to in-memory mode due to initialization error');
  }
}

// In-memory users
let inMemoryUsers = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    userType: 'doctor',
    department: 'administration',
    isActive: true,
    loginCount: 0,
    lastLogin: null,
    loginHistory: []
  },
  {
    username: 'doctor',
    password: 'doctor123',
    role: 'user',
    userType: 'doctor',
    department: 'cardiology',
    isActive: true,
    loginCount: 0,
    lastLogin: null,
    loginHistory: []
  },
  {
    username: 'nurse',
    password: 'nurse123',
    role: 'user',
    userType: 'nurse',
    department: 'general',
    isActive: true,
    loginCount: 0,
    lastLogin: null,
    loginHistory: []
  },
  {
    username: 'receptionist',
    password: 'reception123',
    role: 'user',
    userType: 'receptionist',
    department: 'frontdesk',
    isActive: true,
    loginCount: 0,
    lastLogin: null,
    loginHistory: []
  }
];

async function startServer() {
  // Connect to MongoDB first
  const connected = await connectToMongo();
  
  if (!connected) {
    console.error('Could not connect to MongoDB. Using in-memory mode as fallback.');
    useInMemoryMode = true;
  } else {
    // Initialize data
    await initializeData();
  }

  // Routes
  // Authentication routes directly defined instead of using require('./routes/auth')
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ 
          success: false,
          error: 'Username and password are required' 
        });
      }
      
      let user;
      console.log(`Login attempt for user: ${username}`);
      
      if (useInMemoryMode) {
        // In-memory authentication
        user = inMemoryUsers.find(u => u.username === username && u.password === password);
        
        if (!user) {
          console.log(`Invalid login attempt for user: ${username}`);
          return res.status(401).json({ 
            success: false,
            error: 'Invalid credentials' 
          });
        }
        
        // Update user login info
        user.loginCount = (user.loginCount || 0) + 1;
        user.lastLogin = new Date();
        user.loginHistory = user.loginHistory || [];
        user.loginHistory.push(new Date());
        
        console.log(`User logged in: ${username} (${user.role})`);
      } else {
        // MongoDB authentication
        user = await db.collection('users').findOne({ username });
        
        if (!user || user.password !== password) {
          console.log(`Invalid login attempt for user: ${username}`);
          return res.status(401).json({ 
            success: false,
            error: 'Invalid credentials' 
          });
        }
        
        // Update user login info
        const updateResult = await db.collection('users').updateOne(
          { username },
          { 
            $inc: { loginCount: 1 },
            $set: { lastLogin: new Date() },
            $push: { loginHistory: new Date() }
          }
        );
        
        console.log(`User logged in: ${username} (${user.role})`);
      }
      
      // Don't send the password back
      const { password: _, ...userWithoutPassword } = user;
      
      // Send response with success: true flag
      res.json({
        success: true,
        message: 'Authentication successful',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Internal server error during login' 
      });
    }
  });

  // API endpoints
  app.get('/api/health', (req, res) => {
    console.log('Health check received from:', req.headers.origin);
    res.json({ status: 'Server is healthy' });
  });

  // Dashboard endpoint for admin
  app.get('/api/dashboard', async (req, res) => {
    try {
      console.log('Fetching dashboard data');
      
      let inventoryData, salesData;
      
      if (useInMemoryMode) {
        inventoryData = [...inMemoryInventory];
        salesData = [...inMemorySales];
      } else {
        // MongoDB mode
        inventoryData = await db.collection('inventory').find({}).toArray();
        salesData = await db.collection('billing').find({}).sort({ date: -1 }).limit(20).toArray();
      }
      
      // Calculate total sales for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentSales = salesData.filter(sale => 
        new Date(sale.date) >= thirtyDaysAgo
      );
      
      const totalSales = recentSales.reduce((sum, sale) => sum + (sale.total || 0), 0);
      
      // Calculate inventory value
      const inventoryValue = inventoryData.reduce((sum, item) => 
        sum + (item.price * item.stock || 0), 0
      );
      
      // Find low stock items (less than 5)
      const lowStockItems = inventoryData
        .filter(item => item.stock < 5)
        .map(item => ({ name: item.name, quantity: item.stock }));
      
      // Calculate best sellers
      const salesByProduct = {};
      salesData.forEach(sale => {
        if (!salesByProduct[sale.product]) {
          salesByProduct[sale.product] = 0;
        }
        salesByProduct[sale.product] += sale.quantity || 0;
      });
      
      const bestSellers = Object.keys(salesByProduct)
        .map(name => ({ name, soldQuantity: salesByProduct[name] }))
        .sort((a, b) => b.soldQuantity - a.soldQuantity)
        .slice(0, 3);
      
      // Find least and most in stock
      let leastInStock = null;
      let mostInStock = null;
      
      if (inventoryData.length > 0) {
        leastInStock = inventoryData.reduce((min, item) => 
          (!min || item.stock < min.stock) ? item : min, null
        );
        
        mostInStock = inventoryData.reduce((max, item) => 
          (!max || item.stock > max.stock) ? item : max, null
        );
      }
      
      const dashboardData = {
        totalSales,
        inventoryValue,
        lowStockItems,
        bestSellers,
        leastInStock,
        mostInStock,
        recentSales: recentSales.slice(0, 5) // Only send the 5 most recent sales
      };
      
      res.json(dashboardData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  });

  // User dashboard data
  app.get('/api/user-dashboard', async (req, res) => {
    try {
      console.log('Fetching user dashboard data');
      
      let inventoryData, salesData;
      
      if (useInMemoryMode) {
        inventoryData = [...inMemoryInventory];
        salesData = [...inMemorySales];
      } else {
        // MongoDB mode
        inventoryData = await db.collection('inventory').find({}).toArray();
        salesData = await db.collection('billing').find({}).sort({ date: -1 }).toArray();
      }
      
      // Find best seller product
      const salesByProduct = {};
      salesData.forEach(sale => {
        if (!salesByProduct[sale.product]) {
          salesByProduct[sale.product] = 0;
        }
        salesByProduct[sale.product] += sale.quantity || 0;
      });
      
      let bestSeller = { name: 'No products sold yet', quantity: 0 };
      
      if (Object.keys(salesByProduct).length > 0) {
        const topProduct = Object.keys(salesByProduct).reduce((a, b) => 
          salesByProduct[a] > salesByProduct[b] ? a : b
        );
        
        bestSeller = {
          name: topProduct,
          quantity: salesByProduct[topProduct]
        };
      }
      
      // Find a recommendation (highest priced item for now)
      let ourPreference = { name: 'No items in inventory', price: 0 };
      
      if (inventoryData.length > 0) {
        const topItem = inventoryData.reduce((a, b) => 
          a.price > b.price ? a : b
        );
        
        ourPreference = {
          name: topItem.name,
          price: topItem.price
        };
      }
      
      // Find recently added item (for now just pick a random one)
      const recentlyAdded = inventoryData.length > 0 
        ? inventoryData[Math.floor(Math.random() * inventoryData.length)]
        : null;
      
      // Find low stock items
      const lowStockItems = inventoryData
        .filter(item => item.stock < 5)
        .map(item => ({ name: item.name, stock: item.stock }));
      
      const userDashboardData = {
        bestSeller,
        ourPreference,
        recentlyAdded,
        lowStockItems
      };
      
      res.json(userDashboardData);
    } catch (error) {
      console.error('Error fetching user dashboard data:', error);
      res.status(500).json({ error: 'Failed to fetch user dashboard data' });
    }
  });

  // Reports endpoint for sales data
  app.get('/api/reports/sales', async (req, res) => {
    try {
      console.log('Fetching sales report data');
      
      let salesData;
      
      if (useInMemoryMode) {
        salesData = [...inMemorySales];
      } else {
        // MongoDB mode
        salesData = await db.collection('billing').find({}).toArray();
      }
      
      // Calculate sales summaries by product
      const salesByProduct = {};
      let totalRevenue = 0;
      
      salesData.forEach(sale => {
        const product = sale.product;
        const quantity = sale.quantity || 0;
        const revenue = sale.total || 0;
        
        totalRevenue += revenue;
        
        if (!salesByProduct[product]) {
          salesByProduct[product] = {
            product,
            quantity: 0,
            revenue: 0
          };
        }
        
        salesByProduct[product].quantity += quantity;
        salesByProduct[product].revenue += revenue;
      });
      
      // Convert to array
      const salesSummary = Object.values(salesByProduct);
      
      res.json({
        totalRevenue,
        salesData: salesSummary
      });
    } catch (error) {
      console.error('Error fetching sales report data:', error);
      res.status(500).json({ error: 'Failed to fetch sales report data' });
    }
  });

  // Inventory routes
  app.get('/api/inventory', async (req, res) => {
    try {
      console.log('Fetching inventory');
      
      let inventory;
      if (useInMemoryMode) {
        inventory = [...inMemoryInventory];
      } else {
        inventory = await db.collection('inventory').find({}).toArray();
      }
      
      res.json(inventory);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      res.status(500).json({ error: 'Failed to fetch inventory' });
    }
  });

  // Add new item to inventory
  app.post('/api/inventory/add', async (req, res) => {
    try {
      const { name, stock, price } = req.body;
      
      // Validate request
      if (!name || stock === undefined || price === undefined) {
        return res.status(400).json({ error: 'Please provide name, stock, and price' });
      }
      
      // Check if item already exists
      const existingItem = await db.collection('inventory').findOne({ name });
      if (existingItem) {
        return res.status(400).json({ error: 'Item already exists in inventory' });
      }
      
      // Insert new item
      const result = await db.collection('inventory').insertOne({
        name,
        stock: parseInt(stock),
        price: parseFloat(price)
      });
      
      console.log(`Added new item to inventory: ${name}`);
      res.status(201).json({ message: 'Item added to inventory', item: { name, stock, price } });
    } catch (error) {
      console.error('Error adding item to inventory:', error);
      res.status(500).json({ error: 'Failed to add item to inventory' });
    }
  });

  // Restock item in inventory
  app.post('/api/inventory/restock', async (req, res) => {
    try {
      const { name, quantity } = req.body;
      
      // Validate request
      if (!name || !quantity || parseInt(quantity) < 1) {
        return res.status(400).json({ error: 'Please provide a valid item name and quantity' });
      }
      
      // Find and update the item
      const item = await db.collection('inventory').findOne({ name });
      if (!item) {
        return res.status(404).json({ error: 'Item not found in inventory' });
      }
      
      const result = await db.collection('inventory').updateOne(
        { name },
        { $inc: { stock: parseInt(quantity) } }
      );
      
      if (result.modifiedCount === 0) {
        return res.status(400).json({ error: 'Failed to update inventory' });
      }
      
      const updatedItem = await db.collection('inventory').findOne({ name });
      console.log(`Restocked ${name} with ${quantity} units. New stock: ${updatedItem.stock}`);
      
      res.json({ 
        message: 'Item restocked successfully', 
        item: updatedItem
      });
    } catch (error) {
      console.error('Error restocking inventory:', error);
      res.status(500).json({ error: 'Failed to restock inventory' });
    }
  });

  // Process sale
  app.post('/api/sales', async (req, res) => {
    try {
      const { productName, quantity } = req.body;
      
      // Validate request
      if (!productName || !quantity || quantity < 1) {
        return res.status(400).json({ error: 'Please provide a valid product name and quantity' });
      }
      
      // Find the product in inventory
      let product;
      
      if (useInMemoryMode) {
        product = inMemoryInventory.find(item => item.name === productName);
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        if (product.stock < quantity) {
          return res.status(400).json({ error: 'Insufficient stock' });
        }
        
        // Update inventory
        product.stock -= quantity;
        
        // Record sale
        const sale = {
          product: productName,
          quantity: quantity,
          price: product.price,
          total: product.price * quantity,
          date: new Date()
        };
        
        inMemorySales.push(sale);
        
        console.log(`Processed sale: ${quantity} ${productName} for $${sale.total}`);
        
        return res.json({
          message: 'Sale processed successfully',
          inventory: inMemoryInventory,
          sale: sale
        });
      } else {
        // MongoDB mode
        product = await db.collection('inventory').findOne({ name: productName });
        
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        if (product.stock < quantity) {
          return res.status(400).json({ error: 'Insufficient stock' });
        }
        
        // Update inventory
        const updateResult = await db.collection('inventory').updateOne(
          { name: productName },
          { $inc: { stock: -quantity } }
        );
        
        if (updateResult.modifiedCount === 0) {
          return res.status(500).json({ error: 'Failed to update inventory' });
        }
        
        // Record sale
        const sale = {
          product: productName,
          quantity: quantity,
          price: product.price,
          total: product.price * quantity,
          date: new Date()
        };
        
        await db.collection('billing').insertOne(sale);
        
        // Get updated inventory
        const updatedInventory = await db.collection('inventory').find({}).toArray();
        
        console.log(`Processed sale: ${quantity} ${productName} for $${sale.total}`);
        
        return res.json({
          message: 'Sale processed successfully',
          inventory: updatedInventory,
          sale: sale
        });
      }
    } catch (error) {
      console.error('Error processing sale:', error);
      res.status(500).json({ error: 'Failed to process sale' });
    }
  });

  // Try different ports if the default one is busy
  const possiblePorts = [5000];  // Restrict to just port 5000 for now
  let currentPort = 0;

  function startListening() {
    const port = possiblePorts[currentPort];
    console.log(`Starting server on port ${port}...`);
    
    // Important: Listen on '0.0.0.0' instead of localhost to accept connections from all interfaces
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${port} (${useInMemoryMode ? 'In-Memory Mode' : 'MongoDB Mode'})`);
    }).on('error', (err) => {
      console.error('Server error:', err);
    });
  }

  startListening();
}

startServer();