# ⚡ Sistema de Pagos Lightning Reales - BoltPOS

## 🎯 Descripción

BoltPOS ahora soporta **pagos reales de Lightning Network** usando el estándar **Lightning Address (LNURL-Pay)**. Esto permite generar invoices reales que pueden ser pagados con cualquier wallet de Lightning compatible.

## 🔧 Configuración Inicial

### Lightning Address por Defecto

La aplicación viene pre-configurada con la Lightning Address:
```
purplerhapsody967062@getalby.com
```

Esta dirección se puede cambiar en **Configuración > Configuración de Lightning**.

### Cómo Cambiar la Lightning Address

1. Ve a **Ajustes** (Settings)
2. Busca la sección **"Configuración de Lightning"**
3. Ingresa tu Lightning Address en formato: `usuario@dominio.com`
4. Haz clic en **"Guardar Lightning Address"**

### Proveedores de Lightning Address Recomendados

- **Alby** (https://getalby.com) - Gratuito, fácil de configurar
- **Wallet of Satoshi** - Wallet móvil con Lightning Address
- **Blink** - Lightning Address gratuita
- **Strike** - Lightning Address con conversión a USD

## 🚀 Cómo Funciona

### Flujo de Pago

1. **Cliente agrega productos al carrito**
2. **Hace clic en "Cobrar con Lightning"**
3. **BoltPOS genera invoice real:**
   - Calcula el monto en satoshis usando precio actual de BTC
   - Consulta el endpoint LNURL de tu Lightning Address
   - Solicita un invoice con el monto exacto
   - Genera QR con el invoice real
4. **Cliente escanea el QR con su wallet**
5. **Cliente paga**
6. **Comerciante confirma pago manualmente** (en versión actual)

### Arquitectura Técnica

```
CheckoutModal.jsx
    ↓
getInvoiceFromAddress(address, sats)
    ↓
1. Fetch: https://dominio/.well-known/lnurlp/usuario
    ↓
2. Obtiene callback URL
    ↓
3. Fetch: callback?amount=X (en millisats)
    ↓
4. Retorna invoice (lnbc...)
    ↓
QRCode muestra invoice real
```

## 📝 Archivos Clave

### `src/store/settingsStore.js`
- Store Zustand que persiste la Lightning Address
- Configurable por el usuario

### `src/utils/lightning.js`
- `getInvoiceFromAddress()`: Genera invoices reales
- `copyToClipboard()`: Copia invoice al portapapeles
- Manejo de errores y validaciones

### `src/components/CheckoutModal.jsx`
- Interfaz de cobro
- Muestra QR real
- Estado de carga: "Conectando con Alby..."
- Botón "Copiar Invoice"
- Manejo de errores con reintentos

## ⚠️ Manejo de Errores

### Errores Comunes

**"Lightning Address debe tener formato: usuario@dominio.com"**
- Verifica que la dirección tenga un `@`
- Formato correcto: `usuario@getalby.com`

**"Error de conexión. Verifica tu internet..."**
- Verifica conexión a internet
- Verifica que el dominio de la Lightning Address esté online
- Prueba con otra Lightning Address

**"No se encontró callback en la respuesta LNURL"**
- La Lightning Address podría no ser válida
- El servidor LNURL podría estar caído
- Verifica con el proveedor de tu Lightning Address

**"Monto mínimo es X sats"**
- El proveedor tiene un monto mínimo
- Aumenta el precio del producto

**"Monto máximo es X sats"**
- El proveedor tiene un límite máximo
- Reduce el monto o divide en múltiples transacciones

### Botón de Reintentar

Si falla la generación del invoice, aparece un botón **"Reintentar"** que vuelve a intentar la conexión.

## 🧪 Cómo Probar

### Usando Wallet Real

1. Instala una wallet Lightning:
   - **Blue Wallet** (iOS/Android)
   - **Phoenix Wallet** (iOS/Android)
   - **Zeus** (iOS/Android)
   - **Alby** (Extensión de navegador)

2. Carga fondos en tu wallet

3. En BoltPOS:
   - Agrega productos al carrito
   - Haz clic en "Cobrar con Lightning"
   - Escanea el QR con tu wallet
   - Confirma el pago

4. El pago se procesará en segundos

### Modo de Prueba (Testnet)

Para usar en testnet (Bitcoin de prueba):
- Necesitarás una Lightning Address de testnet
- Ejemplos: wallets como Phoenix tienen modo testnet

## 💡 Características Avanzadas

### Conversión USD → Sats Automática

- BoltPOS consulta el precio de BTC cada 5 minutos
- APIs usadas: CoinGecko + Mempool (fallback)
- Conversión automática al generar invoice

### Múltiples Monedas

El sistema está preparado para soportar múltiples monedas en el futuro. Actualmente soporta USD.

## 🔒 Seguridad

### No Custodia

- BoltPOS **NO custodia fondos**
- Los pagos van directamente a tu Lightning Address
- Tú controlas tus claves privadas

### Privacidad

- No se comparten datos personales
- Las transacciones son peer-to-peer
- El precio de BTC se obtiene de APIs públicas

## 📊 Próximas Mejoras

- [ ] Verificación automática de pagos (webhooks)
- [ ] Soporte para múltiples Lightning Addresses
- [ ] Soporte para On-chain Bitcoin
- [ ] Integración con BTCPay Server
- [ ] Reportes de pagos recibidos vs confirmados manualmente

## 🆘 Soporte

Si tienes problemas:

1. Verifica que tu Lightning Address funcione en https://lightningaddress.com
2. Prueba con una Lightning Address diferente
3. Revisa la consola del navegador (F12) para errores detallados
4. Verifica que el precio de BTC se esté obteniendo correctamente

## 📚 Referencias

- Lightning Address Spec: https://lightningaddress.com
- LNURL Spec: https://github.com/lnurl/luds
- Alby Documentation: https://guides.getalby.com
