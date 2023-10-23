const jwt = require('jsonwebtoken');
const secretKey = require('../secret_key/secret_key');

const checkAuth = (req, res, next) => {
  // Check if the 'authToken' cookie exists
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey.Key, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

  
  
    next();
  });
};

module.exports = checkAuth;
