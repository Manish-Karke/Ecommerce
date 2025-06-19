# 🛒 MERN E-commerce App

A full-stack E-commerce application built using the MERN stack. This project is developed in **three phases** to progressively build functionality from basic UI to full backend integration.

---

## ✅ Tech Stack Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **State Management**: Context API / Redux (Optional)
- **Other Tools**: Axios, JWT, bcrypt, Multer (for image upload)

---

## Phase-wise Development Breakdown

### ✅ Phase 1: Frontend - React App Setup & UI

**Objective:** Build a functional UI with static data and routes.

- [✅] Setup React project with Tailwind or CSS
- [✅] Create component structure (Navbar, ProductCard, Footer, etc.)
- [✅] Routing using React Router (Home, Products, Cart, Login)
- [✅] Sample product listing using dummy data
- [✅] Use Axios to make API calls
- ***

### Phase 2: Backend - REST API with Node & Express

**Objective:** Build the backend and test APIs using Postman.

- [✅] Setup Node.js + Express project
- [✅] Connect MongoDB using Mongoose
- [✅] Create models (User, Product, Order, Cart)
- [ ] REST APIs for authentication (register/login)
- [ ] Product CRUD APIs
- [ ] Use JWT for user auth
- [ ] Secure routes with middleware
- [ ] Test APIs with Postman
- [ ] Practice error handling and validation

---

### Phase 3: Integrate Frontend + Backend

**Objective:** Connect React frontend with the backend APIs.

- [ ] Add-to-cart UI logic using Context API or useState
- [ ] Store user token in localStorage
- [ ] Protect routes (auth-based rendering)
- [ ] Fetch and display products from backend
- [ ] Login & Signup with real data
- [ ] Add product to cart and checkout (basic flow)
- [ ] Admin route for managing products
- [ ] File/image upload using Multer (optional)

---

## Folder Structure (Basic)

```
/client       → React frontend
/server       → Node/Express backend
  └── models
  └── routes
  └── controllers
  └── middleware
```

---

## Future Improvements (Optional)

- [ ] Implement Redux for better state management
- [ ] Payment gateway integration (khalti)
- [ ] Order history, email notifications
- [ ] Search, filters, and pagination
- [ ] Admin dashboard
- [ ] Dockerize the project

---

## Practiced Concepts

✅ React Fundamentals  
✅ React Router  
✅ RESTful APIs  
✅ MongoDB & Mongoose  
✅ Express Routing  
✅ JWT Authentication  
✅ API Integration  
✅ Environment Variables  
✅ Modular Code Structure

---

## Installation

### Frontend

```bash
cd client
npm install
npm start
```

### Backend

```bash
cd server
npm install
npm run dev
```

> Make sure to add your MongoDB URI and JWT secret to a `.env` file
