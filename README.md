# Hospital Management System

A comprehensive web-based Hospital Management System built using React for the frontend, Node.js with Express for the backend, and MongoDB for the database.

## 🏥 Overview

MedCare Hospital Management System provides a complete solution for managing hospital operations including patient records, inventory management, billing, and administrative functions. The system is designed with modern Object-Oriented Programming principles to ensure maintainability, scalability, and extensibility.

## ✨ Features

### 📊 Dashboard
- Real-time overview of hospital statistics
- Patient admission and discharge metrics
- Department-wise patient distribution
- Revenue insights and financial overview
- Inventory status and low stock alerts

### 👨‍⚕️ Patient Management
- Comprehensive patient registration and information management
- Patient admission and discharge processing
- Medical history tracking
- Search and filter functionality for quick access to patient records
- Card and table views for different information needs

### 🗓️ Appointment Scheduling
- Book, update, or cancel appointments
- View appointment calendar
- Doctor availability management
- Appointment reminder system

### 💊 Inventory Management
- Medical supplies tracking and management
- Low stock alerts and notifications
- Inventory value calculation
- Consumption and restocking management
- Categorized inventory organization
- Search and filter capabilities

### 💰 Billing and Finance
- Patient billing management with itemized bills
- Revenue tracking and reporting
- Payment processing and status tracking
- Financial analytics and summaries
- Service, medication, and room charge management

### 👥 User Authentication
- Secure login system with JWT
- Role-based access control (Admin, Doctor, Nurse, Receptionist)
- User profile management

## 🧩 OOP Principles Implementation

This project demonstrates the implementation of core Object-Oriented Programming principles:

1. **Encapsulation**: Data and methods are bundled together in classes with controlled access, hiding implementation details.
2. **Abstraction**: Complex operations are simplified through abstract interfaces, presenting only necessary information.
3. **Inheritance**: Base User class extended by specific roles (Doctor, Nurse, Receptionist).
4. **Polymorphism**: Same interfaces implemented differently for various user types.
5. **Single Responsibility**: Each component has a focused purpose and responsibility.
6. **Composition**: Complex behavior is built by combining simpler objects and functions.

## 🛠️ Technology Stack

### Frontend
- React.js, CSS3, HTML5
- State Management: React Hooks and Context API
- Authentication: JWT-based system

### Backend
- Node.js with Express
- REST API architecture

### Database
- MongoDB for data persistence
- Proper schema design for healthcare data

### Design Pattern
- Component-based architecture
- MVC (Model-View-Controller) pattern

## 🚀 Installation and Setup

```bash
# Clone the repository
git clone https://github.com/shubh-a11y/Hospital-Management.git

# Navigate to project directory
cd Hospital-Management

# Install backend dependencies
cd OOPS_Hospital_Management/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Start the MongoDB and backend server (from root directory)
cd ..
./start_mongo_and_server.bat  # Windows
# OR use the start_server.bat if MongoDB is already running

# Start frontend (in a separate terminal)
cd frontend
npm start
```

## 📱 Usage

After starting the development server:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Default Users

The system comes with pre-configured users:

| Username     | Password     | Role          | Type         |
|--------------|--------------|---------------|--------------|
| admin        | admin123     | Admin         | Doctor       |
| doctor       | doctor123    | User          | Doctor       |
| nurse        | nurse123     | User          | Nurse        |
| receptionist | reception123 | User          | Receptionist |

Navigate through the sidebar to access different modules of the system:
- Dashboard: Overview of hospital statistics
- Patients: Patient management interface
- Appointments: Scheduling interface
- Inventory: Medical supplies management
- Billing: Financial management
- Reports: Financial and operational reports
- Users: User management (admin only)

## 💻 Project Structure

```
OOPS_Hospital_Management/
├── backend/
│   ├── checkdb.js
│   ├── fixuser.js
│   ├── package.json
│   ├── server.js
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── Inventory.js
│   │   │   ├── Patients.js
│   │   │   ├── SideBar.js
│   │   │   └── ...
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── AuthContext.js
│   │   ├── config.js
│   │   └── ...
│   ├── package.json
│   └── ...
├── public/
│   └── images/
├── start_mongo_and_server.bat
├── start_server.bat
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Shubhang - [GitHub Profile](https://github.com/shubh-a11y)
