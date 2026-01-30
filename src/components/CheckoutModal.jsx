import { X, CheckCircle, XCircle, Zap, MessageCircle, Copy, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { getInvoiceFromAddress, copyToClipboard } from '../utils/lightning';
import { useSettingsStore } from '../store/settingsStore';
import { useCartStore } from '../store/cartStore';
import { useLanguageStore } from '../store/languageStore';
import { useTranslation } from '../i18n/translations';

export default function CheckoutModal({ total, items, onClose, onSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [lightningInvoice, setLightningInvoice] = useState('');
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(true);
  const [invoiceError, setInvoiceError] = useState(null);
  
  const { lightningAddress } = useSettingsStore();
  const { convertToSats, btcPrice } = useCartStore();
  const languageStore = useLanguageStore();
  const t = useTranslation(languageStore);

  useEffect(() => {
    generateRealInvoice();
  }, []);

  const generateRealInvoice = async () => {
    setIsLoadingInvoice(true);
    setInvoiceError(null);

    try {
      const amountSats = convertToSats(total);
      
      if (!btcPrice || amountSats === 0) {
        throw new Error('No se pudo calcular el monto en satoshis.');
      }

      console.log(`Generando invoice para ${amountSats} sats (${total} USD)`);
      const invoice = await getInvoiceFromAddress(lightningAddress, amountSats);
      
      setLightningInvoice(invoice);
      setIsLoadingInvoice(false);
    } catch (error) {
      console.error('Error al generar invoice:', error);
      setInvoiceError(error.message || t('errorGeneratingInvoice'));
      setIsLoadingInvoice(false);
    }
  };

  const handleCopyInvoice = async () => {
    const success = await copyToClipboard(lightningInvoice);
    if (success) {
      alert(`✅ ${t('invoiceCopied')}`);
    } else {
      alert(`❌ ${t('invoiceCopyFailed')}`);
    }
  };
  
  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentConfirmed(true);
    }, 800);
  };

  const handleFinalizePayment = () => {
    onSuccess();
  };

  const generateWhatsAppMessage = () => {
    const locale = languageStore.currentLanguage === 'es' ? es : enUS;
    const dateStr = format(new Date(), "dd 'de' MMMM yyyy, HH:mm", { locale });
    let message = `*🧾 ${t('receipt')} - BoltPOS*\n\n`;
    message += `📅 ${t('date')}: ${dateStr}\n`;
    message += `💰 ${t('total')}: $${total.toFixed(2)}\n`;
    message += `⚡ ${t('method')}: Lightning Bitcoin\n\n`;
    message += `*📦 ${t('detail')}:*\n`;
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   ${item.quantity}x $${item.price.toFixed(2)} = $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n✅ *${t('paymentConfirmed')}*\n`;
    message += `\n${t('thankYou')} 🙏`;
    
    return encodeURIComponent(message);
  };

  const handleSendWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="text-orange-500" size={24} />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {paymentConfirmed ? t('paymentConfirmed') : t('payWithLightning')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {!paymentConfirmed ? (
            <>
              <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{t('totalToCharge')}</p>
                <p className="text-5xl font-bold text-orange-500">
                  ${total.toFixed(2)}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">
                  ≈ {convertToSats(total).toLocaleString()} {t('sats')}
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  {items.length} {items.length === 1 ? t('items').slice(0, -1) : t('items')} {t('inCart')}:
                </p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {isLoadingInvoice && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-slate-600 dark:text-slate-400 font-semibold">
                    {t('connectingAlby')}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                    {t('generatingInvoice')}
                  </p>
                </div>
              )}

              {invoiceError && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <div className="flex-1">
                      <p className="text-red-700 dark:text-red-400 font-semibold text-sm mb-1">
                        {t('errorGeneratingInvoice')}
                      </p>
                      <p className="text-red-600 dark:text-red-400 text-xs">
                        {invoiceError}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={generateRealInvoice}
                    className="w-full mt-3 flex items-center justify-center gap-2 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 text-red-700 dark:text-red-400 font-semibold py-2 px-4 rounded-lg transition-colors min-h-[48px]"
                  >
                    <RefreshCw size={16} />
                    {t('retry')}
                  </button>
                </div>
              )}
              
              {!isLoadingInvoice && !invoiceError && lightningInvoice && (
                <>
                  <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
                    <QRCodeSVG
                      value={lightningInvoice}
                      size={256}
                      level="M"
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {t('payingTo')}
                    </p>
                    <p className="text-sm font-mono text-orange-500 font-semibold">
                      {lightningAddress}
                    </p>
                  </div>

                  <button
                    onClick={handleCopyInvoice}
                    className="w-full flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold py-3 px-4 rounded-xl transition-colors min-h-[48px]"
                  >
                    <Copy size={20} />
                    {t('copyInvoice')}
                  </button>
                  
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 font-semibold">{t('lightningInvoice')}:</p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 break-all font-mono">
                      {lightningInvoice}
                    </p>
                  </div>
                  
                  <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                    <p>{t('scanQR')}</p>
                    <p>{t('orCopyInvoice')}</p>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="text-center py-8">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-green-500" size={56} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  {t('paymentReceived')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {t('transactionCompleted')}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300 text-center">
                  {t('purchaseSummary')}
                </p>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-300 dark:border-slate-600 pt-2 mt-2 flex justify-between font-bold text-slate-800 dark:text-slate-100">
                    <span>{t('total')}</span>
                    <span className="text-orange-500">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSendWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 touch-manipulation flex items-center justify-center gap-2 shadow-lg min-h-[56px]"
              >
                <MessageCircle size={24} />
                {t('sendReceiptWhatsApp')}
              </button>
            </>
          )}
        </div>
        
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {!paymentConfirmed ? (
            <>
              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing || isLoadingInvoice || !!invoiceError}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 touch-manipulation flex items-center justify-center gap-2 shadow-lg min-h-[56px]"
              >
                <CheckCircle size={24} />
                {isProcessing ? t('processing') : t('confirmPaymentReceived')}
              </button>
              
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="w-full bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 text-red-700 dark:text-red-400 font-semibold py-3 rounded-xl transition-colors touch-manipulation flex items-center justify-center gap-2 border border-red-300 dark:border-red-500/30 min-h-[48px]"
              >
                <XCircle size={20} />
                {t('cancel')}
              </button>
            </>
          ) : (
            <button
              onClick={handleFinalizePayment}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 touch-manipulation flex items-center justify-center gap-2 shadow-lg min-h-[56px]"
            >
              {t('finalizeContinue')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
