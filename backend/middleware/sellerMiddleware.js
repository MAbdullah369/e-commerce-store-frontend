const User = require('../models/User');

const sellerMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      return res.status(403).json({ error: 'Seller access required' });
    }

    if (!user.isSeller && user.role !== 'admin') {
      return res.status(403).json({ error: 'Please register as a seller first' });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = sellerMiddleware;
