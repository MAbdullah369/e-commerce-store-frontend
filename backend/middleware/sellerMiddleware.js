const User = require('../models/User');
const Shops = require('../models/Shops');

const sellerMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Admin can always pass through
    if (user.role === 'admin') {
      return next();
    }

    // Must have seller role
    if (user.role !== 'seller') {
      return res.status(403).json({ error: 'Seller access required' });
    }

    // Must have a shop (even if pending)
    const shop = await Shops.findOne({ seller: req.userId });
    if (!shop) {
      return res.status(403).json({ error: 'Please create a shop first' });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = sellerMiddleware;