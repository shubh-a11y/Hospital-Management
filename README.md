<div align="center">

# 🏥 Hospital Management System

### Complete Healthcare Operations Management Platform

[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

**A comprehensive web-based solution for managing hospital operations including patient records, inventory management, billing, and administrative functions.**

### 🎥 [Watch Demo Video](https://youtu.be/H08UPDzBQUk)

</div>

---

## 📖 Table of Contents

- [Screenshots](#screenshots)
- [About The Project](#about-the-project)
- [Vision](#vision)
- [Key Features](#key-features)
- [OOP Principles](#oop-principles-implementation)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Future Scope](#future-scope)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## 📸 Screenshots
![WhatsApp Image 2025-11-01 at 20 20 49_2b6b4e41](https://github.com/user-attachments/assets/2ad7fb4f-0b66-4e03-8403-17ab18dbc567)
![WhatsApp Image 2025-11-01 at 20 20 49_e9abf08b](https://github.com/user-attachments/assets/628f4fd5-8f0a-45df-af02-86a720468544)
![WhatsApp Image 2025-11-01 at 20 20 50_ab5eb480](https://github.com/user-attachments/assets/0f3a931f-37b2-44f1-8228-143dae9a1c29)
![WhatsApp Image 2025-11-01 at 20 20 50_2d2af167](https://github.com/user-attachments/assets/903f3b82-7111-424c-881b-8c3dfdb2e27a)
![WhatsApp Image 2025-11-01 at 20 20 51_c6dd6ea0](https://github.com/user-attachments/assets/3ecdc319-c7ac-45a6-a102-14bbdaae21fd)
![WhatsApp Image 2025-11-01 at 20 20 52_9b8ac864](https://github.com/user-attachments/assets/fdfa61bd-0073-49b7-906a-9e51d9a7576e)
![WhatsApp Image 2025-11-01 at 20 20 56_ba8b94e6](https://github.com/user-attachments/assets/3ce7c31a-8a0f-443f-b4b6-86d58517715c)
![WhatsApp Image 2025-11-01 at 20 20 57_4f684a6b](https://github.com/user-attachments/assets/d8881c53-af4c-4719-bc90-006aa64047b5)



## 🎯 About The Project

The **Hospital Management System** is a full-stack web application designed to streamline and modernize healthcare facility operations. Built with modern Object-Oriented Programming principles, this system provides an intuitive, efficient, and scalable solution for managing the day-to-day operations of hospitals and clinics.

### The Problem We Solve

- 📋 **Manual record-keeping** leading to errors and inefficiencies
- ⏱️ **Time-consuming** patient registration and data retrieval
- 💊 **Inventory mismanagement** causing stock-outs and waste
- 💰 **Complex billing processes** prone to human error
- 🔒 **Security concerns** with traditional paper-based systems
- 📊 **Lack of real-time analytics** for informed decision-making

### Our Solution

A unified digital platform that brings together patient management, inventory tracking, billing, and analytics into one seamless experience with **role-based access control**, **real-time updates**, and **secure data management**.

---

## 🌟 Vision

To create a **modern, efficient, and user-friendly** healthcare management ecosystem where:
- ✅ Healthcare providers can **focus on patient care** rather than paperwork
- ✅ Patient records are **secure, accessible, and comprehensive**
- ✅ Inventory is **optimized** with automated alerts and tracking
- ✅ Billing is **transparent and accurate**
- ✅ Data-driven decisions are enabled through **real-time analytics**
- ✅ All stakeholders have **appropriate access** through role-based permissions

We envision a world where healthcare administration is simplified, allowing medical professionals to dedicate more time to what matters most—patient care.

---

## ⚡ Key Features

### 📊 Dashboard
- **Real-time Statistics**: Live overview of hospital operations
- **Patient Metrics**: Track admissions, discharges, and occupancy
- **Department Analytics**: Department-wise patient distribution
- **Financial Overview**: Revenue insights and financial summaries
- **Inventory Alerts**: Low stock notifications and inventory status
- **Quick Actions**: Fast access to common tasks

### 👨‍⚕️ Patient Management
- **Comprehensive Registration**: Detailed patient information capture
- **Admission Processing**: Streamlined patient admission workflow
- **Medical History**: Complete patient medical history tracking
- **Search & Filter**: Quick access to patient records
- **Multiple Views**: Card and table views for flexibility
- **Discharge Management**: Efficient patient discharge process

### 💊 Inventory Management
- **Medical Supplies Tracking**: Real-time inventory monitoring
- **Automated Alerts**: Low stock notifications and warnings
- **Value Calculation**: Automatic inventory value computation
- **Consumption Tracking**: Monitor supply usage patterns
- **Category Organization**: Organized by medical supply categories
- **Restocking Management**: Simplified reordering process

### 💰 Billing and Finance
- **Patient Billing**: Detailed billing management system
- **Revenue Tracking**: Comprehensive financial reporting
- **Payment Processing**: Multiple payment method support
- **Financial Analytics**: In-depth financial insights
- **Itemized Bills**: Transparent service, medication, and room charges
- **Payment Status**: Track payment history and outstanding balances

### 👥 User Authentication & Authorization
- **Secure Login**: JWT-based authentication system
- **Role-Based Access**: Admin, Doctor, Nurse, Receptionist roles
- **User Management**: Admin controls for user accounts
- **Profile Management**: User profile customization
- **Session Security**: Secure session management
- **Access Control**: Granular permission system

---

## 🧩 OOP Principles Implementation

This project demonstrates enterprise-level implementation of core Object-Oriented Programming principles:

### 1. **Encapsulation**
- Data and methods bundled together in components
- Private state management within classes
- Controlled access through public interfaces
- Implementation details hidden from consumers

### 2. **Abstraction**
- Complex operations simplified through abstract interfaces
- High-level APIs for database operations
- Component abstraction for reusability
- Service layer abstraction for business logic

### 3. **Inheritance**
- Base User class extended by specific roles (Doctor, Nurse, Receptionist)
- Component hierarchy with shared functionality
- Reusable base components extended for specific use cases
- Template patterns for common operations

### 4. **Polymorphism**
- Same interfaces implemented differently for various user types
- Dynamic method dispatch based on user roles
- Flexible component rendering based on context
- Adaptive UI based on user permissions

### 5. **Single Responsibility**
- Each component has one focused purpose
- Separation of concerns across modules
- Dedicated services for specific operations
- Clear module boundaries

### 6. **Composition**
- Complex behavior built by combining simpler objects
- Component composition for UI building
- Service composition for business logic
- Modular architecture for scalability

---

## 🛠️ Tech Stack

### Frontend Layer
- **Framework**: React.js 18+
- **Styling**: CSS3, HTML5
- **State Management**: React Hooks and Context API
- **Routing**: React Router (if applicable)
- **UI Components**: Custom component library
- **Authentication**: JWT-based system

### Backend Layer
- **Runtime**: Node.js with Express
- **Architecture**: REST API
- **Middleware**: Custom middleware for auth, validation, logging
- **API Design**: RESTful endpoints
- **Security**: JWT tokens, password hashing

### Database Layer
- **Database**: MongoDB
- **ODM**: Mongoose (if applicable)
- **Schema Design**: Optimized for healthcare data
- **Data Validation**: Schema-level validation
- **Indexing**: Optimized queries with proper indexing

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint (if configured)
- **Design Pattern**: MVC (Model-View-Controller)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14+ and npm
- [MongoDB](https://www.mongodb.com/) v4.4+ (local or Atlas)
- Modern web browser (Chrome, Firefox, Edge)
- Git for version control

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/shubh-a11y/Hospital-Management.git
cd Hospital-Management
```

#### 2. Install Backend Dependencies
```bash
cd OOPS_Hospital_Management/backend
npm install
```

#### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### 4. Configure Environment Variables
Create `.env` files in both backend and frontend directories if needed:

**Backend `.env`** (example):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital_db
JWT_SECRET=your_jwt_secret_key
```

**Frontend `.env`** (example):
```env
REACT_APP_API_URL=http://localhost:5000
```

#### 5. Start MongoDB
```bash
# If MongoDB is installed as a service
net start MongoDB

# Or run mongod manually
mongod --dbpath "C:\data\db"

# Or use the provided batch file
cd OOPS_Hospital_Management
.\start_mongo_and_server.bat
```

#### 6. Start Backend Server
```bash
cd OOPS_Hospital_Management/backend
npm start
```

#### 7. Start Frontend Development Server
```bash
cd ../frontend
npm start
```

#### 8. Access the Application
Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## 📱 Usage

### Default User Accounts

The system comes with pre-configured user accounts for testing:

| Username     | Password     | Role          | Type         |
|--------------|--------------|---------------|--------------|
| admin        | admin123     | Admin         | Doctor       |
| doctor       | doctor123    | User          | Doctor       |
| nurse        | nurse123     | User          | Nurse        |
| receptionist | reception123 | User          | Receptionist |

### Getting Started with the Application

#### 1. **Login**
- Navigate to the login page
- Enter your credentials from the table above
- Click "Login" to access the dashboard

#### 2. **Dashboard Overview**
- View real-time hospital statistics
- Check patient admission/discharge metrics
- Monitor inventory alerts
- Review financial summaries

#### 3. **Patient Management**
- **Add New Patient**: Click "Add Patient" and fill in the form
- **Search Patients**: Use the search bar to find patient records
- **View Details**: Click on a patient card for detailed information
- **Update Records**: Edit patient information as needed
- **Discharge Patient**: Process patient discharge with billing

#### 4. **Inventory Management**
- **View Inventory**: Browse all medical supplies
- **Add Items**: Click "Add Item" to register new supplies
- **Update Stock**: Modify quantities when restocking
- **Set Alerts**: Configure low-stock alert thresholds
- **Track Usage**: Monitor consumption patterns

#### 5. **Billing Operations**
- **Create Bill**: Generate itemized bills for patients
- **Process Payment**: Record payments and update status
- **View History**: Access billing history and reports
- **Export Records**: Download financial reports

#### 6. **User Management** (Admin Only)
- **Add Users**: Create new user accounts
- **Assign Roles**: Set appropriate role and permissions
- **Manage Access**: Enable/disable user accounts
- **View Activity**: Monitor user actions and logs

---

## 💻 Project Structure

```
Hospital-Management/
├── OOPS_Hospital_Management/
│   ├── backend/
│   │   ├── models/              # Database models
│   │   ├── routes/              # API routes
│   │   ├── controllers/         # Business logic
│   │   ├── middleware/          # Auth & validation
│   │   ├── config/              # Configuration files
│   │   ├── checkdb.js           # Database connection check
│   │   ├── fixuser.js           # User data utilities
│   │   ├── server.js            # Main server file
│   │   └── package.json
│   │
│   ├── frontend/
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   ├── manifest.json
│   │   │   └── robots.txt
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── Patients.js
│   │   │   │   ├── Inventory.js
│   │   │   │   ├── Sales.js
│   │   │   │   ├── Reports.js
│   │   │   │   ├── Users.js
│   │   │   │   ├── Login.js
│   │   │   │   ├── UserDashboard.js
│   │   │   │   ├── PrivateRoute.js
│   │   │   │   ├── About.js
│   │   │   │   └── Home.js
│   │   │   ├── images/          # Image assets
│   │   │   ├── AuthContext.js   # Authentication context
│   │   │   ├── config.js        # Frontend config
│   │   │   ├── App.js           # Main app component
│   │   │   ├── App.css          # Global styles
│   │   │   ├── index.js         # Entry point
│   │   │   └── index.css
│   │   └── package.json
│   │
│   ├── start_mongo_and_server.bat    # Startup script
│   ├── start_server.bat              # Server-only script
│   └── README.md
│
└── README.md                          # Main readme
```

---

## 🔮 Future Scope

### Short-term (Next 3 Months)
- [ ] Appointment scheduling system
- [ ] Email/SMS notifications for appointments and alerts
- [ ] Advanced search and filtering options
- [ ] Export functionality (PDF, Excel)
- [ ] Dark mode theme
- [ ] Mobile responsive improvements

### Medium-term (6 Months)
- [ ] Mobile application (React Native)
- [ ] Laboratory test management module
- [ ] Pharmacy integration
- [ ] Doctor scheduling and shift management
- [ ] Patient portal for self-service
- [ ] Telemedicine integration
- [ ] Advanced analytics and reporting
- [ ] Multi-language support

### Long-term (1 Year+)
- [ ] AI-powered diagnosis assistance
- [ ] Integration with medical devices (IoT)
- [ ] Electronic Health Records (EHR) integration
- [ ] Insurance claim processing
- [ ] Multi-facility support
- [ ] Data analytics and predictive modeling
- [ ] Blockchain for medical record security
- [ ] Voice-activated commands
- [ ] Integration with government health systems
- [ ] Cloud deployment with auto-scaling

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines
- Follow the existing code style and conventions
- Write clear commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

---

## 👨‍💻 Author

**Shubhang Singh**
- GitHub: [@shubh-a11y](https://github.com/shubh-a11y)
- LinkedIn: [Shubhang Singh](https://www.linkedin.com/in/shubhang-singh-28663b317/)
- Project Link: [Hospital-Management](https://github.com/shubh-a11y/Hospital-Management)

---

## 🙏 Acknowledgments

- React.js community for excellent documentation
- Node.js and Express.js communities
- MongoDB for robust database solution
- All contributors and testers who helped improve this project
- Open-source community for inspiration and resources

---

## 📊 Project Status

🟢 **Active Development** | Production Ready | Open for Contributions

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

Made with ❤️ for Healthcare

[⬆ Back to Top](#-hospital-management-system)

</div> 
