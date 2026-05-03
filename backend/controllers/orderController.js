const Order = require('../models/Order');
const Product = require('../models/Product');
const Payment = require('../models/Payment');

// ─────────────────────────────────────────────
// Helper — simulate notifications (replace with
// real email/SMS service in production)
// ─────────────────────────────────────────────
const notifyBuyer = async (order, event) => {
  console.log(`[NOTIFY BUYER] Order ${order.orderNumber} — ${event}`);
  // TODO: integrate nodemailer / SendGrid / Twilio here
};

const notifySeller = async (order, event) => {
  const sellerIds = [...new Set(order.items.map(i => i.seller?.toString()).filter(Boolean))];
  console.log(`[NOTIFY SELLER(S)] ${sellerIds.join(', ')} — Order ${order.orderNumber} — ${event}`);
  // TODO: integrate notification service here
};

// ─────────────────────────────────────────────
// GET /orders  — buyer's own orders
// ─────────────────────────────────────────────
exports.getBuyerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('items.product', 'name image price')
      .populate('items.seller', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// GET /orders/:id
// ─────────────────────────────────────────────
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name image price description')
      .populate('items.seller', 'name email')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check authorization: buyer, seller of items in order, or admin
    const isOrderOwner = order.user._id.toString() === req.userId;
    const isAdmin = req.userRole === 'admin';
    const isSeller = req.userRole === 'seller' && 
      order.items.some(item => item.seller && item.seller._id.toString() === req.userId);

    if (!isOrderOwner && !isSeller && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// POST /orders  — place order
//
// Pipeline:
//   1. Validate items & stock
//   2. Calculate total
//   3. Save Order (status: pending)
//   4. Create Payment record (status: pending)
//   5. Simulate payment verification → mark completed
//   6. Deduct stock
//   7. Update order status → confirmed
//   8. Notify seller & buyer
// ─────────────────────────────────────────────
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }
    if (!shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.country) {
      return res.status(400).json({ error: 'Please provide a complete shipping address' });
    }
    if (!paymentMethod) {
      return res.status(400).json({ error: 'Please select a payment method' });
    }

    // ── Step 1 & 2: Validate stock + calculate total ──
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item.productId}` });
      }
      if (!product.isActive || !product.isPublished) {
        return res.status(400).json({ error: `Product "${product.name}" is no longer available` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for "${product.name}". Available: ${product.stock}`,
        });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        seller:  product.seller,
        quantity: item.quantity,
        price:   product.price,
        subtotal,
      });
    }

    // ── Step 3: Save order (pending) ──
    const order = new Order({
      user: req.userId,
      items: orderItems,
      shippingAddress,
      totalAmount,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending',
    });
    await order.save();

    // ── Step 4: Create payment record ──
    const payment = new Payment({
      order: order._id,
      user:  req.userId,
      amount: totalAmount,
      paymentMethod,
      status: 'pending',
    });
    await payment.save();

    // ── Step 5: Simulate payment verification ──
    // In production: call Stripe / PayPal / Razorpay here and await callback
    payment.status = 'completed';
    payment.transactionId = `TXN-${Date.now()}`;
    await payment.save();

    // ── Step 6: Deduct stock ──
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // ── Step 7: Confirm order ──
    order.status = 'confirmed';
    order.paymentStatus = 'completed';
    order.sellerNotified = false;
    order.buyerNotified = false;
    await order.save();

    // ── Step 8: Notify seller & buyer ──
    await notifySeller(order, 'New order received');
    await notifyBuyer(order, 'Order confirmed');
    order.sellerNotified = true;
    order.buyerNotified  = true;
    await order.save();

    // Return populated order
    const populated = await Order.findById(order._id)
      .populate('items.product', 'name image price')
      .populate('items.seller', 'name');

    res.status(201).json({
      message: 'Order placed successfully',
      order: populated,
      payment: { id: payment._id, transactionId: payment.transactionId, status: payment.status },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// PUT /orders/:id/cancel  — buyer/admin cancels
// Restores stock on cancellation
// ─────────────────────────────────────────────
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
      return res.status(400).json({ error: `Cannot cancel an order that is already ${order.status}` });
    }

    // Restore stock for each item
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = 'cancelled';
    order.cancelReason = cancelReason || 'Cancelled by user';
    order.cancellationDate = new Date();
    await order.save();

    await notifyBuyer(order, 'Order cancelled');
    await notifySeller(order, 'Order cancelled by buyer');

    res.json({ message: 'Order cancelled successfully', order });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// PUT /admin/orders/:id/status  — admin updates status
// Triggers notifications at each stage
// ─────────────────────────────────────────────
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, estimatedDelivery } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    if (status === 'delivered') order.deliveredAt = new Date();

    await order.save();

    // Notify based on status
    const notifyMap = {
      confirmed:  'Your order has been confirmed',
      processing: 'Your order is being processed',
      shipped:    `Your order has been shipped${trackingNumber ? ` (Tracking: ${trackingNumber})` : ''}`,
      delivered:  'Your order has been delivered',
      cancelled:  'Your order has been cancelled',
      refunded:   'Your order has been refunded',
    };

    if (notifyMap[status]) {
      await notifyBuyer(order, notifyMap[status]);
      if (['shipped', 'delivered'].includes(status)) {
        await notifySeller(order, `Order ${status}`);
      }
    }

    res.json({ message: 'Order status updated successfully', order });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// POST /orders/:id/review  — buyer submits review after delivery
// ─────────────────────────────────────────────
exports.submitReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { productId, rating, comment } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (order.status !== 'delivered') {
      return res.status(400).json({ error: 'You can only review delivered orders' });
    }

    // Update product rating
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const newReviewCount = product.reviews + 1;
    const newRating = ((product.rating * product.reviews) + rating) / newReviewCount;

    product.rating  = Math.round(newRating * 10) / 10;
    product.reviews = newReviewCount;
    await product.save();

    res.json({ message: 'Review submitted successfully', rating: product.rating });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// POST /orders/:id/return  — buyer requests return/refund
// ─────────────────────────────────────────────
exports.requestReturn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (order.status !== 'delivered') {
      return res.status(400).json({ error: 'You can only return delivered orders' });
    }
    if (order.refundStatus !== 'none') {
      return res.status(400).json({ error: 'A return has already been requested for this order' });
    }

    order.refundStatus = 'requested';
    order.refundReason = reason;
    await order.save();

    await notifyBuyer(order, 'Return request submitted — we will review it shortly');
    await notifySeller(order, 'Buyer requested a return');

    res.json({ message: 'Return request submitted successfully', order });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// PUT /orders/:id/ship  — seller marks as shipped
// ─────────────────────────────────────────────
exports.shipOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { trackingNumber } = req.body || {};

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Check if user is a seller for any item in this order
    const isSeller = order.items.some(item => item.seller?.toString() === req.userId);
    if (!isSeller && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to ship this order' });
    }

    if (order.status !== 'processing' && order.status !== 'confirmed') {
      return res.status(400).json({ error: `Cannot ship an order that is ${order.status}` });
    }

    order.status = 'shipped';
    if (trackingNumber) order.trackingNumber = trackingNumber;
    await order.save();

    await notifyBuyer(order, `Your order has been shipped!${trackingNumber ? ` (Tracking: ${trackingNumber})` : ''}`);
    
    res.json({ message: 'Order marked as shipped', order });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// PUT /orders/:id/receive  — buyer marks as delivered
// ─────────────────────────────────────────────
exports.receiveOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.user.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this order' });
    }

    if (order.status !== 'shipped') {
      return res.status(400).json({ error: 'You can only mark shipped orders as received' });
    }

    order.status = 'delivered';
    order.deliveredAt = new Date();
    await order.save();

    await notifySeller(order, 'Order has been received by the buyer');
    await notifyBuyer(order, 'Order marked as received. Thank you for shopping with us!');

    res.json({ message: 'Order marked as received', order });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// GET /orders/admin/all  — admin sees all orders
// ─────────────────────────────────────────────
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .populate('items.seller', 'name email')
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