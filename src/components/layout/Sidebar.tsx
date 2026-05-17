import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store';
import { setCategoryFilter, setViewMode } from '../../store/notesSlice';
import { selectCategories } from '../../store/categoriesSlice';
import { openCategoryModal } from '../../store/uiSlice';
import { selectUI } from '../../store/uiSlice';
import { selectFilter_ } from '../../store/notesSlice';
import { FileText, Star, Archive, Plus, Pencil, Tag } from 'lucide-react';
import type { ViewMode } from '../../types';

export function Sidebar() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const filter = useAppSelector(selectFilter_);
  const { sidebarOpen } = useAppSelector(selectUI);

  if (!sidebarOpen) return null;

  const navItems: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'all', label: t('nav.allNotes'), icon: <FileText size={16} /> },
    { mode: 'favorites', label: t('nav.favorites'), icon: <Star size={16} /> },
    { mode: 'archives', label: t('nav.archives'), icon: <Archive size={16} /> },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full overflow-y-auto">
      <div className="p-4 pt-6">
        <nav className="space-y-1">
          {navItems.map(item => (
            <button
              key={item.mode}
              onClick={() => dispatch(setViewMode(item.mode))}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                filter.viewMode === item.mode && !filter.categoryId
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-6">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('nav.categories')}</span>
            <button
              onClick={() => dispatch(openCategoryModal(null))}
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            onClick={() => { dispatch(setViewMode('all')); dispatch(setCategoryFilter(null)); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              filter.viewMode === 'all' && !filter.categoryId
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Tag size={16} />
            {t('categories.all')}
          </button>

          <div className="space-y-0.5 mt-0.5">
            {categories.map(cat => (
              <div key={cat.id} className="group flex items-center">
                <button
                  onClick={() => { dispatch(setViewMode('all')); dispatch(setCategoryFilter(cat.id)); }}
                  className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    filter.categoryId === cat.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="truncate">{cat.name}</span>
                </button>
                <button
                  onClick={() => dispatch(openCategoryModal(cat.id))}
                  className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-all mr-1"
                >
                  <Pencil size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
