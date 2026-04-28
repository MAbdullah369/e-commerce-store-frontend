const User = require('../models/User');

const userSeeder = async () => {
  try {
    // Check if sample users exist
    const existingUsers = await User.countDocuments({ role: 'buyer' });
    if (existingUsers > 0) {
      console.log('Sample users already exist');
      return;
    }

    const users = [
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
        isSeller: true,
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

    await User.insertMany(users);
    console.log('Sample users created successfully');
  } catch (error) {
    console.error('Error creating users:', error);
  }
};

module.exports = userSeeder;
