const Payment = require('../models/Payment');
const Order = require('../models/Order');

// Create payment
exports.createPayment = async (req, res, next) => {
  try {
    const { orderId, paymentMethod, amount } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const payment = new Payment({
      order: orderId,
      user: req.userId,
      amount: amount || order.totalAmount,
      paymentMethod,
      status: 'pending',
    });

    await payment.save();

    res.status(201).json({
      message: 'Payment initiated',
      payment,
    });
  } catch (err) {
    next(err);
  }
};

// Process payment (simulate payment gateway)
exports.processPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Simulate payment processing
    payment.status = 'completed';
    payment.transactionId = `TXN-${Date.now()}`;

    const order = await Order.findById(payment.order);
    if (order) {
      order.paymentStatus = 'completed';
      await order.save();
    }

    await payment.save();

    res.json({
      message: 'Payment completed successfully',
      payment,
    });
  } catch (err) {
    next(err);
  }
};

// Get payment details
exports.getPaymentDetails = async (req, res, next) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId).populate('order');
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (err) {
    next(err);
  }
};

// Refund payment
exports.refundPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { refundReason } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ error: 'Can only refund completed payments' });
    }

    payment.status = 'refunded';
    payment.refundedAmount = payment.amount;
    payment.refundReason = refundReason;
    payment.refundedAt = new Date();

    await payment.save();

    res.json({
      message: 'Payment refunded successfully',
      payment,
    });
  } catch (err) {
    next(err);
  }
};

// Get order payments
exports.getOrderPayments = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const payments = await Payment.find({ order: orderId });
    res.json(payments);
  } catch (err) {
    next(err);
  }
};

// Get user payments
exports.getUserPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.userId }).populate('order');
    res.json(payments);
  } catch (err) {
    next(err);
  }
};
