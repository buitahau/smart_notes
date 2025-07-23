import React from 'react';
import { Note } from '@/types/note';
import { formatDate } from '@/lib/utils';
import { Trash2Icon, ClockIcon, TagIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export const NoteList: React.FC<NoteListProps> = ({
  notes,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
}) => {
  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        <p>No notes yet. Create your first note!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <div
          key={note.id}
          className={cn(
            'group relative p-4 rounded-lg border cursor-pointer transition-colors',
            selectedNoteId === note.id
              ? 'border-primary-500 bg-primary-50'
              : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50',
          )}
          onClick={() => onSelectNote(note.id)}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-neutral-900 truncate pr-6">
              {note.title || 'Untitled Note'}
            </h3>
            <button
              className={cn(
                'p-1 rounded-full text-neutral-400 hover:text-error-500 opacity-0 group-hover:opacity-100 transition-opacity',
                selectedNoteId === note.id && 'opacity-100',
              )}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNote(note.id);
              }}
              aria-label="Delete note"
            >
              <Trash2Icon className="w-4 h-4" />
            </button>
          </div>
          
          {note.content && (
            <p className="mt-1 text-sm text-neutral-500 line-clamp-2">
              {note.content.replace(/[#*_`~]/g, '')}
            </p>
          )}
          
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
            <div className="flex items-center">
              <ClockIcon className="w-3 h-3 mr-1" />
              <span>{formatDate(note.updatedAt)}</span>
            </div>
            
            {note.tags && note.tags.length > 0 && (
              <div className="flex items-center">
                <TagIcon className="w-3 h-3 mr-1" />
                <span>{note.tags[0]}</span>
                {note.tags.length > 1 && <span>+{note.tags.length - 1}</span>}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
