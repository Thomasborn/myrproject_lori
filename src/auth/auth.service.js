// services/authService.js
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const secretKey = require('../secret_key/secret_key'); // Replace with your secret key
const userRepository = require('./auth.repository'); // Import the user repository


const authenticateUser= async (username, password)=> {
  try {
    // Implement the authentication logic using the user repository
    const user = userRepository.findByUsernameAndPassword(username, password);

    if (!user) {
        throw new Error('Authentication failed');
    }

    return user;
  } catch (error) {
   
    console.error('Error in findByUsernameAndPassword:', error); // You can handle and log the error here or rethrow it
    throw error;
  }
}

function generateAuthToken(username) {
  try {
    const token = jwt.sign({ username: username }, secretKey.Key);
    return token;
  } catch (error) {
    // You can handle and log the error here or rethrow it
    throw error;
  }
}

// Function to hash the user's password
async function hashPassword(password) {
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
  const registerUser = async (username, password) => {
  
      // Hash the user's password before storing it
      const hashedPassword = await hashPassword(password);
  
      // Create the user in the repository with the hashed password
      const user = userRepository.createUser(username, hashedPassword);
    
      return user;
   
  }
  const checkUser= async (username)=>{
    const user = await userRepository.getForgetPassword(username)

    return user;
  }
  
  
  ;
  const checkEmail= async (username)=>{
    const user = await userRepository.findUserByUsername(username)

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
  module.exports = { authenticateUser, generateAuthToken,registerUser,verifyPassword,checkUser ,checkEmail};
