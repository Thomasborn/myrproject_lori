// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
model user {
  id          Int     @id @default(autoincrement())
  email       String  @unique
  password    String
  karyawan_id Int
  role_id     Int
  created_at  DateTime @default(now()) // Created timestamp
  updated_at  DateTime @default(now())      // Updated timestamp
  karyawan    karyawan @relation(fields: [karyawan_id], references: [id])
  role        role     @relation(fields: [role_id], references: [id])
  deleted_at DateTime?
  produksi  produksi[]
  qc_produksi  qc_produksi[]
  
}

model karyawan {
  id            Int      @id @default(autoincrement())
  nama          String
  nik           String   @unique
  alamat        String
  kontak        String
  tanggal_lahir DateTime
  jenis_kelamin String
  no_rekening   String
  created_at    DateTime @default(now())
  updated_at    DateTime @default(now())
  users         user[]
  deleted_at DateTime?
}

model role {
  id        Int     @id @default(autoincrement())
  nama      String
  created_at DateTime @default(now())
  updated_at DateTime @default(now())
  users     user[]
  hak_akses hak_akses[]
  deleted_at DateTime?
}

model akses {
  id        Int     @id @default(autoincrement())
  nama      String
  created_at DateTime @default(now())
  updated_at DateTime @default(now())
  hak_akses  hak_akses[]
  deleted_at DateTime?
}

model fungsi {
  id        Int     @id @default(autoincrement())
  nama      String
  created_at DateTime @default(now())
  updated_at DateTime @default(now())
  hak_akses  hak_akses[]
  deleted_at DateTime?
}

model hak_akses {
  id        Int      @id @default(autoincrement())
  role_id   Int
  fungsi_id Int
  akses_id  Int
  created_at DateTime @default(now())
  updated_at DateTime @default(now())
  deleted_at DateTime?
  role      role    @relation(fields: [role_id], references: [id])
  fungsi    fungsi  @relation(fields: [fungsi_id], references: [id])
  akses     akses   @relation(fields: [akses_id], references: [id])
  @@unique([role_id, fungsi_id, akses_id], name: "HakAksesConstraint")
}

model model_produk {
  id         Int      @id @default(autoincrement())
  kode       String
  nama       String
  variasi    String
  deskripsi  String?
  deleted_at DateTime?
  kategori   kategori_produk @relation(fields: [kategori_id], references: [id])
  kategori_id Int
  created_at DateTime @default(now())
  updated_at DateTime @default(now())
  foto_produk foto_produk[]
  detail_model_produk detail_model_produk[]
}
model foto_produk {
  id               Int               @id @default(autoincrement())
  filepath         String
  // Define a foreign key relationship to the product model
  model_produk_id    Int
  model_produk      model_produk       @relation(fields: [model_produk_id], references: [id])
}
model kategori_produk {
  id        Int     @id @default(autoincrement())
  nama      String
  tipe      String
  deleted_at DateTime?
  created_at DateTime @default(now())
  updated_at DateTime @default(now())
  model_produk model_produk[]
}

model detail_model_produk {
  id                Int     @id @default(autoincrement())
  ukuran            String
  biaya_jahit       Float
  hpp               Float
  harga_jual        Float
  deleted_at DateTime?
  model_produk      model_produk @relation(fields: [model_produk_id], references: [id])
  model_produk_id   Int
  created_at        DateTime @default(now())
  updated_at        DateTime @default(now())
  bahan_produk      bahan_produk[]
  daftar_produk      daftar_produk[]
  produksi          produksi[]
}

model bahan_produk {
  id                   Int          @id @default(autoincrement())
  jumlah               Float
  detail_model_produk   detail_model_produk @relation(fields: [detail_model_produk_id], references: [id])
  detail_model_produk_id Int
  daftar_bahan         daftar_bahan @relation(fields: [daftar_bahan_id], references: [id])
  daftar_bahan_id      Int
  created_at           DateTime @default(now())
  updated_at           DateTime @default(now())
  deleted_at DateTime?
}

model daftar_bahan {
  id      Int     @id @default(autoincrement())
  kode    String
  stok    Float
  nama    String
  satuan  String
  created_at DateTime @default(now())
  updated_at DateTime @default(now())
  bahan_produk bahan_produk[]
  restok_bahan restok_bahan[]
  detail_bahan_perbaikan detail_bahan_perbaikan[]
  deleted_at DateTime?
  
}
model restok_bahan {
  id              Int      @id @default(autoincrement())
  tanggal_pesan   DateTime
  tanggal_terima  DateTime
  harga_satuan    Float
  jumlah          Float
  daftar_bahan_id Int      // Foreign key to the daftar_bahan model
  daftar_bahan    daftar_bahan @relation(fields: [daftar_bahan_id], references: [id])
  supplier_id     Int      // Foreign key to the supplier model
  supplier        supplier   @relation(fields: [supplier_id], references: [id])
  created_at      DateTime @default(now()) // Created timestamp
  updated_at      DateTime @default(now())      // Updated timestamp
  deleted_at      DateTime?             // Soft delete field
}
model supplier {
  id       Int      @id @default(autoincrement())
  kode     String
  nama     String
  alamat   String
  kontak   String
  no_rek   String
  restok_bahan restok_bahan[] // Add this if you want to establish a relation to restok_bahan
  created_at DateTime @default(now()) // Created timestamp
  updated_at DateTime @default(now())      // Updated timestamp
  deleted_at DateTime?             // Soft delete field
}

model produksi {
  id                  Int       @id @default(autoincrement())
  produksi            String
  tanggal_mulai       DateTime  @default(now())
  tanggal_selesai     DateTime? 
  jumlah              Int
  detail_model_produk   detail_model_produk @relation(fields: [detail_model_produk_id], references: [id])
  detail_model_produk_id Int
  user                user     @relation(fields: [user_id], references: [id])
  user_id             Int
  created_at          DateTime  @default(now())
  updated_at          DateTime  @default(now())
  deleted_at          DateTime?
  qc_produksi  qc_produksi[]
}

model qcproduksi {
  id        Int      @id @default(autoincrement())
  waktu     DateTime @default(now())
  deskripsi String
  status    String
  user      user     @relation(fields: [user_id], references: [id])
  user_id   Int
  produksi  produksi @relation(fields: [produksi_id], references: [id])
  produksi_id Int
  created_at          DateTime  @default(now())
  updated_at          DateTime  @default(now())
  deleted_at          DateTime?
}

model daftar_produk {
  id                  Int       @id @default(autoincrement())
  sku                 String
  detail_model_produk   detail_model_produk @relation(fields: [detail_model_produk_id], references: [id])
  detail_model_produk_id Int
  created_at          DateTime  @default(now())
  updated_at          DateTime  @default(now())
  deleted_at          DateTime?
}
model qc_produksi {
  id             Int                @id @default(autoincrement())
  waktu          DateTime
  deskripsi      String
  status         String
  user           user               @relation(fields: [user_id], references: [id])
  user_id        Int
  produksi       produksi           @relation(fields: [produksi_id], references: [id])
  produksi_id    Int
  perbaikan_produksi perbaikan_produksi[]
}

model perbaikan_produksi {
  id                  Int                @id @default(autoincrement())
  tanggal_mulai       DateTime
  tanggal_selesai     DateTime
  keterangan          String
  qc_produksi        qc_produksi        @relation(fields: [qc_produksi_id], references: [id])
  qc_produksi_id     Int
  detail_bahan_perbaikan detail_bahan_perbaikan[]
}

model detail_bahan_perbaikan {
  id                  Int                @id @default(autoincrement())
  perbaikan_produksi perbaikan_produksi  @relation(fields: [perbaikan_produksi_id], references: [id])
  perbaikan_produksi_id Int
  daftar_bahan       daftar_bahan        @relation(fields: [daftarbahan_id], references: [id])
  daftarbahan_id    Int
}
