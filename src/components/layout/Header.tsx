import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store';
import { setSearchQuery, setSortField, setSortOrder } from '../../store/notesSlice';
import { toggleTheme, setLanguage, toggleSidebar } from '../../store/uiSlice';
import { selectFilter_ } from '../../store/notesSlice';
import { selectUI } from '../../store/uiSlice';
import { useDebounce } from '../../hooks/useDebounce';
import { useEffect, useState } from 'react';
import { Search, Sun, Moon, Menu, Import as SortAsc, Globe, NotebookPen } from 'lucide-react';
import type { Language, SortField } from '../../types';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'sw', label: 'SW' },
  { code: 'ar', label: 'AR' },
];

export function Header() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter_);
  const { theme, language } = useAppSelector(selectUI);

  const [localSearch, setLocalSearch] = useState(filter.searchQuery);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const handleLanguageChange = (lang: Language) => {
    dispatch(setLanguage(lang));
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const sortOptions: { value: SortField; label: string }[] = [
    { value: 'updated_at', label: t('sort.updated_at') },
    { value: 'created_at', label: t('sort.created_at') },
    { value: 'title', label: t('sort.title') },
  ];

  return (
    <header className="h-14 flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Menu size={18} />
      </button>

      <div className="flex items-center gap-2 mr-2">
        <NotebookPen size={20} className="text-blue-600 dark:text-blue-400" />
        <span className="font-bold text-gray-900 dark:text-gray-100 text-base hidden sm:block">{t('app.title')}</span>
      </div>

      <div className="flex-1 relative max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
          placeholder={t('search.placeholder')}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow"
        />
      </div>

      <div className="flex items-center gap-1 ms-auto">
        <div className="relative group">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <SortAsc size={18} />
          </button>
          <div className="absolute top-full end-0 mt-1 w-44 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
            <p className="px-3 py-1.5 text-xs text-gray-400 font-medium">{t('sort.label')}</p>
            {sortOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => {
                  dispatch(setSortField(opt.value));
                  dispatch(setSortOrder(filter.sortField === opt.value && filter.sortOrder === 'asc' ? 'desc' : 'asc'));
                }}
                className={`w-full text-start px-3 py-2 text-sm transition-colors ${
                  filter.sortField === opt.value
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Globe size={18} />
          </button>
          <div className="absolute top-full end-0 mt-1 w-36 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-start px-3 py-2 text-sm transition-colors ${
                  language === lang.code
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {t(`language.${lang.code}`)}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => dispatch(toggleTheme())}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={t('theme.toggle')}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
