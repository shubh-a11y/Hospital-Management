import React, { useState, useEffect } from 'react';
import '../App.css';
import config from '../config';

function Reports() {
  const [inventory, setInventory] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [currentPort, setCurrentPort] = useState(null);

  const fetchInventory = async (customEndpoints = null) => {
    try {
      const endpoints = customEndpoints || config.API_ENDPOINTS;
      const response = await fetch(endpoints.INVENTORY);
      if (!response.ok) {
        throw new Error(`Failed to fetch inventory (${response.status})`);
      }
      const data = await response.json();
      setInventory(data);
      return true;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Failed to load inventory data: ' + error.message);
      return false;
    }
  };

  const fetchSalesData = async (customEndpoints = null) => {
    try {
      const endpoints = customEndpoints || config.API_ENDPOINTS;
      const response = await fetch(endpoints.REPORTS);
      if (!response.ok) {
        throw new Error(`Failed to fetch sales data (${response.status})`);
      }
      const data = await response.json();
      setSalesData(data.salesData || []);
      setTotalRevenue(data.totalRevenue || 0);
      return true;
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setError('Failed to load sales data: ' + error.message);
      return false;
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to find a working backend port
      let workingPort = null;
      let workingEndpoints = null;
      
      // Try all possible ports until one works
      for (let i = 0; i < config.API_PORTS.length; i++) {
        const port = config.API_PORTS[i];
        const endpoints = config.createEndpoints(port);
        
        try {
          console.log(`Reports: Trying port ${port}...`);
          const healthCheck = await fetch(endpoints.HEALTH);
          if (healthCheck.ok) {
            console.log(`Reports: Server found on port ${port}`);
            workingPort = port;
            workingEndpoints = endpoints;
            break; // Found a working port, exit loop
          }
        } catch (err) {
          console.log(`Reports: Port ${port} not responding:`, err.message);
        }
      }
      
      // If no working port was found
      if (!workingPort) {
        throw new Error(`Server is not responding. Please ensure the backend server is running.`);
      }
      
      // Store the working port for future use
      setCurrentPort(workingPort);
      
      // Fetch both inventory and sales data using the working endpoints
      const inventorySuccess = await fetchInventory(workingEndpoints);
      const salesSuccess = await fetchSalesData(workingEndpoints);
      
      if (!inventorySuccess && !salesSuccess) {
        throw new Error('Failed to load report data');
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Failed to load report data. ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    
    // Refresh data every minute
    const intervalId = setInterval(fetchAllData, 60000);
    
    // Clean up on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = () => {
    fetchAllData();
  };

  // Safe formatter to avoid toFixed errors
  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00';
    }
    return Number(value).toFixed(decimals);
  };

  const calculateItemValue = (item) => {
    if (!item || item.price === undefined || item.stock === undefined) return 0;
    return item.price * item.stock;
  };

  const getTotalInventoryValue = () => {
    return inventory.reduce((total, item) => total + calculateItemValue(item), 0);
  };

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(config.API_ENDPOINTS.REPORTS);
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }
      const data = await response.json();
      setReportData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to load report data. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="reports-container loading">Loading report data...</div>;
  }

  if (error) {
    return (
      <div className="reports-container error">
        <p>{error}</p>
        <button className="refresh-button" onClick={handleRefresh}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <h2>Inventory & Sales Reports</h2>
      
      <button className="refresh-button" onClick={handleRefresh}>
        Refresh Data
      </button>
      
      <div className="report-summary">
        <div className="summary-card">
          <h3>Inventory Summary</h3>
          <p>Total Items: <strong>{inventory.length}</strong></p>
          <p>Total Stock: <strong>{inventory.reduce((sum, item) => sum + (item.stock || 0), 0)}</strong></p>
          <p>Inventory Value: <strong>${formatNumber(getTotalInventoryValue())}</strong></p>
        </div>
        
        <div className="summary-card">
          <h3>Sales Summary</h3>
          <p>Total Revenue</p>
          <div className="total-revenue">${formatNumber(totalRevenue)}</div>
          <p>Items Sold: <strong>{salesData.reduce((sum, item) => sum + (item.quantity || 0), 0)}</strong></p>
        </div>
      </div>
      
      <div className="reports-section">
        <h3>Inventory Report</h3>
        {inventory.length > 0 ? (
          <table className="reports-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, index) => (
                <tr key={index} className={item.stock < 5 ? 'low-stock-row' : ''}>
                  <td>{item.name}</td>
                  <td>{item.stock || 0}</td>
                  <td>${formatNumber(item.price)}</td>
                  <td>${formatNumber(calculateItemValue(item))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No inventory data available</p>
        )}
      </div>
      
      <div className="reports-section">
        <h3>Sales Report</h3>
        {salesData.length > 0 ? (
          <table className="reports-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((item, index) => (
                <tr key={index}>
                  <td>{item.product}</td>
                  <td>{item.quantity || 0}</td>
                  <td>${formatNumber(item.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No sales data available</p>
        )}
      </div>
    </div>
  );
}

export default Reports;