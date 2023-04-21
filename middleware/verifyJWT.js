const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization; // good practice

  if (!authHeader) {
    return res.status(401).json({ message: "No auth header" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No bearer token" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>" => ["Bearer", "<token>"] => "<token>"

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyJWT;
