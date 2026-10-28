export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user ? req.user.role : 'anonymous'}' is not authorized to access this resource.`
      });
    }
    next();
  };
};

export const verifyHotelAccess = (req, res, next) => {
  if (req.user.role === 'superadmin') {
    return next();
  }

  const hotelIdParam = req.params.hotelId || req.body.hotelId || req.query.hotelId;
  if (!hotelIdParam) {
    return next();
  }

  if (req.user.role === 'manager' || req.user.role === 'staff') {
    if (req.user.assignedHotelId && req.user.assignedHotelId.toString() !== hotelIdParam.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have management permissions for this specific hotel property.'
      });
    }
  }

  next();
};
