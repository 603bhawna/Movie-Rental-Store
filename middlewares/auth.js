const jwt = require("jsonwebtoken");
const config=require('config');
function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(401);
    res.send("Access Denied- No token provided");
    return;
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400);
    res.send("Invalid Token");
    return;
  }
}

module.exports = auth;
