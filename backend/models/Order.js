const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        quantity: { type: Number, required: true, min: 1 },
        price:    { type: Number, required: true },
        subtotal: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      street:  String,
      city:    String,
      state:   String,
      zipCode: String,
      country: String,
      phone:   String,
    },
    totalAmount:   { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'upi', 'bank_transfer'],
    },
    // Tracking
    trackingNumber:   String,
    estimatedDelivery: Date,
    deliveredAt:      Date,

    // Cancellation / Refund
    cancelReason:     String,
    cancellationDate: Date,
    refundStatus: {
      type: String,
      enum: ['none', 'requested', 'approved', 'rejected'],
      default: 'none',
    },
    refundReason: String,

    // Notifications sent flags
    sellerNotified: { type: Boolean, default: false },
    buyerNotified:  { type: Boolean, default: false },

    notes: String,
  },
  { timestamps: true }
);

// ✅ async pre-save — no next() — Mongoose 6+ awaits the promise automatically
orderSchema.pre('save', async function () {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
});

module.exports = mongoose.model('Order', orderSchema);