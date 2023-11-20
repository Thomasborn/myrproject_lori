const jwt = require('jsonwebtoken');
const secretKey       = process.env.Key;
const prisma = require("../db");
const hak_akses = require("../hak_akses/hak_akses.service")

  // const role_permission = async (userData) => {
  //   try {
  //     const permissions = await prisma.hak_akses.findMany({
  //       where: {
  //         role_id: userData, // Assuming `userData` contains the user's role_id
  //       },
  //     });
  //     return permissions;
  //   } catch (error) {
  //     // Handle any potential errors, e.g., database query errors
  //     console.error('Error fetching user permissions:', error);
  //     return [];
  //   }
  // };
  const adminMiddleware = (req, res, next) => {
    // Check if the user has admin permissions
    // const url = req.url;
    // const permissions =  req.userPermissions;
    // console.log(permissions);
    
    //   res.status(401).json({ message: `Akses tidak dimiliki untuk ${url}`,permissions: permissions });
    
    
  };
  
  // Define other role-specific middleware functions as needed
  const ownerMiddleware = (req, res, next) => {
    const url = req.url;
    const permissions =  req.userPermissions;
    console.log(permissions);
    
      res.status(401).json({ message: `Akses tidak dimiliki untuk ${url}`,permissions: permissions });
    
  
    next();
    // Implement logic for the owner role
  };
  
  const qcMiddleware = (req, res, next) => {
    // Implement logic for the QC role
  };
  
  const penjahitMiddleware = (req, res, next) => {
    // Implement logic for the penjahit role
  };
  
  const checkAuth = async (req, res, next) => {
    // You should obtain the user's role_id from your authentication mechanism
    // const userData = 1; // Replace with the actual user's role_id
      const userData = parseInt(req.session.user.role_id);
      // res.json({ message: 'Akses tidak dimiliki 2',userData });
  
    try {
      const cacheKey = `permissions_${roleId}`;
  
      if(userData){
      // Check if the permissions are cached
      const cachedPermissions = memoryCache.get(cacheKey);
      if (cachedPermissions) {
        console.log('Fetching permissions from cache:', cachedPermissions);
        return cachedPermissions;
      }
    
      // If not cached, fetch permissions from the database
      const permissions = await hak_akses.getHakAksesByRoleId(roleId);
    
      // Cache the permissions
      memoryCache.put(cacheKey, permissions, cacheDuration);
    
      switch (userData) {
        case 1:
          // Owner
          ownerMiddleware(req, res, next);
          break;

        case 2:
          // Owner
          adminMiddleware(req, res, next);
          break;

        case 3:
          // QC
          qcMiddleware(req, res, next);
          break;

        case 4:
          // Penjahit
          penjahitMiddleware(req, res, next);
          break;

        default:
          res.status(401).json({ message: 'Akses tidak dimiliki 1' });
          break;
      }
      // Store permissions in the request object
      // res.send({data:role_permission})// Proceed to the next middleware or route
      } else {
        // User doesn't have the required permissions
        res.status(401).json({ message: 'Akses tidak dimiliki 2' ,userData});
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

module.exports = checkAuth;
