import { Note, CreateNoteData, UpdateNoteData } from '@/types/note';

// Mock data for development
const MOCK_NOTES: Note[] = [
  {
    id: '1',
    title: 'Welcome to Smart Notes',
    content: 'This is your first note. Start writing!',
    tags: ['welcome', 'getting-started'],
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user-123',
  },
  {
    id: '2',
    title: 'Shopping List',
    content: '- Milk\n- Eggs\n- Bread\n- Fruits',
    tags: ['shopping', 'personal'],
    createdAt: new Date(Date.now() - 86400000), // Yesterday
    updatedAt: new Date(Date.now() - 86400000),
    userId: 'user-123',
  },
  {
    id: '3',
    title: 'Project Ideas',
    content: '1. Build a Chrome extension\n2. Learn TypeScript\n3. Create a personal website',
    tags: ['projects', 'ideas'],
    createdAt: new Date(Date.now() - 2 * 86400000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 86400000),
    userId: 'user-123',
  },
];

// Get all notes for the current user
export const getNotes = async (): Promise<Note[]> => {
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  
  // Get notes from Chrome storage or use mock data
  const result = await chrome.storage.local.get('notes');
  return result.notes || MOCK_NOTES;
};

// Get a single note by ID
export const getNote = async (id: string): Promise<Note | undefined> => {
  const notes = await getNotes();
  return notes.find(note => note.id === id);
};

// Create a new note
export const createNote = async (data: CreateNoteData): Promise<Note> => {
  const notes = await getNotes();
  const newNote: Note = {
    id: `note-${Date.now()}`,
    title: data.title,
    content: data.content,
    tags: data.tags || [],
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user-123', // In a real app, this would come from auth
  };
  
  await chrome.storage.local.set({ notes: [...notes, newNote] });
  return newNote;
};

// Update an existing note
export const updateNote = async (data: UpdateNoteData): Promise<Note> => {
  const notes = await getNotes();
  const noteIndex = notes.findIndex(note => note.id === data.id);
  
  if (noteIndex === -1) {
    throw new Error('Note not found');
  }
  
  const updatedNote: Note = {
    ...notes[noteIndex],
    title: data.title !== undefined ? data.title : notes[noteIndex].title,
    content: data.content !== undefined ? data.content : notes[noteIndex].content,
    tags: data.tags !== undefined ? data.tags : notes[noteIndex].tags,
    updatedAt: new Date(),
  };
  
  const updatedNotes = [...notes];
  updatedNotes[noteIndex] = updatedNote;
  
  await chrome.storage.local.set({ notes: updatedNotes });
  return updatedNote;
};

// Delete a note
export const deleteNote = async (id: string): Promise<void> => {
  const notes = await getNotes();
  const filteredNotes = notes.filter(note => note.id !== id);
  
  if (filteredNotes.length === notes.length) {
    throw new Error('Note not found');
  }
  
  await chrome.storage.local.set({ notes: filteredNotes });
};

// Search notes by query
export const searchNotes = async (query: string): Promise<Note[]> => {
  const notes = await getNotes();
  const queryLower = query.toLowerCase();
  
  return notes.filter(note => 
    note.title.toLowerCase().includes(queryLower) || 
    note.content.toLowerCase().includes(queryLower) ||
    note.tags.some(tag => tag.toLowerCase().includes(queryLower))
  );
};
