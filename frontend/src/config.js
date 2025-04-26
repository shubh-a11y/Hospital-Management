// Config file for API endpoints and other settings
const API_HOST = 'http://localhost';
const DEFAULT_PORT = 5000;  // Primary port

// Ports to try in sequence
const API_PORTS = [5000, 5001, 5002, 5003];

// Create API URLs with port
const createEndpoints = (port = DEFAULT_PORT) => {
  const baseUrl = `${API_HOST}:${port}`;
  return {
    HEALTH: `${baseUrl}/api/health`,
    DASHBOARD: `${baseUrl}/api/dashboard`,
    USER_DASHBOARD: `${baseUrl}/api/user-dashboard`,
    INVENTORY: `${baseUrl}/api/inventory`,
    REPORTS: `${baseUrl}/api/reports/sales`,
    LOGIN: `${baseUrl}/api/auth/login`,
    REGISTER: `${baseUrl}/api/auth/register`,
    SALES: `${baseUrl}/api/sales`,
    ADD_ITEM: `${baseUrl}/api/inventory/add`,
    RESTOCK: `${baseUrl}/api/inventory/restock`,
    PROCESS_SALE: `${baseUrl}/api/sales`
  };
};

// Default API endpoints with the primary port
const API_ENDPOINTS = createEndpoints();

export default {
  API_HOST,
  API_PORTS,
  API_ENDPOINTS,
  createEndpoints
}; 