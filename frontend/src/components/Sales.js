import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import config from '../config';
import AuthContext from '../AuthContext';

function Sales() {
  const [inventory, setInventory] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { currentUser, isAdmin } = useContext(AuthContext);
  const [currentPort, setCurrentPort] = useState(null);
  const [activeTab, setActiveTab] = useState('billing');
  const [billingHistory, setBillingHistory] = useState([]);
  
  // For Add New Patient functionality
  const [newPatient, setNewPatient] = useState({ 
    name: '', 
    age: '', 
    gender: 'male', 
    contact: '',
    address: '',
    diagnosis: ''
  });
  
  // For medical services
  const medicalServices = [
    { name: "Consultation", price: 50, category: "General" },
    { name: "Blood Test", price: 75, category: "Laboratory" },
    { name: "X-Ray Scan", price: 120, category: "Radiology" },
    { name: "MRI Scan", price: 450, category: "Radiology" },
    { name: "ECG", price: 90, category: "Cardiology" },
    { name: "Surgery - Minor", price: 1200, category: "Surgical" },
    { name: "Surgery - Major", price: 5000, category: "Surgical" },
    { name: "Room Charges - General (per day)", price: 200, category: "Accommodation" },
    { name: "Room Charges - Private (per day)", price: 500, category: "Accommodation" },
    { name: "Room Charges - ICU (per day)", price: 1000, category: "Accommodation" },
    { name: "Medication", price: 45, category: "Pharmacy" }
  ];
  
  // For bill items
  const [billItems, setBillItems] = useState([]);
  
  // For bill history filtering
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [historyDateFilter, setHistoryDateFilter] = useState('all');

  // Format number safely with fallback
  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00';
    }
    return Number(value).toFixed(decimals);
  };

  useEffect(() => {
    fetchInventory();
    loadPatients();
    loadBillingHistory();
    // Set up polling to keep data fresh
    const intervalId = setInterval(() => {
      fetchInventory();
      loadPatients();
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);
  
  // Load patients combining mock and registered patients
  const loadPatients = () => {
    // Generate mock patients data
    const mockPatients = [
      { id: 'P1001', name: 'John Smith', age: 45, gender: 'male', diagnosis: 'Hypertension' },
      { id: 'P1002', name: 'Emma Johnson', age: 35, gender: 'female', diagnosis: 'Diabetes Type 2' },
      { id: 'P1003', name: 'Robert Davis', age: 60, gender: 'male', diagnosis: 'Arthritis' },
      { id: 'P1004', name: 'Sarah Wilson', age: 28, gender: 'female', diagnosis: 'Bronchitis' },
      { id: 'P1005', name: 'Michael Brown', age: 52, gender: 'male', diagnosis: 'Heart Disease' },
      { id: 'P1006', name: 'Jennifer Taylor', age: 32, gender: 'female', diagnosis: 'Migraine' },
      { id: 'P1007', name: 'William Thomas', age: 71, gender: 'male', diagnosis: 'Parkinson\'s Disease' },
      { id: 'P1008', name: 'Lisa Anderson', age: 40, gender: 'female', diagnosis: 'Asthma' }
    ];
    
    // Get registered patients from localStorage
    const registeredPatients = JSON.parse(localStorage.getItem('registeredPatients')) || [];
    
    // Combine mock and registered patients, removing duplicates by ID
    const allPatientsMap = new Map();
    [...mockPatients, ...registeredPatients].forEach(patient => {
      allPatientsMap.set(patient.id, patient);
    });
    
    const allPatients = Array.from(allPatientsMap.values());
    setPatients(allPatients);
  };
  
  // Check if user is admin, and set default tab accordingly
  useEffect(() => {
    if (isAdmin && isAdmin()) {
      setActiveTab('register');
    } else {
      setActiveTab('billing');
    }
  }, [isAdmin]);

  const fetchInventory = async () => {
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
          console.log(`Billing: Trying port ${port}...`);
          const healthCheck = await fetch(endpoints.HEALTH);
          if (healthCheck.ok) {
            console.log(`Billing: Server found on port ${port}`);
            workingPort = port;
            break; // Found a working port, exit loop
          }
        } catch (err) {
          console.log(`Billing: Port ${port} not responding:`, err.message);
        }
      }
      
      // If no working port was found
      if (!workingPort) {
        throw new Error(`Server is not responding. Please ensure the backend server is running.`);
      }
      
      // Use the working port for data
      const endpoints = workingPort === config.API_PORTS[0] 
        ? config.API_ENDPOINTS 
        : config.createEndpoints(workingPort);
      
      const response = await fetch(endpoints.INVENTORY);
      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }
      const data = await response.json();
      
      // Transform inventory data to medical supplies if needed
      const medicalSupplies = data.map(item => {
        let name = item.name;
        
        if (name.includes('Shirt')) {
          name = 'Surgical Bandages';
        } else if (name.includes('Bastar')) {
          name = 'Syringes (10ml)';
        } else if (name.includes('Bottle')) {
          name = 'IV Fluids (1L)';
        } else if (name.includes('Keyring')) {
          name = 'Medical Gloves';
        } else if (name.includes('Canvas')) {
          name = 'Surgical Masks';
        } else if (name.includes('Stationery')) {
          name = 'Sterile Gauze';
        }
        
        return {
          ...item,
          name
        };
      });
      
      setInventory(medicalSupplies);
      setCurrentPort(workingPort); // Store the working port for later use
      setLoading(false);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory. Please try again later.');
      setLoading(false);
    }
  };

  const handleAddToBill = (e) => {
    e.preventDefault();
    setError(null);
    
    if (!selectedPatient) {
      setError('Please select a patient');
      return;
    }
    
    if (!selectedService) {
      setError('Please select a service or treatment');
      return;
    }
    
    if (!quantity || quantity < 1) {
      setError('Please enter a valid quantity');
      return;
    }
    
    // Find the selected service in the services list
    const service = medicalServices.find(service => service.name === selectedService);
    
    if (!service) {
      setError('Selected service not found');
      return;
    }
    
    // Add the item to the bill
    const newItem = {
      id: Date.now(),
      service: selectedService,
      category: service.category,
      unitPrice: service.price,
      quantity: parseInt(quantity),
      totalPrice: service.price * parseInt(quantity)
    };
    
    setBillItems([...billItems, newItem]);
    setSelectedService('');
      setQuantity(1);
  };
  
  const handleRegisterPatient = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    
    // Validation
    if (!newPatient.name || !newPatient.age || !newPatient.contact || !newPatient.diagnosis) {
      setError('Name, age, contact, and diagnosis are required fields');
      return;
    }
    
    if (isNaN(newPatient.age) || parseInt(newPatient.age) <= 0 || parseInt(newPatient.age) > 120) {
      setError('Please enter a valid age');
      return;
    }
    
    // Create new patient
    const patientId = `P${1000 + patients.length + 1}`;
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const patient = {
      id: patientId,
      name: newPatient.name,
      age: parseInt(newPatient.age),
      gender: newPatient.gender,
      diagnosis: newPatient.diagnosis,
      contact: newPatient.contact,
      address: newPatient.address,
      admissionDate: currentDate,
      dischargeDate: null,
      status: 'Admitted',
      doctor: currentUser?.userType === 'doctor' ? currentUser.username : 'Unassigned'
    };
    
    // Get existing registered patients
    const storedPatients = JSON.parse(localStorage.getItem('registeredPatients')) || [];
    
    // Add new patient and save to localStorage
    const updatedPatients = [...storedPatients, patient];
    localStorage.setItem('registeredPatients', JSON.stringify(updatedPatients));
    
    // Update the local state with the new patient
    setPatients(prevPatients => [...prevPatients, patient]);
    
    // Reset form
    setNewPatient({
      name: '', 
      age: '', 
      gender: 'male', 
      contact: '',
      address: '',
      diagnosis: ''
    });
    
    setSuccessMessage(`Patient ${patient.name} registered successfully with ID: ${patientId}`);
    
    // Update total revenue in localStorage for dashboard
    updateRevenueStatistics(0, 'new_patient');
  };
  
  // Add method to update revenue statistics
  const updateRevenueStatistics = (amount, type) => {
    // Get current revenue data from localStorage or initialize if not exists
    const revenueData = JSON.parse(localStorage.getItem('revenueStatistics')) || {
      totalRevenue: 0,
      patientCount: 0,
      billCount: 0,
      recentBills: []
    };
    
    // Update the statistics based on type
    if (type === 'bill') {
      revenueData.totalRevenue += amount;
      revenueData.billCount += 1;
    } else if (type === 'new_patient') {
      revenueData.patientCount += 1;
    }
    
    // Save back to localStorage
    localStorage.setItem('revenueStatistics', JSON.stringify(revenueData));
  };
  
  const handleBillGeneration = async () => {
    if (billItems.length === 0) {
      setError('Cannot generate bill with no items');
      return;
    }
    
    if (!selectedPatient) {
      setError('Please select a patient for billing');
      return;
    }
    
    // Calculate total
    const total = billItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // Get patient data
    const patient = patients.find(p => p.id === selectedPatient);
    
    if (!patient) {
      setError('Selected patient not found');
      return;
    }
    
    // Create bill record
    const billId = `B${Date.now().toString().slice(-6)}`;
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const bill = {
      id: billId,
      patientId: selectedPatient,
      patientName: patient.name,
      date: currentDate,
      items: billItems,
      total: total,
      status: 'Paid',
      paymentMethod: 'Cash'
    };
    
    // Store in localStorage for history and real-time updates
    const storedBills = JSON.parse(localStorage.getItem('billingHistory')) || [];
    const updatedBills = [...storedBills, bill];
    localStorage.setItem('billingHistory', JSON.stringify(updatedBills));
    setBillingHistory(updatedBills);
    
    // Update revenue statistics
    updateRevenueStatistics(total, 'bill');
    
    // Check if this should update patient status (for example, if it includes discharge fees)
    const includesDischarge = billItems.some(item => 
      item.service.toLowerCase().includes('discharge') || 
      item.service.toLowerCase().includes('final')
    );
    
    if (includesDischarge) {
      // Update patient status to discharged
      const storedPatients = JSON.parse(localStorage.getItem('registeredPatients')) || [];
      const updatedPatients = storedPatients.map(p => {
        if (p.id === selectedPatient) {
          return {
            ...p,
            status: 'Discharged',
            dischargeDate: currentDate
          };
        }
        return p;
      });
      
      // Update localStorage
      localStorage.setItem('registeredPatients', JSON.stringify(updatedPatients));
      
      // Update state if patient is in our list
      setPatients(prevPatients => 
        prevPatients.map(p => {
          if (p.id === selectedPatient) {
            return {
              ...p,
              status: 'Discharged',
              dischargeDate: currentDate
            };
          }
          return p;
        })
      );
    }
    
    setSuccessMessage(`Bill #${billId} generated successfully for patient ${patient.name}. Total amount: $${formatNumber(total)}`);
    
    // Clear the bill items after successful generation
    setBillItems([]);
    setSelectedPatient('');
  };
  
  const removeBillItem = (itemId) => {
    setBillItems(billItems.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return billItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  // Load billing history from localStorage
  const loadBillingHistory = () => {
    const storedBills = JSON.parse(localStorage.getItem('billingHistory')) || [];
    
    // If no stored bills, create some mock history
    if (storedBills.length === 0) {
      // Add some mock history data for demonstration
      const mockHistory = generateMockBillingHistory();
      localStorage.setItem('billingHistory', JSON.stringify(mockHistory));
      setBillingHistory(mockHistory);
    } else {
      setBillingHistory(storedBills);
    }
  };
  
  // Generate mock billing history data
  const generateMockBillingHistory = () => {
    return [
      {
        id: 'B100001',
        patientId: 'P1001',
        patientName: 'John Smith',
        date: '2023-06-18',
        items: [
          { id: 1, service: 'Consultation', category: 'General', unitPrice: 50, quantity: 1, totalPrice: 50 },
          { id: 2, service: 'Blood Test', category: 'Laboratory', unitPrice: 75, quantity: 1, totalPrice: 75 },
          { id: 3, service: 'Medication', category: 'Pharmacy', unitPrice: 45, quantity: 2, totalPrice: 90 }
        ],
        total: 215,
        status: 'Paid',
        paymentMethod: 'Credit Card'
      },
      {
        id: 'B100002',
        patientId: 'P1002',
        patientName: 'Emma Johnson',
        date: '2023-06-19',
        items: [
          { id: 1, service: 'X-Ray Scan', category: 'Radiology', unitPrice: 120, quantity: 1, totalPrice: 120 },
          { id: 2, service: 'Consultation', category: 'General', unitPrice: 50, quantity: 1, totalPrice: 50 }
        ],
        total: 170,
        status: 'Paid',
        paymentMethod: 'Insurance'
      },
      {
        id: 'B100003',
        patientId: 'P1003',
        patientName: 'Robert Davis',
        date: '2023-06-17',
        items: [
          { id: 1, service: 'Room Charges - Private (per day)', category: 'Accommodation', unitPrice: 500, quantity: 3, totalPrice: 1500 },
          { id: 2, service: 'Surgery - Minor', category: 'Surgical', unitPrice: 1200, quantity: 1, totalPrice: 1200 },
          { id: 3, service: 'ECG', category: 'Cardiology', unitPrice: 90, quantity: 1, totalPrice: 90 },
          { id: 4, service: 'Medication', category: 'Pharmacy', unitPrice: 45, quantity: 4, totalPrice: 180 }
        ],
        total: 2970,
        status: 'Paid',
        paymentMethod: 'Insurance'
      }
    ];
  };
  
  // Filter billing history
  const filteredBillingHistory = billingHistory.filter(bill => {
    // Search by patient name or ID
    const searchMatch = 
      bill.patientName.toLowerCase().includes(historySearchTerm.toLowerCase()) || 
      bill.patientId.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
      bill.id.toLowerCase().includes(historySearchTerm.toLowerCase());
    
    // Filter by date
    const billDate = new Date(bill.date);
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    let dateMatch = true;
    if (historyDateFilter === 'today') {
      dateMatch = bill.date === today.toISOString().split('T')[0];
    } else if (historyDateFilter === 'week') {
      dateMatch = billDate >= lastWeek;
    } else if (historyDateFilter === 'month') {
      dateMatch = billDate >= lastMonth;
    }
    
    return searchMatch && dateMatch;
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first

  if (loading && !patients.length) {
    return <div className="loading-container">Loading billing system...</div>;
  }

  return (
    <div className="sales-container billing-container">
      <h1>Patient Billing System</h1>
      
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="tabs">
          <button 
          className={`tab-button ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
          >
          Create Bill
          </button>
          <button 
          className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
          >
          Register Patient
          </button>
          <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
          >
          Billing History
          </button>
        </div>

      {activeTab === 'billing' && (
        <div className="billing-section">
          <div className="form-container">
            <h2>Create New Bill</h2>
            <form onSubmit={handleAddToBill}>
              <div className="form-group">
                <label>Patient:</label>
                <select 
                  value={selectedPatient} 
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  required
                  className="large-select"
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.id} - {patient.name} ({patient.age}, {patient.gender})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Service/Treatment:</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                  className="large-select"
                >
                  <option value="">Select Service</option>
                  {medicalServices.map((service, index) => (
                    <option key={index} value={service.name}>
                      {service.name} - ${formatNumber(service.price)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Quantity/Days:</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="large-input"
                />
              </div>
              
              <button type="submit" className="large-button sales-button">
                Add to Bill
              </button>
            </form>
          </div>
          
          <div className="bill-preview">
            <h2>Current Bill</h2>
            
            {selectedPatient && (
              <div className="selected-patient">
                <strong>Patient:</strong> {patients.find(p => p.id === selectedPatient)?.name || selectedPatient}
              </div>
            )}
            
            {billItems.length > 0 ? (
              <>
                <table className="bill-table">
                  <thead>
                    <tr>
                      <th>Service/Treatment</th>
                      <th>Category</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billItems.map(item => (
                      <tr key={item.id}>
                        <td>{item.service}</td>
                        <td>{item.category}</td>
                        <td>{item.quantity}</td>
                        <td>${formatNumber(item.unitPrice)}</td>
                        <td>${formatNumber(item.totalPrice)}</td>
                        <td>
                          <button 
                            className="remove-item-btn"
                            onClick={() => removeBillItem(item.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="total-label">Total Amount</td>
                      <td colSpan="2" className="total-amount">${formatNumber(calculateTotal())}</td>
                    </tr>
                  </tfoot>
                </table>
                
                <button 
                  className="large-button generate-bill-btn"
                  onClick={handleBillGeneration}
                >
                  Generate Bill
                </button>
              </>
            ) : (
              <p>No items in the bill yet. Add services or treatments.</p>
            )}
          </div>
          </div>
        )}
        
      {activeTab === 'register' && (
        <div className="register-patient-section">
          <h2>Register New Patient</h2>
          <form onSubmit={handleRegisterPatient}>
            <div className="form-row">
              <div className="form-group">
                <label>Patient Name:</label>
                <input 
                  type="text" 
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                  required
                  className="large-input"
                />
              </div>
              
              <div className="form-group">
                <label>Age:</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                  required
                  className="large-input"
                />
              </div>
              
              <div className="form-group">
                <label>Gender:</label>
                <select
                  value={newPatient.gender}
                  onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}
                  className="large-select"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                  </div>
              </div>
              
            <div className="form-row">
              <div className="form-group">
                <label>Contact Number:</label>
                <input
                  type="text"
                  value={newPatient.contact}
                  onChange={(e) => setNewPatient({...newPatient, contact: e.target.value})}
                  required
                  className="large-input"
                />
              </div>
              
              <div className="form-group">
                <label>Address:</label>
                <input 
                  type="text"
                  value={newPatient.address}
                  onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                  className="large-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Diagnosis/Reason for Visit:</label>
              <textarea
                value={newPatient.diagnosis}
                onChange={(e) => setNewPatient({...newPatient, diagnosis: e.target.value})}
                required
                className="large-textarea"
              ></textarea>
            </div>
            
            <button type="submit" className="large-button sales-button">
              Register Patient
            </button>
          </form>
                </div>
              )}
              
      {activeTab === 'history' && (
        <div className="billing-history-section">
          <h2>Billing History</h2>
          
          <div className="history-filters">
            <div className="history-search">
              <input 
                type="text"
                placeholder="Search by patient name, ID or bill number..."
                value={historySearchTerm}
                onChange={(e) => setHistorySearchTerm(e.target.value)}
              />
            </div>
            
            <div className="history-date-filter">
              <select 
                value={historyDateFilter} 
                onChange={(e) => setHistoryDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
          
          {filteredBillingHistory.length > 0 ? (
            <div className="billing-history-container">
              {filteredBillingHistory.map((bill) => (
                <div key={bill.id} className="bill-card">
                  <div className="bill-card-header">
                    <div className="bill-id">Bill #{bill.id}</div>
                    <div className="bill-date">{bill.date}</div>
                  </div>
                  
                  <div className="bill-card-body">
                    <div className="bill-patient-info">
                      <span className="bill-patient-id">{bill.patientId}</span>
                      <span className="bill-patient-name">{bill.patientName}</span>
                    </div>
                    
                    <div className="bill-items-summary">
                      <div className="bill-items-count">{bill.items.length} item(s)</div>
                      <div className="bill-total-amount">${formatNumber(bill.total)}</div>
                    </div>
                    
                    <div className="bill-details-toggle">
                      <details>
                        <summary>View Details</summary>
                        <div className="bill-items-table">
                          <table>
                            <thead>
                              <tr>
                                <th>Service/Treatment</th>
                                <th>Category</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bill.items.map((item, idx) => (
                                <tr key={idx}>
                                  <td>{item.service}</td>
                                  <td>{item.category}</td>
                                  <td>{item.quantity}</td>
                                  <td>${formatNumber(item.unitPrice)}</td>
                                  <td>${formatNumber(item.totalPrice)}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan="4" className="total-label">Total Amount</td>
                                <td className="total-amount">${formatNumber(bill.total)}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                        
                        <div className="bill-payment-info">
                          <div className="payment-status">
                            <span className="payment-label">Status:</span>
                            <span className="payment-value">{bill.status}</span>
                          </div>
                          <div className="payment-method">
                            <span className="payment-label">Payment Method:</span>
                            <span className="payment-value">{bill.paymentMethod}</span>
                          </div>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-history">
              <p>No billing records found. {historySearchTerm || historyDateFilter !== 'all' ? 'Try adjusting your search or filters.' : ''}</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
}

export default Sales;