import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchNotes, updateNote, deleteNote, selectFilteredNotes, selectNotesStatus, selectFilter_ } from '../store/notesSlice';
import { fetchCategories, selectCategories } from '../store/categoriesSlice';
import { openCreateModal, openEditModal, requestDeleteNote, cancelDeleteNote, selectUI } from '../store/uiSlice';
import { NotesGrid } from '../components/notes/NotesGrid';
import { NoteForm } from '../components/notes/NoteForm';
import { CategoryForm } from '../components/categories/CategoryForm';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import type { Note } from '../types';

export function NotesPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const notes = useAppSelector(selectFilteredNotes);
  const categories = useAppSelector(selectCategories);
  const status = useAppSelector(selectNotesStatus);
  const filter = useAppSelector(selectFilter_);
  const ui = useAppSelector(selectUI);

  const allNotes = useAppSelector(state => state.notes.items);
  const editingNote = ui.editingNoteId ? allNotes.find(n => n.id === ui.editingNoteId) : undefined;
  const deletingNote = ui.deleteConfirmNoteId ? allNotes.find(n => n.id === ui.deleteConfirmNoteId) : undefined;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchNotes());
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  const handleToggleFavorite = (note: Note) => {
    dispatch(updateNote({ id: note.id, is_favorite: !note.is_favorite }));
  };

  const handleToggleArchive = (note: Note) => {
    dispatch(updateNote({ id: note.id, is_archived: !note.is_archived }));
  };

  const handleConfirmDelete = () => {
    if (ui.deleteConfirmNoteId) {
      dispatch(deleteNote(ui.deleteConfirmNoteId));
      dispatch(cancelDeleteNote());
    }
  };

  const viewLabels: Record<string, string> = {
    all: t('nav.allNotes'),
    favorites: t('nav.favorites'),
    archives: t('nav.archives'),
  };

  const categoryName = filter.categoryId
    ? categories.find(c => c.id === filter.categoryId)?.name
    : null;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {categoryName || viewLabels[filter.viewMode]}
          </h1>
          {status === 'succeeded' && (
            <p className="text-xs text-gray-400 mt-0.5">
              {t('notes.count', { count: notes.length })}
            </p>
          )}
        </div>

        {filter.viewMode !== 'archives' && (
          <button
            onClick={() => dispatch(openCreateModal())}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm hover:shadow-md"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">{t('notes.create')}</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <NotesGrid
          notes={notes}
          categories={categories}
          searchQuery={filter.searchQuery}
          language={ui.language}
          viewMode={filter.viewMode}
          loading={status === 'loading'}
          onEdit={id => dispatch(openEditModal(id))}
          onDelete={id => dispatch(requestDeleteNote(id))}
          onToggleFavorite={handleToggleFavorite}
          onToggleArchive={handleToggleArchive}
        />
      </div>

      <Modal
        isOpen={ui.isCreateModalOpen}
        onClose={() => dispatch({ type: 'ui/closeNoteModal' })}
        title={t('notes.create')}
        size="lg"
      >
        <NoteForm />
      </Modal>

      <Modal
        isOpen={!!ui.editingNoteId}
        onClose={() => dispatch({ type: 'ui/closeNoteModal' })}
        title={t('notes.edit')}
        size="lg"
      >
        <NoteForm editingNote={editingNote} />
      </Modal>

      <Modal
        isOpen={ui.isCategoryModalOpen}
        onClose={() => dispatch({ type: 'ui/closeCategoryModal' })}
        title={ui.editingCategoryId ? t('categories.edit') : t('categories.create')}
        size="sm"
      >
        <CategoryForm editingId={ui.editingCategoryId} />
      </Modal>

      <ConfirmDialog
        isOpen={!!ui.deleteConfirmNoteId}
        title={t('notes.deleteConfirm')}
        message={t('notes.deleteMessage', { title: deletingNote?.title || '' })}
        onConfirm={handleConfirmDelete}
        onCancel={() => dispatch(cancelDeleteNote())}
        confirmLabel={t('notes.confirmDelete')}
      />
    </div>
  );
}
