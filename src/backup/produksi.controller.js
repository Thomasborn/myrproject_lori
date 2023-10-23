router.get("/produks",async (req,res) => {
    const produk = await prisma.produk_Item.findMany();
    res.send(produk)
 });
 router.post("/produks", upload.none(), async (req, res) => {
    try {
    
      const kode_produk = req.body.kode_produk;
      const sku = req.body.sku;
      const nama_produk = req.body.nama_produk;
      const stok = parseInt(req.body.stok);
      const harga_jual = parseFloat(req.body.harga_jual);
  
      const produk = await prisma.produk_Item.create({
        data: {
          kode_produk,
          sku,
          nama_produk,
          stok,
          harga_jual,
          
        },
      });
      res.send({
        
        data:produk,
        message:"Produk berhasil ditambah success"
      });
    } catch (error) {
      console.error('Error creating produk:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.delete("/produks/:id", async (req, res) => {
    const { id } = req.params;
    try {
      // Check if the produk_Item exists before attempting to delete it
      const existingProduk = await prisma.produk_Item.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!existingProduk) {
        return res.status(404).json({ error: "Produk_Item not found" });
      }
  
      // If the produk_Item exists, delete it
      await prisma.produk_Item.delete({
        where: { id: parseInt(id) },
      });
  
      res.json({ message: "Produk_Item deleted successfully" });
    } catch (error) {
      console.error('Error deleting produk_Item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.patch("/produks/:id", upload.none(),async (req, res) => {
    const { id } = req.params;
    const updatedProdukData = req.body;
    console.log(updatedProdukData)
  
    try {
      // Check if the produk_Item exists before attempting to update it
      const existingProduk = await prisma.produk_Item.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!existingProduk) {
        return res.status(404).json({ error: "Produk_Item not found" });
      }
  
      // Validate and update the Produk_Item data
      const updatedProduk = await prisma.produk_Item.update({
        where: { id: parseInt(id) },
        data: {
          // Add validation and update fields as needed
          kode_produk: updatedProdukData.kode_produk || existingProduk.kode_produk,
          sku: updatedProdukData.sku || existingProduk.sku,
          nama_produk: updatedProdukData.nama_produk || existingProduk.nama_produk,
          stok: parseInt(updatedProdukData.stok) || existingProduk.stok,
          harga_jual: parseFloat(updatedProdukData.harga_jual) || existingProduk.harga_jual,
        
        },
      });
  
      res.send({ message: "Produk_Item updated successfully", updatedProduk });
    } catch (error) {
      console.error('Error updating produk_Item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.put("/produks/:id", upload.none(), async (req, res) => {
    const { id } = req.params;
    const updatedProdukData = req.body;
  
    try {
      // Check if the produk_Item exists before attempting to update it
      const existingProduk = await prisma.produk_Item.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!existingProduk) {
        return res.status(404).json({ error: "Produk_Item not found" });
      }
  
      // Validate and update the Produk_Item data
      const updatedProduk = await prisma.produk_Item.update({
        where: { id: parseInt(id) },
        data: {
          // Update the field only if it's provided in the request body
          kode_produk: updatedProdukData.kode_produk || existingProduk.kode_produk,
          sku: updatedProdukData.sku || existingProduk.sku,
          nama_produk: updatedProdukData.nama_produk || existingProduk.nama_produk,
          stok: updatedProdukData.stok !== undefined ? parseInt(updatedProdukData.stok) : existingProduk.stok,
          harga_jual: updatedProdukData.harga_jual !== undefined ? parseFloat(updatedProdukData.harga_jual) : existingProduk.harga_jual,
          // ... other fields
        },
      });
  
      res.send({ message: "Produk_Item updated successfully", updatedProduk });
    } catch (error) {
      console.error('Error updating produk_Item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  module.exports = router;