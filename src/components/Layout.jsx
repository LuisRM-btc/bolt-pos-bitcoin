import { Link, Outlet, useLocation } from 'react-router-dom';
import { ShoppingCart, History, Settings, Sun, Moon, Globe } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useLanguageStore } from '../store/languageStore';
import { useTranslation } from '../i18n/translations';

export default function Layout() {
  const location = useLocation();
  const { isDark, toggleTheme } = useThemeStore();
  const languageStore = useLanguageStore();
  const t = useTranslation(languageStore);
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-24 transition-colors">
      {/* Theme Toggle Button - Top Right */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-slate-900 shadow-lg dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-800 hover:scale-110 transition-all"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="text-orange-500" size={24} />
        ) : (
          <Moon className="text-slate-700" size={24} />
        )}
      </button>

      {/* Language Toggle Button - Top Left */}
      <button
        onClick={languageStore.toggleLanguage}
        className="fixed top-4 left-4 z-50 px-4 py-2 rounded-full bg-white dark:bg-slate-900 shadow-lg dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-800 hover:scale-110 transition-all font-semibold text-sm"
        aria-label="Toggle language"
      >
        <div className="flex items-center gap-2">
          <Globe size={18} className="text-orange-500" />
          <span className="text-slate-700 dark:text-slate-300">
            {languageStore.currentLanguage.toUpperCase()}
          </span>
        </div>
      </button>
      
      {/* Main Content */}
      <main className="container mx-auto p-4 pt-20">
        <Outlet />
      </main>
      
      {/* Bottom Navigation - Mobile First */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-50 shadow-lg dark:shadow-slate-900/50 safe-area-bottom">
        <div className="flex justify-around items-center h-20">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive('/') 
                ? 'text-orange-500' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
            }`}
          >
            <ShoppingCart size={24} />
            <span className="text-xs mt-1 font-medium">{t('sales')}</span>
          </Link>
          
          <Link
            to="/history"
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive('/history') 
                ? 'text-orange-500' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
            }`}
          >
            <History size={24} />
            <span className="text-xs mt-1 font-medium">{t('history')}</span>
          </Link>
          
          <Link
            to="/settings"
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive('/settings') 
                ? 'text-orange-500' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
            }`}
          >
            <Settings size={24} />
            <span className="text-xs mt-1 font-medium">{t('settings')}</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
