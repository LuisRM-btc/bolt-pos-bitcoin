/**
 * Obtiene un invoice de Lightning desde una Lightning Address usando LNURL-Pay
 * @param {string} address - Lightning Address (formato: user@domain.com)
 * @param {number} amountSats - Monto en satoshis
 * @returns {Promise<string>} Payment Request (invoice lnbc...)
 */
export async function getInvoiceFromAddress(address, amountSats) {
  // Validar formato de Lightning Address
  if (!address || typeof address !== 'string') {
    throw new Error('Lightning Address inválida');
  }

  if (!address.includes('@')) {
    throw new Error('Lightning Address debe tener formato: usuario@dominio.com');
  }

  const parts = address.split('@');
  if (parts.length !== 2) {
    throw new Error('Lightning Address debe tener formato: usuario@dominio.com');
  }

  const [username, domain] = parts;

  if (!username || !domain) {
    throw new Error('Usuario o dominio vacío en Lightning Address');
  }

  try {
    // Paso 1: Obtener LNURL endpoint
    const lnurlUrl = `https://${domain}/.well-known/lnurlp/${username}`;
    console.log('Fetching LNURL from:', lnurlUrl);

    const lnurlResponse = await fetch(lnurlUrl);
    
    if (!lnurlResponse.ok) {
      throw new Error(`Error al consultar LNURL: ${lnurlResponse.status} ${lnurlResponse.statusText}`);
    }

    const lnurlData = await lnurlResponse.json();
    console.log('LNURL data:', lnurlData);

    if (!lnurlData.callback) {
      throw new Error('No se encontró callback en la respuesta LNURL');
    }

    // Validar que el monto esté dentro de los límites
    const minSendable = lnurlData.minSendable || 1000; // millisats
    const maxSendable = lnurlData.maxSendable || 100000000000; // millisats

    const amountMillisats = amountSats * 1000;

    if (amountMillisats < minSendable) {
      throw new Error(`Monto mínimo es ${minSendable / 1000} sats`);
    }

    if (amountMillisats > maxSendable) {
      throw new Error(`Monto máximo es ${maxSendable / 1000} sats`);
    }

    // Paso 2: Solicitar invoice con el monto en millisats
    const callbackUrl = `${lnurlData.callback}?amount=${amountMillisats}`;
    console.log('Requesting invoice from:', callbackUrl);

    const invoiceResponse = await fetch(callbackUrl);
    
    if (!invoiceResponse.ok) {
      throw new Error(`Error al solicitar invoice: ${invoiceResponse.status} ${invoiceResponse.statusText}`);
    }

    const invoiceData = await invoiceResponse.json();
    console.log('Invoice data:', invoiceData);

    if (invoiceData.status === 'ERROR') {
      throw new Error(invoiceData.reason || 'Error al generar invoice');
    }

    if (!invoiceData.pr) {
      throw new Error('No se recibió payment request (pr) en la respuesta');
    }

    // Retornar el payment request
    return invoiceData.pr;

  } catch (error) {
    console.error('Error en getInvoiceFromAddress:', error);
    
    // Mejorar mensajes de error
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Error de conexión. Verifica tu internet y que la Lightning Address sea válida.');
    }
    
    throw error;
  }
}

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} true si se copió exitosamente
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback para navegadores antiguos
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  } catch (error) {
    console.error('Error al copiar al portapapeles:', error);
    return false;
  }
}
