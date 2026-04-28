// Sample data for the e-commerce application
module.exports = {
  users: [
    {
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: 'Admin123@',
      role: 'admin',
    },
    {
      name: 'John Buyer',
      email: 'buyer1@ecommerce.com',
      password: 'Buyer123@',
      role: 'buyer',
    },
    {
      name: 'Sarah Seller',
      email: 'seller1@ecommerce.com',
      password: 'Seller123@',
      role: 'seller',
    },
  ],
  categories: [
    { name: 'Electronics', description: 'Electronic devices and gadgets' },
    { name: 'Fashion', description: 'Clothing, shoes, and accessories' },
    { name: 'Home & Living', description: 'Home furniture and decor' },
    { name: 'Sports', description: 'Sports equipment and gear' },
  ],
};
