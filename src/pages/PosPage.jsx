import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, Minus, Trash2, DollarSign, Zap, ShoppingCart, Grid3x3, Calculator, Delete } from 'lucide-react';
import { useState, useEffect } from 'react';
import db from '../db/db';
import { useCartStore } from '../store/cartStore';
import { useLanguageStore } from '../store/languageStore';
import { useTranslation } from '../i18n/translations';
import CheckoutModal from '../components/CheckoutModal';

export default function PosPage() {
  const products = useLiveQuery(() => db.products.toArray(), []);
  const { 
    items, 
    addItem, 
    addManualItem, 
    removeItem, 
    deleteItem, 
    clearCart, 
    getTotal, 
    getTotalItems,
    fetchBtcPrice,
    convertToSats,
    btcPrice
  } = useCartStore();
  
  const languageStore = useLanguageStore();
  const t = useTranslation(languageStore);
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [viewMode, setViewMode] = useState('catalog');
  const [manualAmount, setManualAmount] = useState('');

  useEffect(() => {
    fetchBtcPrice();
    const interval = setInterval(() => {
      fetchBtcPrice();
    }, 300000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleCheckout = () => {
    if (items.length === 0) {
      alert(t('cartEmpty'));
      return;
    }
    setShowCheckout(true);
  };
  
  const handlePaymentSuccess = async () => {
    const total = getTotal();
    
    const sale = {
      date: new Date().toISOString(),
      total: total,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      paymentMethod: 'Lightning Bitcoin'
    };
    
    try {
      await db.sales.add(sale);
      clearCart();
      setShowCheckout(false);
      
      setTimeout(() => {
        alert(`⚡ ${t('paymentConfirmedMsg')}\n\n${t('total')}: $${total.toFixed(2)}\n${t('method')}: Lightning Network\n\n✅ ${t('savedSuccessfully')}`);
      }, 100);
    } catch (error) {
      console.error('Error al guardar venta:', error);
      alert(`❌ Error ${t('processing').toLowerCase()}`);
    }
  };

  const handleKeypadPress = (key) => {
    if (key === 'delete') {
      setManualAmount(manualAmount.slice(0, -1));
    } else if (key === 'clear') {
      setManualAmount('');
    } else if (key === '.') {
      if (!manualAmount.includes('.')) {
        setManualAmount(manualAmount + '.');
      }
    } else {
      setManualAmount(manualAmount + key);
    }
  };

  const handleAddManualItem = () => {
    const amount = parseFloat(manualAmount);
    if (isNaN(amount) || amount <= 0) {
      alert(`⚠️ ${t('invalidAmount')}`);
      return;
    }
    
    addManualItem(amount, `${t('manual')} $${amount.toFixed(2)}`);
    setManualAmount('');
    alert(`✅ ${t('itemAdded')}: $${amount.toFixed(2)}`);
  };
  
  return (
    <>
      {showCheckout && (
        <CheckoutModal
          total={getTotal()}
          items={items}
          onClose={() => setShowCheckout(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
      
      <div className="grid lg:grid-cols-3 gap-4 pb-6">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <DollarSign className="text-orange-500" size={32} />
              <span>{t('boltpos')}</span>
            </h1>

            <div className="flex gap-2 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('catalog')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  viewMode === 'catalog'
                    ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Grid3x3 size={18} />
                {t('catalog')}
              </button>
              <button
                onClick={() => setViewMode('keypad')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  viewMode === 'keypad'
                    ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Calculator size={18} />
                {t('keypad')}
              </button>
            </div>
          </div>

          {viewMode === 'catalog' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {products?.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addItem(product)}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md transition-all transform hover:scale-105 active:scale-95 touch-manipulation min-h-[120px]"
                >
                  <div className="text-left">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-slate-800 dark:text-slate-100">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{product.category}</p>
                    <p className="text-orange-500 font-bold text-lg">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {viewMode === 'keypad' && (
            <div className="glass p-6 rounded-2xl max-w-md mx-auto">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t('amountToCharge')}
                </label>
                <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-4 text-right">
                  <span className="text-4xl font-bold text-slate-800 dark:text-slate-100">
                    ${manualAmount || '0.00'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0'].map((key) => (
                  <button
                    key={key}
                    onClick={() => handleKeypadPress(key)}
                    className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-2xl py-4 rounded-xl transition-colors active:scale-95 min-h-[56px]"
                  >
                    {key}
                  </button>
                ))}
                <button
                  onClick={() => handleKeypadPress('delete')}
                  className="bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 py-4 rounded-xl transition-colors active:scale-95 flex items-center justify-center min-h-[56px]"
                >
                  <Delete size={28} />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleKeypadPress('clear')}
                  className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 font-semibold py-3 rounded-xl transition-colors min-h-[48px]"
                >
                  {t('clear')}
                </button>
                <button
                  onClick={handleAddManualItem}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <Plus size={20} />
                  {t('add')}
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-4 sticky top-4">
            <h2 className="text-xl font-bold mb-4 flex items-center justify-between text-slate-800 dark:text-slate-100">
              <span>{t('cart')}</span>
              <span className="text-sm text-orange-500">
                {getTotalItems()} {t('items')}
              </span>
            </h2>
            
            {items.length === 0 ? (
              <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                <ShoppingCart size={48} className="mx-auto mb-2 opacity-50" />
                <p>{t('emptyCart')}</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-[50vh] overflow-y-auto pb-4">
                  {items.map((item) => (
                    <div key={item.id} className="glass-light p-3 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-sm flex-1 text-slate-800 dark:text-slate-100">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-red-500 hover:text-red-400 ml-2 min-w-[40px] min-h-[40px] flex items-center justify-center"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        {!item.isManual ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 rounded-lg p-2 touch-manipulation transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-bold w-8 text-center text-slate-800 dark:text-slate-100">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => addItem(item)}
                              className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 rounded-lg p-2 touch-manipulation transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 dark:text-slate-400 italic">{t('manual')}</span>
                        )}
                        
                        <div className="text-right">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            ${item.price.toFixed(2)} {!item.isManual && t('each')}
                          </p>
                          <p className="text-orange-500 font-bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">
                  <div className="flex justify-between items-center text-2xl font-bold text-slate-800 dark:text-slate-100">
                    <span>{t('total')}:</span>
                    <span className="text-orange-500">
                      ${getTotal().toFixed(2)}
                    </span>
                  </div>
                  
                  {btcPrice && (
                    <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                      ≈ {convertToSats(getTotal()).toLocaleString()} {t('sats')}
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        1 BTC = ${btcPrice.toLocaleString()}
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 touch-manipulation flex items-center justify-center gap-2 shadow-lg min-h-[56px]"
                  >
                    <Zap size={24} />
                    {t('payWithLightning')}
                  </button>
                  
                  <button
                    onClick={clearCart}
                    className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 font-semibold py-3 rounded-xl transition-colors touch-manipulation min-h-[48px]"
                  >
                    {t('clearCart')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
