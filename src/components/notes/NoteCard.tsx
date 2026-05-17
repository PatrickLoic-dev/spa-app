import { Star, Archive, ArchiveRestore, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { fr, enUS, ar, type Locale } from 'date-fns/locale';
import type { Note, Category } from '../../types';
import { highlightText } from '../../hooks/useHighlight';

const dateLocales: Record<string, Locale> = { fr, en: enUS, ar, sw: enUS };

interface NoteCardProps {
  note: Note;
  category: Category | undefined;
  searchQuery: string;
  language: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (note: Note) => void;
  onToggleArchive: (note: Note) => void;
}

export function NoteCard({ note, category, searchQuery, language, onEdit, onDelete, onToggleFavorite, onToggleArchive }: NoteCardProps) {
  const { t } = useTranslation();
  const locale = dateLocales[language] ?? enUS;

  const titleHtml = highlightText(note.title, searchQuery);
  const contentHtml = highlightText(note.content, searchQuery);

  const formattedDate = format(new Date(note.updated_at), 'PPp', { locale });

  return (
    <div
      className="group relative rounded-2xl border border-gray-200 dark:border-gray-700 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-default"
      style={{ backgroundColor: note.bg_color === '#ffffff' ? undefined : note.bg_color }}
    >
      {note.is_favorite && (
        <div className="absolute top-3 right-3">
          <Star size={14} className="fill-amber-400 text-amber-400" />
        </div>
      )}

      {category && (
        <span
          className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mb-2"
          style={{ backgroundColor: category.color + '22', color: category.color }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
          {category.name}
        </span>
      )}

      <h3
        className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight mb-2 line-clamp-2"
        dangerouslySetInnerHTML={{ __html: titleHtml }}
      />

      {note.content && (
        <p
          className="text-xs text-gray-500 dark:text-gray-400 line-clamp-4 leading-relaxed mb-3"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      )}

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-black/5 dark:border-white/5">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {formattedDate}
        </span>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => onToggleFavorite(note)}
            title={note.is_favorite ? t('notes.unfavorite') : t('notes.favorite')}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <Star size={13} className={note.is_favorite ? 'fill-amber-400 text-amber-400' : 'text-gray-400'} />
          </button>
          <button
            onClick={() => onToggleArchive(note)}
            title={note.is_archived ? t('notes.unarchive') : t('notes.archive')}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            {note.is_archived
              ? <ArchiveRestore size={13} className="text-gray-400" />
              : <Archive size={13} className="text-gray-400" />}
          </button>
          <button
            onClick={() => onEdit(note.id)}
            title={t('notes.edit')}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <Pencil size={13} className="text-gray-400" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            title={t('notes.delete')}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <Trash2 size={13} className="text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
