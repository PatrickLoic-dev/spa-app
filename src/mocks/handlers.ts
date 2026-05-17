import { http, HttpResponse, delay } from 'msw';
import { v4 as uuidv4 } from 'uuid';
import type { Note, Category } from '../types';

const notes: Note[] = [
  {
    id: uuidv4(),
    title: 'Bienvenue dans NotesApp',
    content: 'Cette application vous permet de gérer vos notes personnelles. Créez, organisez et retrouvez vos idées facilement.',
    category_id: null,
    bg_color: '#fef3c7',
    is_favorite: true,
    is_archived: false,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Liste de courses',
    content: 'Lait, Oeufs, Pain, Fromage, Fruits, Légumes',
    category_id: null,
    bg_color: '#d1fae5',
    is_favorite: false,
    is_archived: false,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Idées de projet',
    content: 'Application de suivi budgetaire, Blog tech, Portfolio personnel',
    category_id: null,
    bg_color: '#dbeafe',
    is_favorite: false,
    is_archived: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

const categories: Category[] = [
  { id: uuidv4(), name: 'Personnel', color: '#10b981', created_at: new Date().toISOString() },
  { id: uuidv4(), name: 'Travail', color: '#3b82f6', created_at: new Date().toISOString() },
  { id: uuidv4(), name: 'Idées', color: '#f59e0b', created_at: new Date().toISOString() },
];

export const handlers = [
  http.get('/api/notes', async () => {
    await delay(500);
    return HttpResponse.json(notes);
  }),

  http.post('/api/notes', async ({ request }) => {
    await delay(300);
    const body = await request.json() as Partial<Note>;
    const newNote: Note = {
      id: uuidv4(),
      title: body.title || '',
      content: body.content || '',
      category_id: body.category_id || null,
      bg_color: body.bg_color || '#ffffff',
      is_favorite: false,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    notes.push(newNote);
    return HttpResponse.json(newNote, { status: 201 });
  }),

  http.put('/api/notes/:id', async ({ params, request }) => {
    await delay(300);
    const { id } = params;
    const body = await request.json() as Partial<Note>;
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    notes[idx] = { ...notes[idx], ...body, id: notes[idx].id, updated_at: new Date().toISOString() };
    return HttpResponse.json(notes[idx]);
  }),

  http.delete('/api/notes/:id', async ({ params }) => {
    await delay(300);
    const { id } = params;
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    notes.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/api/categories', async () => {
    await delay(300);
    return HttpResponse.json(categories);
  }),

  http.post('/api/categories', async ({ request }) => {
    await delay(300);
    const body = await request.json() as Partial<Category>;
    const newCat: Category = {
      id: uuidv4(),
      name: body.name || '',
      color: body.color || '#6b7280',
      created_at: new Date().toISOString(),
    };
    categories.push(newCat);
    return HttpResponse.json(newCat, { status: 201 });
  }),

  http.put('/api/categories/:id', async ({ params, request }) => {
    await delay(300);
    const { id } = params;
    const body = await request.json() as Partial<Category>;
    const idx = categories.findIndex(c => c.id === id);
    if (idx === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    categories[idx] = { ...categories[idx], ...body, id: categories[idx].id };
    return HttpResponse.json(categories[idx]);
  }),

  http.delete('/api/categories/:id', async ({ params }) => {
    await delay(300);
    const { id } = params;
    const idx = categories.findIndex(c => c.id === id);
    if (idx === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    categories.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
