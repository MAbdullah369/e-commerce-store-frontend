const Category = require('../models/Category');

const categorySeeder = async () => {
  try {
    const existingCategories = await Category.countDocuments();
    if (existingCategories > 0) {
      console.log('Categories already exist');
      return;
    }

    const categories = [
      {
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        slug: 'electronics',
      },
      {
        name: 'Fashion',
        description: 'Clothing, shoes, and accessories',
        slug: 'fashion',
      },
      {
        name: 'Home & Living',
        description: 'Home furniture and decor',
        slug: 'home-living',
      },
      {
        name: 'Sports',
        description: 'Sports equipment and gear',
        slug: 'sports',
      },
      {
        name: 'Books',
        description: 'Books and educational materials',
        slug: 'books',
      },
      {
        name: 'Toys & Games',
        description: 'Toys, games, and puzzles',
        slug: 'toys-games',
      },
      {
        name: 'Beauty & Personal Care',
        description: 'Beauty products and personal care items',
        slug: 'beauty-personal-care',
      },
      {
        name: 'Grocery & Food',
        description: 'Grocery items and food products',
        slug: 'grocery-food',
      },
    ];

    await Category.insertMany(categories);
    console.log('Categories created successfully');
  } catch (error) {
    console.error('Error creating categories:', error);
  }
};

module.exports = categorySeeder;
