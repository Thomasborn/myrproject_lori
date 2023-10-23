const jwt = require('jsonwebtoken');
const secretKey = require('../secret_key/secret_key');

const checkAuth = (req, res, next) => {
  // Check if the 'authToken' cookie exists
  
    // Retrieve the user information from the session
    const userData = req.session.user;
  // change into role
    if (userData.username !="otakuz1") {
      return res.status(401).json({ message: 'Akses tidak dimiliki' });
    }

  
    next();
};

module.exports = checkAuth;
