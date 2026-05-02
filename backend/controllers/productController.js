const Product = require('../models/Product');
const Category = require('../models/Category');

// ─────────────────────────────────────────────
// GET /products  — public product listing
// Only shows active + published products
// ─────────────────────────────────────────────
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search, sort, page = 1, limit = 12 } = req.query;

    // ✅ Only show active AND published products to the public
    const filter = { isActive: true, isPublished: true };

    if (category) filter.category = category;

    if (minPrice || maxPrice) {
      filter.price = {};
      // ✅ Cast to Number — query params are strings, $gte/$lte need numbers
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
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
    } else {
      query = query.sort({ createdAt: -1 });
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

// ─────────────────────────────────────────────
// GET /products/:id
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// GET /products/category/:categoryId
// ─────────────────────────────────────────────
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({
      category: categoryId,
      isActive: true,
      isPublished: true,
    }).populate('seller', 'name');
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// GET /products/categories
// ─────────────────────────────────────────────
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// POST /products  — seller creates a product
// Image is sent as a URL string (not a file upload)
// ─────────────────────────────────────────────
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, image, isPublished } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'Please provide name, description, price and category' });
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock) || 0,
      seller: req.userId,
      // ✅ image comes as URL string from the frontend form
      image: image || (req.file ? req.file.path : null),
      // ✅ Allow seller to create and immediately publish in one step
      isPublished: isPublished === true || isPublished === 'true' ? true : false,
      isActive: true,
    });

    await product.save();

    // If published, update shop's published count and check activation
    if (product.isPublished) {
      await checkAndActivateShop(req.userId);
    }

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// PUT /products/:id  — seller updates a product
// ─────────────────────────────────────────────
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, image, isPublished } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.seller.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this product' });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (category) product.category = category;
    if (image) product.image = image;
    if (req.file) product.image = req.file.path;

    // Handle publish toggle
    const wasPublished = product.isPublished;
    if (isPublished !== undefined) {
      product.isPublished = isPublished === true || isPublished === 'true';
    }

    await product.save();

    // If newly published, check shop activation
    if (!wasPublished && product.isPublished) {
      await checkAndActivateShop(req.userId);
    }

    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// DELETE /products/:id
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Helper — check published count and auto-activate shop
// ─────────────────────────────────────────────
async function checkAndActivateShop(userId) {
  try {
    const Shops = require('../models/Shops');

    const publishedCount = await Product.countDocuments({
      seller: userId,
      isPublished: true,
    });

    const shop = await Shops.findOne({ seller: userId });
    if (!shop) return;

    shop.publishedProducts = publishedCount;

    if (publishedCount >= 3 && shop.shopStatus === 'pending') {
      shop.shopStatus = 'active';
      shop.hasMetRequirements = true;
    }

    await shop.save();
  } catch (err) {
    console.error('Error checking shop activation:', err);
  }
}