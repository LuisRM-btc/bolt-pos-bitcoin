import { useLiveQuery } from 'dexie-react-hooks';
import { Calendar, DollarSign, Package, Zap, ShoppingBag, TrendingUp, Receipt } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import db from '../db/db';
import { useLanguageStore } from '../store/languageStore';
import { useTranslation } from '../i18n/translations';

export default function HistoryPage() {
  const sales = useLiveQuery(() => 
    db.sales.orderBy('date').reverse().toArray(), 
    []
  );
  
  const languageStore = useLanguageStore();
  const t = useTranslation(languageStore);
  const locale = languageStore.currentLanguage === 'es' ? es : enUS;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy, HH:mm", { locale });
  };
  
  const getTotalSales = () => {
    if (!sales) return 0;
    return sales.reduce((sum, sale) => sum + sale.total, 0);
  };

  const getTodayStats = () => {
    if (!sales) return { todaySales: 0, todayTransactions: 0, avgTicket: 0 };
    
    const todaySales = sales.filter(sale => isToday(new Date(sale.date)));
    const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const todayCount = todaySales.length;
    const avgTicket = todayCount > 0 ? todayTotal / todayCount : 0;
    
    return {
      todaySales: todayTotal,
      todayTransactions: todayCount,
      avgTicket
    };
  };

  const todayStats = getTodayStats();
  
  return (
    <div className="max-w-4xl mx-auto pb-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-slate-100">
        <Calendar className="text-orange-500" size={32} />
        <span>{t('salesHistory')}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="text-orange-500" size={20} />
            <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold">{t('salesToday')}</p>
          </div>
          <p className="text-3xl font-bold text-orange-500">
            ${todayStats.todaySales.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            {format(new Date(), languageStore.currentLanguage === 'es' ? "dd 'de' MMMM" : "MMMM dd", { locale })}
          </p>
        </div>

        <div className="glass p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Receipt className="text-orange-500" size={20} />
            <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold">{t('transactions')}</p>
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            {todayStats.todayTransactions}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            {t('completedSalesToday')}
          </p>
        </div>

        <div className="glass p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-orange-500" size={20} />
            <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold">{t('avgTicket')}</p>
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            ${todayStats.avgTicket.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            {t('perTransaction')}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="text-orange-500" size={20} />
            <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold">{t('totalSales')}</p>
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{sales?.length || 0}</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{t('completeHistory')}</p>
        </div>
        <div className="glass p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="text-orange-500" size={20} />
            <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold">{t('totalRevenue')}</p>
          </div>
          <p className="text-3xl font-bold text-orange-500">
            ${getTotalSales().toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{t('allTransactionsText')}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">
          {t('allTransactions')}
        </h2>
        
        {!sales || sales.length === 0 ? (
          <div className="glass p-12 rounded-2xl text-center text-slate-500 dark:text-slate-400">
            <Package size={64} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-300">{t('noSalesYet')}</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">{t('salesWillAppear')}</p>
          </div>
        ) : (
          sales.map((sale) => (
            <div key={sale.id} className="glass p-5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="text-slate-500 dark:text-slate-500" size={16} />
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                      {formatDate(sale.date)}
                    </p>
                    {isToday(new Date(sale.date)) && (
                      <span className="text-xs bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full font-semibold">
                        {t('today')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="text-orange-500" size={14} />
                    <p className="text-xs text-orange-500 dark:text-orange-400 font-semibold">
                      {sale.paymentMethod}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t('total')}</p>
                  <p className="text-3xl font-bold text-orange-500">
                    ${sale.total.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {sale.items.length} {sale.items.length === 1 ? t('items').slice(0, -1) : t('items')}
                  </p>
                </div>
              </div>
              
              <div className="glass-light rounded-xl p-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-2 uppercase tracking-wide">
                  {t('saleDetail')}
                </p>
                <div className="space-y-2">
                  {sale.items.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between text-sm items-center"
                    >
                      <span className="text-slate-700 dark:text-slate-200 font-medium">
                        <span className="text-orange-500 font-bold">{item.quantity}x</span> {item.name}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
