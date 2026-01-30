# 🌍 Sistema de Internacionalización (i18n) - BoltPOS

## 📋 Descripción

BoltPOS incluye un sistema i18n ligero construido con Zustand que soporta múltiples idiomas sin dependencias externas pesadas como i18next o react-intl.

## 🎯 Idiomas Soportados

- **English (en)** - Idioma por defecto
- **Español (es)** - Completamente traducido

## 🏗️ Arquitectura

### Store de Idioma (`src/store/languageStore.js`)

```javascript
{
  currentLanguage: 'en', // 'en' | 'es'
  setLanguage: (language) => void,
  toggleLanguage: () => void
}
```

- Persiste en `localStorage` con clave `boltpos-language-storage`
- El idioma se mantiene entre sesiones

### Diccionario de Traducciones (`src/i18n/translations.js`)

Estructura:
```javascript
{
  en: {
    key: 'Translation in English',
    // ...
  },
  es: {
    key: 'Traducción en Español',
    // ...
  }
}
```

## 🔧 Cómo Usar en Componentes

### 1. Importar el Hook

```javascript
import { useLanguageStore } from '../store/languageStore';
import { useTranslation } from '../i18n/translations';
```

### 2. Usar en el Componente

```javascript
export default function MyComponent() {
  const languageStore = useLanguageStore();
  const t = useTranslation(languageStore);
  
  return (
    <div>
      <h1>{t('cart')}</h1>
      <button>{t('payWithLightning')}</button>
    </div>
  );
}
```

### 3. Para Fechas con date-fns

```javascript
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

const locale = languageStore.currentLanguage === 'es' ? es : enUS;
const dateStr = format(new Date(), "dd MMMM yyyy", { locale });
```

## 📝 Claves de Traducción Disponibles

### Navegación
- `sales`, `history`, `settings`
- `boltpos`

### Punto de Venta
- `catalog`, `keypad`, `cart`, `items`
- `emptyCart`, `total`, `payWithLightning`, `clearCart`
- `amountToCharge`, `clear`, `add`, `manual`
- `sats`, `each`

### Historial
- `salesHistory`, `salesToday`, `transactions`, `avgTicket`
- `totalSales`, `totalRevenue`, `allTransactions`
- `noSalesYet`, `salesWillAppear`, `today`
- `saleDetail`, `completedSalesToday`, `perTransaction`

### Configuración
- `configuration`, `offlineFirstPos`, `version`
- `lightningConfig`, `lightningAddress`, `lightningAddressDesc`
- `saveLightningAddress`, `activeLightningAddress`
- `productManagement`, `newProduct`, `noProducts`
- `edit`, `delete`, `dataManagement`
- `exportData`, `exportSalesCSV`, `restoreProducts`
- `deleteAllHistory`, `features`

### Productos
- `editProduct`, `productName`, `productNamePlaceholder`
- `priceUSD`, `category`, `save`, `cancel`

### Categorías
- `services`, `repairs`, `installation`
- `maintenance`, `emergency`, `other`

### Checkout
- `paymentConfirmed`, `paymentReceived`, `transactionCompleted`
- `purchaseSummary`, `sendReceiptWhatsApp`, `finalizeContinue`
- `totalToCharge`, `inCart`, `connectingAlby`
- `generatingInvoice`, `errorGeneratingInvoice`, `retry`
- `payingTo`, `copyInvoice`, `lightningInvoice`
- `scanQR`, `orCopyInvoice`, `confirmPaymentReceived`
- `processing`

### Alertas y Mensajes
- `cartEmpty`, `productDeleted`, `productUpdated`, `productCreated`
- `dataDeleted`, `productsRestored`, `fiveProductsAdded`
- `dataExported`, `checkDownloads`, `salesExportedCSV`
- `noSalesToExport`, `invoiceCopied`, `invoiceCopyFailed`
- `lightningAddressSaved`, `invalidLightningAddress`
- `completeAllFields`, `confirmDelete`, `confirmDeleteAll`
- `confirmRestoreProducts`, `itemAdded`, `invalidAmount`
- `paymentConfirmedMsg`, `method`, `savedSuccessfully`

### WhatsApp
- `receipt`, `date`, `detail`, `thankYou`

## 🎮 Cambiar de Idioma

### En la UI

1. Haz clic en el botón **EN/ES** en la esquina superior izquierda
2. El idioma cambia instantáneamente
3. La preferencia se guarda automáticamente

### Programáticamente

```javascript
const { setLanguage, toggleLanguage } = useLanguageStore();

// Cambiar a idioma específico
setLanguage('es'); // o 'en'

// Alternar entre idiomas
toggleLanguage();
```

## ➕ Añadir Nuevos Idiomas

### Paso 1: Añadir al Diccionario

En `src/i18n/translations.js`:

```javascript
export const translations = {
  en: { /* ... */ },
  es: { /* ... */ },
  pt: { // Nuevo idioma
    cart: 'Carrinho',
    payWithLightning: 'Pagar com Lightning',
    // ...
  }
};
```

### Paso 2: Añadir Locale de date-fns

```javascript
import { es, enUS, ptBR } from 'date-fns/locale';

const locales = {
  en: enUS,
  es: es,
  pt: ptBR
};

const locale = locales[languageStore.currentLanguage];
```

### Paso 3: Actualizar el Toggle en Layout

Modificar el botón para soportar más de 2 idiomas (usar dropdown en lugar de toggle).

## 📱 Optimizaciones Móviles Incluidas

### Meta Tags (index.html)
```html
<!-- Prevenir zoom en iOS -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />

<!-- PWA Support -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="theme-color" content="#0f172a" />
```

### CSS Optimizations
- **Font Size**: Inputs tienen 16px para prevenir zoom en iOS
- **Touch Targets**: Todos los botones tienen mínimo 48px
- **Safe Areas**: Padding para notch y home indicator de iOS
- **Tap Highlight**: Deshabilitado para mejor experiencia táctil
- **User Select**: Deshabilitado en elementos UI

### Component Optimizations
- Todos los botones tienen `min-h-[48px]` o `min-h-[56px]`
- Listas tienen `pb-8` extra para no quedar tapadas
- Touch feedback con `active:scale-95`
- Transiciones suaves

## 🧪 Testing

### Probar Cambio de Idioma

1. Abre http://localhost:5176/
2. Verifica que esté en INGLÉS por defecto
3. Haz clic en el botón "EN" (esquina superior izquierda)
4. Debe cambiar a "ES" y todos los textos a español
5. Recarga la página - debe mantener el idioma

### Probar en Dispositivos Móviles

#### iOS Safari
- No debe hacer zoom al tocar inputs
- Botones deben ser fáciles de tocar
- Home indicator no debe tapar contenido

#### Android Chrome
- Touch targets de 48px mínimo
- No debe tener zoom accidental
- Navegación fluida

### Probar Fechas

- Cambia a español: deben verse "ene, feb, mar..."
- Cambia a inglés: deben verse "Jan, Feb, Mar..."
- Formato de hora debe ser correcto en ambos

## 🎨 Consistencia Visual

El sistema i18n NO afecta:
- Colores (se mantienen Orange-500 para Bitcoin)
- Tema Dark/Light (independiente del idioma)
- Layout y espaciado
- Iconos

Solo cambian los textos y formato de fechas según el locale.

## 🔄 Estado por Defecto

- **Idioma**: Inglés (`en`)
- **Tema**: Dark mode
- **Lightning Address**: purplerhapsody967062@getalby.com

## 📊 Impacto en Performance

- **Bundle Size**: +2KB (traducciones)
- **Runtime**: Sin overhead (solo lookup de objeto)
- **First Load**: Instantáneo
- **Language Switch**: <50ms

## 🐛 Troubleshooting

### "Cannot read property of undefined"
- Verifica que la clave exista en `translations.js`
- Si falta una clave, se retorna la clave misma como fallback

### Fechas en inglés aunque esté en español
- Verifica que estés importando el locale correcto
- Asegúrate de pasar `{ locale }` a `format()`

### Idioma no persiste después de recargar
- Verifica que Zustand persist esté configurado
- Revisa localStorage: busca `boltpos-language-storage`

---

**Construido para la comunidad Bitcoin global** 🌍⚡
