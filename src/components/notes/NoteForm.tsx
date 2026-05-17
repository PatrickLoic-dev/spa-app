import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '../../store';
import { createNote, updateNote } from '../../store/notesSlice';
import { selectCategories } from '../../store/categoriesSlice';
import { closeNoteModal } from '../../store/uiSlice';
import type { Note } from '../../types';

const BG_COLORS = [
  '#ffffff', '#fef3c7', '#d1fae5', '#dbeafe', '#fce7f3',
  '#f3e8ff', '#fff7ed', '#ecfdf5', '#fef2f2', '#f0f9ff',
];

interface NoteFormProps {
  editingNote?: Note;
}

export function NoteForm({ editingNote }: NoteFormProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);

  const [title, setTitle] = useState(editingNote?.title || '');
  const [content, setContent] = useState(editingNote?.content || '');
  const [categoryId, setCategoryId] = useState<string>(editingNote?.category_id || '');
  const [bgColor, setBgColor] = useState(editingNote?.bg_color || '#ffffff');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setCategoryId(editingNote.category_id || '');
      setBgColor(editingNote.bg_color);
    }
  }, [editingNote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError(t('notes.titleRequired')); return; }
    setSaving(true);
    try {
      if (editingNote) {
        await dispatch(updateNote({ id: editingNote.id, title: title.trim(), content, category_id: categoryId || null, bg_color: bgColor }));
      } else {
        await dispatch(createNote({ title: title.trim(), content, category_id: categoryId || null, bg_color: bgColor }));
      }
      dispatch(closeNoteModal());
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {t('notes.title')} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={e => { setTitle(e.target.value); setError(''); }}
          placeholder={t('notes.title')}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow text-sm"
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('notes.content')}</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={6}
          placeholder={t('notes.content')}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow text-sm resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('notes.category')}</label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow text-sm"
          >
            <option value="">{t('categories.noCategory')}</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('notes.bgColor')}</label>
          <div className="flex gap-1.5 flex-wrap">
            {BG_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setBgColor(color)}
                className="w-7 h-7 rounded-lg border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: color,
                  borderColor: bgColor === color ? '#3b82f6' : '#e5e7eb',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={() => dispatch(closeNoteModal())}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
        >
          {t('notes.cancel')}
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-colors"
        >
          {saving ? t('loading') : t('notes.save')}
        </button>
      </div>
    </form>
  );
}
