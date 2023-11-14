const jwt = require('jsonwebtoken');
const secretKey       = process.env.Key;
const prisma = require("../src/db");


  const role_permission = async (userData) => {
    try {
      const permissions = await prisma.hak_akses.findMany({
        where: {
          role_id: userData, // Assuming `userData` contains the user's role_id
        },
      });
      return permissions;
    } catch (error) {
      // Handle any potential errors, e.g., database query errors
      console.error('Error fetching user permissions:', error);
      return [];
    }
  };
  
  const checkAuth = async (req, res, next) => {
    // You should obtain the user's role_id from your authentication mechanism
    // const userData = 1; // Replace with the actual user's role_id
      const userData = parseInt(req.session.user.role_id);
  
    try {
      const permissions = await role_permission(userData);
  
      if (permissions.length > 0) {
        // User has the required permissions
      const role_permission=  req.userPermissions = permissions;
      switch (userData) {
            case 1:
                //for admin
              const admin = role_permission;
              res.send({data:admin, message: "hak_akses successfully" });
              // next();
            
              break;
            
            case 2:
              const owner = role_permission(userData);
              next();
              
              break;
              
            case 3:
              const qc = role_permission(userData);
              next();
      
              break;
      
            case 4:
              const penjahit = role_permission(userData);
              next();
      
              break;
          
            default:
              return res.status(401).json({ message: 'Akses tidak dimiliki' ,user:userData});
      
              break;
          }
        
       
      
      // Store permissions in the request object
      // res.send({data:role_permission})// Proceed to the next middleware or route
      } else {
        // User doesn't have the required permissions
        res.status(401).json({ message: 'Akses tidak dimiliki' });
      }
    } catch (error) {
      // Handle any potential errors, e.g., fetching permissions failed
      console.error('Error checking user permissions:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }

  // // next();
  //   try{
  //     const userData = parseInt(req.session.user.karyawan.role_id);
      
  //     // return res.status(401).json({ message: 'Akses tidak dimiliki' ,user:userData});
  //     // if(!userData){
  
  //     //   return res.status(401).json({ message: 'Akses tidak dimiliki' ,user:userData});
  //     // }
   
  //   // change into role
  // 

    
   

  
  
};

module.exports = checkAuthz;
