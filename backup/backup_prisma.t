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
  updated_at  DateTime @updatedAt      // Updated timestamp
  karyawan    karyawan @relation(fields: [karyawan_id], references: [id])
  role        role     @relation(fields: [role_id], references: [id])
  deleted_at DateTime?
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
  updated_at    DateTime @updatedAt
  users         user[]
  deleted_at DateTime?
}

model role {
  id        Int     @id @default(autoincrement())
  nama      String
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  users     user[]
  hak_akses hak_akses[]
  deleted_at DateTime?
}

model akses {
  id        Int     @id @default(autoincrement())
  nama      String
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  hak_akses  hak_akses[]
  deleted_at DateTime?
}

model fungsi {
  id        Int     @id @default(autoincrement())
  nama      String
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  hak_akses  hak_akses[]
  deleted_at DateTime?
}

model hak_akses {
  id        Int      @id @default(autoincrement())
  role_id   Int
  fungsi_id Int
  akses_id  Int
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
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
  deskripsi  String?
  foto       String?
  deleted_at DateTime?
  kategori   kategori_produk @relation(fields: [kategori_id], references: [id])
  kategori_id Int
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  detail_model_produk detail_model_produk[]
}

model kategori_produk {
  id        Int     @id @default(autoincrement())
  nama      String
  tipe      String
  deleted_at DateTime?
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
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
  updated_at        DateTime @updatedAt
  bahan_produk      bahan_produk[]
}

model bahan_produk {
  id                   Int          @id @default(autoincrement())
  jumlah               Float
  detail_model_produk   detail_model_produk @relation(fields: [detail_model_produk_id], references: [id])
  detail_model_produk_id Int
  daftar_bahan         daftar_bahan @relation(fields: [daftar_bahan_id], references: [id])
  daftar_bahan_id      Int
  created_at           DateTime @default(now())
  updated_at           DateTime @updatedAt
  deleted_at DateTime?
}

model daftar_bahan {
  id      Int     @id @default(autoincrement())
  kode    String
  stok    Float
  nama    String
  satuan  String
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  bahan_produk bahan_produk[]
  restok_bahan restok_bahan[]
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
  updated_at      DateTime @updatedAt      // Updated timestamp
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
  updated_at DateTime @updatedAt      // Updated timestamp
  deleted_at DateTime?             // Soft delete field
}
