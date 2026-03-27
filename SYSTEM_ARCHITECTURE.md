# 🏗️ SIPRE-AVC System Architecture

## High-Level System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SIPRE-AVC SYSTEM                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────┐         ┌──────────────────────┐           │
│  │   FRONTEND (React)   │         │  BACKEND (Express)   │           │
│  │  http://localhost    │◄────────►│ http://localhost     │           │
│  │       :5175          │   Axios  │      :3000           │           │
│  ├──────────────────────┤         ├──────────────────────┤           │
│  │ • LoginPage          │         │ • Auth Routes        │           │
│  │ • Dashboard          │         │ • Patient Routes     │           │
│  │ • Patients Page      │         │ • Verification MW    │           │
│  │ • Vitals Page        │         │ • Error Handling     │           │
│  │ • authService        │         │ • Database Queries   │           │
│  │ • localStorage       │         │ • JWT Generation     │           │
│  └──────────────────────┘         └──────────────────────┘           │
│           ▲                                 ▲                         │
│           │                                 │                         │
│           └─────────────────┬───────────────┘                         │
│                             │                                         │
│                      JWT Token & Data                                │
│                             │                                         │
│                    ┌────────▼────────┐                               │
│                    │   MySQL Database │                              │
│                    │   (Aiven Hosted) │                              │
│                    ├─────────────────┤                               │
│                    │ • users          │                              │
│                    │ • patients       │                              │
│                    │ • vitals         │                              │
│                    │ • alerts         │                              │
│                    │ • alert_limits   │                              │
│                    │ • sessions       │                              │
│                    └──────────────────┘                              │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                   AUTHENTICATION FLOW                                │
└─────────────────────────────────────────────────────────────────────┘

NEW USER REGISTRATION:
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│              │      │              │      │              │
│   Frontend   │─────►│  Backend     │─────►│  Database    │
│  (Register   │      │  (validate   │      │  (insert     │
│   form)      │      │   & hash)    │      │   user)      │
│              │      │              │      │              │
└──────────────┘      └──────────────┘      └──────────────┘
      │                     │                     │
      │                     ▼                     │
      │              ┌──────────────┐             │
      │              │ Hash password │             │
      │              │ Generate JWT  │             │
      │              │ Create limits │             │
      │              └──────────────┘             │
      │                     │                     │
      │◄────────────────────┴─────────────────────┤
      │ (token + user data)
      ▼
  Store token in localStorage
  Navigate to dashboard


EXISTING USER LOGIN:
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│              │      │              │      │              │
│   Frontend   │─────►│  Backend     │─────►│  Database    │
│  (Login      │      │  (find user  │      │  (query      │
│   form)      │      │   & verify)  │      │   user)      │
│              │      │              │      │              │
└──────────────┘      └──────────────┘      └──────────────┘
      │                     │
      │                     ▼
      │              ┌──────────────┐
      │              │ Verify pass  │
      │              │ with bcrypt   │
      │              │ Generate JWT  │
      │              └──────────────┘
      │                     │
      │◄────────────────────┤
      │ (token + user data)
      ▼
  Store token in localStorage
  Axios intercepts & injects token
  Navigate to dashboard


SESSION PERSISTENCE (Page Reload):
┌──────────────────────────────────┐
│                                  │
│   App mounts (page reload)       │
│                                  │
└─────────────┬────────────────────┘
              │
              ▼
      ┌───────────────┐
      │ useEffect()   │
      │ hook runs     │
      └───────┬───────┘
              │
              ▼
      ┌─────────────────────┐
      │ Check localStorage  │
      │ for token + user    │
      └───────┬─────────────┘
              │
         ┌────┴──────────────┐
         │                   │
         ▼ Token found       ▼ No token
    ┌─────────────┐     ┌──────────────┐
    │ Call        │     │ Show login   │
    │ getMe()     │     │ screen       │
    │ to verify   │     │              │
    └────┬────────┘     └──────────────┘
         │
    ┌────┴──────────────┐
    │ Valid? Yes        │ Valid? No
    │                   │
    ▼                   ▼
Stay on dashboard   Logout & show login
Fetch patients
Restore session
```

---

## 🔄 Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                         API REQUEST FLOW                            │
└────────────────────────────────────────────────────────────────────┘

Component calls:
authService.getPatients()
    │
    ▼
Axios intercepts request
    │
    ├─► Add: Authorization: Bearer JWT_TOKEN
    ├─► Add: Content-Type: application/json
    │
    ▼
Send to Backend:
GET /api/auth/patients
    │
    ▼
Backend receives
    │
    ├─► Extract token from Authorization header
    ├─► Verify token with JWT middleware
    ├─► Extract userId and userRole from token
    │
    ▼
verifyToken middleware checks:
    │
    ├─► Is token valid? ──No──► Return 401 (Unauthorized)
    │                              │
    │                              ▼
    │                          Response interceptor
    │                          catches 401 → logout()
    │
    ├─ Yes ─► Continue to route handler
    │
    ▼
Route handler:
    │
    ├─► Query database for patients where assigned_doctor_id = userId
    ├─► Get 5 most recent patients
    ├─► Return patient list
    │
    ▼
Response sent to Frontend:
[
  { id: 1, name: "João", age: 65, status: "active" },
  { id: 2, name: "Maria", age: 58, status: "active" }
]
    │
    ▼
Frontend receives response
    │
    ├─► JSON parsed
    ├─► State updated (setPatientsData)
    ├─► Component re-renders
    ├─► UI displays patient list
    │
    ▼
User sees updated patients
```

---

## 📊 Database Relationships

```
┌──────────────────────────────────────────────────────────────┐
│                    DATABASE SCHEMA                            │
└──────────────────────────────────────────────────────────────┘

users (1) ◄──────────────────────────► (Many) patients
  │ id                                         │ id
  │ email                                      │ name
  │ password_hash                              │ assigned_doctor_id (FK)
  │ full_name                                  │ email
  │ role                                       │ phone
  │ crm                                        │ cpf
  │ phone                                      │ status
  │ specialization                             └─────────────┐
  │ hospital                                                  │
  │                                                           │
  └────────────────┬──────────────────────────────────────────┘
                   │
                   │ (1) users ◄─────────────────────► (Many) vitals
                   │                                        │
                   │                                        │ id
                   │                                        │ patient_id (FK)
                   │                                        │ heart_rate
                   │                                        │ blood_pressure
                   │                                        │ oxygen_level
                   │                                        │ temperature
                   │                                        │ timestamp
                   │
                   │ (1) users ◄─────────────────────► (Many) alert_limits
                   │                                        │
                   │                                        │ id
                   │                                        │ user_id (FK)
                   │                                        │ metric_type
                   │                                        │ min_value
                   │                                        │ max_value
                   │
                   │ (1) users ◄─────────────────────► (Many) sessions
                                                            │
                                                            │ id
                                                            │ user_id (FK)
                                                            │ token
                                                            │ expires_at

patients (1) ◄──────────────────────► (Many) alerts
      │ id                                    │ id
      │ name                                  │ patient_id (FK)
      │ age                                   │ alert_type
      │ status                                │ message
      │                                       │ status
      └───────────────────────────────────────┘
```

---

## 🔐 Security Layer Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE                            │
└────────────────────────────────────────────────────────────────────┘

Frontend:
┌─────────────────────────────────────┐
│ LocalStorage (Token Storage)        │
│ sipre_token = "JWT..."              │
│ sipre_user = {id, email, role}      │
│                                     │
│ Axios Interceptor                   │
│ ├─ Add token to header              │
│ └─ Catch 401 → logout               │
│                                     │
│ Form Validation                     │
│ ├─ Email format check               │
│ ├─ Password length check            │
│ └─ Required field validation        │
└─────────────────────────────────────┘

Network:
┌─────────────────────────────────────┐
│ HTTPS (Production only)             │
│ CORS Headers (Allow frontend)       │
│ Authorization Bearer token          │
└─────────────────────────────────────┘

Backend:
┌─────────────────────────────────────┐
│ Route Middleware                    │
│ ├─ Extract token from header        │
│ ├─ Verify JWT signature             │
│ ├─ Check token expiry               │
│ ├─ Extract userId & role            │
│ └─ Pass to route handler            │
│                                     │
│ Password Security                   │
│ ├─ bcryptjs hashing (10 rounds)     │
│ ├─ Automatic salting                │
│ └─ Never store plain text           │
│                                     │
│ Input Validation                    │
│ ├─ Email uniqueness                 │
│ ├─ SQL injection prevention         │
│ └─ Data type checking               │
│                                     │
│ Error Handling                      │
│ ├─ No sensitive info in errors      │
│ ├─ Proper HTTP status codes         │
│ └─ Logging for debugging            │
└─────────────────────────────────────┘

Database:
┌─────────────────────────────────────┐
│ Encrypted passwords (bcrypt)        │
│ JWT stored (no plain tokens)        │
│ Foreign key constraints             │
│ Transaction support                 │
│ Row-level access control            │
└─────────────────────────────────────┘
```

---

## 📱 User Journey Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      DOCTOR USER JOURNEY                             │
└─────────────────────────────────────────────────────────────────────┘

Start
  │
  ▼
Open App (http://localhost:5175)
  │
  ▼
[Decision] Already logged in?
  │
  ├─ No  ──► Login Page
  │          │
  │          ├─► Register Tab
  │          │    ├─ Fill form (email, password, name, role=doctor)
  │          │    ├─ Click Registar
  │          │    ├─ Backend creates user
  │          │    ├─ JWT generated
  │          │    └─ Stored in localStorage
  │          │
  │          └─► Login Tab
  │               ├─ Enter email & password
  │               ├─ Click Entrar
  │               ├─ Backend verifies credentials
  │               ├─ JWT generated
  │               └─ Stored in localStorage
  │
  └─ Yes ──► Dashboard
             │
             ▼
        Doctor Dashboard
             │
             ├─► View Overview
             │    ├─ Patient count
             │    ├─ Recent alerts
             │    └─ Last vitals
             │
             ├─► Go to Patients Page
             │    ├─ List all patients
             │    ├─ Create New Patient
             │    │  ├─ Fill patient form
             │    │  ├─ Submit
             │    │  └─ Patient added to database
             │    │
             │    ├─ Click Patient
             │    │  ├─ View details
             │    │  ├─ See vitals
             │    │  └─ View alerts
             │    │
             │    └─ Edit Patient
             │       ├─ Modify info
             │       └─ Save changes
             │
             ├─► Go to Vitals
             │    ├─ Select patient
             │    ├─ View vitals chart
             │    └─ See history
             │
             ├─► Go to Alerts
             │    ├─ View active alerts
             │    ├─ Acknowledge alerts
             │    └─ Set alert limits
             │
             ├─► Go to Reports
             │    ├─ Generate report
             │    └─ Export data
             │
             ├─► Go to Settings
             │    ├─ Change password
             │    ├─ Update profile
             │    └─ Set preferences
             │
             └─► Logout
                  ├─ Clear token
                  ├─ Clear user data
                  ├─ Redirect to login
                  └─ Session ended


PATIENT USER JOURNEY:

Start
  │
  ▼
Open App (http://localhost:5175)
  │
  ▼
Login (same as doctor)
  │
  ▼
Patient Dashboard
  │
  ├─► View My Health Overview
  │    ├─ Latest vitals
  │    ├─ Status indicator
  │    └─ Recent alerts
  │
  ├─► Go to Vitals
  │    ├─ View my vital signs
  │    ├─ See chart history
  │    └─ Check trends
  │
  ├─► Go to Alerts
  │    ├─ See alert notifications
  │    └─ View alert history
  │
  ├─► Go to Recommendations
  │    ├─ Diet recommendations
  │    ├─ Exercise plans
  │    └─ Health tips
  │
  ├─► Go to Settings
  │    ├─ Change password
  │    ├─ Update profile
  │    └─ Set preferences
  │
  └─► Logout
       ├─ Clear session
       └─ Return to login
```

---

## 🔄 Request/Response Cycle

```
┌─────────────────────────────────────────────────────────────────────┐
│                    REQUEST/RESPONSE CYCLE                            │
└─────────────────────────────────────────────────────────────────────┘

Example: Doctor creates a patient

1. FRONTEND
   User clicks "Create Patient"
   Component: PatientsPage
   │
   └─► authService.createPatient(
       name: "João",
       age: 65,
       gender: "M",
       ...
   )

2. AXIOS INTERCEPTOR
   Request object created
   │
   └─► Add headers:
       Authorization: Bearer eyJhbGciOi...
       Content-Type: application/json

3. NETWORK
   POST http://localhost:3000/api/auth/patients
   {
     "name": "João",
     "age": 65,
     "gender": "M",
     ...
   }

4. BACKEND - Express Router
   app.use("/api/auth", authRouter)
   │
   └─► POST /api/auth/patients → authRouter handler

5. BACKEND - Middleware
   verifyToken middleware runs
   │
   ├─ Extract token from header
   ├─ Verify signature with JWT_SECRET
   ├─ Check expiry
   ├─ Extract userId from payload
   │
   └─ req.userId = 1, req.userRole = "doctor"

6. BACKEND - Route Handler
   authRouter.post("/patients", verifyToken, async (req, res) => {
     Extract request body
     │
     Validate data
     │
     Query: INSERT INTO patients (name, age, assigned_doctor_id...)
     VALUES ("João", 65, 1...)
     │
     Return created patient
   })

7. RESPONSE
   HTTP 201 Created
   {
     "id": 10,
     "name": "João",
     "age": 65,
     "assigned_doctor_id": 1,
     "status": "active"
   }

8. AXIOS INTERCEPTOR
   Response received
   │
   ├─ Status 200-299? → Continue
   └─ Status 401? → Logout & redirect

9. FRONTEND
   Component receives data
   │
   ├─ State updates: setPatientsData([...patients, newPatient])
   ├─ Component re-renders
   ├─ UI shows "Patient created successfully"
   │
   └─ New patient appears in list
```

---

## 🗂️ File Structure

```
sipre-avc-frontend/
├── backend/
│   ├── src/
│   │   ├── authRoutes.js ...................... ✅ NEW (259 lines)
│   │   └── index.js ........................... ✅ MODIFIED
│   ├── auth.sql .............................. ✅ NEW (107 lines)
│   ├── package.json
│   └── vercel.json
│
├── src/
│   ├── services/
│   │   ├── authService.js .................... ✅ UPDATED (135 lines)
│   │   ├── api.js
│   │   └── index.js
│   │
│   ├── auth/
│   │   ├── LoginPage.jsx ..................... ✅ UPDATED (290 lines)
│   │   └── index.js
│   │
│   ├── App.jsx .............................. ✅ UPDATED (390 lines)
│   ├── main.jsx
│   │
│   ├── Doutor/
│   │   ├── DoctorDashboard.jsx
│   │   ├── PatientsPage.jsx
│   │   ├── VitalsPage.jsx (shared)
│   │   ├── AlertsPage.jsx
│   │   ├── ReportsPage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── Navigation.jsx
│   │   └── index.js
│   │
│   ├── paciente/
│   │   ├── PatientDashboard.jsx
│   │   ├── VitalsPage.jsx
│   │   ├── RecommendationsPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── index.js
│   │
│   ├── shared/
│   │   ├── components.jsx
│   │   ├── data.js
│   │   ├── styles.js
│   │   └── index.js
│   │
│   └── context/
│       └── AuthContext.jsx
│
├── public/
│
├── Documentation/
│   ├── TESTING_GUIDE_AUTH.md ................. 📖 Read First!
│   ├── PHASE_2_COMPLETE.md ................... 📖 Overview
│   ├── AUTH_QUICK_REFERENCE.md .............. 📖 Quick Ref
│   ├── AUTH_IMPLEMENTATION_COMPLETE.md ...... 📖 Detailed
│   ├── DOCUMENTATION_INDEX.md ............... 📖 Index
│   └── ... (other docs)
│
├── package.json
├── vite.config.js
└── index.html
```

---

## ⚡ Performance Metrics

```
┌─────────────────────────────────────────────────────────────┐
│             EXPECTED PERFORMANCE METRICS                     │
└─────────────────────────────────────────────────────────────┘

Registration:
├─ Form validation: ~10ms
├─ Password hashing (10 rounds): ~300-500ms
├─ Database insert: ~50-100ms
├─ JWT generation: ~10-20ms
└─ Total: ~400-700ms

Login:
├─ Database query: ~30-50ms
├─ Password comparison: ~200-300ms
├─ JWT generation: ~10-20ms
└─ Total: ~250-400ms

Patient Creation:
├─ Input validation: ~5-10ms
├─ Database insert: ~50-100ms
├─ Response generation: ~5-10ms
└─ Total: ~60-120ms

Patient List (5 patients):
├─ Database query: ~20-40ms
├─ JSON serialization: ~2-5ms
├─ Network transfer: ~10-30ms
└─ Total: ~32-75ms

Session Restoration:
├─ localStorage read: <1ms
├─ getMe() API call: ~200-400ms
├─ Component update: ~50-100ms
└─ Total: ~250-500ms
```

---

## 🚀 Scalability Considerations

```
┌─────────────────────────────────────────────────────────────┐
│           SCALABILITY & OPTIMIZATION NOTES                   │
└─────────────────────────────────────────────────────────────┘

Current:
├─ Single server instance
├─ Single database connection pool
├─ Tokens in localStorage
├─ Real-time data sync (refresh)

For Production Scaling:
├─ Load balancer (distribute requests)
├─ Database replication (master-slave)
├─ Caching layer (Redis for tokens)
├─ Session store (persistent across servers)
├─ Connection pooling optimization
├─ Rate limiting (prevent brute force)
├─ CDN for static assets
└─ API versioning for backward compatibility
```

---

This architecture provides a solid foundation for a secure, scalable healthcare monitoring system.

**Ready to deploy! 🚀**
