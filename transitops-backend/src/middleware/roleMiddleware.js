export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: Access restricted. Required role: one of [${allowedRoles.join(', ')}]. Current role: ${req.user ? req.user.role : 'None'}` 
      });
    }
    next();
  };
};
