# 📖 OtakuTracker — Panduan Lengkap Setup & Deploy

## 🗂️ Struktur Project

```
otaku-tracker/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (TopBar + BottomNav)
│   │   ├── globals.css         # Global styles + dark theme
│   │   ├── page.tsx            # Halaman Home (dashboard)
│   │   ├── anime/page.tsx      # Halaman Anime
│   │   ├── manga/page.tsx      # Halaman Komik (manga/manhwa/dll)
│   │   ├── drakor/page.tsx     # Halaman Drakor
│   │   ├── dorama/page.tsx     # Halaman Dorama
│   │   └── search/page.tsx     # Pencarian global
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopBar.tsx      # Header atas
│   │   │   └── BottomNav.tsx   # Navigasi bawah (mobile-friendly)
│   │   └── ui/
│   │       ├── MediaCard.tsx       # Kartu media di grid
│   │       ├── MediaDetailModal.tsx # Modal detail & edit
│   │       ├── AddMediaModal.tsx    # Modal tambah manual
│   │       ├── SearchMALModal.tsx   # Cari dari MyAnimeList
│   │       ├── MediaListPage.tsx    # Komponen halaman list
│   │       └── StatsBar.tsx         # Filter statistik
│   ├── lib/
│   │   ├── storage.ts          # localStorage utils
│   │   └── jikan.ts            # MyAnimeList API (Jikan v4)
│   └── types/
│       └── index.ts            # TypeScript types
├── public/
│   └── manifest.json           # PWA manifest
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

---

## 🔧 TAHAP 1: Persiapan (Lakukan Sekali)

### 1.1 Install Node.js
```bash
# Cek apakah sudah ada
node --version   # harus v18+ 
npm --version

# Kalau belum ada, install via nvm (direkomendasikan):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# Restart terminal, lalu:
nvm install 20
nvm use 20
```

### 1.2 Install Git
```bash
sudo apt update && sudo apt install git -y
git --version
```

### 1.3 Konfigurasi Git (pertama kali)
```bash
git config --global user.name "Nama Kamu"
git config --global user.email "email@kamu.com"
```

---

## 💻 TAHAP 2: Jalankan Lokal (Preview Sebelum Deploy)

### 2.1 Masuk ke folder project
```bash
cd otaku-tracker
```

### 2.2 Install dependencies
```bash
npm install
```
> ⏳ Tunggu ~1-2 menit sampai selesai

### 2.3 Jalankan development server
```bash
npm run dev
```

### 2.4 Buka di browser HP atau Laptop
- **Laptop:** buka `http://localhost:3000`
- **HP Android:** 
  1. Pastikan HP & laptop satu WiFi
  2. Cari IP laptop: `ip addr show | grep 'inet ' | grep -v 127`
  3. Buka di HP: `http://[IP-LAPTOP]:3000`
  4. Misal: `http://192.168.1.5:3000`
  5. Untuk allow akses dari HP, jalankan: `npm run dev -- --hostname 0.0.0.0`

### 2.5 Stop server
```bash
# Tekan Ctrl+C di terminal
```

---

## 🐙 TAHAP 3: Upload ke GitHub

### 3.1 Buat akun GitHub
- Buka https://github.com → Sign Up (gratis)

### 3.2 Buat repository baru
1. Klik tombol **"+"** di sudut kanan atas
2. Pilih **"New repository"**
3. Nama: `otaku-tracker` (atau bebas)
4. Pilih **Public** (gratis deployment di Vercel)
5. **JANGAN** centang "Add README" atau apapun
6. Klik **"Create repository"**

### 3.3 Push project ke GitHub
```bash
# Pastikan kamu di dalam folder otaku-tracker
cd otaku-tracker

# Inisialisasi git
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "🎌 Initial commit - OtakuTracker"

# Ganti USERNAME dengan username GitHub kamu
# Ganti REPO_NAME dengan nama repo yang kamu buat
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

> 💡 GitHub akan minta login. Gunakan Personal Access Token:
> 1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
> 2. Generate new token → centang "repo" → Generate
> 3. Copy token, gunakan sebagai password saat push

---

## 🚀 TAHAP 4: Deploy ke Vercel (GRATIS)

### 4.1 Buat akun Vercel
- Buka https://vercel.com
- Klik **"Sign Up"** → pilih **"Continue with GitHub"**
- Authorize Vercel

### 4.2 Import project
1. Di dashboard Vercel → klik **"Add New..."** → **"Project"**
2. Cari repo `otaku-tracker` kamu → klik **"Import"**
3. Framework: **Next.js** (otomatis terdeteksi)
4. Klik **"Deploy"**

### 4.3 Tunggu deploy
- ⏳ ~2-3 menit
- Setelah selesai, kamu dapat URL gratis: `otaku-tracker-xxx.vercel.app`

### 4.4 Akses dari HP
- Buka URL vercel di browser HP
- Untuk install sebagai app: tekan **⋮ (titik tiga)** → **"Add to Home Screen"**

---

## 🔄 Update Kode (Setelah Perubahan)

```bash
# Setiap kali ada perubahan kode:
git add .
git commit -m "✨ [deskripsi perubahan]"
git push

# Vercel otomatis re-deploy dalam ~1 menit!
```

---

## 📱 Tips Penggunaan di HP

### Cara pakai optimal di Android:
1. **Buka website** di Chrome
2. **Add to Home Screen** untuk tampilan fullscreen seperti app
3. **Bottom navigation** untuk pindah halaman
4. **Ketuk kartu** untuk buka detail & edit
5. **Tombol + / -** di kartu untuk update progress cepat
6. **Cari di MAL** untuk anime & manga (perlu internet)
7. **Tambah Manual** untuk drakor & dorama

### Fitur:
- ✅ **Watchlist** - Tambah ke list dengan status
- 📊 **Progress** - Lacak episode/chapter yang sudah ditonton
- ⭐ **Skor** - Beri nilai 1-10
- 🔍 **Cari MAL** - Database anime & manga dari MyAnimeList
- 📝 **Catatan** - Tulis notes pribadi
- 🗂️ **Filter** - Filter by status (nonton/selesai/dll)
- 💾 **Otomatis tersimpan** - Data di localStorage browser

---

## ❓ Troubleshooting

### Error: "npm not found"
```bash
# Install Node.js dulu via nvm (lihat tahap 1.1)
```

### Error saat `npm install`: EACCES permission
```bash
sudo chown -R $USER ~/.npm
npm install
```

### HP tidak bisa akses localhost
```bash
# Jalankan dengan hostname eksplisit:
npm run dev -- --hostname 0.0.0.0 --port 3000
# Lalu di HP buka: http://[IP-LAPTOP]:3000
```

### Build error saat deploy Vercel
```bash
# Test build lokal dulu:
npm run build
# Perbaiki error yang muncul, lalu push lagi
```

### Data hilang di HP
- Data tersimpan di localStorage browser
- Jangan clear browser data / cache
- Data tidak sinkron antar device (ini by design - tanpa login)

---

## 🛠️ Development dengan VS Code

```bash
# Buka VS Code langsung dari terminal:
cd otaku-tracker
code .

# Install extension yang direkomendasikan:
# - ESLint
# - Tailwind CSS IntelliSense  
# - TypeScript Importer
# - Prettier

# Jalankan dev server di terminal VS Code (Ctrl+`)
npm run dev
```
