const User = require('../models/User');
const Shops = require('../models/Shops');
const Product = require('../models/Product');

// Register as seller
exports.registerAsSeller = async (req, res, next) => {
  try {
    const { shopName, description, phone, email, address } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isSeller) {
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
    });

    await shop.save();

    user.isSeller = true;
    user.role = 'seller';
    user.shop = shop._id;
    await user.save();

    res.status(201).json({
      message: 'Seller registration successful',
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
