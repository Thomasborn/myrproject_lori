const jwt = require('jsonwebtoken');
const secretKey       = process.env.Key;
const prisma = require("../db");
const hak_akses = require("../hak_akses/hak_akses.service")
const NodeCache = require('node-cache');
const permissionsCache = new NodeCache();

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
   
    
  

    // Implement logic for the owner role
  };
  
  const qcMiddleware = (req, res, next) => {
    // Implement logic for the QC role
  };
  
  const penjahitMiddleware = (req, res, next) => {
    // Implement logic for the penjahit role
  };
  const getPermissions = async (roleId) => {
    const cachedPermissions = permissionsCache.get(roleId);
  
    if (cachedPermissions) {
      console.log('Permissions found in cache');
      return cachedPermissions;
    } else {
      console.log('Fetching permissions from the database');
      // Replace the following line with your actual logic to fetch permissions from the database
      const permissions = await hak_akses.getHakAksesByRoleId(roleId);
      permissionsCache.set(roleId, permissions, /* set your expiration time in seconds */);
      return permissions;
    }
  };
  const methodMappings = {
    'read': 'GET',
    'create': 'POST',
    'update': 'PUT',
    // Add more mappings as needed
  };
  
  const mapAksesNamaToMethod = (aksesNama) => {
    return methodMappings.hasOwnProperty(aksesNama) ? methodMappings[aksesNama] : aksesNama;
  };
  
  const checkPermission = (url, method, fungsiNama, aksesNama) => {
    const mappedAksesNama = mapAksesNamaToMethod(aksesNama);
    return (url.includes(fungsiNama) && mappedAksesNama === method) || (url.includes(fungsiNama) && mappedAksesNama === 'crud');
  };
  const checkAuth = async (req, res, next) => {
    try {
      if (req.session && req.session.user && req.session.user.role_id) {
        const userData = parseInt(req.session.user.role_id);
  
        const url = req.originalUrl;
        const method = req.method;
        const permissions = await getPermissions(userData);
  
        for (const permission of permissions) {
          const fungsiNama = permission.fungsi.nama;
          const aksesNama = permission.akses.nama;
  
          console.log(mapAksesNamaToMethod(aksesNama), method);
  
          if (checkPermission(url, method, fungsiNama, aksesNama)) {
            console.log(mapAksesNamaToMethod(aksesNama));
            console.log(permissions)
            next();
            return;
          }
        }
  
        res.status(403).json({ success: false, message: `Akses tidak dimiliki untuk ${url}`, permissions: permissions });
      } else {
        res.status(401).json({ success: false, message: 'Sesi tidak sah' });
      }
    } catch (error) {
      console.error('Error checking user permissions:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
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
