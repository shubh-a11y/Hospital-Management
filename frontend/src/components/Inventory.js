import React, { useState, useEffect } from 'react';
import '../App.css';
import config from '../config';

/**
 * DETAILED OOP PRINCIPLES IMPLEMENTATION
 * 
 * This component demonstrates multiple Object-Oriented Programming concepts:
 * 
 * 1. CLASS & OBJECT CREATION:
 *    - The InventorySystem class represents a blueprint for creating inventory management objects
 *    - Objects of this class are instantiated in the Inventory component
 * 
 * 2. ENCAPSULATION:
 *    - Data (categories, inventory items) and methods (formatNumber, processInventory) are bundled together
 *    - The class manages its own internal state and provides controlled access through methods
 *    - Implementation details are hidden from the outside, exposing only necessary interfaces
 * 
 * 3. ABSTRACTION:
 *    - Complex operations like inventory filtering, sorting, and stock management are abstracted
 *    - Users of the class don't need to know how these operations work internally
 *    - The class presents a simplified interface for inventory operations (e.g., restockItem, consumeItem)
 * 
 * 4. POLYMORPHISM:
 *    - The processInventory method handles different data types and sorting criteria
 *    - Same method works differently based on the sort field type (numeric vs. alphabetic sorting)
 *    - This demonstrates method polymorphism - same interface, different behavior
 * 
 * 5. MODULARITY:
 *    - The design separates inventory logic from UI rendering
 *    - This allows for better code organization and easier maintenance
 *    - The InventorySystem class can be reused in other components if needed
 */
class InventorySystem {
  constructor() {
    this.categories = [
      'all',
      'medication',
      'equipment',
      'disposable',
      'emergency',
      'surgical'
    ];
  }
  
  // Format number with proper decimal places
  formatNumber(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00';
    }
    return Number(value).toFixed(decimals);
  }
  
  // Get summary statistics from inventory
  getInventoryStats(inventory) {
    return {
      totalItems: inventory.reduce((sum, item) => sum + (item.stock || 0), 0),
      totalValue: inventory.reduce((sum, item) => sum + ((item.price || 0) * (item.stock || 0)), 0),
      lowStockCount: inventory.filter(item => item.stock > 0 && item.stock < 10).length,
      outOfStockCount: inventory.filter(item => item.stock <= 0).length
    };
  }
  
  // Filter and sort inventory based on provided criteria
  processInventory(inventory, filter, categoryFilter, sortField, sortDirection) {
    return inventory
      .filter(item => 
        (categoryFilter === 'all' || item.category === categoryFilter) &&
        item.name.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) => {
        if (sortField === 'price' || sortField === 'stock') {
          // Sort numerically
          return sortDirection === 'asc' 
            ? a[sortField] - b[sortField]
            : b[sortField] - a[sortField];
        } else {
          // Sort alphabetically
          return sortDirection === 'asc'
            ? a[sortField].localeCompare(b[sortField])
            : b[sortField].localeCompare(a[sortField]);
        }
      });
  }
  
  // Restock an item by increasing its quantity
  restockItem(item, quantity) {
    return {
      ...item,
      stock: (item.stock || 0) + quantity
    };
  }
  
  // Remove stock from inventory (for sales or usage)
  consumeItem(item, quantity) {
    const newStock = Math.max(0, (item.stock || 0) - quantity);
    return {
      ...item,
      stock: newStock
    };
  }
}

function Inventory() {
  // Create an instance of our InventorySystem class
  const inventorySystem = new InventorySystem();
  
  // State variables
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Inventory management state
  const [activeTab, setActiveTab] = useState('view');
  const [selectedItem, setSelectedItem] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchInventory();
    // Set up polling to keep data fresh
    const intervalId = setInterval(fetchInventory, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      // Try to find a working backend port
      let workingPort = null;
      
      // Try all possible ports until one works
      for (let i = 0; i < config.API_PORTS.length; i++) {
        const port = config.API_PORTS[i];
        const endpoints = config.createEndpoints(port);
        
        try {
          console.log(`Inventory: Trying port ${port}...`);
          const healthCheck = await fetch(endpoints.HEALTH);
          if (healthCheck.ok) {
            console.log(`Inventory: Server found on port ${port}`);
            
            // Now try to fetch inventory with this port
            const response = await fetch(endpoints.INVENTORY);
            if (response.ok) {
              const data = await response.json();
              
              // Transform the inventory data into medical supplies
              const medicalSupplies = data.map((item, itemIndex) => {
                // Map existing items to medical categories
                let category = 'disposable';
                let name = item.name;
                
                if (name.includes('Shirt')) {
                  name = 'Surgical Bandages';
                  category = 'surgical';
                } else if (name.includes('Bastar')) {
                  name = 'Syringes (10ml)';
                  category = 'disposable';
                } else if (name.includes('Bottle')) {
                  name = 'IV Fluids (1L)';
                  category = 'medication';
                } else if (name.includes('Keyring')) {
                  name = 'Medical Gloves';
                  category = 'disposable';
                } else if (name.includes('Canvas')) {
                  name = 'Surgical Masks';
                  category = 'surgical';
                } else if (name.includes('Stationery')) {
                  name = 'Sterile Gauze';
                  category = 'surgical';
                } else {
                  // Add some additional medical items
                  const extras = [
                    { name: 'Defibrillator', category: 'emergency', stock: 3, price: 2500 },
                    { name: 'Patient Monitors', category: 'equipment', stock: 8, price: 1200 },
                    { name: 'Ventilators', category: 'emergency', stock: 5, price: 5000 },
                    { name: 'Wheelchairs', category: 'equipment', stock: 12, price: 350 },
                    { name: 'Ibuprofen (200mg)', category: 'medication', stock: 120, price: 15 },
                    { name: 'Antibiotics', category: 'medication', stock: 85, price: 45 },
                    { name: 'Blood Pressure Cuffs', category: 'equipment', stock: 25, price: 70 }
                  ];
                  
                  if (itemIndex < extras.length) {
                    return extras[itemIndex];
                  }
                }
                
                return {
                  ...item,
                  name,
                  category,
                  expiryDate: new Date(Date.now() + Math.random() * 10000000000).toLocaleDateString()
                };
              });
              
              // Get existing inventory data from localStorage
              const savedInventory = JSON.parse(localStorage.getItem('medicalInventory')) || [];
              
              // If we have saved inventory, use it instead
              const finalInventory = savedInventory.length > 0 ? savedInventory : medicalSupplies;
              
              setInventory(finalInventory);
              // Save to localStorage
              localStorage.setItem('medicalInventory', JSON.stringify(finalInventory));
              
              setError(null);
              setLoading(false);
              return; // Exit on success
            }
          }
        } catch (err) {
          console.log(`Inventory: Port ${port} not responding:`, err.message);
        }
      }
      
      // If we get here, no server responded successfully
      throw new Error(`Server is not responding. Please ensure the backend server is running.`);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory. Please try again later.');
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // If already sorting by this field, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If sorting by a new field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter change handler
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Category filter change handler
  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };
  
  // Restock an item
  const handleRestock = (e) => {
    e.preventDefault();
    
    if (!selectedItem) {
      setError('Please select an item to restock');
      return;
    }
    
    if (restockQuantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }
    
    // Find the selected item in inventory
    const itemIndex = inventory.findIndex(item => item.name === selectedItem);
    
    if (itemIndex === -1) {
      setError('Selected item not found in inventory');
      return;
    }
    
    // Create updated inventory
    const updatedInventory = [...inventory];
    updatedInventory[itemIndex] = inventorySystem.restockItem(
      updatedInventory[itemIndex], 
      parseInt(restockQuantity)
    );
    
    // Update state and localStorage
    setInventory(updatedInventory);
    localStorage.setItem('medicalInventory', JSON.stringify(updatedInventory));
    
    // Show success message
    setSuccessMessage(`Successfully restocked ${restockQuantity} units of ${selectedItem}`);
    
    // Clear form
    setSelectedItem(null);
    setRestockQuantity(1);
    
    // Clear message after a delay
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  // Handle consumption of inventory items (for usage tracking)
  const handleConsume = (e) => {
    e.preventDefault();
    
    if (!selectedItem) {
      setError('Please select an item to consume');
      return;
    }
    
    if (restockQuantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }
    
    // Find the selected item in inventory
    const itemIndex = inventory.findIndex(item => item.name === selectedItem);
    
    if (itemIndex === -1) {
      setError('Selected item not found in inventory');
      return;
    }
    
    // Check if we have enough stock
    if (inventory[itemIndex].stock < restockQuantity) {
      setError(`Not enough stock available. Current stock: ${inventory[itemIndex].stock}`);
      return;
    }
    
    // Create updated inventory
    const updatedInventory = [...inventory];
    updatedInventory[itemIndex] = inventorySystem.consumeItem(
      updatedInventory[itemIndex], 
      parseInt(restockQuantity)
    );
    
    // Update state and localStorage
    setInventory(updatedInventory);
    localStorage.setItem('medicalInventory', JSON.stringify(updatedInventory));
    
    // Show success message
    setSuccessMessage(`Successfully consumed ${restockQuantity} units of ${selectedItem}`);
    
    // Clear form
    setSelectedItem(null);
    setRestockQuantity(1);
    
    // Clear message after a delay
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Sort and filter inventory using the InventorySystem class
  const displayInventory = inventorySystem.processInventory(
    inventory, 
    filter, 
    categoryFilter, 
    sortField, 
    sortDirection
  );
  
  // Get inventory statistics using the InventorySystem class
  const stats = inventorySystem.getInventoryStats(displayInventory);

  if (loading && inventory.length === 0) {
    return <div className="loading-container">Loading medical supplies inventory...</div>;
  }

  if (error && inventory.length === 0) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchInventory}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="inventory-container">
      <h1>Medical Supplies Inventory</h1>
      
      <div className="inventory-summary-cards">
        <div className="stat-card">
          <h3>Total Items</h3>
          <div className="card-value">{stats.totalItems}</div>
          <p className="card-subtitle">Items in stock</p>
        </div>
        
        <div className="stat-card">
          <h3>Inventory Value</h3>
          <div className="card-value">${inventorySystem.formatNumber(stats.totalValue)}</div>
          <p className="card-subtitle">Total value</p>
        </div>
        
        <div className="stat-card">
          <h3>Low Stock Items</h3>
          <div className="card-value">{stats.lowStockCount}</div>
          <p className="card-subtitle">Need restocking</p>
        </div>
        
        <div className="stat-card">
          <h3>Out of Stock</h3>
          <div className="card-value">{stats.outOfStockCount}</div>
          <p className="card-subtitle">Unavailable items</p>
        </div>
      </div>
      
      <div className="inventory-tabs">
        <button 
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          View Inventory
        </button>
        <button 
          className={`tab-button ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage Inventory
        </button>
      </div>
      
      {activeTab === 'view' && (
        <>
          <div className="inventory-controls">
            <button className="large-button refresh-button" onClick={fetchInventory}>
        Refresh Inventory
      </button>
            
            <div className="filter-controls">
              <input 
                type="text" 
                placeholder="Search supplies..." 
                value={filter}
                onChange={handleFilterChange}
                className="large-input inventory-filter"
              />
              
              <select 
                value={categoryFilter}
                onChange={handleCategoryChange}
                className="large-select category-filter"
              >
                {inventorySystem.categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
      
      {inventory.length > 0 ? (
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                    <th onClick={() => handleSort('name')}>
                      Supply Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('category')}>
                      Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('stock')}>
                      Current Stock {sortField === 'stock' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('price')}>
                      Unit Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                <th>Value</th>
                    <th>Expiry Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayInventory.map((item, index) => (
                <tr 
                  key={index}
                  className={
                    item.stock <= 0 ? 'out-of-stock-row' : 
                        item.stock < 10 ? 'low-stock-row' : ''
                  }
                >
                  <td>{item.name}</td>
                      <td>{item.category}</td>
                  <td>{item.stock || 0}</td>
                      <td>${inventorySystem.formatNumber(item.price)}</td>
                      <td>${inventorySystem.formatNumber((item.price || 0) * (item.stock || 0))}</td>
                      <td>{item.expiryDate || 'N/A'}</td>
                  <td>
                    {item.stock <= 0 ? (
                      <span className="stock-badge out-of-stock">Out of Stock</span>
                        ) : item.stock < 10 ? (
                      <span className="stock-badge low-stock">Low Stock</span>
                    ) : (
                      <span className="stock-badge in-stock">In Stock</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
            <p className="no-data">No medical supplies found</p>
          )}
        </>
      )}
      
      {activeTab === 'manage' && (
        <div className="inventory-management-section">
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          
          <div className="management-forms">
            <div className="management-form">
              <h3>Restock Inventory</h3>
              <form onSubmit={handleRestock}>
                <div className="form-group">
                  <label>Select Item:</label>
                  <select 
                    value={selectedItem || ''} 
                    onChange={(e) => setSelectedItem(e.target.value)}
                    className="large-select"
                  >
                    <option value="">-- Select an item --</option>
                    {inventory.map((item, index) => (
                      <option key={index} value={item.name}>
                        {item.name} (Current Stock: {item.stock})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Quantity to Add:</label>
                  <input 
                    type="number" 
                    min="1"
                    value={restockQuantity}
                    onChange={(e) => setRestockQuantity(e.target.value)}
                    className="large-input"
                  />
                </div>
                
                <button type="submit" className="large-button management-button">
                  Restock Item
                </button>
              </form>
            </div>
            
            <div className="management-form">
              <h3>Record Usage/Consumption</h3>
              <form onSubmit={handleConsume}>
                <div className="form-group">
                  <label>Select Item:</label>
                  <select 
                    value={selectedItem || ''} 
                    onChange={(e) => setSelectedItem(e.target.value)}
                    className="large-select"
                  >
                    <option value="">-- Select an item --</option>
                    {inventory.filter(item => item.stock > 0).map((item, index) => (
                      <option key={index} value={item.name}>
                        {item.name} (Available: {item.stock})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Quantity to Use:</label>
                  <input 
                    type="number" 
                    min="1"
                    value={restockQuantity}
                    onChange={(e) => setRestockQuantity(e.target.value)}
                    className="large-input"
                  />
                </div>
                
                <button type="submit" className="large-button management-button">
                  Record Usage
                </button>
              </form>
            </div>
          </div>
          
          <div className="low-stock-alerts">
            <h3>Items Needing Restocking</h3>
            
            {displayInventory.filter(item => item.stock < 10).length > 0 ? (
              <ul className="alerts-list">
                {displayInventory
                  .filter(item => item.stock < 10)
                  .map((item, index) => (
                    <li key={index} className={item.stock === 0 ? 'alert-critical' : 'alert-warning'}>
                      <span className="alert-name">{item.name}</span>
                      <span className="alert-details">
                        Current Stock: <strong>{item.stock}</strong>
                        {item.stock === 0 ? ' (OUT OF STOCK)' : ' (LOW STOCK)'}
                      </span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="no-alerts">No low stock items to display</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;