import { useTranslation } from 'react-i18next';
import { FileText, Star, Archive } from 'lucide-react';
import type { Note, Category } from '../../types';
import { NoteCard } from './NoteCard';
import { SkeletonCard } from '../ui/SkeletonCard';

interface NotesGridProps {
  notes: Note[];
  categories: Category[];
  searchQuery: string;
  language: string;
  viewMode: string;
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (note: Note) => void;
  onToggleArchive: (note: Note) => void;
}

function EmptyState({ viewMode, searchQuery }: { viewMode: string; searchQuery: string }) {
  const { t } = useTranslation();

  if (searchQuery.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <FileText size={28} className="text-gray-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
          {t('notes.noResults', { query: searchQuery })}
        </h3>
      </div>
    );
  }

  if (viewMode === 'favorites') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
          <Star size={28} className="text-amber-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('notes.noFavorites')}</h3>
        <p className="text-sm text-gray-400 max-w-xs">{t('notes.noFavoritesHint')}</p>
      </div>
    );
  }

  if (viewMode === 'archives') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <Archive size={28} className="text-gray-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('notes.noArchives')}</h3>
        <p className="text-sm text-gray-400 max-w-xs">{t('notes.noArchivesHint')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
        <FileText size={28} className="text-blue-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('notes.noNotes')}</h3>
      <p className="text-sm text-gray-400 max-w-xs">{t('notes.noNotesHint')}</p>
    </div>
  );
}

export function NotesGrid({ notes, categories, searchQuery, language, viewMode, loading, onEdit, onDelete, onToggleFavorite, onToggleArchive }: NotesGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!notes.length) {
    return <EmptyState viewMode={viewMode} searchQuery={searchQuery} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          category={categories.find(c => c.id === note.category_id)}
          searchQuery={searchQuery}
          language={language}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
          onToggleArchive={onToggleArchive}
        />
      ))}
    </div>
  );
}
