import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Note, CreateNoteData, UpdateNoteData } from '@/types/note';
import {
  getNotes as getNotesApi,
  getNote as getNoteApi,
  createNote as createNoteApi,
  updateNote as updateNoteApi,
  deleteNote as deleteNoteApi,
  searchNotes as searchNotesApi,
} from '@/services/noteService';

export const useNotes = () => {
  const queryClient = useQueryClient();

  // Get all notes
  const {
    data: notes = [],
    isLoading,
    error,
  } = useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: getNotesApi,
  });

  // Get a single note by ID
  const { data: currentNote } = useQuery<Note | undefined>({
    queryKey: ['currentNote'],
    queryFn: () => ({} as Note | undefined),
    enabled: false, // We'll manually refetch when needed
  });

  // Create a new note
  const createNoteMutation = useMutation<Note, Error, CreateNoteData>({
    mutationFn: createNoteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  // Update an existing note
  const updateNoteMutation = useMutation<Note, Error, UpdateNoteData>({
    mutationFn: updateNoteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['currentNote'] });
    },
  });

  // Delete a note
  const deleteNoteMutation = useMutation<void, Error, string>({
    mutationFn: deleteNoteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.setQueryData(['currentNote'], null);
    },
  });

  // Search notes
  const searchNotesMutation = useMutation<Note[], Error, string>({
    mutationFn: searchNotesApi,
  });

  // Helper functions
  const getNote = async (id: string) => {
    return queryClient.fetchQuery({
      queryKey: ['currentNote'],
      queryFn: () => getNoteApi(id),
    });
  };

  const createNote = async (data: CreateNoteData) => {
    return createNoteMutation.mutateAsync(data);
  };

  const updateNote = async (data: UpdateNoteData) => {
    return updateNoteMutation.mutateAsync(data);
  };

  const deleteNote = async (id: string) => {
    return deleteNoteMutation.mutateAsync(id);
  };

  const searchNotes = async (query: string) => {
    return searchNotesMutation.mutateAsync(query);
  };

  return {
    notes,
    currentNote,
    isLoading,
    error,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
    isSearching: searchNotesMutation.isPending,
  };
};

export default useNotes;
