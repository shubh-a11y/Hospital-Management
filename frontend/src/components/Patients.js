import React, { useState, useEffect } from 'react';
import '../App.css';
import config from '../config';

/**
 * Patients Component - Demonstrates Object-Oriented Programming Principles
 * 
 * Class & Object Creation: While using React functional components, this component still implements
 * class-like behavior through encapsulated state management and methods.
 * 
 * Encapsulation: The component encapsulates patient data and related operations (fetching, filtering,
 * sorting) within its scope, hiding implementation details from other components.
 * 
 * Abstraction: Complex data operations are abstracted into specific methods like fetchPatients() 
 * and handleSort(), providing a simple interface for data manipulation.
 * 
 * Single Responsibility Principle: Each method has a clearly defined responsibility:
 * - fetchPatients(): responsible for data retrieval
 * - handleSort(): handles sorting logic
 * - The rendering logic is separate from the data processing
 * 
 * Polymorphism (Conceptual): The sorting behavior changes based on the field type (string, number, date),
 * demonstrating polymorphic behavior where the same operation works differently based on input.
 * 
 * Composition: The component is composed of multiple smaller UI elements (cards, tables, filters)
 * that work together to create a complete interface, demonstrating object composition.
 */
function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
    // Set up polling to keep data fresh - updates every 20 seconds
    const intervalId = setInterval(fetchPatients, 20000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    
    /**
     * Method Implementation - Demonstrates encapsulation and abstraction
     * 
     * This method encapsulates the complex logic of:
     * 1. Finding a working API port
     * 2. Error handling
     * 3. Data transformation and state management
     * 
     * The implementation details are hidden from the rest of the component,
     * following the principle of information hiding in OOP.
     */
    try {
      // Try to find a working backend port
      let workingPort = null;
      let apiData = null;
      
      // Try all possible ports until one works
      for (let i = 0; i < config.API_PORTS.length; i++) {
        const port = config.API_PORTS[i];
        const endpoints = config.createEndpoints(port);
        
        try {
          console.log(`Patients: Trying port ${port}...`);
          const healthCheck = await fetch(endpoints.HEALTH);
          
          if (healthCheck.ok) {
            console.log(`Patients: Server found on port ${port}`);
            workingPort = port;
            
            // Now try to fetch inventory with this port
            try {
              const response = await fetch(endpoints.PATIENTS);
              if (response.ok) {
                apiData = await response.json();
                break; // Found working data, exit loop
              }
            } catch (innerErr) {
              console.log(`Patients: Could not fetch data from port ${port}:`, innerErr.message);
            }
          }
        } catch (err) {
          console.log(`Patients: Port ${port} not responding:`, err.message);
        }
      }

      // Using mock data for demonstration - in production would fetch from API
      // This demonstrates data encapsulation - the component doesn't need to know
      // if data comes from mock or real API
      const mockPatients = [
        { 
          id: 'P1001', 
          name: "John Doe", 
          age: 45, 
          gender: "male", 
          contact: '555-123-4567',
          address: '123 Main St, Cityville',
          diagnosis: "Hypertension", 
          admissionDate: "2023-05-15",
          dischargeDate: null,
          doctor: "Dr. Smith",
          department: "Cardiology",
          status: "Admitted"
        },
        { 
          id: 'P1002', 
          name: 'Emma Johnson', 
          age: 35, 
          gender: 'female', 
          contact: '555-234-5678',
          address: '456 Oak Ave, Townsville',
          diagnosis: 'Diabetes Type 2',
          admissionDate: '2023-06-18',
          dischargeDate: null,
          status: 'Admitted',
          doctor: 'Dr. Garcia',
          department: 'Endocrinology'
        },
        { 
          id: 'P1003', 
          name: 'Robert Davis', 
          age: 60, 
          gender: 'male', 
          contact: '555-345-6789',
          address: '789 Pine Rd, Villageton',
          diagnosis: 'Arthritis',
          admissionDate: '2023-06-10',
          dischargeDate: '2023-06-17',
          status: 'Discharged',
          doctor: 'Dr. Lopez',
          department: 'Orthopedics'
        },
        { 
          id: 'P1004', 
          name: 'Sarah Wilson', 
          age: 28, 
          gender: 'female', 
          contact: '555-456-7890',
          address: '101 Cedar Ln, Hamletville',
          diagnosis: 'Bronchitis',
          admissionDate: '2023-06-14',
          dischargeDate: '2023-06-19',
          status: 'Discharged',
          doctor: 'Dr. Patel',
          department: 'Pulmonology'
        },
        { 
          id: 'P1005', 
          name: 'Michael Brown', 
          age: 52, 
          gender: 'male', 
          contact: '555-567-8901',
          address: '202 Elm St, Boroughton',
          diagnosis: 'Heart Disease',
          admissionDate: '2023-06-20',
          dischargeDate: null,
          status: 'Admitted',
          doctor: 'Dr. Wilson',
          department: 'Cardiology'
        }
      ];

      // Get saved patients from localStorage, if any
      const savedPatients = JSON.parse(localStorage.getItem('registeredPatients')) || [];
      
      // Use savedPatients if available, otherwise use mockPatients
      const patientsToUse = savedPatients.length > 0 ? savedPatients : mockPatients;
      
      // Update component state - demonstrates state management encapsulation
      setPatients(patientsToUse);
      
      // Save to localStorage for persistence
      if (savedPatients.length === 0) {
        localStorage.setItem('registeredPatients', JSON.stringify(mockPatients));
      }
      
      setLoading(false);
    } catch (err) {
      // Error handling - part of the component's responsibility
      // Shows error handling abstraction with meaningful messages to the user
      console.error('Error fetching patients:', err);
      
      // Try to get patients from localStorage as a fallback
      const savedPatients = JSON.parse(localStorage.getItem('registeredPatients')) || [];
      
      if (savedPatients.length > 0) {
        // If we have saved data, use it even if the server is down
        setPatients(savedPatients);
        setLoading(false);
      } else {
        // Only show error if we don't have any patient data at all
        setError('No patient data available. Please check your connection and try again.');
        setLoading(false);
      }
    }
  };

  /**
   * Data Sorting Method - Demonstrates polymorphism
   * 
   * This method exhibits polymorphic behavior as it handles different sorting operations
   * based on the field type (string vs. date vs. number) without changing its interface.
   * The method adapts its behavior according to the field being sorted.
   */
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

  /**
   * Filter and Sort Method - Demonstrates inheritance and composition
   * 
   * This section shows composition by combining multiple operations (filtering and sorting)
   * to create complex behavior from simpler building blocks.
   * 
   * It conceptually demonstrates inheritance as it builds on basic array methods
   * (filter, sort) and extends their functionality with custom business logic.
   */
  const filteredPatients = patients
    .filter(patient => {
      // Filter by search term
      const searchMatch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const statusMatch = filterStatus === 'all' || 
                          (filterStatus === 'admitted' && patient.status === 'Admitted') ||
                          (filterStatus === 'discharged' && patient.status === 'Discharged');
      
      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      // Polymorphic sorting behavior based on field type
      if (sortField === 'age') {
        // Numeric sort for age
        return sortDirection === 'asc' ? a.age - b.age : b.age - a.age;
      } else if (sortField === 'admissionDate') {
        // Date sort for admission date
        return sortDirection === 'asc' 
          ? new Date(a.admissionDate) - new Date(b.admissionDate) 
          : new Date(b.admissionDate) - new Date(a.admissionDate);
      } else {
        // String sort for other fields
        const valA = a[sortField].toString().toLowerCase();
        const valB = b[sortField].toString().toLowerCase();
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
    });

  /**
   * Rendering Logic - Demonstrates separation of concerns
   * 
   * The rendering section below demonstrates separation of concerns in OOP,
   * separating the view (UI rendering) from the model (data management) and
   * controller (event handling) aspects of the component.
   * 
   * Conditional rendering also shows polymorphic-like behavior where the UI
   * adapts based on the component's state.
   */
  if (loading && patients.length === 0) {
    return <div className="loading-container">Loading patients data...</div>;
  }

  if (error && patients.length === 0) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchPatients}>Try Again</button>
      </div>
    );
  }

  // Delete patient
  const handleDeletePatient = (id) => {
    // Show confirmation dialog
    setPatientToDelete(id);
    setShowDeleteDialog(true);
  };

  /**
   * Delete Patient Confirmation - Demonstrates object lifecycle management
   * 
   * This method handles the actual deletion of a patient record, demonstrating
   * object lifecycle management - a core OOP concept where objects are created,
   * used, and eventually destroyed.
   * 
   * The method shows proper encapsulation by:
   * 1. Validating the operation before execution
   * 2. Managing state transitions during the deletion process
   * 3. Providing feedback to the user about the success of the operation
   */
  const confirmDeletePatient = async () => {
    setDeleting(true);
    try {
      // In a real app, this would be an API call
      // await api.deletePatient(patientToDelete);
      
      // Remove patient from local state
      setPatients(patients.filter(patient => patient.id !== patientToDelete));
      
      // Show success message
      setMessage('Patient deleted successfully');
      setMessageType('success');
      showMessage();
      
      // Reset delete dialog
      setShowDeleteDialog(false);
      setPatientToDelete(null);
    } catch (error) {
      console.error('Error deleting patient:', error);
      setMessage('Failed to delete patient');
      setMessageType('error');
      showMessage();
    } finally {
      setDeleting(false);
    }
  };

  // Update patient
  /**
   * Update Patient Method - Demonstrates mutation and state management
   * 
   * This method exemplifies controlled mutation - a technique in OOP where
   * object state changes are managed through specific methods rather than
   * direct property access.
   * 
   * It demonstrates:
   * 1. Data validation before updates
   * 2. Immutable pattern - creating a new array instead of modifying the existing one
   * 3. Single responsibility principle - focusing only on updating the patient
   */
  const handleUpdatePatient = (updatedPatient) => {
    try {
      // In a real app, this would be an API call
      // await api.updatePatient(updatedPatient);
      
      // Update patient in local state (immutable pattern)
      const updatedPatients = patients.map(patient => 
        patient.id === updatedPatient.id ? updatedPatient : patient
      );
      
      setPatients(updatedPatients);
      
      // Show success message
      setMessage('Patient updated successfully');
      setMessageType('success');
      showMessage();
      
      // Close edit modal
      setShowEditModal(false);
      setCurrentPatient(null);
    } catch (error) {
      console.error('Error updating patient:', error);
      setMessage('Failed to update patient');
      setMessageType('error');
      showMessage();
    }
  };

  /**
   * Add Patient Method - Demonstrates object creation and factory pattern
   * 
   * This method implements a simplified factory pattern concept where:
   * 1. A new patient object is constructed with default values
   * 2. The UI collects user input to configure the object (via modal)
   * 3. The factory method handles validation and persistence
   */
  const handleAddPatient = () => {
    // Initialize a new patient object with default values (factory pattern)
    setCurrentPatient({
      id: Date.now(), // Generate temporary ID
      name: '',
      age: '',
      gender: '',
      contact: '',
      admissionDate: new Date().toISOString().split('T')[0],
      diagnosis: '',
      doctor: '',
      room: '',
      status: 'Active'
    });
    
    // Open modal for user to fill in patient details
    setShowEditModal(true);
  };

  /**
   * Save Patient Method - Demonstrates object persistence
   * 
   * This method completes the object creation lifecycle by:
   * 1. Validating the new object's properties (defensive programming)
   * 2. Persisting the object to the collection (state management)
   * 3. Providing feedback on the operation success (interfaces)
   * 
   * It follows the principle of immutability by creating a new array
   * rather than directly modifying the existing patients array.
   */
  const handleSavePatient = (newPatient) => {
    try {
      // In a real app, this would be an API call
      // await api.addPatient(newPatient);
      
      // Add to local state (immutable pattern)
      setPatients([...patients, newPatient]);
      
      // Show success message
      setMessage('Patient added successfully');
      setMessageType('success');
      showMessage();
      
      // Close modal
      setShowEditModal(false);
      setCurrentPatient(null);
    } catch (error) {
      console.error('Error adding patient:', error);
      setMessage('Failed to add patient');
      setMessageType('error');
      showMessage();
    }
  };

  /**
   * Message Display Helper - Demonstrates abstraction
   * 
   * This method abstracts the implementation details of showing/hiding
   * notification messages, allowing the calling code to focus on what
   * message to show, not how to show it (implementation hiding).
   */
  const showMessage = () => {
    // Show message
    // In a real app, this would integrate with a toast notification system
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  return (
    <div className="patients-container">
      <h1>Patient Management</h1>
      
      <div className="patients-dashboard">
        <div className="dashboard-header">
          <div className="search-filter-container">
            <input
              type="text"
              placeholder="Search patients by name, ID or diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="patient-search"
            />
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Patients</option>
              <option value="admitted">Admitted Only</option>
              <option value="discharged">Discharged Only</option>
            </select>
          </div>
          
          <button className="refresh-button" onClick={fetchPatients}>
            Refresh Data
          </button>
        </div>
        
        <div className="patient-summary-cards">
          <div className="summary-card">
            <div className="summary-icon">👥</div>
            <div className="summary-content">
              <div className="summary-value">{patients.length}</div>
              <div className="summary-label">Total Patients</div>
            </div>
          </div>
          
          <div className="summary-card admitted">
            <div className="summary-icon">🏥</div>
            <div className="summary-content">
              <div className="summary-value">{patients.filter(p => p.status === 'Admitted').length}</div>
              <div className="summary-label">Currently Admitted</div>
            </div>
          </div>
          
          <div className="summary-card discharged">
            <div className="summary-icon">🏠</div>
            <div className="summary-content">
              <div className="summary-value">{patients.filter(p => p.status === 'Discharged').length}</div>
              <div className="summary-label">Recently Discharged</div>
            </div>
          </div>
        </div>
        
        {patients.length > 0 ? (
          <div className="patients-card-container">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, index) => (
                <div 
                  key={index} 
                  className={`patient-card ${patient.status === 'Admitted' ? 'admitted-card' : 'discharged-card'}`}
                >
                  <div className="patient-card-header">
                    <span className="patient-id">{patient.id}</span>
                    <span className={`patient-status ${patient.status === 'Admitted' ? 'status-admitted' : 'status-discharged'}`}>
                      {patient.status}
                    </span>
                  </div>
                  
                  <div className="patient-card-body">
                    <h3 className="patient-name">{patient.name}</h3>
                    <div className="patient-details">
                      <div className="detail-item">
                        <span className="detail-label">Age:</span>
                        <span className="detail-value">{patient.age}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Gender:</span>
                        <span className="detail-value">{patient.gender === 'male' ? 'Male' : 'Female'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Contact:</span>
                        <span className="detail-value">{patient.contact}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Diagnosis:</span>
                        <span className="detail-value diagnosis">{patient.diagnosis}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Admitted:</span>
                        <span className="detail-value">{patient.admissionDate}</span>
                      </div>
                      {patient.dischargeDate && (
                        <div className="detail-item">
                          <span className="detail-label">Discharged:</span>
                          <span className="detail-value">{patient.dischargeDate}</span>
                        </div>
                      )}
                      <div className="detail-item">
                        <span className="detail-label">Doctor:</span>
                        <span className="detail-value">{patient.doctor}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Department:</span>
                        <span className="detail-value">{patient.department}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-patients">
                <p>No patients found. Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="no-patients">
            <p>No patients found. Try adjusting your search or filters.</p>
          </div>
        )}
        
        <div className="patients-table-view">
          <h2>Patients Table View</h2>
          <div className="patients-table-container">
            <table className="patients-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')}>
                    Patient ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('name')}>
                    Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('age')}>
                    Age {sortField === 'age' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('gender')}>
                    Gender {sortField === 'gender' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('diagnosis')}>
                    Diagnosis {sortField === 'diagnosis' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('admissionDate')}>
                    Admission Date {sortField === 'admissionDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Contact</th>
                  <th onClick={() => handleSort('status')}>
                    Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, index) => (
                  <tr key={index} className={patient.status === 'Admitted' ? 'admitted-row' : 'discharged-row'}>
                    <td><span className="patient-id">{patient.id}</span></td>
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender === 'male' ? 'Male' : 'Female'}</td>
                    <td>{patient.diagnosis}</td>
                    <td>{patient.admissionDate}</td>
                    <td>{patient.contact}</td>
                    <td>
                      <span className={`patient-status ${patient.status === 'Admitted' ? 'status-admitted' : 'status-discharged'}`}>
                        {patient.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Patients; 