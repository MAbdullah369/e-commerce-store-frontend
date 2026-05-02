const User = require('../models/User');
const Shops = require('../models/Shops');

const userSeeder = async () => {
  try {
    // Remove users whose passwords have not been hashed with bcrypt
    await User.deleteMany({ password: { $not: { $regex: /^\$2[ab]\$.*/ } } });

    const existingUsers = await User.countDocuments({ role: 'buyer' });
    if (existingUsers > 0) {
      console.log('Sample users already exist');
      return;
    }

    const users = [
      {
        name: 'Admin User',
        email: 'admin@ecommerce.com',
        password: 'Admin123@',
        role: 'admin',
        phone: '1234567890',
        address: {
          street: '123 Admin St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        isActive: true,
      },
      {
        name: 'John Buyer',
        email: 'buyer1@ecommerce.com',
        password: 'Buyer123@',
        role: 'buyer',
        phone: '9876543210',
        address: {
          street: '456 Buyer Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'USA',
        },
        isActive: true,
      },
      {
        name: 'Sarah Seller',
        email: 'seller1@ecommerce.com',
        password: 'Seller123@',
        role: 'seller',
        phone: '9123456789',
        address: {
          street: '789 Seller St',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA',
        },
        isActive: true,
      },
      {
        name: 'Mike Johnson',
        email: 'buyer2@ecommerce.com',
        password: 'Buyer123@',
        role: 'buyer',
        phone: '9234567890',
        address: {
          street: '321 Customer Ln',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001',
          country: 'USA',
        },
        isActive: true,
      },
    ];

    // ✅ Use save() — NOT insertMany() — so pre-save hook hashes passwords
    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }

    // ✅ Create a shop for the seeded seller so they can use the dashboard immediately
    const sellerUser = createdUsers.find(u => u.role === 'seller');
    if (sellerUser) {
      const existingShop = await Shops.findOne({ seller: sellerUser._id });
      if (!existingShop) {
        await new Shops({
          seller: sellerUser._id,
          shopName: "Sarah's Store",
          description: 'Quality products at great prices',
          shopStatus: 'pending',
          hasMetRequirements: false,
          publishedProducts: 0,
          isActive: true,
        }).save();
        console.log("Seller shop created for Sarah Seller");
      }
    }

    console.log('Sample users created successfully');
  } catch (error) {
    console.error('Error creating users:', error);
  }
};

module.exports = userSeeder;