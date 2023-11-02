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

router.post("/login",upload.none(), async(req, res)=> {
 
  try {
    const { email, password } = req.body;
    const hashedPassword = await authService.checkPasswordByEmail(email);
  
    if (hashedPassword) {
      // Verify the user's password
      const isPasswordMatch = await authService.verifyPassword(password, hashedPassword);
  
      if (isPasswordMatch) {
        const user = await authService.authenticateUser(email);

        // res.json({ message: 'Logged in successfully', user });
        
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
router.get('/logout', (req, res) => {
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


  res.json({ message: `Logout success with '${cookieName}' dihapus` });
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
router.post("/forget-password", upload.none(),async (req, res) => {
  try {
    const { email } = req.body;

    if (!email.localeCompare(compareString, locales, {})) {
      return res.status(400).json({ message: 'Email are required' });
    }
    
    const user = await authService.checkEmail(email);
    if(!user.email){

      return res.status(400).json({ message: 'Email tidak ada' });
    } 
    const resetToken = generateResetToken();
    resetTokens.set(email, resetToken);
  
    const mailOptions = {
      from: 'assaglow69@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Untuk melakukan reset lakukan dengan mengakses link: http://localhost:3008/reset-password/${resetToken}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Email not sent' });
      }
  
      res.status(200).json({ message: 'Password reset email sent successfully' });
    });
  
  } catch (err) {
    if (err) {
      // Handle the case where the email already exists
      return res.status(400).json({ message:err.message });
    } else {
      // Handle other errors
      console.error('Error in user registration:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
}});

router.post('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Find the email associated with the reset token
  // and locate the user in your database
  const email = [...resetTokens.keys()].find(
    (key) => resetTokens.get(key) === token
  );

  if (!email) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  // Reset the user's password in your database
  // Don't forget to remove the reset token from your database or memory

  res.status(200).json({ message: 'Password reset successfully' });
});
router.get('/logout', (req, res) => {
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


  res.json({ message: `Logout success with '${cookieName}' dihapus` });
});

module.exports= router
