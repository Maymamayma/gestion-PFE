//check role lkol fard tharba
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });

    if (!allowedRoles.includes(req.user.role))
      return res.status(403).json({
        error: "Access denied",
        requiredRoles: allowedRoles,
        currentRole: req.user.role,
      });

    next();
  };
};
