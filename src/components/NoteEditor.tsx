import React, { useState, useRef, useEffect } from 'react';
import { Note, UpdateNoteData } from '@/types/note';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { BoldIcon, ItalicIcon, ListIcon, ListOrderedIcon, LinkIcon, ImageIcon, Trash2Icon, SaveIcon } from 'lucide-react';

type NoteEditorProps = {
  note: Pick<Note, 'id' | 'title' | 'content' | 'tags'>;
  onSave: (data: UpdateNoteData) => Promise<Note>;
  onDelete: () => void;
};

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onDelete }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState<string[]>(note.tags || []);
  const [isSaving, setIsSaving] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Update local state when note prop changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags || []);
  }, [note]);

  const handleSave = async () => {
    if (!title.trim()) return;
    
    setIsSaving(true);
    try {
      await onSave({
        id: note.id,
        title: title.trim(),
        content: content,
        tags: tags,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save on Cmd/Ctrl + S
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  const formatText = (prefix: string, suffix: string = '') => {
    if (!contentRef.current) return;
    
    const { selectionStart, selectionEnd, value } = contentRef.current;
    const beforeText = value.substring(0, selectionStart);
    const selectedText = value.substring(selectionStart, selectionEnd);
    const afterText = value.substring(selectionEnd);
    
    // If text is selected, wrap it with the prefix and suffix
    if (selectionStart !== selectionEnd) {
      const newText = `${beforeText}${prefix}${selectedText}${suffix}${afterText}`;
      setContent(newText);
      
      // Set cursor position after the formatted text
      setTimeout(() => {
        if (contentRef.current) {
          const newPosition = selectionStart + prefix.length;
          contentRef.current.setSelectionRange(newPosition, newPosition + selectedText.length);
          contentRef.current.focus();
        }
      }, 0);
    } else {
      // If no text is selected, just insert the prefix and suffix
      const newText = `${beforeText}${prefix}${suffix}${afterText}`;
      setContent(newText);
      
      // Set cursor position between prefix and suffix
      setTimeout(() => {
        if (contentRef.current) {
          const newPosition = selectionStart + prefix.length;
          contentRef.current.setSelectionRange(newPosition, newPosition);
          contentRef.current.focus();
        }
      }, 0);
    }
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    } else if (e.key === 'Backspace' && !currentTag && tags.length > 0) {
      // Remove last tag on backspace when input is empty
      e.preventDefault();
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="text-xl font-semibold border-0 border-b border-neutral-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary-500"
          onKeyDown={(e) => e.key === 'Enter' && contentRef.current?.focus()}
        />
      </div>
      
      <div className="flex items-center gap-1 mb-3 flex-wrap">
        <button
          type="button"
          onClick={() => formatText('**', '**')}
          className="p-1.5 rounded hover:bg-neutral-100 text-neutral-700"
          title="Bold (Ctrl+B)"
        >
          <BoldIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('*', '*')}
          className="p-1.5 rounded hover:bg-neutral-100 text-neutral-700"
          title="Italic (Ctrl+I)"
        >
          <ItalicIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('- ', '')}
          className="p-1.5 rounded hover:bg-neutral-100 text-neutral-700"
          title="Bullet List"
        >
          <ListIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('1. ', '')}
          className="p-1.5 rounded hover:bg-neutral-100 text-neutral-700"
          title="Numbered List"
        >
          <ListOrderedIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('[', '](url)')}
          className="p-1.5 rounded hover:bg-neutral-100 text-neutral-700"
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('![Alt text](', ' "title")')}
          className="p-1.5 rounded hover:bg-neutral-100 text-neutral-700"
          title="Add Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col">
        <Textarea
          ref={contentRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Start writing your note here..."
          className="flex-1 w-full resize-none border-0 p-0 focus-visible:ring-0 text-base"
        />
        
        <div className="mt-4 pt-3 border-t border-neutral-200">
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500"
                  aria-label={`Remove tag ${tag}`}
                >
                  &times;
                </button>
              </span>
            ))}
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={addTag}
              placeholder="Add a tag..."
              className="flex-1 min-w-[100px] text-sm border-0 p-0 focus:outline-none focus:ring-0"
            />
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-error-600 hover:bg-error-50 hover:text-error-700"
            >
              <Trash2Icon className="w-4 h-4 mr-1.5" />
              Delete
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={isSaving || !title.trim()}
              className="ml-auto"
            >
              {isSaving ? (
                <>
                  <span className="mr-2">Saving...</span>
                </>
              ) : (
                <>
                  <SaveIcon className="w-4 h-4 mr-1.5" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
