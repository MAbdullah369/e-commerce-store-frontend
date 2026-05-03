const User = require('../models/User');
const Shops = require('../models/Shops');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// ─────────────────────────────────────────────
// GET /sellers/shop  — get the logged-in seller's own shop
// ─────────────────────────────────────────────
exports.getMyShop = async (req, res, next) => {
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

// ─────────────────────────────────────────────
// POST /sellers/shop  — create a new shop
// Works for users with role='seller' who don't have a shop yet,
// AND for buyers registering as sellers for the first time.
// ─────────────────────────────────────────────
exports.createShop = async (req, res, next) => {
  try {
    const { shopName, description, logo, phone, email, address } = req.body;

    if (!shopName) {
      return res.status(400).json({ error: 'Please provide a shop name' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if shop already exists for this user
    const existingShop = await Shops.findOne({ seller: req.userId });
    if (existingShop) {
      return res.status(400).json({ error: 'You already have a shop' });
    }

    const shop = new Shops({
      seller: req.userId,
      shopName,
      description,
      shopLogo: logo,
      phone,
      email,
      address,
      shopStatus: 'pending',
      hasMetRequirements: false,
    });

    await shop.save();

    // If user is still a buyer, promote to seller
    if (user.role !== 'seller') {
      user.role = 'seller';
      await user.save();
    }

    res.status(201).json({
      message: 'Shop created! Publish at least 3 products to activate it.',
      shop,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// POST /sellers/register  — legacy: buyer registers as seller
// Kept for backwards compatibility
// ─────────────────────────────────────────────
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

    // If already a seller AND already has a shop → error
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
      shopStatus: 'pending',
      hasMetRequirements: false,
    });

    await shop.save();

    // Promote to seller if not already
    if (user.role !== 'seller') {
      user.role = 'seller';
      await user.save();
    }

    res.status(201).json({
      message: 'Seller registration successful. Please publish at least 3 products to activate your shop.',
      shop,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// GET /sellers/profile
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// PUT /sellers/shop  — update shop details
// ─────────────────────────────────────────────
exports.updateShop = async (req, res, next) => {
  try {
    const { shopName, description, logo, phone, email, address, socialLinks } = req.body;

    const shop = await Shops.findOne({ seller: req.userId });
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    if (shopName) shop.shopName = shopName;
    if (description) shop.description = description;
    if (logo) shop.shopLogo = logo;
    if (phone) shop.phone = phone;
    if (email) shop.email = email;
    if (address) shop.address = address;
    if (socialLinks) shop.socialLinks = socialLinks;

    await shop.save();

    res.json({ message: 'Shop updated successfully', shop });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// PUT /sellers/profile  — same as updateShop (legacy alias)
// ─────────────────────────────────────────────
exports.updateSellerProfile = async (req, res, next) => {
  return exports.updateShop(req, res, next);
};

// ─────────────────────────────────────────────
// GET /sellers/stats  — dashboard stats for seller
// ─────────────────────────────────────────────
exports.getSellerStats = async (req, res, next) => {
  try {
    const Order = require('../models/Order');

    const totalProducts = await Product.countDocuments({ seller: req.userId });
    const publishedProducts = await Product.countDocuments({ seller: req.userId, isPublished: true });

    // Aggregate sales from orders
    const salesAgg = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: '$productInfo' },
      {
        $match: {
          'productInfo.seller': new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$items.subtotal' },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const myRecentOrders = await Order.find({ 'items.seller': req.userId })
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Filter items and calculate subtotal for recent orders
    const filteredRecentOrders = myRecentOrders.map(order => {
      const myItems = order.items.filter(item => 
        item.seller?.toString() === req.userId || 
        item.product?.seller?.toString() === req.userId
      );
      const sellerSubtotal = myItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
      return { ...order, items: myItems, sellerSubtotal };
    });

    res.json({
      totalProducts,
      publishedProducts,
      totalSales: salesAgg[0]?.totalSales || 0,
      totalOrders: salesAgg[0]?.totalOrders || 0,
      averageRating: 0, 
      recentOrders: filteredRecentOrders,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// GET /sellers/products  — all products for this seller
// ─────────────────────────────────────────────
exports.getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.userId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// GET /sellers/orders  — orders containing this seller's products
// ─────────────────────────────────────────────
exports.getSellerOrders = async (req, res, next) => {
  try {
    const Order = require('../models/Order');

    const orders = await Order.find({ 'items.seller': req.userId })
      .populate('user', 'name email')
      .populate('items.product', 'name seller price image')
      .sort({ createdAt: -1 })
      .lean();

    // Filter items to only show those belonging to this seller
    const filteredOrders = orders.map(order => {
      const myItems = order.items.filter(item => 
        item.seller?.toString() === req.userId || 
        item.product?.seller?.toString() === req.userId
      );
      const sellerSubtotal = myItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
      return { ...order, items: myItems, sellerSubtotal };
    });

    res.json(filteredOrders);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// GET /sellers/sales
// ─────────────────────────────────────────────
exports.getSellerSales = async (req, res, next) => {
  try {
    const Order = require('../models/Order');

    const sales = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: '$productInfo' },
      {
        $match: {
          // ✅ Fixed: use `new` keyword — mongoose.Types.ObjectId() as function is deprecated in Mongoose 6+
          'productInfo.seller': new mongoose.Types.ObjectId(req.userId),
        },
      },
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

// ─────────────────────────────────────────────
// GET /sellers/shop/status
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// GET /sellers/  — all active shops (public)
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// GET /sellers/:sellerId  — public shop by seller user ID
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// POST /sellers/products/create  — create product (draft)
// ─────────────────────────────────────────────
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

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
      isPublished: false,
    });

    await product.save();

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// PATCH /sellers/products/:productId/publish
// ─────────────────────────────────────────────
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

    const publishedCount = await Product.countDocuments({
      seller: req.userId,
      isPublished: true,
    });

    const shop = await Shops.findOne({ seller: req.userId });
    shop.publishedProducts = publishedCount;

    if (publishedCount >= 3 && shop.shopStatus === 'pending') {
      shop.shopStatus = 'active';
      shop.hasMetRequirements = true;
      await shop.save();

      return res.json({
        message: 'Product published! Your shop is now active.',
        product,
        shop,
      });
    }

    await shop.save();

    const remaining = Math.max(0, 3 - publishedCount);
    res.json({
      message: `Product published. ${remaining} more product${remaining !== 1 ? 's' : ''} needed to activate your shop.`,
      product,
      publishedProducts: publishedCount,
      remainingRequired: remaining,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// DELETE /sellers/products/:productId
// ─────────────────────────────────────────────
exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.seller.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await product.deleteOne();

    // Update published count on shop
    const publishedCount = await Product.countDocuments({ seller: req.userId, isPublished: true });
    await Shops.findOneAndUpdate({ seller: req.userId }, { publishedProducts: publishedCount });

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// PUT /sellers/products/:productId
// ─────────────────────────────────────────────
exports.updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.seller.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { name, description, price, category, stock, image } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (image) product.image = image;

    await product.save();

    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    next(err);
  }
};