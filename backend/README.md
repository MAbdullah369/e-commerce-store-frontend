# Backend - E-Commerce API

Node.js/Express backend API for the e-commerce platform.

## 📋 Overview

This is a robust REST API built with Express.js and MongoDB for a full-featured e-commerce platform. It includes user authentication, product management, order processing, payment handling, and seller functionality.

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js           # MongoDB connection
│   └── cloudinary.js   # Cloudinary configuration
├── controllers/        # Business logic
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── buyerController.js
│   ├── sellerController.js
│   ├── paymentController.js
│   └── adminController.js
├── middleware/         # Custom middleware
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   ├── roleMiddleware.js
│   ├── adminMiddleware.js
│   ├── sellerMiddleware.js
│   └── uploadMiddleware.js
├── models/            # MongoDB schemas
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Payment.js
│   ├── Cart.js
│   ├── Wishlist.js
│   ├── Review.js
│   ├── Shops.js
│   ├── Category.js
│   └── Notification.js
├── routes/           # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── buyerRoutes.js
│   ├── sellerRoutes.js
│   ├── paymentRoutes.js
│   └── adminRoutes.js
├── seeders/         # Database seeders
│   ├── index.js
│   ├── adminSeeder.js
│   ├── userSeeder.js
│   ├── categorySeeder.js
│   ├── productSeeder.js
│   └── sampleData.js
├── package.json
├── server.js       # Express app entry point
└── README.md       # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js v14 or higher
- MongoDB v4.4 or higher
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

3. Seed the database (optional):
```bash
npm run seed
```

4. Start the server:
```bash
npm start          # Production
npm run dev        # Development with nodemon
```

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Environment variables
- **multer**: File upload handling

### Dev Dependencies

- **nodemon**: Auto-restart on file changes

## 🔑 Key Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcryptjs
- Secure token verification

### User Management
- User registration and login
- Profile management
- Password change functionality
- User deletion (Admin only)

### Product Management
- CRUD operations for products
- Product filtering and search
- Category management
- Inventory tracking
- Product ratings and reviews

### Shopping Features
- Shopping cart management
- Wishlist functionality
- Order creation and management
- Order status tracking
- Order cancellation

### Payment System
- Payment creation and processing
- Payment history
- Refund management
- Transaction tracking

### Seller Features
- Seller registration
- Shop profile management
- Product management
- Sales tracking
- Shop analytics

### Admin Features
- User management
- Order management
- Review management
- System administration

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - User login
GET    /api/auth/verify         - Verify JWT token
POST   /api/auth/logout         - User logout
```

### Users
```
GET    /api/users/profile       - Get current user profile
PUT    /api/users/profile       - Update user profile
PUT    /api/users/change-password - Change password
GET    /api/users               - Get all users (Admin)
DELETE /api/users/:userId       - Delete user (Admin)
```

### Products
```
GET    /api/products            - Get all products (with filtering)
GET    /api/products/:id        - Get single product
POST   /api/products            - Create product (Seller/Admin)
PUT    /api/products/:id        - Update product (Seller/Admin)
DELETE /api/products/:id        - Delete product (Seller/Admin)
GET    /api/products/categories - Get all categories
GET    /api/products/category/:categoryId - Get products by category
```

### Orders
```
GET    /api/orders              - Get user orders
POST   /api/orders              - Create order
GET    /api/orders/:id          - Get order details
PUT    /api/orders/:id/cancel   - Cancel order
PUT    /api/orders/:id/status   - Update order status (Admin)
GET    /api/orders/admin/all    - Get all orders (Admin)
```

### Shopping Cart & Wishlist
```
GET    /api/buyers/cart         - Get shopping cart
POST   /api/buyers/cart/add     - Add to cart
PUT    /api/buyers/cart/update  - Update cart item
DELETE /api/buyers/cart/remove/:productId - Remove from cart
DELETE /api/buyers/cart/clear   - Clear cart

GET    /api/buyers/wishlist    - Get wishlist
POST   /api/buyers/wishlist/add - Add to wishlist
DELETE /api/buyers/wishlist/remove/:productId - Remove from wishlist
```

### Payments
```
POST   /api/payments             - Create payment
POST   /api/payments/:paymentId/process - Process payment
GET    /api/payments/:paymentId  - Get payment details
POST   /api/payments/:paymentId/refund - Refund payment (Admin)
GET    /api/payments/order/:orderId - Get order payments
GET    /api/payments/user/history - Get user payments
```

### Sellers
```
POST   /api/sellers/register     - Register as seller
GET    /api/sellers/profile      - Get seller profile
PUT    /api/sellers/profile      - Update seller profile
GET    /api/sellers/products     - Get seller products
GET    /api/sellers/sales        - Get seller sales analytics
GET    /api/sellers              - Get all sellers
GET    /api/sellers/:sellerId    - Get seller details
```

### Admin
```
POST   /api/admin/reviews/:reviewId/helpful - Mark review helpful
DELETE /api/admin/reviews/:reviewId - Delete review
```

## 🔒 Middleware

### authMiddleware
- Validates JWT token
- Extracts user ID and role
- Required for protected routes

### roleMiddleware
- Checks user role authorization
- Supports multiple roles
- Returns 403 for unauthorized access

### errorMiddleware
- Centralized error handling
- Mongoose validation errors
- JWT authentication errors
- Formatted error responses

### adminMiddleware
- Checks if user is admin
- Used for admin-only routes

### sellerMiddleware
- Checks if user is seller
- Verifies seller registration
- Used for seller-only routes

### uploadMiddleware
- Handles file uploads with multer
- Image file validation
- File size limiting (5MB)

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  role: String (admin|seller|buyer),
  profileImage: String,
  isActive: Boolean,
  isSeller: Boolean,
  shop: ObjectId (ref: Shops),
  timestamps: true
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  seller: ObjectId (ref: User),
  image: String,
  rating: Number (0-5),
  reviews: Number,
  isActive: Boolean,
  timestamps: true
}
```

### Order Model
```javascript
{
  orderNumber: String (unique),
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    seller: ObjectId (ref: User),
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  shippingAddress: {...},
  totalAmount: Number,
  status: String (pending|confirmed|shipped|delivered|cancelled),
  paymentStatus: String (pending|completed|failed),
  paymentMethod: String,
  timestamps: true
}
```

## 🌱 Database Seeding

Run the seeder to populate sample data:

```bash
npm run seed
```

This creates:
- 1 Admin user (admin@ecommerce.com / Admin123@)
- 2 Buyer users
- 1 Seller user (seller1@ecommerce.com / Seller123@)
- 8 Product categories
- 10 Sample products

## 🔐 Authentication

The API uses JWT for authentication. Include token in headers:

```
Authorization: Bearer <your-jwt-token>
```

### Token Claims
```javascript
{
  id: "user_id",
  role: "buyer|seller|admin",
  iat: timestamp,
  exp: timestamp (7 days)
}
```

## 📝 Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123@",
  "confirmPassword": "Password123@",
  "role": "buyer"
}

Response:
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

### Create Product
```bash
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Wireless Mouse",
  "description": "USB wireless mouse",
  "price": 25.99,
  "category": "Electronics",
  "stock": 100
}

Response:
{
  "message": "Product created successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Wireless Mouse",
    "price": 25.99,
    "seller": "507f1f77bcf86cd799439011",
    ...
  }
}
```

### Create Order
```bash
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439012",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "1234567890"
  },
  "paymentMethod": "credit_card"
}
```

## 🛠️ Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message description",
  "stack": "Stack trace (development only)"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 📊 Performance Tips

1. **Use pagination** for list endpoints
2. **Filter products** using query parameters
3. **Cache frequently accessed data**
4. **Use indexes** on commonly queried fields
5. **Compress responses** with gzip

## 🔄 Development Workflow

1. Install dependencies: `npm install`
2. Create `.env` file with configuration
3. Start MongoDB
4. Run seeders: `npm run seed`
5. Start dev server: `npm run dev`
6. Test endpoints with Postman or similar tool

## 📚 Best Practices

- All routes are protected with authentication middleware
- Role-based authorization for sensitive operations
- Input validation on all endpoints
- Error handling middleware for consistent responses
- Hashed passwords using bcryptjs
- JWT tokens with expiration
- Secure error messages (no sensitive info leak)

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check MONGO_URI in .env
- Verify network connectivity

### JWT Token Errors
- Token may be expired (7 days)
- Ensure JWT_SECRET is set in .env
- Check Authorization header format

### File Upload Errors
- Ensure uploads/ directory exists
- Check file size (max 5MB)
- Verify file type (images only)

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

**Last Updated**: 2024
**Version**: 1.0.0
