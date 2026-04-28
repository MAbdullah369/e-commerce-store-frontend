const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const adminSeeder = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const admin = new User({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: 'Admin123@',
      role: 'admin',
      phone: '9999999999',
      address: {
        street: '123 Admin Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      isActive: true,
    });

    await admin.save();
    console.log('Admin user created successfully:', admin.email);
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};

module.exports = adminSeeder;
