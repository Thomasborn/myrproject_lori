require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey       = process.env.KEY; // Secreat 
const checkAuth = (req, res, next) => {
  // Check if the 'authToken' cookie exists
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized',token:token });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(401).json({ message: err,token:token });
    }

  
  
    next();
  });
};

module.exports = checkAuth;
