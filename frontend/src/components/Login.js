import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import config from '../config';
import AuthContext from '../AuthContext';

function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Inventory management states (only for admin)
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', stock: '', price: '' });
  const [restockItem, setRestockItem] = useState({ name: '', quantity: '' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState(1);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log(`Attempting to login with username: ${username}`);
      
      // Try to find a working backend port
      let healthData = null;
      let workingPort = null;
      
      // First try the default port
      try {
        const healthCheck = await fetch(config.API_ENDPOINTS.HEALTH);
        if (healthCheck.ok) {
          healthData = await healthCheck.json();
          console.log('Server health check successful on default port:', healthData);
          workingPort = config.API_PORTS[0]; // Default port works
        }
      } catch (err) {
        console.log('Default port not working, will try alternatives');
      }
      
      // If default port didn't work, try all other ports
      if (!workingPort) {
        for (let i = 1; i < config.API_PORTS.length; i++) {
          const port = config.API_PORTS[i];
          const endpoints = config.createEndpoints(port);
          
          try {
            console.log(`Trying port ${port}...`);
            const healthCheck = await fetch(endpoints.HEALTH);
            if (healthCheck.ok) {
              healthData = await healthCheck.json();
              console.log(`Server found on port ${port}:`, healthData);
              workingPort = port;
              break; // Found a working port, exit loop
            }
          } catch (err) {
            console.log(`Port ${port} not responding:`, err.message);
          }
        }
      }
      
      // If no working port was found
      if (!workingPort) {
        throw new Error(`Server is not responding. Please ensure the backend server is running on one of these ports: ${config.API_PORTS.join(', ')}`);
      }
      
      // Use the working port for login
      const endpoints = workingPort === config.API_PORTS[0] 
        ? config.API_ENDPOINTS 
        : config.createEndpoints(workingPort);
      
      console.log('Using login endpoint:', endpoints.LOGIN);
      
      // Now attempt login with working port
      const response = await fetch(endpoints.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      console.log('Login response status:', response.status);
      
      // Parse the JSON response
      const data = await response.json();
      console.log('Login response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || `Login failed with status ${response.status}`);
      }
      
      // Check if login was successful based on the success flag
      if (data.success) {
        // Store user data in context
        console.log('Login successful, user data:', data.user);
        login(data.user);
        setError('');
        
        // Navigate to appropriate dashboard based on role
        if (data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
        
        // If admin, also fetch inventory data
        if (data.user.role === 'admin') {
          fetchInventory(endpoints);
        }
      } else {
        // If success is false but we didn't get caught by the !response.ok check
        setError(data.error || 'Login failed. Please check credentials and try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Error connecting to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchInventory = async (endpoints = config.API_ENDPOINTS) => {
    try {
      const response = await fetch(endpoints.INVENTORY);
      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }
      const data = await response.json();
      setInventory(data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  };

  // Rest of the code for admin functionality remains unchanged
  const handleAddItem = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    
    // Basic validation
    if (!newItem.name || !newItem.stock || !newItem.price) {
      setError('All fields are required');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(config.API_ENDPOINTS.ADD_ITEM, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newItem.name,
          stock: parseInt(newItem.stock),
          price: parseFloat(newItem.price)
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add item');
      }
      
      const data = await response.json();
      setSuccessMessage(data.message || 'Item added successfully');
      setNewItem({ name: '', stock: '', price: '' });
      fetchInventory();
    } catch (err) {
      console.error('Error adding item:', err);
      setError(err.message || 'Error adding item. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRestock = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    
    // Basic validation
    if (!selectedItem || !restockQuantity || restockQuantity <= 0) {
      setError('Please select an item and enter a valid quantity');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(config.API_ENDPOINTS.RESTOCK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: selectedItem,
          quantity: parseInt(restockQuantity)
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to restock item');
      }
      
      const data = await response.json();
      setSuccessMessage(data.message || 'Item restocked successfully');
      setSelectedItem(null);
      setRestockQuantity(1);
      fetchInventory();
    } catch (err) {
      console.error('Error restocking item:', err);
      setError(err.message || 'Error restocking item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format number safely with fallback
  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00';
    }
    return Number(value).toFixed(decimals);
  };

  return (
    <div className="login hospital-login">
      <h2>Welcome to MedCare Hospital</h2>
      
      {activeTab !== 'login' && (
        <div className="management-nav">
          <button 
            className={activeTab === 'login' ? 'active' : ''} 
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button 
            className={activeTab === 'add' ? 'active' : ''} 
            onClick={() => setActiveTab('add')}
          >
            Add New Item
          </button>
          <button 
            className={activeTab === 'restock' ? 'active' : ''} 
            onClick={() => setActiveTab('restock')}
          >
            Restock Items
          </button>
          <button 
            className={activeTab === 'view' ? 'active' : ''} 
            onClick={() => setActiveTab('view')}
          >
            View Inventory
          </button>
        </div>
      )}
      
      <div className="management-content">
        {activeTab === 'login' && (
          <div className="login-form">
            <form onSubmit={handleLogin}>
              <div>
                <label htmlFor="username">Username</label>
                <input 
                  type="text" 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
              
              {error && <div className="message error">{error}</div>}
            </form>
            <div className="login-info">
              <h3>Available Accounts:</h3>
              <p>Admin: username - admin, password - admin123</p>
              <p>Doctor: username - doctor, password - doctor123</p>
              <p>Nurse: username - nurse, password - nurse123</p>
              <p>Receptionist: username - receptionist, password - reception123</p>
            </div>
          </div>
        )}
        
        {activeTab === 'add' && (
          <div className="management-form">
            <h3>Add New Item</h3>
            <form onSubmit={handleAddItem}>
              <div>
                <label htmlFor="name">Product Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={newItem.name} 
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label htmlFor="stock">Initial Stock</label>
                <input 
                  type="number" 
                  id="stock" 
                  min="0" 
                  value={newItem.stock} 
                  onChange={(e) => setNewItem({...newItem, stock: e.target.value})}
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label htmlFor="price">Price ($)</label>
                <input 
                  type="number" 
                  id="price" 
                  min="0.01" 
                  step="0.01" 
                  value={newItem.price} 
                  onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  disabled={loading}
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Item'}
              </button>
              
              {error && <div className="message error">{error}</div>}
              {successMessage && (
                <div className="message success">{successMessage}</div>
              )}
            </form>
          </div>
        )}
        
        {activeTab === 'restock' && (
          <div className="management-form">
            <h3>Restock Inventory</h3>
            <form onSubmit={handleRestock}>
              <div>
                <label htmlFor="item">Select Item</label>
                <select 
                  id="item" 
                  value={selectedItem || ''} 
                  onChange={(e) => setSelectedItem(e.target.value)}
                  disabled={loading}
                  required
                >
                  <option value="">-- Select an item --</option>
                  {inventory.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name} (Current stock: {item.stock})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="quantity">Quantity to Add</label>
                <input 
                  type="number" 
                  id="quantity" 
                  min="1" 
                  value={restockQuantity} 
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <button type="submit" disabled={loading || !selectedItem}>
                {loading ? 'Processing...' : 'Restock Item'}
              </button>
              
              {error && <div className="message error">{error}</div>}
              {successMessage && (
                <div className="message success">{successMessage}</div>
              )}
            </form>
          </div>
        )}
        
        {activeTab === 'view' && (
          <div className="inventory-view">
            <h3>Current Inventory</h3>
            
            {inventory.length === 0 ? (
              <p>No items in inventory</p>
            ) : (
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Current Stock</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item, index) => (
                    <tr key={index} className={item.stock < 5 ? 'low-stock' : ''}>
                      <td>{item.name}</td>
                      <td>${formatNumber(item.price)}</td>
                      <td>
                        {item.stock}{' '}
                        {item.stock < 5 && (
                          <span className="stock-warning">Low Stock!</span>
                        )}
                      </td>
                      <td>${formatNumber(item.price * item.stock)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login; 