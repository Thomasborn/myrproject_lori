const express = require("express")
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser"); // Add cookie-parser
const verifyToken = require("./middleware/auth_jwt");
const verifyAccess = require("./middleware/access");
const { PrismaClient } = require("@prisma/client");
const prisma= new PrismaClient();
const AuthController = require("./auth/auth.controller")
const multer = require("multer");
const upload = multer();
const session = require('express-session');
const router = require('./router/index')
const  app = express();
dotenv.config();
app.use(express.json())
const PORT = process.env.PORT;
app.get("/api",(req,res) => {
    res.send("Hello World");
});
app.use(cookieParser());
app.use(
    session({
      secret: 'lori',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours (in milliseconds)
    },
    })
  );
app.use("/auth",AuthController);  
// app.use("/",router);

app.use("/",verifyAccess,router);

// app.post("/produks", async (req, res) => {
//     const newProdukData = req.body;
//     try {
//       const produk = await prisma.produk_Item.create({
//         data: {
//           kode_produk: newProdukData.kode_produk, // Provide a valid value for kode_produk
//           sku: newProdukData.sku,
//           nama_produk: newProdukData.nama_produk,
//           stok: newProdukData.stok,
//           harga_jual: newProdukData.harga_jual,
//         
//         },
//       });
//       res.json(produk);
//     } catch (error) {
//       console.error('Error creating produk:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });

 
  

app.listen(PORT, ()=>{
    console.log("JALAN LORI NYA IN PORT: "+PORT);
});