# ⚡ BoltPOS - Bitcoin Lightning Point of Sale

**Offline-First Point of Sale (POS) designed for merchants to accept Bitcoin payments via the Lightning Network.**

BoltPOS is a Progressive Web App (PWA) built to solve real-world connectivity issues. It allows merchants to manage products, process sales, and generate LNURL-Pay invoices directly on the device, syncing only when a connection is available.

![BoltPOS Demo](https://github.com/LuisRM-btc/bolt-pos-bitcoin/raw/main/public/demo-screenshot.png) 
*(Note: You can add a screenshot of your app here later)*

## 🚀 Key Features

### 🌍 Multi-Language Support (i18n)
- **English (EN):** Default language for global accessibility.
- **Spanish (ES):** Fully translated interface.
- **Instant Switch:** Toggle languages instantly via the UI.
- **Persistence:** User language preference is saved locally.

### ⚡ Real Lightning Payments
- **LNURL-Pay Integration:** Generates dynamic invoices using a Lightning Address (e.g., `user@getalby.com`).
- **Real-Time Conversion:** Automatically converts fiat currency (USD/MXN) to Satoshis.
- **QR Code Generation:** Renders scannable invoices compatible with any Lightning wallet (Zeus, Wallet of Satoshi, Blink).
- **Social Sharing:** Send receipts via WhatsApp directly from the app.

### 📱 Full POS Functionality
- **Product Catalog:** Grid view with easy add/edit/delete capabilities.
- **Numeric Keypad:** Quick entry for custom amounts.
- **Smart Cart:** Manage quantities and calculate totals instantly.
- **Inventory Management:** Create, update, and remove products locally.

### 📊 Dashboard & Analytics
- **Sales History:** Detailed log of all transactions.
- **Daily Stats:** View total sales, transaction count, and average ticket size.
- **Data Export:** Download full sales reports as `.csv`.
- **Backup & Restore:** JSON import/export for data safety.

### 🎨 Modern UI/UX
- **Dark/Light Mode:** Automatic persistence based on user preference.
- **Mobile-First Design:** Optimized touch targets (48px+) and safe areas for iOS/Android.
- **Glassmorphism:** Modern aesthetic with TailwindCSS.

### 🔌 Offline-First Architecture
- **Local Database:** Uses **Dexie.js (IndexedDB)** to store all data on the device.
- **No Internet Required:** The app works 100% offline (except for generating the final invoice).
- **State Management:** **Zustand** with persistence middleware.

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** TailwindCSS v3 + clsx
- **State Management:** Zustand
- **Database:** Dexie.js (IndexedDB wrapper)
- **Bitcoin/LN:** LNURL-Pay Protocol
- **Routing:** React Router DOM

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/LuisRM-btc/bolt-pos-bitcoin.git](https://github.com/LuisRM-btc/bolt-pos-bitcoin.git)
   cd bolt-pos-bitcoin
⚡ **#Bitcoin #Lightning #PoS #Offline #React**

2. **Install dependencies**
```bash
npm install


3. **Start Development Server**
```bash
npm run dev

##⚙️ Configuration
To receive real payments, go to the Settings page in the app and enter your Lightning Address:

Default: purplerhapsody967062@getalby.com (Change this to your own).

##🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Built with 🧡 by Luis Antonio Rodriguez
