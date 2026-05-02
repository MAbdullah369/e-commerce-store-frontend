const Product = require('../models/Product');
const User = require('../models/User');
const Shops = require('../models/Shops');

const productSeeder = async () => {
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log('Products already exist');
      return;
    }

    const seller = await User.findOne({ role: 'seller' });
    if (!seller) {
      console.log('No seller found. Please run userSeeder first.');
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
        isPublished: true,   // ✅ must be published to appear in store
      },
      {
        name: 'Laptop Stand',
        description: 'Adjustable aluminum laptop stand for better ergonomics',
        price: 29.99,
        category: 'Electronics',
        stock: 100,
        seller: seller._id,
        rating: 4.2,
        reviews: 85,
        isActive: true,
        isPublished: true,
      },
      {
        name: 'USB-C Cable',
        description: '2m braided USB-C charging and data cable',
        price: 12.99,
        category: 'Electronics',
        stock: 200,
        seller: seller._id,
        rating: 4.3,
        reviews: 250,
        isActive: true,
        isPublished: true,
      },
      {
        name: 'Cotton T-Shirt',
        description: 'Comfortable 100% cotton t-shirt available in multiple colors',
        price: 19.99,
        category: 'Fashion',
        stock: 150,
        seller: seller._id,
        rating: 4.1,
        reviews: 100,
        isActive: true,
        isPublished: true,
      },
      {
        name: 'Running Shoes',
        description: 'Professional running shoes with memory foam cushioning',
        price: 89.99,
        category: 'Fashion',
        stock: 75,
        seller: seller._id,
        rating: 4.6,
        reviews: 200,
        isActive: true,
        isPublished: true,
      },
      {
        name: 'Coffee Maker',
        description: '12-cup automatic drip coffee maker with programmable timer',
        price: 49.99,
        category: 'Home & Living',
        stock: 60,
        seller: seller._id,
        rating: 4.4,
        reviews: 180,
        isActive: true,
        isPublished: true,
      },
      {
        name: 'Yoga Mat',
        description: 'Non-slip 6mm thick yoga mat with carrying strap',
        price: 24.99,
        category: 'Sports',
        stock: 80,
        seller: seller._id,
        rating: 4.3,
        reviews: 95,
        isActive: true,
        isPublished: true,
      },
      {
        name: 'Fiction Novel',
        description: 'Bestselling mystery fiction novel — over 1 million copies sold',
        price: 14.99,
        category: 'Books',
        stock: 120,
        seller: seller._id,
        rating: 4.7,
        reviews: 300,
        isActive: true,
        isPublished: true,
      },
      {
        name: 'Board Game',
        description: 'Strategy family board game for 2-4 players, ages 8+',
        price: 34.99,
        category: 'Toys & Games',
        stock: 40,
        seller: seller._id,
        rating: 4.5,
        reviews: 150,
        isActive: true,
        isPublished: true,
      },
      {
        name: 'Face Moisturizer',
        description: 'Lightweight hydrating face moisturizer for all skin types',
        price: 22.99,
        category: 'Beauty & Personal Care',
        stock: 110,
        seller: seller._id,
        rating: 4.4,
        reviews: 220,
        isActive: true,
        isPublished: true,
      },
    ];

    // ✅ insertMany is fine here since Product has no pre-save middleware
    //    that needs to run (no password hashing etc.)
    await Product.insertMany(products);

    // ✅ Update the seller's shop to reflect published products and activate it
    const publishedCount = products.filter(p => p.isPublished).length;
    await Shops.findOneAndUpdate(
      { seller: seller._id },
      {
        publishedProducts: publishedCount,
        shopStatus: publishedCount >= 3 ? 'active' : 'pending',
        hasMetRequirements: publishedCount >= 3,
      }
    );

    console.log(`Products created successfully (${publishedCount} published)`);
    console.log('Seller shop activated automatically');
  } catch (error) {
    console.error('Error creating products:', error);
  }
};

module.exports = productSeeder;