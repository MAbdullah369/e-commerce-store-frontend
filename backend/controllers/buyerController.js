const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get cart
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.userId }).populate('items.product');

    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// Add to cart
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }

    cart.calculateTotals();
    await cart.save();
    await cart.populate('items.product');

    res.json({
      message: 'Item added to cart',
      cart,
    });
  } catch (err) {
    next(err);
  }
};

// Update cart item
exports.updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ error: 'Item not in cart' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    cart.calculateTotals();
    await cart.save();
    await cart.populate('items.product');

    res.json({
      message: 'Cart updated',
      cart,
    });
  } catch (err) {
    next(err);
  }
};

// Remove from cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    cart.calculateTotals();
    await cart.save();
    await cart.populate('items.product');

    res.json({
      message: 'Item removed from cart',
      cart,
    });
  } catch (err) {
    next(err);
  }
};

// Clear cart
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    cart.calculateTotals();
    await cart.save();
    await cart.populate('items.product');

    res.json({
      message: 'Cart cleared',
      cart,
    });
  } catch (err) {
    next(err);
  }
};

// Get wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    const Wishlist = require('../models/Wishlist');
    const wishlist = await Wishlist.findOne({ user: req.userId }).populate('items.product');

    res.json(wishlist || { user: req.userId, items: [] });
  } catch (err) {
    next(err);
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const Wishlist = require('../models/Wishlist');

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.userId, items: [] });
    }

    const existingItem = wishlist.items.find((item) => item.product.toString() === productId);

    if (!existingItem) {
      wishlist.items.push({ product: productId });
      await wishlist.save();
    }

    await wishlist.populate('items.product');

    res.json({
      message: 'Item added to wishlist',
      wishlist,
    });
  } catch (err) {
    next(err);
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const Wishlist = require('../models/Wishlist');

    const wishlist = await Wishlist.findOne({ user: req.userId });
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    wishlist.items = wishlist.items.filter((item) => item.product.toString() !== productId);
    await wishlist.save();
    await wishlist.populate('items.product');

    res.json({
      message: 'Item removed from wishlist',
      wishlist,
    });
  } catch (err) {
    next(err);
  }
};
