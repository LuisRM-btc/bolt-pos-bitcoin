import { Settings, Database, Trash2, Download, Package, Plus, Edit, FileText, Zap } from 'lucide-react';
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../db/db';
import { useCartStore } from '../store/cartStore';
import { useSettingsStore } from '../store/settingsStore';
import { useLanguageStore } from '../store/languageStore';
import { useTranslation } from '../i18n/translations';
import ProductFormModal from '../components/ProductFormModal';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

export default function SettingsPage() {
  const { clearCart } = useCartStore();
  const { lightningAddress, setLightningAddress } = useSettingsStore();
  const languageStore = useLanguageStore();
  const t = useTranslation(languageStore);
  const locale = languageStore.currentLanguage === 'es' ? es : enUS;
  
  const products = useLiveQuery(() => db.products.toArray(), []);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [tempLightningAddress, setTempLightningAddress] = useState(lightningAddress);

  const handleClearData = async () => {
    if (window.confirm(t('confirmDeleteAll'))) {
      try {
        await db.sales.clear();
        clearCart();
        alert(`✅ ${t('dataDeleted')}`);
      } catch (error) {
        console.error('Error al limpiar datos:', error);
        alert('❌ Error');
      }
    }
  };

  const handleResetProducts = async () => {
    if (window.confirm(t('confirmRestoreProducts'))) {
      try {
        await db.products.clear();

        const sampleProducts = [
          { name: 'Roof Inspection', price: 250, category: 'Services' },
          { name: 'Shingle Repair', price: 450, category: 'Repairs' },
          { name: 'Full Roof Replacement', price: 8500, category: 'Installation' },
          { name: 'Gutter Cleaning', price: 180, category: 'Maintenance' },
          { name: 'Emergency Leak Repair', price: 350, category: 'Emergency' }
        ];

        await db.products.bulkAdd(sampleProducts);
        alert(`✅ ${t('productsRestored')}\n\n${t('fiveProductsAdded')}`);
        window.location.reload();
      } catch (error) {
        console.error('Error al restaurar productos:', error);
        alert('❌ Error');
      }
    }
  };

  const handleExportData = async () => {
    try {
      const sales = await db.sales.toArray();
      const products = await db.products.toArray();

      const data = {
        exportDate: new Date().toISOString(),
        sales,
        products
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `boltpos-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert(`✅ ${t('dataExported')}\n\n${t('checkDownloads')}`);
    } catch (error) {
      console.error('Error al exportar datos:', error);
      alert('❌ Error');
    }
  };

  const handleExportCSV = async () => {
    try {
      const sales = await db.sales.toArray();

      if (sales.length === 0) {
        alert(`⚠️ ${t('noSalesToExport')}`);
        return;
      }

      const headers = languageStore.currentLanguage === 'es' 
        ? 'Fecha,Total (USD),Items,Método de Pago\n'
        : 'Date,Total (USD),Items,Payment Method\n';
      
      let csv = headers;

      sales.forEach(sale => {
        const dateStr = format(new Date(sale.date), 'dd/MM/yyyy HH:mm', { locale });
        const itemsStr = sale.items.map(item => `${item.quantity}x ${item.name}`).join(' | ');
        csv += `"${dateStr}","${sale.total.toFixed(2)}","${itemsStr}","${sale.paymentMethod}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `boltpos-sales-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert(`✅ ${t('salesExportedCSV')}`);
    } catch (error) {
      console.error('Error al exportar CSV:', error);
      alert('❌ Error');
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`${t('confirmDelete')} "${productName}"?`)) {
      try {
        await db.products.delete(productId);
        alert(`✅ ${t('productDeleted')}`);
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('❌ Error');
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleSaveLightningAddress = () => {
    if (!tempLightningAddress || !tempLightningAddress.includes('@')) {
      alert(`⚠️ ${t('invalidLightningAddress')}`);
      return;
    }
    
    setLightningAddress(tempLightningAddress);
    alert(`✅ ${t('lightningAddressSaved')}`);
  };

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {showProductModal && (
        <ProductFormModal
          product={editingProduct}
          onClose={handleCloseModal}
          onSave={() => {}}
        />
      )}

      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
        <Settings className="text-orange-500" size={32} />
        <span>{t('configuration')}</span>
      </h1>

      <div className="glass p-6 rounded-2xl mb-4">
        <h2 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">BoltPOS V2</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">
          {t('offlineFirstPos')}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500">
          {t('version')} 2.0.0 - {t('withRealLightning')}
        </p>
      </div>

      <div className="glass p-6 rounded-2xl mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
          <Zap size={20} className="text-orange-500" />
          {t('lightningConfig')}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('lightningAddress')}
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-500 mb-2">
              {t('lightningAddressDesc')}
            </p>
            <input
              type="text"
              value={tempLightningAddress}
              onChange={(e) => setTempLightningAddress(e.target.value)}
              placeholder="user@getalby.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm min-h-[48px]"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveLightningAddress}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors min-h-[48px]"
            >
              {t('saveLightningAddress')}
            </button>
            <button
              onClick={() => setTempLightningAddress(lightningAddress)}
              className="px-6 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 font-semibold py-3 rounded-xl transition-colors min-h-[48px]"
            >
              {t('cancel')}
            </button>
          </div>

          {lightningAddress && (
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl p-3">
              <p className="text-xs text-green-700 dark:text-green-400 font-semibold mb-1">
                ✅ {t('activeLightningAddress')}:
              </p>
              <p className="text-sm text-green-800 dark:text-green-300 font-mono break-all">
                {lightningAddress}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="glass p-6 rounded-2xl mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Package size={20} className="text-orange-500" />
            {t('productManagement')}
          </h2>
          <button
            onClick={handleNewProduct}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors min-h-[48px]"
          >
            <Plus size={20} />
            {t('newProduct')}
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto pb-4">
          {products?.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <Package size={48} className="mx-auto mb-2 opacity-30" />
              <p>{t('noProducts')}</p>
            </div>
          ) : (
            products?.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {product.category} • ${product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="p-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={t('edit')}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id, product.name)}
                    className="p-2 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label={t('delete')}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="glass p-6 rounded-2xl space-y-4 mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-100">
          <Database size={20} className="text-orange-500" />
          {t('dataManagement')}
        </h2>

        <button
          onClick={handleExportData}
          className="w-full flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold py-3 px-4 rounded-xl transition-colors touch-manipulation min-h-[52px]"
        >
          <Download size={20} />
          {t('exportData')}
        </button>

        <button
          onClick={handleExportCSV}
          className="w-full flex items-center justify-center gap-2 bg-green-100 dark:bg-green-500/20 hover:bg-green-200 dark:hover:bg-green-500/30 text-green-700 dark:text-green-400 font-semibold py-3 px-4 rounded-xl transition-colors touch-manipulation border border-green-300 dark:border-green-500/30 min-h-[52px]"
        >
          <FileText size={20} />
          {t('exportSalesCSV')}
        </button>

        <button
          onClick={handleResetProducts}
          className="w-full flex items-center justify-center gap-2 bg-orange-100 dark:bg-orange-500/20 hover:bg-orange-200 dark:hover:bg-orange-500/30 text-orange-700 dark:text-orange-400 font-semibold py-3 px-4 rounded-xl transition-colors touch-manipulation border border-orange-300 dark:border-orange-500/30 min-h-[52px]"
        >
          <Database size={20} />
          {t('restoreProducts')}
        </button>

        <button
          onClick={handleClearData}
          className="w-full flex items-center justify-center gap-2 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 text-red-700 dark:text-red-400 font-semibold py-3 px-4 rounded-xl transition-colors touch-manipulation border border-red-300 dark:border-red-500/30 min-h-[52px]"
        >
          <Trash2 size={20} />
          {t('deleteAllHistory')}
        </button>
      </div>

      <div className="glass p-6 rounded-2xl">
        <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">{t('features')}</h2>
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">⚡</span>
            <span><strong>{t('offlineFirst')}:</strong> {t('offlineFirstDesc')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">💾</span>
            <span><strong>{t('localPersistence')}:</strong> {t('localPersistenceDesc')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">📱</span>
            <span><strong>{t('mobileFirst')}:</strong> {t('mobileFirstDesc')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">₿</span>
            <span><strong>{t('bitcoinReady')}:</strong> {t('bitcoinReadyDesc')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">🌓</span>
            <span><strong>{t('themes')}:</strong> {t('themesDesc')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">🛍️</span>
            <span><strong>{t('productManagement')}:</strong> {t('productManagementDesc')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">📊</span>
            <span><strong>{t('reports')}:</strong> {t('reportsDesc')}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
