import { createSlice, createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit';
import type { Note, NotesFilter, SortField, SortOrder, ViewMode } from '../types';
import type { RootState } from './index';

interface NotesState {
  items: Note[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filter: NotesFilter;
}

const initialState: NotesState = {
  items: [],
  status: 'idle',
  error: null,
  filter: {
    categoryId: null,
    searchQuery: '',
    sortField: 'updated_at',
    sortOrder: 'desc',
    viewMode: 'all',
  },
};

export const fetchNotes = createAsyncThunk('notes/fetchAll', async () => {
  const res = await fetch('/api/notes');
  if (!res.ok) throw new Error('Failed to fetch notes');
  return res.json() as Promise<Note[]>;
});

export const createNote = createAsyncThunk('notes/create', async (data: Omit<Note, 'id' | 'created_at' | 'updated_at' | 'is_favorite' | 'is_archived'>) => {
  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create note');
  return res.json() as Promise<Note>;
});

export const updateNote = createAsyncThunk('notes/update', async ({ id, ...data }: Partial<Note> & { id: string }) => {
  const res = await fetch(`/api/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update note');
  return res.json() as Promise<Note>;
});

export const deleteNote = createAsyncThunk('notes/delete', async (id: string) => {
  const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete note');
  return id;
});

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.filter.searchQuery = action.payload;
    },
    setCategoryFilter(state, action: PayloadAction<string | null>) {
      state.filter.categoryId = action.payload;
    },
    setSortField(state, action: PayloadAction<SortField>) {
      state.filter.sortField = action.payload;
    },
    setSortOrder(state, action: PayloadAction<SortOrder>) {
      state.filter.sortOrder = action.payload;
    },
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.filter.viewMode = action.payload;
      state.filter.categoryId = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotes.pending, state => { state.status = 'loading'; })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(createNote.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updateNote.fulfilled, (state, action) => {
        const idx = state.items.findIndex(n => n.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.items = state.items.filter(n => n.id !== action.payload);
      });
  },
});

export const { setSearchQuery, setCategoryFilter, setSortField, setSortOrder, setViewMode } = notesSlice.actions;
export default notesSlice.reducer;

const selectNotesState = (state: RootState) => state.notes;
const selectAllNotes = (state: RootState) => state.notes.items;
const selectFilter = (state: RootState) => state.notes.filter;

export const selectFilteredNotes = createSelector(
  [selectAllNotes, selectFilter],
  (notes, filter) => {
    let result = [...notes];

    if (filter.viewMode === 'favorites') {
      result = result.filter(n => n.is_favorite && !n.is_archived);
    } else if (filter.viewMode === 'archives') {
      result = result.filter(n => n.is_archived);
    } else {
      result = result.filter(n => !n.is_archived);
      if (filter.categoryId) {
        result = result.filter(n => n.category_id === filter.categoryId);
      }
    }

    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      result = result.filter(
        n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let av: string, bv: string;
      if (filter.sortField === 'title') {
        av = a.title.toLowerCase();
        bv = b.title.toLowerCase();
      } else {
        av = a[filter.sortField];
        bv = b[filter.sortField];
      }
      if (av < bv) return filter.sortOrder === 'asc' ? -1 : 1;
      if (av > bv) return filter.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }
);

export const selectNotesStatus = (state: RootState) => selectNotesState(state).status;
export const selectFilter_ = (state: RootState) => selectFilter(state);
