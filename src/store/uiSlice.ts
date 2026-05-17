import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Theme, Language } from '../types';
import type { RootState } from './index';

interface UIState {
  theme: Theme;
  language: Language;
  selectedNoteId: string | null;
  editingNoteId: string | null;
  isCreateModalOpen: boolean;
  deleteConfirmNoteId: string | null;
  isCategoryModalOpen: boolean;
  editingCategoryId: string | null;
  sidebarOpen: boolean;
}

const storedTheme = (localStorage.getItem('theme') as Theme) || 'light';
const storedLang = (localStorage.getItem('language') as Language) || 'fr';

const initialState: UIState = {
  theme: storedTheme,
  language: storedLang,
  selectedNoteId: null,
  editingNoteId: null,
  isCreateModalOpen: false,
  deleteConfirmNoteId: null,
  isCategoryModalOpen: false,
  editingCategoryId: null,
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    setSelectedNote(state, action: PayloadAction<string | null>) {
      state.selectedNoteId = action.payload;
    },
    openCreateModal(state) {
      state.isCreateModalOpen = true;
      state.editingNoteId = null;
    },
    openEditModal(state, action: PayloadAction<string>) {
      state.editingNoteId = action.payload;
      state.isCreateModalOpen = false;
    },
    closeNoteModal(state) {
      state.isCreateModalOpen = false;
      state.editingNoteId = null;
    },
    requestDeleteNote(state, action: PayloadAction<string>) {
      state.deleteConfirmNoteId = action.payload;
    },
    cancelDeleteNote(state) {
      state.deleteConfirmNoteId = null;
    },
    openCategoryModal(state, action: PayloadAction<string | null>) {
      state.isCategoryModalOpen = true;
      state.editingCategoryId = action.payload;
    },
    closeCategoryModal(state) {
      state.isCategoryModalOpen = false;
      state.editingCategoryId = null;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const {
  toggleTheme, setLanguage, setSelectedNote,
  openCreateModal, openEditModal, closeNoteModal,
  requestDeleteNote, cancelDeleteNote,
  openCategoryModal, closeCategoryModal,
  toggleSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;
export const selectTheme = (state: RootState) => state.ui.theme;
export const selectLanguage = (state: RootState) => state.ui.language;
export const selectUI = (state: RootState) => state.ui;
