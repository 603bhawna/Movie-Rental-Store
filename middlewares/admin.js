function admin(req, res, next) {
    if (!req.user.isAdmin) {
      res.status(403);
      res.send("Access Denied");
      return;
    }
    next();
  }
  
  module.exports = admin;
  