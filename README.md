# NPM Scraper

Scraper API percobaan NPM dan ngrok

## Daftar Isi
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Penggunaan](#penggunaan)

---

## Prasyarat

Pastikan Anda telah menginstal versi terbaru dari Node.js dan npm di komputer Anda.

- [Node.js](https://nodejs.org/)

Anda bisa memeriksa versi Node.js dan npm dengan perintah berikut:

```bash
node -v
npm -v
```

## Instalasi
Kloning repositori ini:

```bash
git clone [https://github.com/username/nama-proyek.git](https://github.com/username/nama-proyek.git)
```

Masuk ke direktori proyek:

```bash
cd nama-proyek
```

Instal semua dependensi yang diperlukan:

```bash
npm install
```

## Penggunaan

Membuat Build Produksi
Untuk mengompilasi dan mengoptimalkan proyek Anda untuk produksi, jalankan perintah ini.

```Bash
npm run build
npm start
```

Hasil build akan berada di dalam folder build/ atau dist/.

Mendapatkan URL Publik
Untuk membuat server lokal Anda dapat diakses dari internet, Anda bisa menggunakan ngrok.

Pastikan aplikasi Anda sudah berjalan dengan npm start dan Anda tahu nomor port-nya (misalnya, 3000).

Jalankan perintah berikut di terminal baru, ganti [PORT_NUMBER] dengan port aplikasi Anda:

```Bash
ngrok http 3000
```

Di output ngrok, cari baris Forwarding untuk mendapatkan URL publik Anda. Contoh:

```bash
Forwarding                    [https://a3b2-103-123-45-67.ngrok.io](https://a3b2-103-123-45-67.ngrok.io) -> http://localhost:3000
URL https://a3b2-103-123-45-67.ngrok.io adalah alamat publik yang bisa Anda bagikan.
```

CURL dengan format

```bash
https://xxxx.ngrok-free.app/naver?productUrl=https://smartstore.naver.com/rainbows9030/products/11102379008
```