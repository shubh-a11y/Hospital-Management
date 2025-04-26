import React, { useState, useEffect } from 'react';
import '../App.css';
import config from '../config';

/**
 * DETAILED OOP PRINCIPLES IMPLEMENTATION
 * 
 * The HospitalDataService class demonstrates several key Object-Oriented Programming concepts:
 * 
 * 1. CLASS & OBJECT CREATION:
 *    - Defines a blueprint for hospital data management services
 *    - An instance of this class is created in the Dashboard component
 *    - Maintains its own state (defaultData) and behavior (methods)
 * 
 * 2. ENCAPSULATION:
 *    - Bundles data (defaultData) and methods (formatNumber, getDashboardData, etc.)
 *    - Hides implementation details from the Dashboard component
 *    - Provides a clean interface for data access through well-defined methods
 *    - Internal state is protected from direct external modification
 * 
 * 3. ABSTRACTION:
 *    - Simplifies complex data retrieval operations through method abstraction
 *    - getDashboardData() provides a single, simple interface to all dashboard statistics
 *    - Hides implementation complexity of data fetching, calculation and formatting
 *    - Dashboard component doesn't need to know how data is processed internally
 * 
 * 4. SINGLE RESPONSIBILITY PRINCIPLE:
 *    - Each method has a single, well-defined responsibility
 *    - getPatientStatistics() handles only patient data
 *    - getRevenueStatistics() manages only revenue calculations
 *    - Clear separation of concerns throughout the class
 * 
 * 5. INHERITANCE (CONCEPTUAL):
 *    - While not explicitly showing inheritance through extends,
 *    - This class could serve as a base class for more specialized services
 *      (e.g., PatientDataService, RevenueDataService)
 */
class HospitalDataService {
  constructor() {
    this.defaultData = {
      totalPatients: 125,
      activePatients: 42,
      todayAppointments: 18,
      bedOccupancy: "75%",
      doctorsOnDuty: 12,
      emergencyCases: 8,
      departments: [
        { name: "Cardiology", patients: 28, doctors: 5 },
        { name: "Neurology", patients: 15, doctors: 3 },
        { name: "Pediatrics", patients: 22, doctors: 4 },
        { name: "Orthopedics", patients: 17, doctors: 3 },
        { name: "Oncology", patients: 12, doctors: 2 }
      ],
      criticalSupplies: [],
      recentAdmissions: []
    };
  }
  
  // Helper method to format numbers
  formatNumber(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00';
    }
    return Number(value).toFixed(decimals);
  }
  
  // Get hospital departments
  getDepartments() {
    return this.defaultData.departments;
  }
  
  // Get patient statistics
  getPatientStatistics() {
    // Try to get real patient data
    const registeredPatients = JSON.parse(localStorage.getItem('registeredPatients')) || [];
    
    if (registeredPatients.length === 0) {
      return {
        totalPatients: this.defaultData.totalPatients,
        activePatients: this.defaultData.activePatients,
        dischargedPatients: this.defaultData.totalPatients - this.defaultData.activePatients
      };
    }
    
    // Calculate actual stats from localStorage
    const admitted = registeredPatients.filter(p => p.status === 'Admitted').length;
    const discharged = registeredPatients.filter(p => p.status === 'Discharged').length;
    
    return {
      totalPatients: registeredPatients.length,
      activePatients: admitted,
      dischargedPatients: discharged
    };
  }
  
  // Get revenue statistics
  getRevenueStatistics() {
    // Get revenue data from localStorage
    const revenueData = JSON.parse(localStorage.getItem('revenueStatistics')) || {
      totalRevenue: 0,
      patientCount: 0,
      billCount: 0,
      recentBills: []
    };
    
    const billingHistory = JSON.parse(localStorage.getItem('billingHistory')) || [];
    
    // If we have billing history, use actual data
    if (billingHistory.length > 0) {
      const totalRevenue = billingHistory.reduce((sum, bill) => sum + bill.total, 0);
      
      // Get today's bills
      const today = new Date().toISOString().split('T')[0];
      const todayBills = billingHistory.filter(bill => bill.date === today);
      const todayRevenue = todayBills.reduce((sum, bill) => sum + bill.total, 0);
      
      return {
        totalRevenue,
        todayRevenue,
        billCount: billingHistory.length
      };
    }
    
    // Otherwise use data from revenueStatistics if available
    return {
      totalRevenue: revenueData.totalRevenue || 5000,
      todayRevenue: revenueData.totalRevenue ? revenueData.totalRevenue / 10 : 500,
      billCount: revenueData.billCount || 0
    };
  }
  
  // Get inventory status
  getInventoryStatus() {
    // Get inventory data from localStorage
    const inventory = JSON.parse(localStorage.getItem('medicalInventory')) || [];
    
    if (inventory.length === 0) {
      return {
        totalItems: 0,
        lowStockItems: [],
        inventoryValue: 0
      };
    }
    
    // Calculate inventory statistics
    const totalItems = inventory.reduce((sum, item) => sum + (item.stock || 0), 0);
    const inventoryValue = inventory.reduce((sum, item) => sum + ((item.price || 0) * (item.stock || 0)), 0);
    const lowStockItems = inventory
      .filter(item => item.stock > 0 && item.stock < 10)
      .map(item => ({
        name: item.name,
        quantity: item.stock,
        category: item.category
      }));
    
    return {
      totalItems,
      lowStockItems,
      inventoryValue
    };
  }
  
  // Get recent admissions
  getRecentAdmissions() {
    // Get registered patients
    const registeredPatients = JSON.parse(localStorage.getItem('registeredPatients')) || [];
    
    if (registeredPatients.length === 0) {
      return [];
    }
    
    // Transform patients to admissions format
    return registeredPatients
      .slice(0, 10)
      .map(patient => ({
        patientId: patient.id,
        patientName: patient.name,
        department: patient.department || ["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Oncology"][Math.floor(Math.random() * 5)],
        admissionDate: patient.admissionDate,
        status: patient.status
      }));
  }
  
  // Get all dashboard data - this is the main method for the service
  async getDashboardData() {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Combine all data
      const patientStats = this.getPatientStatistics();
      const revenueStats = this.getRevenueStatistics();
      const inventoryStats = this.getInventoryStatus();
      const recentAdmissions = this.getRecentAdmissions();
      
      // Calculate appointments (random but based on patients)
      const todayAppointments = Math.max(
        Math.floor(patientStats.totalPatients / 5), 
        Math.floor(Math.random() * 20)
      );
      
      // Return combined dashboard data
      return {
        ...this.defaultData,
        totalPatients: patientStats.totalPatients,
        activePatients: patientStats.activePatients,
        dischargedPatients: patientStats.dischargedPatients,
        todayAppointments,
        recentAdmissions,
        inventoryValue: inventoryStats.inventoryValue,
        criticalSupplies: inventoryStats.lowStockItems,
        totalRevenue: revenueStats.totalRevenue,
        todayRevenue: revenueStats.todayRevenue,
        billCount: revenueStats.billCount
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      return this.defaultData;
    }
  }
}

/**
 * Dashboard Component using OOP principles
 * - We use the HospitalDataService class to handle data fetching and processing
 * - The component only handles the presentation layer
 */
function Dashboard() {
  // Initialize the data service
  const dataService = new HospitalDataService();
  
  // Component state
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      // First try to get data from server
    try {
      // Try to find a working backend port
      let workingPort = null;
      
      // Try all possible ports until one works
      for (let i = 0; i < config.API_PORTS.length; i++) {
        const port = config.API_PORTS[i];
        const endpoints = config.createEndpoints(port);
        
        try {
          console.log(`Dashboard: Trying port ${port}...`);
          const healthCheck = await fetch(endpoints.HEALTH);
          if (healthCheck.ok) {
            console.log(`Dashboard: Server found on port ${port}`);
            workingPort = port;
            break; // Found a working port, exit loop
          }
        } catch (err) {
          console.log(`Dashboard: Port ${port} not responding:`, err.message);
        }
      }
      
        // If a working port was found, try to get server data
        if (workingPort) {
      const endpoints = workingPort === config.API_PORTS[0] 
        ? config.API_ENDPOINTS 
        : config.createEndpoints(workingPort);
      
      // Then fetch dashboard data
      const response = await fetch(endpoints.DASHBOARD);
          if (response.ok) {
            // Use server data as base but will be overridden by local data
            const data = await response.json();
            // Just keep this for reference
            console.log('Server dashboard data:', data);
          }
        }
      } catch (err) {
        console.log('Could not fetch server data, using local data only');
      }
      
      // Get data from our service (prioritizes localStorage data)
      const hospitalData = await dataService.getDashboardData();
      
      setDashboardData(hospitalData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data: ' + error.message);
      setLoading(false);
    }
  };

  // Function to handle refresh button
  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading && !dashboardData) {
    return <div className="dashboard-container loading">Loading dashboard data...</div>;
  }

  if (error && !dashboardData) {
    return (
      <div className="dashboard-container error">
        <p>{error}</p>
        <button className="refresh-button" onClick={handleRefresh}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Hospital Dashboard</h1>
      <button className="large-button refresh-button" onClick={handleRefresh}>
        Refresh Data
      </button>

      {dashboardData ? (
        <div className="dashboard-content">
          <div className="stats-container">
            <div className="stat-card">
              <h2>Total Patients</h2>
              <div className="card-value">{dashboardData.totalPatients}</div>
              <div className="card-subtitle">Registered Patients</div>
            </div>
            <div className="stat-card">
              <h2>Active Patients</h2>
              <div className="card-value">{dashboardData.activePatients}</div>
              <div className="card-subtitle">Currently Admitted</div>
            </div>
            <div className="stat-card">
              <h2>Today's Appointments</h2>
              <div className="card-value">{dashboardData.todayAppointments}</div>
              <div className="card-subtitle">Scheduled for Today</div>
            </div>
            <div className="stat-card">
              <h2>Revenue</h2>
              <div className="card-value">${dataService.formatNumber(dashboardData.totalRevenue)}</div>
              <div className="card-subtitle">Total Generated</div>
            </div>
          </div>

          <div className="dashboard-sections">
            <div className="dashboard-section">
              <h3>Department Statistics</h3>
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Patients</th>
                    <th>Doctors</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.departments.map((dept, index) => (
                    <tr key={index}>
                      <td>{dept.name}</td>
                      <td>{dept.patients}</td>
                      <td>{dept.doctors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="dashboard-section">
              <h3>Medical Supplies Alert</h3>
              {!dashboardData.criticalSupplies || dashboardData.criticalSupplies.length === 0 ? (
                <p>No critical supplies low in stock</p>
              ) : (
                <div className="low-stock-list">
                  <h3>Supplies to Restock:</h3>
                  <ul>
                    {dashboardData.criticalSupplies.map((item, index) => (
                      <li key={index}>
                        {item.name} - Only {item.quantity} left
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <h3>Recent Patient Admissions</h3>
            {!dashboardData.recentAdmissions || dashboardData.recentAdmissions.length === 0 ? (
              <p>No recent admissions</p>
            ) : (
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Patient Name</th>
                    <th>Department</th>
                    <th>Admission Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentAdmissions.slice(0, 5).map((admission, index) => (
                    <tr key={index}>
                      <td>{admission.patientId}</td>
                      <td>{admission.patientName}</td>
                      <td>{admission.department}</td>
                      <td>{admission.admissionDate}</td>
                      <td>
                        <span className={`patient-status ${admission.status === 'Admitted' ? 'status-admitted' : 'status-discharged'}`}>
                          {admission.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          <div className="dashboard-section">
            <h3>Hospital Status</h3>
            <div className="status-container">
              <div className="status-item">
                <span className="status-label">Doctors on Duty:</span>
                <span className="status-value">{dashboardData.doctorsOnDuty}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Emergency Cases Today:</span>
                <span className="status-value">{dashboardData.emergencyCases}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Average Wait Time:</span>
                <span className="status-value">12 minutes</span>
              </div>
              <div className="status-item">
                <span className="status-label">Revenue Today:</span>
                <span className="status-value">${dataService.formatNumber(dashboardData.todayRevenue)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard-container loading">No data available</div>
      )}
    </div>
  );
}

export default Dashboard;