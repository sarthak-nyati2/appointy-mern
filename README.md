# Appointy — MERN Doctor Appointment System

A complete college-project MERN application with patient, doctor and admin roles.

## Features
- Patient signup/login
- Doctor login
- Admin login
- JWT authentication
- bcrypt password hashing
- MongoDB + Mongoose
- Doctor search/filter
- Appointment booking
- Cash / Stripe / Razorpay payment method selection
- Patient profile
- Doctor dashboard
- Admin dashboard
- Doctor CRUD
- Appointment status management
- Contact form
- Responsive UI

## Requirements
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI

## 1. Backend

```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

On macOS/Linux use:

```bash
cp .env.example .env
```

Backend: http://localhost:5000

## 2. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Demo Accounts

Admin:
- Email: admin@appointy.com
- Password: admin123

Seeded doctors:
- rahul@appointy.com / doctor123
- priya@appointy.com / doctor123
- amit@appointy.com / doctor123
- neha@appointy.com / doctor123
- arjun@appointy.com / doctor123
- riya@appointy.com / doctor123
- karan@appointy.com / doctor123
- anjali@appointy.com / doctor123

Patients can be created from the Signup page.

## Payment
Cash is implemented as a working booking option. Stripe and Razorpay are included as selectable payment methods and can be connected later with provider credentials.

## Project structure

backend/
- models
- routes
- middleware
- uploads
- server.js
- seed.js

frontend/
- React + Vite
- pages/components are organized in App.jsx for quick college submission
- styles.css
