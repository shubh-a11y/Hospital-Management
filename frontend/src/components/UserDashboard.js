import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import config from '../config';
import AuthContext from '../AuthContext';

function UserDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);

  // Format number safely with fallback
  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00';
    }
    return Number(value).toFixed(decimals);
  };

  useEffect(() => {
    fetchDashboardData();
    // Set up interval to refresh data periodically
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try to find a working backend port
      let workingPort = null;
      
      // Try all possible ports until one works
      for (let i = 0; i < config.API_PORTS.length; i++) {
        const port = config.API_PORTS[i];
        const endpoints = config.createEndpoints(port);
        
        try {
          console.log(`UserDashboard: Trying port ${port}...`);
          const healthCheck = await fetch(endpoints.HEALTH);
          if (healthCheck.ok) {
            console.log(`UserDashboard: Server found on port ${port}`);
            workingPort = port;
            break; // Found a working port, exit loop
          }
        } catch (err) {
          console.log(`UserDashboard: Port ${port} not responding:`, err.message);
        }
      }
      
      // If no working port was found
      if (!workingPort) {
        throw new Error(`Server is not responding. Please ensure the backend server is running.`);
      }
      
      // Use the working port for dashboard data
      const endpoints = workingPort === config.API_PORTS[0] 
        ? config.API_ENDPOINTS 
        : config.createEndpoints(workingPort);
      
      // Then fetch user dashboard data
      const response = await fetch(endpoints.USER_DASHBOARD);
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data (${response.status})`);
      }
      
      const data = await response.json();
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Server responded: ' + error.message);
      setLoading(false);
    }
  };

  // Function to handle refresh button
  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="dashboard-container loading">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container error">
        <p>{error}</p>
        <button className="refresh-button" onClick={handleRefresh}>
          Try Again
        </button>
      </div>
    );
  }

  // Safety check for dashboardData
  if (!dashboardData) {
    return (
      <div className="dashboard-container error">
        <p>No dashboard data available</p>
        <button className="refresh-button" onClick={handleRefresh}>
          Try Again
        </button>
      </div>
    );
  }

  // Ensure all required properties exist with defaults
  const bestSeller = dashboardData.bestSeller || { name: 'No data', quantity: 0 };
  const ourPreference = dashboardData.ourPreference || { name: 'No data', price: 0 };
  const recentlyAdded = dashboardData.recentlyAdded || null;
  const lowStockItems = dashboardData.lowStockItems || [];

  return (
    <div className="dashboard-container">
      <h1>Welcome to Your Dashboard, {currentUser?.username || 'User'}</h1>
      <p className="welcome-message">
        You have logged in {currentUser?.loginCount || 0} time{currentUser?.loginCount !== 1 ? 's' : ''}.
        {currentUser?.lastLogin && ` Last login: ${new Date(currentUser.lastLogin).toLocaleString()}`}
      </p>
      
      <button className="refresh-button" onClick={handleRefresh}>
        Refresh Data
      </button>
      
      <div className="dashboard-content">
        <div className="stats-container">
          <div className="stat-card">
            <h2>Best Selling Product</h2>
            <div className="card-value">{bestSeller.name}</div>
            <div className="card-subtitle">
              {bestSeller.quantity > 0 
                ? `Sold ${bestSeller.quantity} units` 
                : 'No sales data yet'}
            </div>
          </div>
          
          <div className="stat-card">
            <h2>Our Recommendation</h2>
            <div className="card-value">{ourPreference.name}</div>
            <div className="card-subtitle">
              Price: ${formatNumber(ourPreference.price)}
            </div>
          </div>
        </div>
        
        <div className="dashboard-sections">
          <div className="dashboard-section">
            <h3>Recently Added</h3>
            {recentlyAdded ? (
              <div className="item-details">
                <h4>{recentlyAdded.name}</h4>
                <p>Price: ${formatNumber(recentlyAdded.price)}</p>
                <p>Stock: {recentlyAdded.stock} units</p>
              </div>
            ) : (
              <p>No recent items</p>
            )}
          </div>
          
          <div className="dashboard-section">
            <h3>Limited Stock Items</h3>
            <div className="low-stock-list">
              {lowStockItems.length > 0 ? (
                <ul>
                  {lowStockItems.map((item, index) => (
                    <li key={index}>
                      {item.name} - Only {item.stock} left!
                    </li>
                  ))}
                </ul>
              ) : (
                <p>All items are well-stocked</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard; 