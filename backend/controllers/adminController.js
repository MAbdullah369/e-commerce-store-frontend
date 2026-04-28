const Review = require('../models/Review');
const Product = require('../models/Product');

// Create review
exports.createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!rating || !title || !comment) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      product: productId,
      user: req.userId,
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    const review = new Review({
      product: productId,
      user: req.userId,
      rating,
      title,
      comment,
      verified: true, // In real app, check if user bought product
    });

    await review.save();

    // Update product rating
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    product.rating = avgRating;
    product.reviews = reviews.length;
    await product.save();

    res.status(201).json({
      message: 'Review created successfully',
      review,
    });
  } catch (err) {
    next(err);
  }
};

// Get product reviews
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ product: productId });

    res.json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

// Update review
exports.updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this review' });
    }

    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;

    await review.save();

    res.json({
      message: 'Review updated successfully',
      review,
    });
  } catch (err) {
    next(err);
  }
};

// Delete review
exports.deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.user.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this review' });
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

    res.json({
      message: 'Review marked as helpful',
      review,
    });
  } catch (err) {
    next(err);
  }
};
