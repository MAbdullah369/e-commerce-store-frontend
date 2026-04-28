const Product = require('../models/Product');
const Category = require('../models/Category');

// Get all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search, sort, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let query = Product.find(filter).populate('seller', 'name');

    if (sort) {
      const sortObj = {};
      if (sort === 'price-asc') sortObj.price = 1;
      if (sort === 'price-desc') sortObj.price = -1;
      if (sort === 'newest') sortObj.createdAt = -1;
      if (sort === 'rating') sortObj.rating = -1;
      query = query.sort(sortObj);
    }

    const skip = (page - 1) * limit;
    const products = await query.skip(skip).limit(parseInt(limit));
    const total = await Product.countDocuments(filter);

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (err) {
    next(err);
  }
};

// Get product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ category: categoryId, isActive: true });

    res.json(products);
  } catch (err) {
    next(err);
  }
};

// Get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// Create product (seller only)
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      seller: req.userId,
      image: req.file ? req.file.path : null,
    });

    await product.save();
    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (err) {
    next(err);
  }
};

// Update product (seller only)
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.seller.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this product' });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (category) product.category = category;
    if (req.file) product.image = req.file.path;

    await product.save();
    res.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (err) {
    next(err);
  }
};

// Delete product (seller/admin only)
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.seller.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};
