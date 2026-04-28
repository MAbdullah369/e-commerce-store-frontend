const Product = require('../models/Product');
const User = require('../models/User');

const productSeeder = async () => {
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log('Products already exist');
      return;
    }

    // Get a seller user to assign products
    const seller = await User.findOne({ role: 'seller' });
    if (!seller) {
      console.log('No seller found. Please create a seller first.');
      return;
    }

    const products = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 79.99,
        category: 'Electronics',
        stock: 50,
        seller: seller._id,
        rating: 4.5,
        reviews: 120,
        isActive: true,
      },
      {
        name: 'Laptop Stand',
        description: 'Adjustable aluminum laptop stand',
        price: 29.99,
        category: 'Electronics',
        stock: 100,
        seller: seller._id,
        rating: 4.2,
        reviews: 85,
        isActive: true,
      },
      {
        name: 'USB-C Cable',
        description: '2m USB-C charging and data cable',
        price: 12.99,
        category: 'Electronics',
        stock: 200,
        seller: seller._id,
        rating: 4.3,
        reviews: 250,
        isActive: true,
      },
      {
        name: 'Cotton T-Shirt',
        description: 'Comfortable 100% cotton t-shirt',
        price: 19.99,
        category: 'Fashion',
        stock: 150,
        seller: seller._id,
        rating: 4.1,
        reviews: 100,
        isActive: true,
      },
      {
        name: 'Running Shoes',
        description: 'Professional running shoes with cushioning',
        price: 89.99,
        category: 'Fashion',
        stock: 75,
        seller: seller._id,
        rating: 4.6,
        reviews: 200,
        isActive: true,
      },
      {
        name: 'Coffee Maker',
        description: 'Automatic drip coffee maker',
        price: 49.99,
        category: 'Home & Living',
        stock: 60,
        seller: seller._id,
        rating: 4.4,
        reviews: 180,
        isActive: true,
      },
      {
        name: 'Yoga Mat',
        description: 'Non-slip yoga mat with carrying strap',
        price: 24.99,
        category: 'Sports',
        stock: 80,
        seller: seller._id,
        rating: 4.3,
        reviews: 95,
        isActive: true,
      },
      {
        name: 'Fiction Novel',
        description: 'Bestselling fiction novel',
        price: 14.99,
        category: 'Books',
        stock: 120,
        seller: seller._id,
        rating: 4.7,
        reviews: 300,
        isActive: true,
      },
      {
        name: 'Board Game',
        description: 'Family board game for 2-4 players',
        price: 34.99,
        category: 'Toys & Games',
        stock: 40,
        seller: seller._id,
        rating: 4.5,
        reviews: 150,
        isActive: true,
      },
      {
        name: 'Face Moisturizer',
        description: 'Hydrating face moisturizer for all skin types',
        price: 22.99,
        category: 'Beauty & Personal Care',
        stock: 110,
        seller: seller._id,
        rating: 4.4,
        reviews: 220,
        isActive: true,
      },
    ];

    await Product.insertMany(products);
    console.log('Products created successfully');
  } catch (error) {
    console.error('Error creating products:', error);
  }
};

module.exports = productSeeder;
