export interface Category {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category_id: string | null;
  bg_color: string;
  is_favorite: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export type SortField = 'created_at' | 'updated_at' | 'title';
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'all' | 'favorites' | 'archives';
export type Theme = 'light' | 'dark';
export type Language = 'fr' | 'en' | 'sw' | 'ar';

export interface NotesFilter {
  categoryId: string | null;
  searchQuery: string;
  sortField: SortField;
  sortOrder: SortOrder;
  viewMode: ViewMode;
}
