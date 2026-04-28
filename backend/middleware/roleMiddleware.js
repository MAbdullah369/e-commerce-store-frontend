const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ 
        error: 'Access denied. Required roles: ' + allowedRoles.join(', ') 
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
