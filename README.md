# Finance Data Processing and Access Control

A comprehensive MERN-stack (MongoDB, Express, React, Node.js) application designed for managing financial records with robust Role-Based Access Control (RBAC) and interactive data visualizations.

---

## 🚀 Key Features

### 🔐 Security & Access Control
- **Authentication**: Secure login and signup powered by **JWT (JSON Web Tokens)** and **Bcrypt.js** password hashing.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions using custom middleware.
  - **Admin**: Full access to user management (view, update roles, register new users) and financial data.
  - **Manager/User**: Varying levels of access to read, write, or delete financial records.
- **Middleware Protection**: All sensitive API routes are protected by authentication and authorization layers.
- **Security Headers**: Integrated **Helmet.js** for enhanced HTTP header security.

### 📊 Finance Dashboard
- **Real-time Analytics**: Instant calculation of total Income, Expenses, and current Balance.
- **Data Visualization**: Interactive charts powered by **Recharts**:
  - **Expense Breakdown**: Pie charts showing spending across different categories.
  - **Financial Trends**: Area/Line charts visualizing income and expense flow over time.
- **Activity Log**: View the most recent financial transactions at a glance.

### 📝 Record Management
- **Full CRUD**: Create, Read, and Delete financial records with ease.
- **Smart Filtering**: Filter records by type (Income/Expense), category, and date range.
- **Detailed Tracking**: Each record includes amount, category, date, and optional notes.

### 👥 User Management (Admin Only)
- **User Directory**: View a list of all registered users.
- **Role Updates**: Modify user roles (e.g., promoting a User to Admin).
- **Account Control**: Update user status and details directly from the admin panel.

---

## 🛠️ Technology Stack

### Frontend
- **React.js** (Vite-powered)
- **React Router Dom** (Navigation)
- **Recharts** (Data Visualization)
- **Lucide React** (Modern Iconography)

### Backend
- **Node.js** & **Express.js**
- **MongoDB** with **Mongoose ODM**
- **JWT** (Authentication)
- **Bcrypt.js** (Password Encryption)
- **Cors** & **Helmet** (Middleware)

---

## 📦 Getting Started

### Prerequisites
- **Node.js** (v18.0 or higher)
- **NPM** or **Yarn**
- **MongoDB Atlas** account or a local MongoDB instance

### 1. Clone the Repository
```bash
git clone https://github.com/akhilofindia/Finance-Data-Processing-and-Access-Control.git
cd Finance-Data-Processing-and-Access-Control
```

### 2. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add your credentials by following the structure in the provided `.env.example` file.

### 3. Frontend Configuration
1. Return to the root directory:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## 🚀 Running the Application

### Start the Backend
```bash
cd backend
npm run dev # Uses nodemon for auto-restart
```

### Start the Frontend
```bash
# From the root directory
npm run dev
```
The application will be live at `http://localhost:5173`.

---

## 🛣️ API Reference

### Authentication
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/login` | Authenticate user & get token | Public |
| POST | `/api/auth/signup` | Register a new account | Public |
| GET | `/api/auth/users` | List all registered users | Admin |
| PUT | `/api/auth/users/:id` | Update user role/status | Admin |

### Financial Records
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/api/records` | Fetch filtered records | Authenticated |
| GET | `/api/records/stats` | Get dashboard analytics | Authenticated |
| POST | `/api/records` | Add a new transaction | Manager/Admin |
| DELETE | `/api/records/:id` | Remove a record | Manager/Admin |

---

## 📜 License
This project is licensed under the **ISC License**.

---
Built with ❤️ by [Akhil](https://github.com/akhilofindia)