const Order = require('../models/Order');
const Product = require('../models/Product');

// Get buyer's orders
exports.getBuyerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// Get order by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check authorization
    if (order.user._id.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

// Create order
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        seller: product.seller,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });

      // Reduce product stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: req.userId,
      items: orderItems,
      shippingAddress,
      totalAmount,
      paymentMethod,
    });

    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (err) {
    next(err);
  }
};

// Update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (err) {
    next(err);
  }
};

// Cancel order
exports.cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.user.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to cancel this order' });
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ error: 'Cannot cancel order in current status' });
    }

    order.status = 'cancelled';
    order.cancelReason = cancelReason;
    order.cancellationDate = new Date();

    await order.save();

    res.json({
      message: 'Order cancelled successfully',
      order,
    });
  } catch (err) {
    next(err);
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      orders,
    });
  } catch (err) {
    next(err);
  }
};
