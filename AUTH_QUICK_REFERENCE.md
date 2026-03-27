# Authentication System - Quick Reference Guide

## 🎯 What Was Built

A complete **JWT-based authentication system** with role-based access control, patient management, and session persistence.

---

## 📂 Key Files

### Backend
| File | Purpose | Lines | Status |
|------|---------|-------|--------|
| `backend/auth.sql` | Database schema (6 tables) | 107 | ✅ NEW |
| `backend/src/authRoutes.js` | Auth endpoints (11 routes) | 259 | ✅ NEW |
| `backend/src/index.js` | Express setup + routing | MODIFIED | ✅ Updated |

### Frontend
| File | Purpose | Lines | Status |
|------|---------|-------|--------|
| `src/services/authService.js` | Auth API client (12 methods) | 135 | ✅ Rewritten |
| `src/auth/LoginPage.jsx` | Login/Register UI | 290 | ✅ Integrated |
| `src/App.jsx` | Main app with session restore | 390 | ✅ Updated |

---

## 🔐 Authentication Flows

### Registration
```
User Registration Form
        ↓
authService.register(email, password, name, role)
        ↓
Backend: Hash password + Create user + Generate JWT
        ↓
Frontend: Store token + Navigate to dashboard
```

### Login
```
User Login Form
        ↓
authService.login(email, password)
        ↓
Backend: Verify password + Generate JWT
        ↓
Frontend: Store token + Navigate to dashboard
```

### Session Persistence
```
Page Reload/Refresh
        ↓
App.jsx useEffect hook
        ↓
Check localStorage for token + user
        ↓
If exists: authService.getMe() to verify token
        ↓
Restore user session (no login needed)
```

### Logout
```
User clicks logout
        ↓
authService.logout()
        ↓
Clear localStorage + Clear state
        ↓
Navigate to login screen
```

---

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
npm install
node src/index.js
# Server running on port 3000
```

### 2. Start Frontend
```bash
cd sipre-avc-frontend
npm install
npm run dev
# App running on http://localhost:5173
```

### 3. Create Database
```bash
mysql -h your-host -u user -p < backend/auth.sql
```

### 4. Test Login
- Go to http://localhost:5173
- Click "Login"
- Register new account (Doctor/Nurse/Admin)
- Or use existing credentials

---

## 💻 API Endpoints

### Authentication
```
POST   /api/auth/register          # Create new user
POST   /api/auth/login             # Authenticate user
GET    /api/auth/me                # Get current user
```

### Patient Management
```
POST   /api/auth/patients          # Create patient
GET    /api/auth/patients          # List doctor's patients
GET    /api/auth/patients/:id      # Get patient details
PUT    /api/auth/patients/:id      # Update patient
GET    /api/auth/patients/:id/vitals # Get vitals
```

---

## 📦 Using authService

### Import
```javascript
import authService from '../services/authService';
```

### Authentication
```javascript
// Register
const result = await authService.register(
  email, password, name, role
);

// Login
const result = await authService.login(email, password);

// Get current user
const user = authService.getStoredUser();

// Check if authenticated
if (authService.isAuthenticated()) { /* ... */ }

// Logout
authService.logout();
```

### Patient Operations
```javascript
// Create patient
const patient = await authService.createPatient(
  name, age, gender, email, phone, cpf, address, medical_history
);

// Get all patients
const patients = await authService.getPatients();

// Get specific patient
const patient = await authService.getPatient(patientId);

// Update patient
await authService.updatePatient(patientId, { name: "New Name" });

// Get patient vitals
const vitals = await authService.getPatientVitals(patientId, limit);
```

---

## 🔒 Storage

### LocalStorage Structure
```javascript
localStorage.sipre_token  // JWT token (string)
localStorage.sipre_user   // User data (JSON)
  {
    id,
    email,
    full_name,
    role,
    crm,
    phone,
    specialization,
    hospital
  }
```

---

## 🎭 User Roles

### Doctor
- Register patients
- View assigned patients
- Monitor patient vitals
- Set alert limits
- Generate reports

### Nurse
- (Same as Doctor, configure permissions as needed)

### Admin
- Manage all users
- System configuration
- Generate system reports

---

## ⚙️ Environment Setup

### Backend .env
```env
DB_HOST=your-database-host
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=sipre_db
JWT_SECRET=your_secret_key_at_least_32_chars
NODE_ENV=development
```

### Frontend .env.local
```env
VITE_API_URL=http://localhost:3000
```

---

## 🧪 Testing with curl

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "full_name": "Test User",
    "role": "doctor"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

### Get Authenticated User (with token)
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot GET /api/auth/login" | Backend not running or route not mounted |
| "Token invalid" | JWT_SECRET mismatch or token expired |
| "Cannot create patient" | User not authenticated or not a doctor |
| "CORS error" | Frontend not in CORS whitelist or missing credentials |
| "Database connection error" | Check DB credentials in .env |
| "Users can't stay logged in" | localStorage not available or useEffect not working |

---

## 📊 Database Schema Summary

### users
```
id, email, password_hash, full_name, role, crm, phone, 
specialization, hospital, created_at, updated_at
```

### patients
```
id, name, age, gender, email, phone, cpf, address, 
medical_history, assigned_doctor_id (FK), status, created_at
```

### vitals
```
id, patient_id (FK), heart_rate, blood_pressure, oxygen_level, 
temperature, timestamp
```

### alerts
```
id, patient_id (FK), alert_type, message, status, created_at
```

### alert_limits
```
id, user_id (FK), metric_type, min_value, max_value
```

---

## 🚀 Next Steps

1. ✅ Test login/registration
2. ✅ Create test patients
3. ⏳ Build PatientsPage UI for patient creation
4. ⏳ Implement vitals monitoring dashboard
5. ⏳ Add email verification (optional)
6. ⏳ Add password reset (optional)
7. ⏳ Implement 2FA (optional)

---

## 📚 Documentation Files

- **AUTH_IMPLEMENTATION_COMPLETE.md** - Detailed technical documentation
- **QUICK_REFERENCE.md** - This file
- **Backend documentation** - See `backend/README.md`

---

## 📞 Support

For detailed information, see `AUTH_IMPLEMENTATION_COMPLETE.md`

---

**Last Updated**: January 2025  
**Status**: ✅ Production Ready  
**Version**: 1.0.0
