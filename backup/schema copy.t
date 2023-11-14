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
  role_id     Int // This assumes a relationship to a Karyawan (employee) table
  karyawan    karyawan @relation(fields: [karyawan_id], references: [id])
  role          role     @relation(fields: [role_id], references: [id])

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

  // Define a relationship to the User model
  users         user[]
  
  // Define a relationship to the Role model
}
model role {
  id   Int    @id @default(autoincrement())
  nama String

  // Define a relationship to the Karyawan model
  users user[]
  hak_akses hak_akses[]

}
model akses {
  id    Int     @id @default(autoincrement())
  nama  String
  
  hak_akses hak_akses[]

}
model fungsi {
  id    Int     @id @default(autoincrement())
  nama  String

  hak_akses hak_akses[]
}

model hak_akses {
  id        Int      @id @default(autoincrement())
  role_id   Int
  fungsi_id Int
  akses_id  Int

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
  kategori   kategori_produk @relation(fields: [kategori_id], references: [id])
  kategori_id Int
  detail_model_produk detail_model_produk[]
}

model kategori_produk {
  id    Int     @id @default(autoincrement())
  nama  String
  tipe  String
  model_produk model_produk[]
}

model detail_model_produk {
  id                Int     @id @default(autoincrement())
  ukuran            String
  biaya_jahit       Float
  hpp               Float
  harga_jual        Float
  model_produk      model_produk @relation(fields: [model_produk_id], references: [id])
  model_produk_id   Int
  bahan_produk      bahan_produk[]
}

model bahan_produk {
  id                   Int          @id @default(autoincrement())
  jumlah               Float
  detail_model_produk detail_model_produk @relation(fields: [detail_model_produk_id], references: [id])
  detail_model_produk_id Int
  daftar_bahan         daftar_bahan @relation(fields: [daftar_bahan_id], references: [id])
  daftar_bahan_id      Int
}

model daftar_bahan {
  id    Int     @id @default(autoincrement())
  kode  String
  stok  Float
  nama  String
  satuan String
  bahan_produk bahan_produk[]
}
