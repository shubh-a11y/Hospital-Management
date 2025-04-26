import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import UserDashboard from './components/UserDashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Reports from './components/Reports';
import Login from './components/Login';
import Users from './components/Users';
import About from './components/About';
import config from './config';
import { AuthProvider, AuthContext } from './AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Patients from './components/Patients';

// Helper component to handle active links
function NavBar() {
  const location = useLocation();
  const [serverStatus, setServerStatus] = useState('checking');
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  
  useEffect(() => {
    checkServerStatus();
    
    // Check server status periodically
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const checkServerStatus = async () => {
    setServerStatus('checking');
    
    // Try all possible ports
    for (let i = 0; i < config.API_PORTS.length; i++) {
      const port = config.API_PORTS[i];
      const endpoints = config.createEndpoints(port);
      
      try {
        console.log(`Checking server health on port ${port}...`);
        const response = await fetch(endpoints.HEALTH);
        if (response.ok) {
          const data = await response.json();
          console.log(`Server found on port ${port}:`, data);
          setServerStatus(data.mode || 'online');
          return; // Exit once we find a working server
        }
      } catch (error) {
        console.log(`Port ${port} not responding: ${error.message}`);
      }
    }
    
    // If we get here, no server was found
    console.error('Server status check failed on all ports');
    setServerStatus('offline');
  };
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
  };
  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          MedCare Hospital
          <div className={`server-status ${serverStatus}`}>
            {serverStatus === 'checking' ? 'Connecting...' : 
             serverStatus === 'offline' ? 'Server Offline' : 
             serverStatus === 'mongodb' ? 'Server Online (DB)' : 
             'Server Online (Memory)'}
          </div>
        </Link>
        
        <div className="menu-icon" onClick={toggleMenu}>
          <div className={menuOpen ? 'open' : ''}></div>
        </div>
        
        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          
          <li className="nav-item">
            <Link 
              to="/about" 
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              About Us
            </Link>
          </li>
          
          {isAuthenticated() && (
            <>
              <li className="nav-item">
                <Link 
                  to="/user-dashboard" 
                  className={`nav-link ${location.pathname === '/user-dashboard' ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  Patient Portal
                </Link>
              </li>
              
              {isAdmin() && (
                <>
                  <li className="nav-item">
                    <Link 
                      to="/admin-dashboard" 
                      className={`nav-link ${location.pathname === '/admin-dashboard' ? 'active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                  
                  <li className="nav-item">
                    <Link 
                      to="/inventory" 
                      className={`nav-link ${location.pathname === '/inventory' ? 'active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Medical Inventory
                    </Link>
                  </li>
                  
                  <li className="nav-item">
                    <Link 
                      to="/reports" 
                      className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Reports
                    </Link>
                  </li>
                  
                  <li className="nav-item">
                    <Link 
                      to="/patients" 
                      className={`nav-link ${location.pathname === '/patients' ? 'active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Patients
                    </Link>
                  </li>
                </>
              )}
              
              <li className="nav-item">
                <Link 
                  to="/sales" 
                  className={`nav-link ${location.pathname === '/sales' ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  Billing
                </Link>
              </li>
            </>
          )}
          
          <li className="nav-item login-item">
            {isAuthenticated() ? (
              <button 
                className="nav-link login-link"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                Logout ({currentUser.username})
              </button>
            ) : (
              <Link 
                to="/login" 
                className={`nav-link login-link ${location.pathname === '/login' ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar />
          <div className="content">
            <Routes>
              {/* Public route */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              
              {/* Protected routes for any authenticated user */}
              <Route element={<PrivateRoute adminOnly={false} />}>
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/sales" element={<Sales />} />
              </Route>
              
              {/* Admin-only routes */}
              <Route element={<PrivateRoute adminOnly={true} />}>
                <Route path="/admin-dashboard" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/users" element={<Users />} />
              </Route>
              
              {/* New routes */}
              <Route path="/patients" element={<Patients />} />
              
              {/* Redirect to home for unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;