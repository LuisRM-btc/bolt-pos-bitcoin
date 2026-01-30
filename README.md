# ⚡ BoltPOS V2

**Punto de Venta Offline-First para Bitcoiners con Pagos Lightning Reales**

![Version](https://img.shields.io/badge/version-2.0.0-orange)
![License](https://img.shields.io/badge/license-MIT-blue)
![Bitcoin](https://img.shields.io/badge/bitcoin-lightning-yellow)

## 🚀 Características Principales

### 🌍 Multi-Idioma (i18n)
- ✅ Inglés (EN) - Idioma por defecto
- ✅ Español (ES) - Completamente traducido
- ✅ Cambio instantáneo con botón EN/ES
- ✅ Persistencia de preferencia de idioma
- ✅ Fechas localizadas según idioma

### 💰 Pagos Lightning Reales
- ✅ Generación de invoices reales usando Lightning Address (LNURL-Pay)
- ✅ QR Code escaneables con cualquier wallet Lightning
- ✅ Conversión automática USD → Sats en tiempo real
- ✅ Lightning Address configurable por el usuario
- ✅ Recibos compartibles por WhatsApp

### 🛍️ Punto de Venta Completo
- ✅ Catálogo de productos con categorías
- ✅ Vista de teclado numérico para montos manuales
- ✅ Carrito de compras inteligente
- ✅ CRUD completo de productos
- ✅ Persistencia local con Dexie.js (IndexedDB)

### 📊 Dashboard y Reportes
- ✅ Stats del día (Ventas, Transacciones, Ticket Promedio)
- ✅ Historial completo de ventas
- ✅ Exportación a CSV
- ✅ Exportación JSON (backup completo)

### 🎨 Diseño y UX
- ✅ Modo Light/Dark con persistencia
- ✅ Mobile-First (optimizado para tablets y celulares)
- ✅ Diseño Glassmorphism
- ✅ Botones grandes táctiles (mínimo 48px)
- ✅ Animaciones suaves
- ✅ Optimizado para iOS y Android
- ✅ Sin zoom accidental en inputs
- ✅ Safe areas para notch y home indicator

### ⚡ Offline-First
- ✅ Funciona sin conexión a internet
- ✅ Sincronización automática cuando hay conexión
- ✅ Todos los datos en el dispositivo

## 📦 Instalación

```bash
# Clonar el repositorio
git clone [URL_DEL_REPO]
cd BoltPOS

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

## 🛠️ Stack Tecnológico

- **Frontend**: React 18.3 + Vite 6
- **Router**: React Router DOM 7
- **State Management**: Zustand 5 (con persistencia)
- **Database**: Dexie.js 4 (IndexedDB)
- **Styling**: TailwindCSS 3 + Glassmorphism
- **Icons**: Lucide React
- **QR Codes**: qrcode.react
- **Date Handling**: date-fns (con locales)
- **i18n**: Custom lightweight solution (Zustand-based)
- **Lightning**: LNURL-Pay Protocol (Lightning Address)

## 🌍 Cambiar Idioma

BoltPOS inicia en **INGLÉS** por defecto.

Para cambiar de idioma:
1. Haz clic en el botón **EN/ES** en la esquina superior izquierda
2. El idioma cambia instantáneamente
3. Tu preferencia se guarda automáticamente

Idiomas disponibles:
- 🇺🇸 **English (EN)** - Default
- 🇪🇸 **Español (ES)**

Ver documentación completa en [I18N_GUIDE.md](./I18N_GUIDE.md)

## ⚡ Configuración de Lightning

Ver documentación detallada en [LIGHTNING_SETUP.md](./LIGHTNING_SETUP.md)

### Quick Start

1. Ve a **Ajustes** → **Configuración de Lightning**
2. Ingresa tu Lightning Address (formato: `usuario@dominio.com`)
3. Guarda y listo

**Lightning Address por defecto:**
```
purplerhapsody967062@getalby.com
```

### Obtener una Lightning Address

- **Alby** (https://getalby.com) - Recomendado
- **Wallet of Satoshi** - Fácil para principiantes
- **Blink** - Gratuita
- **Strike** - Con conversión a fiat

## 📱 Uso

### Como Comerciante

1. **Configurar productos**
   - Ve a Ajustes → Gestión de Productos
   - Agrega tus productos con nombre, precio y categoría

2. **Realizar una venta**
   - Selecciona productos del catálogo
   - O usa el teclado numérico para montos manuales
   - Revisa el carrito (muestra total en USD y sats)
   - Haz clic en "Cobrar con Lightning"

3. **Cobrar**
   - El sistema genera un QR real con invoice
   - El cliente escanea con su wallet
   - Confirma el pago cuando lo recibas
   - Opcionalmente envía el recibo por WhatsApp

4. **Ver reportes**
   - Ve a Historial para ver stats del día
   - Exporta ventas a CSV para contabilidad

### Como Cliente

1. Abre tu wallet Lightning (Blue Wallet, Phoenix, Alby, etc.)
2. Escanea el QR mostrado en BoltPOS
3. Confirma el pago
4. ¡Listo! Recibirás tu recibo

## 🗂️ Estructura del Proyecto

```
BoltPOS/
├── src/
│   ├── components/
│   │   ├── CheckoutModal.jsx      # Modal de cobro con QR real
│   │   ├── Layout.jsx             # Layout con navegación
│   │   └── ProductFormModal.jsx   # CRUD de productos
│   ├── pages/
│   │   ├── PosPage.jsx            # Vista principal del POS
│   │   ├── HistoryPage.jsx        # Dashboard y reportes
│   │   └── SettingsPage.jsx       # Configuración
│   ├── store/
│   │   ├── cartStore.js           # State del carrito + BTC price
│   │   ├── themeStore.js          # State del tema (light/dark)
│   │   └── settingsStore.js       # Lightning Address y config
│   ├── utils/
│   │   └── lightning.js           # Lógica LNURL-Pay
│   ├── db/
│   │   ├── db.js                  # Schema Dexie
│   │   └── seed.js                # Productos de ejemplo
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── tailwind.config.js
├── vite.config.js
├── README.md
└── LIGHTNING_SETUP.md
```

## 🔌 APIs Utilizadas

- **CoinGecko API**: Precio de Bitcoin (actualización cada 5 min)
- **Mempool API**: Fallback para precio de Bitcoin
- **LNURL Endpoints**: Generación de invoices Lightning reales

## 🎯 Roadmap

### V2.1 (Próximamente)
- [ ] Verificación automática de pagos (webhooks)
- [ ] Soporte para múltiples Lightning Addresses
- [ ] Notificaciones push cuando se recibe un pago
- [ ] Modo kiosk (pantalla completa sin barra de navegación)

### V2.2
- [ ] Soporte para Bitcoin On-chain
- [ ] Integración con BTCPay Server
- [ ] Multi-idioma (EN, ES, PT)
- [ ] Impresión de recibos (termal printer)

### V3.0
- [ ] Multi-tienda (varias ubicaciones)
- [ ] Sincronización entre dispositivos
- [ ] Control de inventario
- [ ] Reportes avanzados con gráficos

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## 🙏 Agradecimientos

- Comunidad de Lightning Network
- Alby por su excelente API
- Todos los contribuidores de código abierto

## 📞 Soporte

- **Issues**: [GitHub Issues](link)
- **Documentación**: Ver [LIGHTNING_SETUP.md](./LIGHTNING_SETUP.md)
- **Lightning Address de Demo**: purplerhapsody967062@getalby.com

## ⚠️ Disclaimer

Este software se proporciona "tal cual", sin garantía de ningún tipo. Úsalo bajo tu propio riesgo. Siempre prueba en testnet antes de usar con fondos reales.

---

**Construido con ❤️ para la comunidad Bitcoin**

⚡ **#Bitcoin #Lightning #PoS #Offline #React**
