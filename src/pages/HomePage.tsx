import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotes } from '@/hooks/useNotes';
import { PlusIcon, FileTextIcon, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NoteList } from '@/components/NoteList';
import { NoteEditor } from '@/components/NoteEditor';
import { ChatInterface } from '@/components/ChatInterface';
import { MessageSquareIcon } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const selectedNote = selectedNoteId ? notes.find(note => note.id === selectedNoteId) : null;

  const handleCreateNote = async () => {
    const newNote = await createNote({
      title: 'Untitled Note',
      content: '',
      tags: [],
    });
    setSelectedNoteId(newNote.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2Icon className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="notes" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileTextIcon className="w-4 h-4" />
            <span>My Notes</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquareIcon className="w-4 h-4" />
            <span>Chat with Notes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="flex-1 flex flex-col space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-neutral-900">My Notes</h2>
            <Button onClick={handleCreateNote} size="sm">
              <PlusIcon className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <NoteList 
                notes={notes}
                selectedNoteId={selectedNoteId}
                onSelectNote={setSelectedNoteId}
                onDeleteNote={deleteNote}
              />
            </div>
            <div className="md:col-span-2">
              {selectedNote ? (
                <NoteEditor
                  note={selectedNote}
                  onSave={updateNote}
                  onDelete={() => {
                    deleteNote(selectedNote.id);
                    setSelectedNoteId(null);
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border-2 border-dashed border-neutral-300 p-6 text-center">
                  <FileTextIcon className="w-12 h-12 text-neutral-400 mb-3" />
                  <h3 className="text-lg font-medium text-neutral-900">No note selected</h3>
                  <p className="text-neutral-500 mt-1">Select a note from the list or create a new one</p>
                  <Button onClick={handleCreateNote} className="mt-4">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create Note
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="bg-white rounded-lg border border-neutral-200 h-[500px] overflow-hidden">
          <ChatInterface notes={notes} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePage;
