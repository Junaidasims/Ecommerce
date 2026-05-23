# 🚀 Nexus Store — Full-Stack E-Commerce Platform

A premium, full-stack, responsive e-commerce web application featuring a stunning glassmorphic dark UI, role-based access, JWT authentication, and MongoDB database integration using Mongoose.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), React Router v6, Lucide Icons, Glassmorphic CSS Design.
- **Backend**: Node.js, Express.js, REST APIs.
- **Database**: MongoDB, Mongoose ODM.
- **Authentication**: Stateless JSON Web Tokens (JWT) & `bcryptjs` password hashing.
- **Deployment**:
  - **Frontend**: Vercel or Netlify (fully prepared with SPA rewrites).
  - **Backend**: Render, Railway, or Heroku.
  - **MongoDB**: Cloud-hosted MongoDB (MongoDB Atlas).

---

## 📊 Database Schema

The database consists of the following Collections defined with Mongoose schemas:

1. **`User`**:
   - `username`: String (Unique, Trimmed, Min length 3)
   - `password`: String (Hashed via bcrypt)
   - `role`: String ('user', 'admin') (Default: 'user')
   - Timestamps (`createdAt`, `updatedAt`)

2. **`Product`**:
   - `name`: String (Trimmed)
   - `description`: String (Default: '')
   - `price`: Number (Min: 0)
   - `stock`: Number (Default: 0)
   - `image_url`: String (Default high-res tech placeholder)
   - Timestamps (`createdAt`, `updatedAt`)

3. **`Order`**:
   - `user_id`: ObjectId (Ref -> `User`)
   - `items`: Array of Nested Items:
     - `product_id`: ObjectId (Ref -> `Product`)
     - `quantity`: Number (Min: 1)
     - `price`: Number (Preserves historical purchase prices)
   - `total`: Number (Min: 0)
   - `status`: String ('pending', 'processing', 'shipped', 'delivered', 'cancelled') (Default: 'pending')
   - Timestamps (`createdAt`, `updatedAt`)

---

## 🖥️ Local Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v18+)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed and running locally

---

### Step 1: Backend Configuration & Execution
1. Navigate to the `backend/` folder.
2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and fill in your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecom_db
   JWT_SECRET=supersecretjwtkeyforlocaldevelopment12345
   NODE_ENV=development
   ```
4. Install all server dependencies:
   ```bash
   npm install
   ```
5. **Sync & Seed database** with sample premium products and testing users:
   ```bash
   npm run seed
   ```
6. Launch the server in hot-reload development mode:
   ```bash
   npm run dev
   ```
   *Your backend API will now be running at: **`http://localhost:5000`***

---

### Step 2: Frontend Configuration & Execution
1. Navigate to the `frontend/` folder.
2. Install all frontend dependencies:
   ```bash
   npm install
   ```
3. Set up the development environment endpoints:
   - Ensure the `.env` file contains `VITE_API_URL=http://localhost:5000`.
4. Launch the local React server:
   ```bash
   npm run dev
   ```
   *Your web application frontend will now be open at: **`http://localhost:5173`***

---

## 🧪 Testing and Walkthrough

### 🔑 Demo Accounts Provided:
- **Administrator Role**:
  - **Username**: `admin`
  - **Password**: `adminpassword`
- **Standard User Role**:
  - **Username**: `user`
  - **Password**: `userpassword`

### 🛒 Core Sandbox Walkthrough:
1. **Explore Products**: Open the home page. Browse the high-end mechanical keyboard, gaming headphones, ergonomic seats, and smart wear.
2. **Standard Checkout Flow**:
   - Add items to the cart. Click the floating shopping bag to view cart quantities.
   - Adjust quantities or delete lines.
   - Press "Proceed to Checkout". You will be redirected to the **Login Page** (if not signed in).
   - Enter `user` and `userpassword`.
   - Complete checkout by entering your mock delivery address and card details.
   - Click "Complete Order". The system will process transactions, securely decrement product stocks, and display an Order Confirmation card.
   - Navigate to the **Profile Dropdown** in the top-right corner and click **My Orders** to review active status tracking.
3. **Admin Dashboard Controls**:
   - Log out of your user account, open the Profile Dropdown, and log in using `admin` / `adminpassword`.
   - Open the Profile Dropdown and click **Admin Control Center**.
   - **Operational Stats**: View live aggregate statistics like Total Revenue, Sales counts, catalog items, and pending list cues.
   - **Catalog CRUD**: Click "Manage Products". Run the dynamic modal forms to quickly Add, Edit (name, price, stock, images), or Delete marketplace items.
   - **Shipments Management**: Click "Process Orders". Expand order details to view line items. Select status options from the drop-down menu (e.g. from `Pending` to `Shipped` or `Delivered`) to immediately update client ledger feeds.
   - **Stock Restoration**: If you set an order's status to `Cancelled`, the system will automatically restore the purchased items' quantities back to the product database stock!

---

## 🌐 Production Deployment Guide

Ready to deploy online? Follow these steps:

### 1. MongoDB Database (Cloud)
- Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Create a shared cluster (free tier).
- Under Database Access, create a database user with read/write privileges.
- Under Network Access, allow access from anywhere (`0.0.0.0/0`) since cloud hosting services (like Render) change IPs dynamically.
- Retrieve your connection string (e.g., `mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/ecom_db?retryWrites=true&w=majority`).

### 2. Backend API (Render / Railway)
- Push your codebase to a GitHub repository.
- Link your repo on **Render** (as a Web Service) or **Railway**.
- Set the build command to `npm install` and start command to: `npm start`.
- Define **Environment Variables** in their settings panel:
  - `MONGODB_URI` = (Your MongoDB Atlas connection string).
  - `JWT_SECRET` = (Generate a secure random key).
  - `NODE_ENV` = `production`.
  - `FRONTEND_URLS` = (Optional, comma-separated list of allowed frontend domains. If not set, it defaults to a fail-safe mode allowing the requested origin).
- Note down your deployed API live endpoint (e.g., `https://nexus-ecom-api.onrender.com`).

### 3. Frontend App (Vercel)
- Create a project on **Vercel** and connect your GitHub repository.
- Set the root directory to `frontend`.
- Specify Build settings (default: `npm run build` using Vite is automatically detected).
- Add the **Environment Variable**:
  - `VITE_API_URL` = (Your deployed backend API URL, without a trailing slash).
- Deploy! Vercel will build the React bundles, leverage the `vercel.json` SPA routing config to handle React Router client side routing, and provide a secure, HTTPS live URL!
