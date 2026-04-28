# E-Commerce Website

A full-stack e-commerce platform with user authentication, product catalog, shopping cart, order management, and seller functionality.

## 📋 Project Structure

```
e-commerce_website/
├── backend/              # Node.js/Express backend API
│   ├── config/          # Configuration files (DB, Cloudinary)
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── seeders/         # Database seeders
│   ├── package.json
│   ├── server.js
│   └── README.md
├── frontend/            # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── index.html
├── utils/              # Shared utilities
└── README.md           # This file
```

## 🚀 Features

### User Management
- User registration and authentication
- Role-based access control (Admin, Seller, Buyer)
- User profile management
- Password management

### Product Management
- Browse products with filtering and search
- Category-based organization
- Product reviews and ratings
- Seller product management

### Shopping Features
- Shopping cart management
- Wishlist functionality
- Order creation and tracking
- Order status management

### Payment System
- Payment processing simulation
- Payment history
- Refund management

### Seller Features
- Seller registration and profile
- Shop management
- Sales tracking
- Product inventory management

### Admin Features
- User management
- Order management
- Review management
- System administration

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling
- **Bcryptjs** - Password hashing
- **Dotenv** - Environment variables

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling
- **JavaScript** - Frontend logic

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key
NODE_ENV=development
```

4. Seed the database (optional):
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/logout` - Logout user

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Seller/Admin)
- `PUT /api/products/:id` - Update product (Seller/Admin)
- `DELETE /api/products/:id` - Delete product (Seller/Admin)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/category/:categoryId` - Get products by category

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users` - Get all users (Admin)
- `DELETE /api/users/:userId` - Delete user (Admin)

### Order Endpoints
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `GET /api/orders/admin/all` - Get all orders (Admin)

### Payment Endpoints
- `POST /api/payments` - Create payment
- `POST /api/payments/:paymentId/process` - Process payment
- `GET /api/payments/:paymentId` - Get payment details
- `POST /api/payments/:paymentId/refund` - Refund payment (Admin)
- `GET /api/payments/order/:orderId` - Get order payments
- `GET /api/payments/user/history` - Get user payments

### Seller Endpoints
- `POST /api/sellers/register` - Register as seller
- `GET /api/sellers/profile` - Get seller profile
- `PUT /api/sellers/profile` - Update seller profile
- `GET /api/sellers/products` - Get seller products
- `GET /api/sellers/sales` - Get seller sales
- `GET /api/sellers` - Get all sellers
- `GET /api/sellers/:sellerId` - Get seller by ID

### Buyer Endpoints
- `GET /api/buyers/cart` - Get cart
- `POST /api/buyers/cart/add` - Add to cart
- `PUT /api/buyers/cart/update` - Update cart item
- `DELETE /api/buyers/cart/remove/:productId` - Remove from cart
- `DELETE /api/buyers/cart/clear` - Clear cart
- `GET /api/buyers/wishlist` - Get wishlist
- `POST /api/buyers/wishlist/add` - Add to wishlist
- `DELETE /api/buyers/wishlist/remove/:productId` - Remove from wishlist

## 🗄️ Database Models

### User
- name, email, password, phone, address
- role (buyer, seller, admin)
- profileImage, isActive
- timestamps

### Product
- name, description, price, category
- stock, seller (reference)
- image, rating, reviews
- isActive, timestamps

### Order
- orderNumber, user, items
- shippingAddress, totalAmount
- status, paymentStatus, paymentMethod
- timestamps

### Cart
- user, items, totalPrice, totalItems
- timestamps

### Wishlist
- user, items
- timestamps

### Payment
- order, user, amount, paymentMethod
- transactionId, status
- refundedAmount, refundReason
- timestamps

### Review
- product, user, rating, title, comment
- helpful, unhelpful, verified
- timestamps

### Shops
- seller, shopName, description
- address, phone, email, website
- rating, totalReviews, followers
- isVerified, isActive
- timestamps

### Category
- name, description, slug
- image, isActive
- timestamps

### Notification
- user, type, title, message
- relatedEntity, read
- timestamps

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## 👥 User Roles

### Admin
- Manage all users
- Manage all orders
- Manage reviews
- System administration

### Seller
- Create and manage products
- View sales
- Manage shop profile
- Track orders

### Buyer
- Browse products
- Create orders
- Manage cart and wishlist
- Leave reviews
- Track order status

## 🎯 Sample Credentials

After seeding, use these credentials:

| Role  | Email                    | Password   |
|-------|--------------------------|------------|
| Admin | admin@ecommerce.com      | Admin123@  |
| Buyer | buyer1@ecommerce.com     | Buyer123@  |
| Seller| seller1@ecommerce.com    | Seller123@ |

## 📝 Environment Variables

Backend `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-jwt-secret-key
NODE_ENV=development
```

## 🧪 Database Seeding

To populate the database with sample data:

```bash
npm run seed
```

This will create:
- 1 Admin user
- 2 Buyer users
- 1 Seller user
- 8 Product categories
- 10 Sample products

## 🚦 Running the Application

### Development Mode

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

### Production Mode

Backend:
```bash
cd backend
npm start
```

## 📖 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🤝 Support

For support, email support@ecommerce.com or open an issue in the repository.

## 🗺️ Roadmap

- [ ] Implement advanced search and filtering
- [ ] Add product recommendations
- [ ] Implement email notifications
- [ ] Add payment gateway integration
- [ ] Implement inventory management system
- [ ] Add analytics dashboard
- [ ] Mobile app development
- [ ] Real-time chat support

---

**Happy coding! 🎉** 
