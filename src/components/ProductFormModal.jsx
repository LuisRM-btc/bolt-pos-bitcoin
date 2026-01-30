import { X, Save, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import db from '../db/db';
import { useLanguageStore } from '../store/languageStore';
import { useTranslation, translations } from '../i18n/translations';

export default function ProductFormModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Services'
  });

  const languageStore = useLanguageStore();
  const t = useTranslation(languageStore);
  
  const categories = ['Services', 'Repairs', 'Installation', 'Maintenance', 'Emergency', 'Other'];
  
  // Traducir categorías
  const getCategoryLabel = (category) => {
    const key = category.toLowerCase();
    return t(key);
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.price || parseFloat(formData.price) <= 0) {
      alert(`⚠️ ${t('completeAllFields')}`);
      return;
    }

    try {
      const productData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        category: formData.category
      };

      if (product) {
        await db.products.update(product.id, productData);
        alert(`✅ ${t('productUpdated')}`);
      } else {
        await db.products.add(productData);
        alert(`✅ ${t('productCreated')}`);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('❌ Error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Package className="text-orange-500" size={24} />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {product ? t('editProduct') : t('newProduct')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('productName')} *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('productNamePlaceholder')}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('priceUSD')} *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-bold">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t('category')} *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px]"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {getCategoryLabel(cat)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 font-semibold py-3 rounded-xl transition-colors min-h-[48px]"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Save size={20} />
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
