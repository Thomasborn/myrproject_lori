// services/authService.js
const bcrypt          = require('bcrypt')
const jwt             = require('jsonwebtoken');
const secretKey       = process.env.KEY; // Replace with your secret key
// const secretKey = require('../secret_key/secret_key'); // Replace with your secret key
const userRepository  = require('./auth.repository'); // Import the user repository


const authenticateUser= async (email, password)=> {
  try {
    // Implement the authentication logic using the user repository
    const user = userRepository.findByEmailAndPassword(email, password);

    if (!user) {
        throw new Error('Authentication failed');
    }

    return user;
  } catch (error) {
   
    console.error('Error in findByEmailAndPassword:', error); // You can handle and log the error here or rethrow it
    throw error;
  }
}

function generateAuthToken(email) {
  try {
    const token = jwt.sign({ email: email }, secretKey);
    return token;
  } catch (error) {
    // You can handle and log the error here or rethrow it
    throw error;
  }
}

// Function to hash the user's password
const hashPassword= async (password)=> {
    try {
      // const saltRounds = bcrypt.genSalt(10); // The number of salt rounds (adjust as needed)
      const saltRounds = (10); // The number of salt rounds (adjust as needed)
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw error;
    }
  }
  
  // Function to register a user with a hashed password
  const registerUser = async (dataUser) => {
  
  
      // membuat user pada repository
      
      const user = userRepository.createUser(dataUser);
      return user;
   
  }
  const checkUser= async (email)=>{
    const user = await userRepository.getForgetPassword(email)

    return user;
  }
  const checkPasswordByEmail= async (email)=>{
    const user = await userRepository.getHashedPasswordByemail(email)

    return user;
  }
  
  
  ;
  const checkEmail= async (email)=>{
    const user = await userRepository.findUserByemail(email)

    return user;
  }
  const verifyPassword = async (password, hashedPassword) => {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch (error) {
      // Handle any errors that may occur during the comparison
      console.error('Error comparing passwords:', error); // Log the e
          return false; // Return false if there's an error
    }
  
  };
  module.exports = { authenticateUser, generateAuthToken,registerUser,verifyPassword,checkUser ,checkEmail,hashPassword,checkPasswordByEmail};
