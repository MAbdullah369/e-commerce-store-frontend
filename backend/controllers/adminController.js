const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Shops = require('../models/Shops');

// ==================== DASHBOARD ====================

// Get admin dashboard data
exports.getDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSellers = await Shops.countDocuments({ shopStatus: 'active' });
    const totalCategories = await Category.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    res.json({
      message: 'Dashboard data fetched',
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        activeSellers,
        totalCategories,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ==================== USER MANAGEMENT ====================

// Get all active users
exports.getActiveUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const users = await User.find({ isActive: true })
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({ isActive: true });

    res.json({
      message: 'Active users fetched',
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (err) {
    next(err);
  }
};

// Get users by status (active or inactive)
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (status === 'active') query.isActive = true;
    else if (status === 'inactive') query.isActive = false;

    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      message: 'Users fetched',
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (err) {
    next(err);
  }
};

// Get user details
exports.getUserDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User details fetched',
      user,
    });
  } catch (err) {
    next(err);
  }
};

// Deactivate user
exports.deactivateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User deactivated successfully',
      user,
    });
  } catch (err) {
    next(err);
  }
};

// Activate user
exports.activateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User activated successfully',
      user,
    });
  } catch (err) {
    next(err);
  }
};

// ==================== SELLER MANAGEMENT ====================

// Get all sellers
exports.getAllSellers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const sellers = await Shops.find()
      .populate('seller', 'name email phone')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Shops.countDocuments();

    res.json({
      message: 'All sellers fetched',
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      sellers,
    });
  } catch (err) {
    next(err);
  }
};

// Get active sellers
exports.getActiveSellers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const sellers = await Shops.find({ shopStatus: 'active' })
      .populate('seller', 'name email phone')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Shops.countDocuments({ shopStatus: 'active' });

    res.json({
      message: 'Active sellers fetched',
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      sellers,
    });
  } catch (err) {
    next(err);
  }
};

// Approve/Activate seller shop
exports.approveSeller = async (req, res, next) => {
  try {
    const { shopId } = req.params;

    const shop = await Shops.findByIdAndUpdate(
      shopId,
      { shopStatus: 'active', hasMetRequirements: true },
      { new: true }
    ).populate('seller', 'name email phone');

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json({
      message: 'Seller shop approved successfully',
      shop,
    });
  } catch (err) {
    next(err);
  }
};

// Suspend seller shop
exports.suspendSeller = async (req, res, next) => {
  try {
    const { shopId } = req.params;

    const shop = await Shops.findByIdAndUpdate(
      shopId,
      { shopStatus: 'suspended' },
      { new: true }
    ).populate('seller', 'name email phone');

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json({
      message: 'Seller shop suspended successfully',
      shop,
    });
  } catch (err) {
    next(err);
  }
};

// ==================== CATEGORY MANAGEMENT ====================

// Get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const categories = await Category.find()
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Category.countDocuments();

    res.json({
      message: 'All categories fetched',
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      categories,
    });
  } catch (err) {
    next(err);
  }
};

// Create category
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Please provide category name' });
    }

    const category = new Category({
      name,
      description,
      image,
    });

    await category.save();

    res.status(201).json({
      message: 'Category created successfully',
      category,
    });
  } catch (err) {
    next(err);
  }
};

// Update category
exports.updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { name, description, image } = req.body;

    const category = await Category.findByIdAndUpdate(
      categoryId,
      { name, description, image },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({
      message: 'Category updated successfully',
      category,
    });
  } catch (err) {
    next(err);
  }
};

// Delete category
exports.deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ==================== PRODUCT MANAGEMENT ====================

// Get all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status === 'published') query.isPublished = true;
    if (status === 'unpublished') query.isPublished = false;

    const products = await Product.find(query)
      .populate('seller', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      message: 'All products fetched',
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (err) {
    next(err);
  }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await Product.findByIdAndDelete(productId);

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ==================== REVIEW MANAGEMENT ====================

// Delete inappropriate review
exports.deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Mark review as helpful
exports.markHelpful = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({
      message: 'Review marked as helpful',
      review,
    });
  } catch (err) {
    next(err);
  }
};
