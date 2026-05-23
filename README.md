# 🚀 Nexus Store — Full-Stack E-Commerce Platform

A premium, full-stack, responsive e-commerce web application featuring a stunning glassmorphic dark UI, role-based access, JWT authentication, and MySQL database integration using Sequelize ORM.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), React Router v6, Lucide Icons, Glassmorphic CSS Design.
- **Backend**: Node.js, Express.js, REST APIs.
- **Database**: MySQL, Sequelize ORM (with `mysql2` driver).
- **Authentication**: Stateless JSON Web Tokens (JWT) & `bcryptjs` password hashing.
- **Deployment**:
  - **Frontend**: Vercel or Netlify (fully prepared with SPA rewrites).
  - **Backend**: Render, Railway, or Heroku.
  - **MySQL**: Cloud-hosted MySQL (Railway, Aiven, or PlanetScale).

---

## 📊 Database Schema

The database consists of the following highly optimized tables defined with Sequelize associations:

1. **`users`**:
   - `id`: Integer (Primary Key, Auto Increment)
   - `username`: String (Unique, Indexed)
   - `password`: String (Hashed via bcrypt)
   - `role`: Enum ('user', 'admin') (Default: 'user')
   - `createdAt`, `updatedAt`: Timestamps

2. **`products`**:
   - `id`: Integer (Primary Key, Auto Increment)
   - `name`: String
   - `description`: Text
   - `price`: Decimal (10, 2)
   - `stock`: Integer (Default: 0)
   - `image_url`: Text (Default high-res tech placeholder)
   - `createdAt`, `updatedAt`: Timestamps

3. **`orders`**:
   - `id`: Integer (Primary Key, Auto Increment)
   - `user_id`: Integer (Foreign Key -> `users.id`)
   - `total`: Decimal (10, 2)
   - `status`: Enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled')
   - `created_at`, `updated_at`: Timestamps

4. **`order_items`**:
   - `id`: Integer (Primary Key, Auto Increment)
   - `order_id`: Integer (Foreign Key -> `orders.id`, CASCADE delete)
   - `product_id`: Integer (Foreign Key -> `products.id`)
   - `quantity`: Integer
   - `price`: Decimal (10, 2) (Preserves historical purchase prices)

---

## 🖥️ Local Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v18+)
- [MySQL Server](https://dev.mysql.com/downloads/installer/) running locally (or a cloud MySQL connection)

---

### Step 1: Database Setup
1. Launch your MySQL command line or client interface.
2. Run the following command to create a new database schema:
   ```sql
   CREATE DATABASE ecom_db;
   ```

---

### Step 2: Backend Configuration & Execution
1. Navigate to the `backend/` folder.
2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and fill in your database credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=your_mysql_password
   DB_NAME=ecom_db
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

### Step 3: Frontend Configuration & Execution
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
   - Navigate to "My Orders" in the sticky navbar to review active status tracking.
3. **Admin Dashboard Controls**:
   - Log out of your user account and log in using `admin` / `adminpassword`.
   - Click **Admin** in the sticky navbar.
   - **Operational Stats**: View live aggregate statistics like Total Revenue, Sales counts, catalog items, and pending list cues.
   - **Catalog CRUD**: Click "Manage Products". Run the dynamic modal forms to quickly Add, Edit (name, price, stock, images), or Delete marketplace items.
   - **Shipments Management**: Click "Process Orders". Expand order details to view line items. Select status options from the drop-down menu (e.g. from `Pending` to `Shipped` or `Delivered`) to immediately update client ledger feeds.
   - **Stock Restoration**: If you set an order's status to `Cancelled`, the system will automatically restore the purchased items' quantities back to the product database stock!

---

## 🌐 Production Deployment Guide

Ready to deploy online? Follow these steps:

### 1. MySQL Database (Cloud)
- Create a free instance of MySQL on **Railway** or **Aiven MySQL**.
- Retrieve the connection details: host, port, user, password, and database name.
- Alternatively, if using SSL, uncomment the SSL block in `backend/src/config/database.js`.

### 2. Backend API (Render / Railway)
- Push your codebase to a GitHub repository.
- Link your repo on **Render** (as a Web Service) or **Railway**.
- Set the start command to: `npm start`.
- Define **Environment Variables** in their settings panel:
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` (pointing to your Cloud MySQL instance).
  - `JWT_SECRET` (generate a secure random key).
  - `NODE_ENV=production`.
- Note down your deployed API live endpoint (e.g., `https://nexus-ecom-api.onrender.com`).

### 3. Frontend App (Vercel)
- Create a project on **Vercel** and connect your GitHub repository.
- Set the root directory to `frontend`.
- Specify Build settings (default: `npm run build` using Vite is automatically detected).
- Add the **Environment Variable**:
  - `VITE_API_URL` = (Your deployed backend API URL, without a trailing slash).
- Deploy! Vercel will build the React bundles, leverage the `vercel.json` rewrite file to ensure SPA router pages don't 404, and provide a secure, HTTPS live URL!
