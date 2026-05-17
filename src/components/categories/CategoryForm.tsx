import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store';
import { createCategory, updateCategory, selectCategories } from '../../store/categoriesSlice';
import { closeCategoryModal } from '../../store/uiSlice';

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#3b82f6',
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#6b7280',
];

interface CategoryFormProps {
  editingId: string | null;
}

export function CategoryForm({ editingId }: CategoryFormProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const editing = categories.find(c => c.id === editingId);

  const [name, setName] = useState(editing?.name || '');
  const [color, setColor] = useState(editing?.color || '#3b82f6');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) { setName(editing.name); setColor(editing.color); }
  }, [editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await dispatch(updateCategory({ id: editingId, name: name.trim(), color }));
      } else {
        await dispatch(createCategory({ name: name.trim(), color }));
      }
      dispatch(closeCategoryModal());
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('categories.name')}</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('categories.color')}</label>
        <div className="flex gap-2 flex-wrap">
          {PRESET_COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110"
              style={{ backgroundColor: c, borderColor: color === c ? '#111' : 'transparent' }}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={() => dispatch(closeCategoryModal())} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors">
          {t('categories.cancel')}
        </button>
        <button type="submit" disabled={saving} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-colors">
          {saving ? t('loading') : t('categories.save')}
        </button>
      </div>
    </form>
  );
}
