import type { Meta, StoryObj } from '@storybook/react';
import { NoteCard } from './NoteCard';
import type { Note, Category } from '../../types';

const mockNote: Note = {
  id: '1',
  title: 'Ma première note',
  content: 'Contenu de la note avec suffisamment de texte pour montrer le rendu complet de la carte.',
  category_id: 'cat-1',
  bg_color: '#fef3c7',
  is_favorite: false,
  is_archived: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockCategory: Category = {
  id: 'cat-1',
  name: 'Personnel',
  color: '#10b981',
  created_at: new Date().toISOString(),
};

const meta: Meta<typeof NoteCard> = {
  title: 'Notes/NoteCard',
  component: NoteCard,
  tags: ['autodocs'],
  args: {
    note: mockNote,
    category: mockCategory,
    searchQuery: '',
    language: 'fr',
    onEdit: () => {},
    onDelete: () => {},
    onToggleFavorite: () => {},
    onToggleArchive: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof NoteCard>;

export const Default: Story = {};

export const Favorite: Story = {
  args: { note: { ...mockNote, is_favorite: true } },
};

export const WithSearch: Story = {
  args: { searchQuery: 'première' },
};

export const NoCategory: Story = {
  args: { category: undefined },
};

export const ColoredBackground: Story = {
  args: { note: { ...mockNote, bg_color: '#dbeafe' } },
};
