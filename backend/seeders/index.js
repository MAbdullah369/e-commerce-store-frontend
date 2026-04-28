const mongoose = require('mongoose');
require('dotenv').config();

const adminSeeder = require('./adminSeeder');
const categorySeeder = require('./categorySeeder');
const userSeeder = require('./userSeeder');
const productSeeder = require('./productSeeder');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    console.log('\nStarting database seeding...\n');

    await categorySeeder();
    await adminSeeder();
    await userSeeder();
    await productSeeder();

    console.log('\nDatabase seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;