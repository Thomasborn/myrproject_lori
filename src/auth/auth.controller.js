// controllers/authController.js

const express = require("express");
const prisma = require("../db");
const jwt = require('jsonwebtoken');
const cookie = require('cookie')
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const multer = require("multer");
const bcrypt = require('bcrypt')
const upload = multer();
const authService = require('../auth/auth.service'); 
const authKaryawan = require('../karyawan/karyawan.service'); 
const router = express.Router();
const NodeCache = require("node-cache")
const permissionsCache = new NodeCache();
const userService = require("./auth.service");


router.post("/login",upload.none(), async(req, res)=> {
 
  try {
    const { email, password } = req.body;
    const hashedPassword = await authService.checkPasswordByEmail(email);
  
    if (hashedPassword) {
      // Verify the user's password
      const isPasswordMatch = await authService.verifyPassword(password, hashedPassword);
  
      if (isPasswordMatch) {
        const user = await authService.authenticateUser(email);

      
        
        if (user) {
          // Authentication successful
          const token = authService.generateAuthToken(email);
          const {id,...karyawan} = await authKaryawan.getkaryawanById(user.karyawan_id);

          if (!req.session.user) {
            req.session.user = {}; // Initialize the user object if it doesn't exist
          }
          
          req.session.user.email = email;
          req.session.user.role_id = user.role_id;
          
          // Now you can use req.session.user.email and req.session.user.karyawan as needed.
          const session = req.session;
          
          res.cookie('authToken', token, { 
            httpOnly: true,
           
             });
          res.json({ message: 'Logged in successfully', session, token });
        } else {
          // User doesn't exist, authentication failed
          res.status(401).json({ message: 'User Tidak Ditemukan' });
        }
      } else {
        // Password doesn't match, authentication failed
        res.status(401).json({ message: 'Autentikasi tidak berhasil' });
      }
    } else {
      // User doesn't exist, authentication failed
      res.status(401).json({ message: 'User Tidak Ditemukan' });
    }
  } catch (err) {
    console.error('Error in user authentication:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }

});


router.post("/register", upload.none(),async (req, res) => {
  try {
    const { email, password } = req.body;
    const dataUser = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await authService.registerUser(dataUser);

    res.json({ message: 'Registered successfully', user });
  } catch (err) {
    if (err.message === 'email sudah ada') {
      // Handle the case where the email already exists
      return res.status(400).json({ message: 'email sudah ada' });
    } else {
      // Handle other errors
      console.error('Error in user registration:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
}});
router.post('/logout', (req, res) => {
  const cookieName = 'authToken';

  // Remove the cookie by setting its value to null and expiration date to the past
  res.cookie(cookieName, null, { expires: new Date(0), httpOnly: true});
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    
    // Clear the session cookie by setting its expiration date to the past
   });
    res.clearCookie('connect.sid');
    permissionsCache.flushAll();

  res.json({ message: `Berhasil keluar. '${cookieName}' dihapus` });
});
// Generate a random reset token
function generateResetToken() {
  return crypto.randomBytes(20).toString('hex');
}

// Store reset tokens with user email in memory or your database
const resetTokens = new Map();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'assaglow69@gmail.com',
    pass: 'minzpro8790x',
  },});
  const sendResetEmail = (email, token) => {
    const resetLink = `http://localhost:3008/auth/reset-password?token=${token}`;

    // Replace with your email configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'assaglow69@gmail.com',
        pass: 'vuvf cewr xwnx xbxo',
      },
    });
  
    const mailOptions = {
      from: 'Wear Lori',
      to: email,
      subject: 'Password Reset',
      text: `Klik link ini untuk mengubah password: ${resetLink}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    })};  

    const generateToken = async () => {
      const token = crypto.randomBytes(20).toString('hex');
      return await bcrypt.hash(token, 10); // Hash the token
    };
    
    const tokenStorage = {};
    
    router.post('/forget-password',upload.none(), async (req, res) => {
      try {
        const { email } = req.body;
    
        // Check if the email exists in the database
        const user = await prisma.user.findUnique({
          where: { email },
        });
    
        if (user) {
          // Generate a hashed token and store it for later verification
          const hashedToken = await generateToken();
          tokenStorage[email] = {
            token: hashedToken,
            expires: Date.now() + 3600000, // 1 hour in milliseconds
          };
          // Send an email with the reset link
          sendResetEmail(email, hashedToken);
    
          res.status(200).json({ message: 'Password reset email sent successfully' });
        } else {
          res.status(400).json({ message: 'Email address not found' });
        }
      } catch (err) {
        // Handle other errors
        console.error('Error in forget password:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    });
    
    router.post('/reset-password/:token',upload.none(), async (req, res) => {
      const { email, token, newPassword } = req.body;
    
     // Decode the token
  const decodedToken = decodeURIComponent(token);

  // Verify token and update password
  const storedToken = tokenStorage[email];
  if (storedToken) {
    const { token, expires } = storedToken;
    // const coba=(decodedToken== token);
    // return res.status(200).json({ message: 'Password reset successful',decodedToken,token,coba });

  if (Date.now() < expires && (decodedToken== token)) {
    try {
      // Update the password in the database
      const hashedPassword = await userService.hashPassword(newPassword);
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });

      // Clear the token after password reset
      delete tokenStorage[email];

      return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
      }
    
      res.status(400).json({ message: 'Invalid token or email' });
   } });
    
    router.get('/reset-password',upload.none(), (req, res) => {
      const { token } = req.query;
    
      // Render a form or a page where the user can enter a new password
      // You may want to verify the token here and proceed accordingly
    
      // Example: Render a form with hidden input for the token
      res.send(`
        <html>
          <body>
            <form action="/auth/reset-password/${encodeURIComponent(token)}" method="post">
              <input type="hidden" name="token" value="${encodeURIComponent(token)}">
              <label for="newPassword">New Password:</label>
              <input type="password" id="newPassword" name="newPassword" required>
              <input type="email" id="email" name="email" required>
              <button type="submit">Reset Password</button>
            </form>
          </body>
        </html>
      `);
    });
// router.get('/logout', (req, res) => {
//   const cookieName = 'authToken';

//   // Remove the cookie by setting its value to null and expiration date to the past
//   res.cookie(cookieName, null, { expires: new Date(0), httpOnly: true});
//   req.session.destroy((err) => {
//     if (err) {
//       console.error('Error destroying session:', err);
//       return res.status(500).json({ message: 'Internal Server Error' });
//     }
    
//     // Clear the session cookie by setting its expiration date to the past
//    });
//     res.clearCookie('connect.sid');
 
//     // Clear the cache
//     permissionsCache.flushAll();


//   res.json({ message: `Logout success with '${cookieName}' dihapus` });
// });

module.exports= router
