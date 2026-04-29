const User = require('../models/User');
const Shops = require('../models/Shops');
const Product = require('../models/Product');

// Register as seller (Create shop)
exports.registerAsSeller = async (req, res, next) => {
  try {
    const { shopName, description, phone, email, address } = req.body;

    if (!shopName) {
      return res.status(400).json({ error: 'Please provide shop name' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'seller') {
      return res.status(400).json({ error: 'Already registered as seller' });
    }

    const existingShop = await Shops.findOne({ seller: req.userId });
    if (existingShop) {
      return res.status(400).json({ error: 'Shop already exists for this user' });
    }

    const shop = new Shops({
      seller: req.userId,
      shopName,
      description,
      phone,
      email,
      address,
      shopStatus: 'pending', // Shop is pending until requirements are met
      hasMetRequirements: false,
    });

    await shop.save();

    // Update user role to seller
    user.role = 'seller';
    await user.save();

    res.status(201).json({
      message: 'Seller registration successful. Please publish at least 3 products to activate your shop.',
      shop,
    });
  } catch (err) {
    next(err);
  }
};

// Get seller profile
exports.getSellerProfile = async (req, res, next) => {
  try {
    const shop = await Shops.findOne({ seller: req.userId }).populate('seller', 'name email');

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json(shop);
  } catch (err) {
    next(err);
  }
};

// Update seller profile
exports.updateSellerProfile = async (req, res, next) => {
  try {
    const { shopName, description, phone, email, address, socialLinks } = req.body;

    const shop = await Shops.findOne({ seller: req.userId });
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    if (shopName) shop.shopName = shopName;
    if (description) shop.description = description;
    if (phone) shop.phone = phone;
    if (email) shop.email = email;
    if (address) shop.address = address;
    if (socialLinks) shop.socialLinks = socialLinks;

    await shop.save();

    res.json({
      message: 'Shop profile updated successfully',
      shop,
    });
  } catch (err) {
    next(err);
  }
};

// Get seller's products
exports.getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.userId });

    res.json({
      total: products.length,
      products,
    });
  } catch (err) {
    next(err);
  }
};

// Get seller's sales
exports.getSellerSales = async (req, res, next) => {
  try {
    const Order = require('../models/Order');

    const sales = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { 'items.seller': require('mongoose').Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$items.subtotal' },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    res.json(sales[0] || { totalSales: 0, totalOrders: 0 });
  } catch (err) {
    next(err);
  }
};

// Get all sellers
exports.getAllSellers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const shops = await Shops.find({ isActive: true })
      .populate('seller', 'name email')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Shops.countDocuments({ isActive: true });

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      shops,
    });
  } catch (err) {
    next(err);
  }
};

// Get seller by ID
exports.getSellerById = async (req, res, next) => {
  try {
    const { sellerId } = req.params;
    const shop = await Shops.findOne({ seller: sellerId }).populate('seller', 'name email');

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json(shop);
  } catch (err) {
    next(err);
  }
};

// ==================== PRODUCT PUBLISHING ====================

// Create product (seller creates draft)
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if seller has a shop
    const shop = await Shops.findOne({ seller: req.userId });
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found. Please create a shop first.' });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      seller: req.userId,
      image,
      isPublished: false, // Start as unpublished draft
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

// Publish product
exports.publishProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.seller.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to publish this product' });
    }

    product.isPublished = true;
    await product.save();

    // Check if seller has published at least 3 products
    const publishedCount = await Product.countDocuments({
      seller: req.userId,
      isPublished: true,
    });

    const shop = await Shops.findOne({ seller: req.userId });
    shop.publishedProducts = publishedCount;

    // If seller has 3+ products, activate the shop
    if (publishedCount >= 3 && shop.shopStatus === 'pending') {
      shop.shopStatus = 'active';
      shop.hasMetRequirements = true;
      await shop.save();

      return res.json({
        message: 'Product published successfully. Congratulations! Your shop is now active.',
        product,
        shop,
      });
    } else {
      await shop.save();

      const remaining = Math.max(0, 3 - publishedCount);
      return res.json({
        message: `Product published successfully. ${remaining} more products needed to activate your shop.`,
        product,
        publishedProducts: publishedCount,
        remainingRequired: remaining,
      });
    }
  } catch (err) {
    next(err);
  }
};

// Get shop activation status
exports.getShopStatus = async (req, res, next) => {
  try {
    const shop = await Shops.findOne({ seller: req.userId });
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const publishedCount = await Product.countDocuments({
      seller: req.userId,
      isPublished: true,
    });

    res.json({
      shopStatus: shop.shopStatus,
      hasMetRequirements: shop.hasMetRequirements,
      publishedProducts: publishedCount,
      remainingRequired: Math.max(0, 3 - publishedCount),
    });
  } catch (err) {
    next(err);
  }
};
