// JWT Authentication Middleware placeholder
module.exports = (req, res, next) => {
  console.log('[Auth Middleware] Verifying token (Mock/Placeholder)...');
  req.user = { id: 'mock-user-123', email: 'papa@kynn.vn', name: 'Papa Hoang' };
  next();
};
