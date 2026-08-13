# 🌾 KisanSetu

> **Farm to Market — Connecting Farmers Directly with Buyers**

KisanSetu is a full-stack MERN agriculture marketplace that enables farmers to list their agricultural products and buyers to discover and order products directly from farmers.

The platform provides role-based experiences for **Farmers** and **Buyers**, with secure authentication, product management, marketplace browsing, order management, and farmer-side order processing.

---

## 🚀 Live Demo

🌐 **Live Application:**  
https://kisan-setu-gray.vercel.app

💻 **GitHub Repository:**  
https://github.com/ankush-13/KisanSetu

---

## ✨ Features

### 👨‍🌾 Farmer

- 🔐 Secure farmer registration and login
- ➕ Add agricultural products
- 📦 Manage listed products
- ✏️ Edit product details
- 🗑️ Delete products
- 📊 Farmer dashboard
- 📈 View available stock
- 🛒 View received orders
- ✅ Accept orders
- ❌ Reject orders
- ✔️ Complete orders
- 📍 Manage product location and delivery information

### 🛒 Buyer

- 🔐 Secure buyer registration and login
- 🔎 Browse agricultural products
- 🏷️ View product category and pricing
- 📦 Place product orders
- 📍 Provide delivery address
- 🛍️ View personal orders
- 📊 Track order status

### 🔒 Authentication & Security

- JWT-based authentication
- Protected API routes
- Role-based access control
- Farmer and Buyer specific navigation
- Secure password hashing with bcrypt
- Environment-based configuration

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- Lucide React
- React Hot Toast
- CSS

### Backend

- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcrypt.js
- CORS

### Database

- MongoDB
- Mongoose
- MongoDB Atlas

### Cloud & Tools

- Cloudinary
- Git
- GitHub
- Postman
- VS Code
- Vercel
- Render

---

## 🏗️ Application Architecture

```text
                    ┌─────────────────────┐
                    │      Buyer          │
                    │                     │
                    │ Browse Products     │
                    │ Place Orders        │
                    │ Track Orders        │
                    └──────────┬──────────┘
                               │
                               ▼
┌───────────────────────────────────────────────────┐
│                  React Frontend                   │
│                     Vite                          │
│                                                   │
│  Home │ Marketplace │ Dashboard │ My Orders      │
└──────────────────────┬────────────────────────────┘
                       │
                    Axios
                       │
                       ▼
┌───────────────────────────────────────────────────┐
│                Express Backend                    │
│                                                   │
│ Authentication │ Products │ Orders │ Users       │
└──────────────────────┬────────────────────────────┘
                       │
                       ▼
                ┌───────────────┐
                │    MongoDB    │
                │    Atlas      │
                └───────────────┘
                       │
                       ▼
                ┌───────────────┐
                │  Cloudinary   │
                │ Image Storage │
                └───────────────┘