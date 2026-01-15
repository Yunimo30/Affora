# Affora Web App - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Architecture](#architecture)
5. [Process Flow](#process-flow)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Component Details](#component-details)
9. [Setup & Installation](#setup--installation)
10. [Running the Application](#running-the-application)

---

## Project Overview

**Affora Web App** is a full-stack e-commerce platform designed for Filipino consumers. It provides a modern, feature-rich shopping experience with product browsing, cart management, user authentication, checkout, order history, and social engagement features like video reels and product reviews.

### Key Features
- 🛍️ **Product Catalog**: Browse products across multiple categories (Tech, Apparel, Accessories, Appliances)
- 🛒 **Shopping Cart**: Add/remove items with size and color selection
- 🔐 **User Authentication**: Secure login with password hashing (bcrypt)
- 💳 **Checkout System**: Complete transaction management
- 📦 **Order Tracking**: View order history and status
- ❤️ **Wishlist**: Save favorite products
- 🎬 **Reels/Shorts**: Video feed similar to TikTok/Instagram Reels
- ⭐ **Product Reviews**: Rating and comment system
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2.0 | UI library and component management |
| **Vite** | 7.2.4 | Fast build tool and dev server |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS framework |
| **Lucide React** | 0.562.0 | SVG icon library |
| **Axios** | 1.13.2 | HTTP client for API calls |
| **Recharts** | 3.6.0 | Charts/analytics visualization (future use) |
| **bcryptjs** | 3.0.3 | Password hashing (frontend usage) |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | (Latest) | JavaScript runtime |
| **Express.js** | 5.2.1 | REST API framework |
| **SQLite3** | 5.1.7 | Lightweight SQL database |
| **bcryptjs** | (Latest) | Password hashing |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |
| **Nodemon** | 3.1.11 | Dev tool for auto-reload |

### Development Tools
| Tool | Purpose |
|---|---|
| **ESLint** | Code quality and style enforcement |
| **PostCSS** | CSS processing pipeline |
| **Autoprefixer** | Automatic vendor prefixes |

---

## Project Structure

```
AfforaWebApp/
├── src/                              # Frontend source code
│   ├── App.jsx                       # Main application component
│   ├── main.jsx                      # React entry point
│   ├── index.css                     # Global styles
│   ├── CartDrawer.jsx                # Slide-out shopping cart
│   ├── CheckoutPage.jsx              # Checkout flow
│   ├── SuccessPage.jsx               # Order confirmation
│   ├── LoginPage.jsx                 # User authentication
│   ├── ProductPage.jsx               # Product detail view
│   ├── ReviewsPage.jsx               # Product reviews and ratings
│   ├── OrderHistoryPage.jsx          # User's past orders
│   ├── UserProfilePage.jsx           # User profile management
│   └── assets/                       # Images and static files
│
├── server/                           # Backend source code
│   ├── server.js                     # Express server (Port 3000)
│   ├── database.js                   # SQLite setup and seeding
│   ├── affora.db                     # SQLite database file (auto-created)
│   └── package.json                  # Server dependencies
│
├── public/                           # Public static files
│   ├── favicon/                      # Favicon assets
│   └── products/                     # Product images
│
├── Configuration Files
│   ├── package.json                  # Frontend dependencies and scripts
│   ├── vite.config.js                # Vite build configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── postcss.config.js             # PostCSS configuration
│   ├── eslint.config.js              # ESLint rules
│   └── index.html                    # HTML entry point
│
├── Setup & Run Scripts
│   ├── SETUP_FIRST.BAT               # Windows setup script
│   ├── START_AFFORA.bat              # Windows start script
│   ├── download-images.js            # Script to download product images
│   └── README.md                     # Project readme
│
└── DOCUMENTATION.md                  # This file
```

---

## Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              App.jsx (Main Component)                    │  │
│  │  - State Management (products, cart, user, etc.)        │  │
│  │  - Route handling via ViewState                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────┬──────────────┬──────────────┬───────────────┐ │
│  │   Product    │   Cart       │  Checkout    │    Reviews    │ │
│  │   Browsing   │   Drawer     │   Page       │    Page       │ │
│  │              │              │              │               │ │
│  │ • Categories │ • Items List │ • Cart Items │ • Star Rating │ │
│  │ • Filters    │ • Qty Mgmt   │ • Payment    │ • Comments    │ │
│  │ • Search     │ • Totals     │ • Promo Code │ • Submit Form │ │
│  └──────────────┴──────────────┴──────────────┴───────────────┘ │
│                                                                   │
│  ┌──────────────┬──────────────┬──────────────┬───────────────┐ │
│  │    Login     │  User        │    Order     │   Reels       │ │
│  │    Page      │  Profile     │    History   │   Feature     │ │
│  │              │              │              │               │ │
│  │ • Email Auth │ • Name Edit  │ • List View  │ • Video Feed  │ │
│  │ • Password   │ • Wishlist   │ • Details    │ • Comments    │ │
│  │ • Session    │ • Logout     │ • Tracking   │ • Like/Share  │ │
│  └──────────────┴──────────────┴──────────────┴───────────────┘ │
│                                                                   │
│  HTTP Requests (Axios)  ←───────────────────────────────────→   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
                    (API Calls on Port 3000)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Express Server (Port 3000)                  │  │
│  │         (CORS enabled for localhost:5173)               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  API Routes:                                                     │
│  • GET  /api/products          → Fetch all products             │
│  • GET  /api/products/:id      → Fetch specific product         │
│  • POST /api/login            → User authentication            │
│  • POST /api/cart             → Add to cart                    │
│  • GET  /api/cart/:userId     → Get user's cart               │
│  • DELETE /api/cart/:cartId   → Remove from cart              │
│  • POST /api/checkout         → Process order                 │
│  • GET  /api/orders/:userId   → Get order history             │
│  • POST /api/reviews          → Submit product review         │
│  • GET  /api/reviews/:productId → Fetch product reviews       │
│  • POST /api/wishlist         → Add to wishlist               │
│  • GET  /api/wishlist/:userId → Get user's wishlist          │
│  • DELETE /api/wishlist/:id   → Remove from wishlist          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ SQL Queries
                    (SQLite Database Connection)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE (SQLite)                            │
│                                                                   │
│  ┌─────────────┬──────────────┬──────────────┬────────────────┐ │
│  │   users     │  products    │    cart      │    orders      │ │
│  │             │              │              │                │ │
│  │ • id        │ • id         │ • id         │ • id           │ │
│  │ • name      │ • name       │ • user_id    │ • user_id      │ │
│  │ • email     │ • price      │ • product_id │ • total_amount │ │
│  │ • password  │ • rating     │ • sel_size   │ • payment_meth │ │
│  │ • (hashed)  │ • colors     │ • color_name │ • order_date   │ │
│  │             │ • sizes      │              │ • status       │ │
│  │             │ • deal_type  │              │                │ │
│  │             │ • description│              │                │ │
│  └─────────────┴──────────────┴──────────────┴────────────────┘ │
│                                                                   │
│  ┌─────────────┬──────────────┬──────────────┬────────────────┐ │
│  │ order_items │ wishlist     │    reviews   │                │ │
│  │             │              │              │                │ │
│  │ • id        │ • id         │ • id         │                │ │
│  │ • order_id  │ • user_id    │ • user_id    │                │ │
│  │ • prod_name │ • product_id │ • product_id │                │ │
│  │ • price     │              │ • rating     │                │ │
│  │ • sel_size  │              │ • comment    │                │ │
│  │ • color_name│              │ • date       │                │ │
│  │ • img_label │              │              │                │ │
│  └─────────────┴──────────────┴──────────────┴────────────────┘ │
│                                                                   │
│  File: affora.db (Auto-created on first run)                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Architectural Layers

#### 1. **Presentation Layer** (Frontend)
- React components for UI
- Tailwind CSS for styling
- Lucide React for icons
- Responsive design for mobile/tablet/desktop

#### 2. **State Management Layer**
- React Hooks (useState, useRef, useEffect)
- Local state in App.jsx manages:
  - Products list
  - Selected product
  - Cart items
  - User session
  - UI states (modals, notifications, etc.)

#### 3. **API Communication Layer**
- Axios for HTTP requests
- Base URL: `http://localhost:3000/api/`
- Error handling and loading states

#### 4. **Business Logic Layer** (Backend)
- Express.js route handlers
- Request validation
- Password hashing with bcrypt
- Transaction management for checkout

#### 5. **Data Access Layer**
- SQLite database operations
- Prepared statements for security
- Data serialization (JSON for colors/sizes)

#### 6. **Data Storage Layer**
- SQLite database (affora.db)
- 7 tables with relationships
- Auto-created on first run

---

## Process Flow

### 1. **Application Initialization Flow**

```
User Opens App
    ↓
[main.jsx] Loads React App
    ↓
[App.jsx] Component Mounts
    ↓
useEffect() Triggers
    ↓
Fetch Products from /api/products
    ↓
isAppLoading = true → Show Loading Screen
    ↓
Products Data Retrieved
    ↓
setProducts() Updates State
    ↓
isAppLoading = false → Show Main UI
    ↓
Show Promo Popup (optional)
```

### 2. **User Authentication Flow**

```
User Clicks Login Button
    ↓
Navigate to LoginPage Component
    ↓
User Enters Email & Password
    ↓
User Clicks Submit
    ↓
POST /api/login with credentials
    ↓
[Backend] Fetch user from database
    ↓
[Backend] Hash comparison: bcrypt.compareSync()
    ↓
If Password Valid:
    ↓ ✓
User object returned {id, name, email}
    ↓
setUser() Updates State
    ↓
Fetch user's cart data
    ↓
Navigate to Browse Page
    ✗
If Password Invalid:
    ↓
Return error message
    ↓
Show notification to user
```

### 3. **Product Browsing Flow**

```
User Sees Browse View
    ↓
Products Display in Grid
    ↓
User Interacts:
    ├─ Select Category → Filter products by type
    ├─ Search Query → Filter by name/description
    ├─ Click Product → Open ProductPage detail view
    ├─ Scroll Categories → Show/hide arrows
    └─ Scroll to Top → Show floating button

User Clicks on Product
    ↓
setSelectedProduct() = chosen product
    ↓
setViewState() = 'product'
    ↓
ProductPage Component Renders
    ↓
Show Product Details:
    ├─ Large image gallery
    ├─ Product name, price, rating
    ├─ Size & color selectors
    ├─ Add to Cart button
    ├─ Reviews section
    └─ Recommended products
```

### 4. **Shopping Cart Flow**

```
User Clicks "Add to Cart"
    ↓
Get Selected Size & Color
    ↓
Validate Selection
    ├─ If missing: Show error notification
    └─ If valid: Continue
    ↓
Create Cart Item:
    {
      productId: number,
      size: string,
      color: string,
      quantity: number
    }
    ↓
If User Logged In:
    ↓
POST /api/cart
    ↓ Save to Database
Else:
    ↓
Store in Local State Only
    ↓
Add to cartItems array
    ↓
Update total price
    ↓
Show "Added to cart!" notification
    ↓
Trigger cart bump animation
    ↓
User Can Continue Shopping or Open Cart Drawer
```

### 5. **Checkout & Order Flow**

```
User Opens Cart Drawer
    ↓
Review Items List:
    ├─ Product name
    ├─ Selected size/color
    ├─ Quantity
    └─ Remove button

User Clicks "Checkout"
    ↓
setViewState() = 'checkout'
    ↓
CheckoutPage Renders
    ↓
Show Order Summary:
    ├─ Items breakdown
    ├─ Subtotal
    ├─ Shipping cost
    ├─ Apply coupon code (if available)
    └─ Grand Total

User Enters Payment Details:
    ├─ Email
    ├─ Phone
    ├─ Address
    ├─ Payment Method (Credit Card/GCash/etc)
    └─ Promo code (optional)

User Clicks "Place Order"
    ↓
Validate All Fields
    ├─ If invalid: Show errors
    └─ If valid: Continue
    ↓
POST /api/checkout with order data
    ↓
[Backend] Create Order Record
    ↓
[Backend] Move cart items to order_items table
    ↓
[Backend] Clear user's cart
    ↓
[Backend] Set order status = "Processing"
    ↓
Return Order Confirmation {orderId, total}
    ↓
setViewState() = 'success'
    ↓
SuccessPage Renders
    ↓
Show Confirmation Message:
    ├─ "Order Placed Successfully!"
    ├─ Order ID
    ├─ Delivery estimate
    └─ Continue Shopping button
```

### 6. **Wishlist Flow**

```
User Clicks Heart Icon (any product)
    ↓
If Not in Wishlist:
    ├─ POST /api/wishlist
    ├─ Add to database
    └─ setWishlistIds([...wishlist, productId])
    ↓
If Already in Wishlist:
    ├─ DELETE /api/wishlist/:id
    ├─ Remove from database
    └─ setWishlistIds(filter out productId)
    ↓
Heart Icon Updates Visually (filled/empty)
```

### 7. **Reviews Flow**

```
User Views ProductPage
    ↓
Reviews Section Shows:
    ├─ Star rating (1-5)
    ├─ Existing reviews list
    └─ Review form

User Clicks "Write a Review"
    ↓
ReviewsPage Opens
    ↓
User Enters:
    ├─ Star rating
    ├─ Comment text
    └─ Clicks Submit

POST /api/reviews with review data
    ↓
[Backend] Validate input
    ↓
[Backend] Save to reviews table
    ↓
Refresh reviews list
    ↓
Show success message
    ↓
Review appears in product page
```

### 8. **Video Reels Flow**

```
User Clicks "Reels" or Video Icon
    ↓
setShowReelsModal() = true
    ↓
ReelsModal Opens (Full Screen)
    ↓
Video Feed Loads (5 hardcoded videos)
    ↓
User Watches Video
    ↓
User Can:
    ├─ Like (heart icon)
    ├─ Comment (message icon) → Opens Comments Panel
    ├─ Share (share icon)
    ├─ Navigate (arrows/swipe) → Next/Prev video
    ├─ Mute/Unmute (speaker icon)
    └─ Fullscreen (expand icon)

Comments Panel Shows:
    ├─ List of comments
    ├─ User avatars
    └─ Comment form for new comments

User Clicks X to Close
    ↓
setShowReelsModal() = false
    ↓
Return to Browse View
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT  -- Hashed with bcrypt
);
```

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT,
  price TEXT,
  rating INTEGER,
  reviewCount INTEGER,
  imageLabel TEXT,
  colors TEXT,        -- JSON: ["#1F2937", "#9CA3AF"]
  sizes TEXT,         -- JSON: ["S", "M", "L"]
  description TEXT,
  deal BOOLEAN,
  deal_type TEXT      -- "flash", "new", "50off", "clearance", "bundle", "freeship"
);
```

### Cart Table
```sql
CREATE TABLE cart (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  product_id INTEGER,
  selected_size TEXT,
  color_name TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(product_id) REFERENCES products(id)
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  total_amount TEXT,
  payment_method TEXT,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'Processing',  -- "Processing", "Shipped", "Delivered", "Cancelled"
  FOREIGN KEY(user_id) REFERENCES users(id)
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER,
  product_name TEXT,
  price TEXT,
  selected_size TEXT,
  color_name TEXT,
  image_label TEXT,
  FOREIGN KEY(order_id) REFERENCES orders(id)
);
```

### Wishlist Table
```sql
CREATE TABLE wishlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  product_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(product_id) REFERENCES products(id)
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  product_id INTEGER,
  rating INTEGER,      -- 1-5 stars
  comment TEXT,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(product_id) REFERENCES products(id)
);
```

---

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Product Endpoints

**GET** `/api/products`
- Fetches all products
- No authentication required
- Response:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Premium Wireless Headphones",
      "price": "₱14,999.00",
      "rating": 5,
      "reviewCount": 128,
      "imageLabel": "headphones.jpg",
      "colors": ["#1F2937", "#9CA3AF"],
      "sizes": ["Std"],
      "description": "Noise-cancelling over-ear headphones.",
      "deal": true,
      "deal_type": "flash"
    }
  ]
}
```

### Authentication Endpoints

**POST** `/api/login`
- Authenticates user
- Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- Response (Success):
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```
- Response (Failure): `{ "error": "Invalid password" }`

### Cart Endpoints

**GET** `/api/cart/:userId`
- Fetches user's cart items
- Response:
```json
{
  "data": [
    {
      "cartId": 1,
      "product_id": 1,
      "name": "Premium Wireless Headphones",
      "selectedSize": "Std",
      "colorName": "#1F2937",
      "price": "₱14,999.00",
      "colors": ["#1F2937", "#9CA3AF"],
      "sizes": ["Std"]
    }
  ]
}
```

**POST** `/api/cart`
- Adds item to cart
- Request Body:
```json
{
  "userId": 1,
  "productId": 1,
  "size": "Std",
  "color": "#1F2937"
}
```

**DELETE** `/api/cart/:cartId`
- Removes item from cart
- Response: `{ "message": "Deleted", "changes": 1 }`

### Checkout Endpoints

**POST** `/api/checkout`
- Processes order
- Request Body:
```json
{
  "userId": 1,
  "total": "₱29,998.00",
  "paymentMethod": "Credit Card"
}
```
- Response:
```json
{
  "message": "Order placed successfully",
  "orderId": 123
}
```

### Order Endpoints

**GET** `/api/orders/:userId`
- Fetches user's order history
- Response:
```json
{
  "data": [
    {
      "id": 123,
      "total_amount": "₱29,998.00",
      "payment_method": "Credit Card",
      "order_date": "2025-01-16T10:30:00.000Z",
      "status": "Processing",
      "items": [
        {
          "product_name": "Premium Wireless Headphones",
          "price": "₱14,999.00",
          "selected_size": "Std",
          "color_name": "#1F2937"
        }
      ]
    }
  ]
}
```

### Reviews Endpoints

**GET** `/api/reviews/:productId`
- Fetches reviews for a product
- Response:
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 5,
      "rating": 5,
      "comment": "Excellent product!",
      "date": "2025-01-15T08:00:00.000Z"
    }
  ]
}
```

**POST** `/api/reviews`
- Submits a product review
- Request Body:
```json
{
  "userId": 1,
  "productId": 5,
  "rating": 5,
  "comment": "Great quality and fast shipping!"
}
```

### Wishlist Endpoints

**GET** `/api/wishlist/:userId`
- Fetches user's wishlist
- Response:
```json
{
  "data": [
    {
      "id": 1,
      "product_id": 5,
      "name": "Ocean Breeze Hoodie",
      "price": "₱1,999.00"
    }
  ]
}
```

**POST** `/api/wishlist`
- Adds product to wishlist
- Request Body:
```json
{
  "userId": 1,
  "productId": 5
}
```

**DELETE** `/api/wishlist/:wishlistId`
- Removes product from wishlist
- Response: `{ "message": "Removed from wishlist" }`

---

## Component Details

### [App.jsx](App.jsx) - Main Component
The heart of the application. Manages:
- **Global State**: products, cart, user, wishlist
- **View Routing**: Switches between browse, product, checkout, login, etc.
- **API Communication**: Fetches data from all endpoints
- **UI Features**: Notifications, modals, animations

**Key Functions**:
- `handleAddToCart()` - Adds product to cart
- `handleCheckout()` - Processes checkout
- `handleLogin()` - User authentication
- `handleRemoveFromCart()` - Removes cart item

### [CartDrawer.jsx](CartDrawer.jsx) - Shopping Cart
Slide-out drawer showing:
- Cart items list
- Quantity management
- Total price calculation
- Checkout button
- Empty cart state

### [CheckoutPage.jsx](CheckoutPage.jsx) - Checkout Flow
Displays:
- Order summary
- Item breakdown
- Shipping details form
- Payment method selection
- Promo code input
- Place order button

### [SuccessPage.jsx](SuccessPage.jsx) - Order Confirmation
Shows:
- Success message
- Order ID
- Estimated delivery date
- Customer service contact
- Continue shopping button

### [LoginPage.jsx](LoginPage.jsx) - Authentication
Features:
- Email/password form
- Login validation
- Error messages
- Registration link (placeholder)

### [ProductPage.jsx](ProductPage.jsx) - Product Details
Displays:
- Product image gallery
- Name, price, rating
- Size/color selectors
- Stock availability
- Product description
- Reviews section
- Related products
- Add to cart button

### [ReviewsPage.jsx](ReviewsPage.jsx) - Product Reviews
Shows:
- Existing reviews list
- Star rating visualization
- Review submission form
- User comments and dates

### [OrderHistoryPage.jsx](OrderHistoryPage.jsx) - Order Tracking
Displays:
- List of past orders
- Order details (date, total, status)
- Order items breakdown
- Track shipment button
- Reorder option

### [UserProfilePage.jsx](UserProfilePage.jsx) - User Account
Features:
- User information display
- Edit profile
- Wishlist view
- Saved addresses
- Logout button

---

## Setup & Installation

### Prerequisites
- **Node.js** (v16+) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** (optional)

### Step 1: Install Frontend Dependencies
```bash
cd YourDirectory\
npm install
```

This installs:
- React, Vite, Tailwind CSS
- Axios for HTTP requests
- Lucide React icons
- Development tools (ESLint, PostCSS)

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
```

This installs:
- Express.js
- SQLite3
- CORS middleware
- Nodemon (dev tool)

### Step 3: Database Setup
The database is **auto-created** on first run:
- File: `server/affora.db`
- Tables: Auto-created with seed data
- Products: 17 sample items across 4 categories
- Users: None (created on registration)

To manually seed data, run:
```bash
cd server
node database.js
```

---

## Running the Application

### Windows Users - Quick Start

#### Option 1: Use Batch Scripts (Recommended)
```bash
cd YourDirectory\

# Run this ONCE to setup
SETUP_FIRST.BAT

# Then to start the app
START_AFFORA.bat
```

#### Option 2: Manual Start

**Terminal 1 - Start Backend (Port 3000)**
```bash
cd YourDirectory\\server
npm start
```

Expected output:
```
Server running on port 3000
Connected to the SQLite database.
```

**Terminal 2 - Start Frontend (Port 5173)**
```bash
cd YourDirectory\
npm run dev
```

Expected output:
```
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

### Production Build
To create optimized production build:
```bash
npm run build
```

Output files will be in `dist/` directory.

---

## Development Workflow

### Frontend Development
- **Dev Server**: `npm run dev` - Hot reload enabled
- **Linting**: `npm run lint` - Check code quality
- **Building**: `npm run build` - Create production bundle

### Backend Development
- **Dev Server**: `npm start` or `npm run dev`
- **Auto-reload**: Nodemon watches for file changes
- **Database**: Changes persist in `affora.db`

### Debugging
- **Browser DevTools**: F12 in browser
- **Network Tab**: Monitor API calls
- **React DevTools**: Check component state
- **Backend Logs**: Check terminal for Express logs

---

## Key Features Implementation

### 🛍️ E-Commerce Core
- ✅ Product catalog with categories
- ✅ Shopping cart management
- ✅ Checkout and order processing
- ✅ Order history and tracking

### 🔐 Security
- ✅ Bcrypt password hashing
- ✅ User authentication
- ✅ Secure API endpoints
- ✅ CORS configuration

### 💳 Payment
- ✅ Multiple payment methods
- ✅ Order total calculation
- ✅ Promo code support (template ready)

### 📱 Social Features
- ✅ Product reviews and ratings
- ✅ Wishlist/favorites
- ✅ Video reels/shorts feed
- ✅ Social sharing (ready to implement)

### 🎨 UI/UX
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Dark mode ready (Tailwind support)
- ✅ Smooth animations
- ✅ Loading states
- ✅ Error notifications
- ✅ Accessibility features

---

## Future Enhancements

### Planned Features
1. **Real Payment Integration**: Stripe, PayPal, GCash
2. **Push Notifications**: Order updates
3. **Inventory Management**: Stock tracking
4. **Admin Dashboard**: Product and order management
5. **Analytics**: Sales reports, user behavior
6. **Email Notifications**: Order confirmations
7. **Advanced Search**: Filters, sorting, pagination
8. **Loyalty Program**: Points and rewards
9. **Multi-language Support**: Tagalog, English, etc.
10. **Image Optimization**: CDN integration

### Technical Improvements
1. **Database**: Migrate to PostgreSQL for scalability
2. **Caching**: Redis for performance
3. **Authentication**: JWT tokens
4. **API Pagination**: Better data handling
5. **Error Handling**: Comprehensive error boundaries
6. **Testing**: Unit and integration tests
7. **CI/CD**: Automated deployment
8. **Monitoring**: Error tracking (Sentry)

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (Backend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 5173 (Frontend)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Database Issues
```bash
# Recreate database
cd server
rm affora.db
node database.js
```

### CORS Errors
- Ensure backend runs on `http://localhost:3000`
- Frontend must be on `http://localhost:5173`
- Check CORS settings in `server/server.js`

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -r node_modules package-lock.json
npm install
```

---

## Support & Contact

For questions or issues:
- Check terminal logs for error messages
- Review browser console (F12)
- Verify ports are available
- Ensure Node.js is installed correctly

---

**Last Updated**: January 16, 2026
**Version**: 1.0.0
**Status**: Active Development
