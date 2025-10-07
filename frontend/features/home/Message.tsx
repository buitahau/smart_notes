import React, { useState, useRef, useEffect } from 'react';
import { User as UserIcon, Bot as BotIcon, Check, Edit2, Trash2, Plus, Save, X, MoreVertical } from 'lucide-react';
import { Note } from '@services/note-service';
import { Clock as ClockIcon } from 'lucide-react';
import { getHeaderTitle, getEmptyState } from '@utils';

interface MessageProps {
  message: {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    notes?: Note[];
    intent?: string;
  };
  styles: { [key: string]: React.CSSProperties };
}

const NoteCard: React.FC<{ note: Note; index: number; styles: { [key: string]: React.CSSProperties } }> = ({ note, index, styles }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const [isCompleted, setIsCompleted] = useState(note.status === 'completed');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const noteDate = new Date(note.date || note.createdAt);
  const timeString = noteDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleComplete = () => {
    setIsCompleted(!isCompleted);
    // TODO: API call to update status
    console.log('Toggle complete status for note:', note.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // TODO: API call to update content
    console.log('Save note:', note.id, editedContent);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(note.content);
  };

  const handleDelete = () => {
    // TODO: API call to delete note
    console.log('Delete note:', note.id);
  };

  return (
    <div
      style={{
        ...styles.noteCard,
        animation: `fadeInUp 0.4s ease ${index * 0.1}s both`,
        opacity: isCompleted ? 0.6 : 1,
        zIndex: isMenuOpen ? 20 : 'auto',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = styles.noteCardHover.backgroundColor || 'rgba(255, 255, 255, 0.95)';
        e.currentTarget.style.borderColor = styles.noteCardHover.borderColor || 'rgba(99, 102, 241, 0.3)';
        e.currentTarget.style.boxShadow = styles.noteCardHover.boxShadow || '0 8px 24px rgba(0, 0, 0, 0.12)';
        e.currentTarget.style.transform = styles.noteCardHover.transform || 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = styles.noteCard.backgroundColor || 'rgba(255, 255, 255, 0.9)';
        e.currentTarget.style.borderColor = (styles.noteCard.border as string) || 'rgba(229, 231, 235, 0.6)';
        e.currentTarget.style.boxShadow = styles.noteCard.boxShadow || '0 2px 12px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {!isEditing && (
        <div style={{ position: 'absolute', top: '14px', right: '14px' }} ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: 'grid',
              justifyContent: 'center',
              alignItems: 'center',
              width: '28px',
              height: '28px',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            title="More options"
          >
            <MoreVertical size={16} />
          </button>
          {isMenuOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '34px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 50,
              width: '200px',
              padding: '4px',
              border: '1px solid #e5e7eb'
            }}>
              <button
                onClick={() => { handleComplete(); setIsMenuOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '13px',
                  color: '#374151',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <Check size={14} />
                {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
              </button>
              <button
                onClick={() => { handleEdit(); setIsMenuOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '13px',
                  color: '#374151',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <Edit2 size={14} />
                Edit Task
              </button>
              <button
                onClick={() => { handleDelete(); setIsMenuOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '13px',
                  color: '#ef4444',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <Trash2 size={14} />
                Delete Task
              </button>
            </div>
          )}
        </div>
      )}
      <div style={styles.noteTime}>
        <ClockIcon size={13} />
        {timeString}
      </div>
      <div style={{...styles.noteContent, textDecoration: isCompleted ? 'line-through' : 'none', paddingRight: '28px'}}>
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            style={{
              width: '100%',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '8px',
              fontSize: '13px',
              lineHeight: '1.4',
              fontFamily: 'inherit',
              resize: 'vertical',
              minHeight: '60px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            autoFocus
          />
        ) : (
          note.content
        )}
      </div>
      {isEditing && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '12px',
          justifyContent: 'flex-end'
        }}>
            <button
              onClick={handleSave}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
              }}
            >
              <Save size={14} />
              Save
            </button>
            <button
              onClick={handleCancel}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4b5563';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6b7280';
              }}
            >
              <X size={14} />
              Cancel
            </button>
        </div>
      )}
    </div>
  );
};

const AddNewNote: React.FC<{ styles: { [key: string]: React.CSSProperties }; onAddNote: (content: string) => void }> = ({ styles, onAddNote }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleAdd = () => {
    setIsAdding(true);
  };

  const handleSave = () => {
    if (newNoteContent.trim()) {
      onAddNote(newNoteContent.trim());
      setNewNoteContent('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setNewNoteContent('');
    setIsAdding(false);
  };

  return (
    <div style={{
      ...styles.noteCard,
      border: '2px dashed #d1d5db',
      backgroundColor: '#f9fafb',
      opacity: 0.8,
    }}>
      {isAdding ? (
        <div>
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Enter your task..."
            style={{
              width: '100%',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '8px',
              fontSize: '13px',
              lineHeight: '1.4',
              fontFamily: 'inherit',
              resize: 'vertical',
              minHeight: '60px',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: 'white',
            }}
            autoFocus
          />
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={handleSave}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
              }}
            >
              <Save size={14} />
              Save
            </button>
            <button
              onClick={handleCancel}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4b5563';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6b7280';
              }}
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleAdd}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '16px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: '#6b7280',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.color = '#374151';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#6b7280';
          }}
        >
          <Plus size={20} />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Add a new task</span>
        </button>
      )}
    </div>
  );
};


// Helper function to format date for display
const formatDateDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time to compare dates only
  const resetTime = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const resetDate = resetTime(date);
  const resetToday = resetTime(today);
  const resetYesterday = resetTime(yesterday);

  if (resetDate.getTime() === resetToday.getTime()) {
    return 'Today';
  } else if (resetDate.getTime() === resetYesterday.getTime()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }
};

// Helper function to group notes by date
const groupNotesByDate = (notes: Note[]): { [date: string]: Note[] } => {
  const grouped: { [date: string]: Note[] } = {};

  notes.forEach(note => {
    const noteDate = note.date || note.createdAt;
    const dateKey = new Date(noteDate).toDateString();

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(note);
  });

  // Sort dates in descending order (newest first)
  const sortedKeys = Object.keys(grouped).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  const sortedGrouped: { [date: string]: Note[] } = {};
  sortedKeys.forEach(key => {
    sortedGrouped[key] = grouped[key].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  return sortedGrouped;
};

const NotesDisplay: React.FC<{
  notes: Note[] | undefined;
  styles: { [key: string]: React.CSSProperties };
  intent?: string;
  messageContent?: string;
}> = ({ notes, styles, intent, messageContent }) => {
  const [localNotes, setLocalNotes] = useState<Note[]>(notes || []);
  const [addForms, setAddForms] = useState<{ [date: string]: string[] }>({});

  const handleAddNote = (content: string, targetDate?: string, formId?: string) => {
    const newNote: Note = {
      id: `temp-${Date.now()}`,
      content,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      date: targetDate || new Date().toISOString(),
      userId: 'temp-user',
    };
    setLocalNotes([...localNotes, newNote]);

    // Remove the specific add form after adding
    if (targetDate && formId) {
      setAddForms(prev => ({
        ...prev,
        [targetDate]: prev[targetDate].filter(id => id !== formId)
      }));
    }
    // TODO: API call to create note
    console.log('Add new note:', content, 'for date:', targetDate || new Date().toISOString());
  };

  const addNewForm = (dateString: string) => {
    const formId = `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setAddForms(prev => ({
      ...prev,
      [dateString]: [...(prev[dateString] || []), formId]
    }));
  };

  const removeForm = (dateString: string, formId: string) => {
    setAddForms(prev => ({
      ...prev,
      [dateString]: prev[dateString].filter(id => id !== formId)
    }));
  };

  if (!localNotes || localNotes.length === 0) {
    if (intent === undefined) { // Welcome message case
      return (
        <div style={styles.notesContainer}>
          <AddNewNote styles={styles} onAddNote={handleAddNote} />
        </div>
      );
    }
    const title = getHeaderTitle({ intent, messageContent });
    return (
      <div style={styles.notesContainer}>
        {title && (
          <div style={styles.notesHeader}>
            <div style={styles.notesTitle}>{title}</div>
            <div style={styles.notesCount}>0</div>
          </div>
        )}
        <AddNewNote styles={styles} onAddNote={handleAddNote} />
      </div>
    );
  }

  const title = getHeaderTitle({ intent, messageContent });
  const groupedNotes = groupNotesByDate(localNotes);

  return (
    <div style={styles.notesContainer}>
      {title && (
        <div style={styles.notesHeader}>
          <div style={styles.notesTitle}>{title}</div>
          <div style={styles.notesCount}>{localNotes?.length || 0}</div>
        </div>
      )}

      {Object.entries(groupedNotes).map(([dateString, dateNotes]) => (
        <div key={dateString} style={{ marginBottom: '20px' }}>
          {/* Date Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
            padding: '8px 12px',
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
            borderRadius: '8px',
            border: '1px solid rgba(99, 102, 241, 0.15)',
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#4f46e5',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {formatDateDisplay(dateString)}
            </div>
            <div style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '2px 8px',
                borderRadius: '12px',
              }}>
                {dateNotes.length} {dateNotes.length === 1 ? 'task' : 'tasks'}
              </div>
              {/* Plus button beside task count */}
              <button
                onClick={() => addNewForm(dateString)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: '#059669',
                  padding: '0',
                  margin: '0',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.25)';
                  e.currentTarget.style.borderColor = '#059669';
                  e.currentTarget.style.color = '#047857';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                  e.currentTarget.style.color = '#059669';
                }}
                title={`Add task for ${formatDateDisplay(dateString)}`}
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Notes for this date */}
          {dateNotes.map((note, index) => (
            <NoteCard
              key={`${note.id}-${index}`}
              note={note}
              index={index}
              styles={styles}
            />
          ))}

          {/* Multiple add forms that appear when plus button is clicked */}
          {(addForms[dateString] || []).map((formId, index) => (
            <div
              key={formId}
              style={{
                ...styles.noteCard,
                border: '2px dashed #10b981',
                backgroundColor: '#f0fdf4',
                marginTop: '8px',
                marginBottom: '8px',
                animation: `fadeInUp 0.3s ease ${index * 0.1}s both`,
              }}
            >
              <div style={{
                fontSize: '12px',
                color: '#059669',
                marginBottom: '8px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <Plus size={14} />
                Adding task for {formatDateDisplay(dateString)}
              </div>
              <textarea
                placeholder="Enter your task..."
                style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '8px',
                  fontSize: '13px',
                  lineHeight: '1.4',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  minHeight: '60px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: 'white',
                }}
                autoFocus
                onKeyDown={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  if (e.key === 'Enter' && e.ctrlKey && target.value.trim()) {
                    handleAddNote(target.value.trim(), dateString, formId);
                  } else if (e.key === 'Escape') {
                    removeForm(dateString, formId);
                  }
                }}
              />
              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => removeForm(dateString, formId)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4b5563';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#6b7280';
                  }}
                >
                  <X size={14} />
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    const textarea = e.currentTarget.closest('div')?.previousElementSibling?.previousElementSibling as HTMLTextAreaElement;
                    if (textarea?.value.trim()) {
                      handleAddNote(textarea.value.trim(), dateString, formId);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#059669';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#10b981';
                  }}
                >
                  <Save size={14} />
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const Message: React.FC<MessageProps> = ({ message, styles }) => {
  const isAI = message.type === 'ai';
  const isLoading = message.id.startsWith('loading-');

  return (
    <div
      style={{
        ...styles.messageWrapper,
        ...(isAI ? styles.messageWrapperAI : styles.messageWrapperUser),
      }}
    >
      {isAI && (
        <div style={{...styles.avatar, ...styles.avatarAI}}>
          <BotIcon size={18} color="white" />
        </div>
      )}
      <div
        style={{
          ...styles.messageBubble,
          ...(isAI ? styles.aiBubble : styles.userBubble),
        }}
        className={isAI ? 'message-bubble-ai' : 'message-bubble-user'}
      >
        <div style={styles.messageContent}>
          {isAI ? (
            <div>
              <div style={{ marginBottom: '12px', fontSize: '15px', color: '#374151' }}>
                {message.content}
              </div>
              {message.notes && message.notes.length > 0 && !isLoading ? (
                <NotesDisplay
                  notes={message.notes}
                  styles={styles}
                  intent={message.intent}
                  messageContent={message.content}
                />
              ) : !isLoading ? (
                <NotesDisplay
                  notes={[]}
                  styles={styles}
                  intent={message.intent}
                  messageContent={message.content}
                />
              ) : null}
            </div>
          ) : isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Thinking</span>
              <span className="loading-dots"></span>
            </div>
          ) : (
            message.content.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))
          )}
        </div>
        <div style={{
          ...styles.messageTime,
          ...(isAI ? styles.messageTimeAI : styles.messageTimeUser)
        }}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      {!isAI && (
        <div style={{...styles.avatar, ...styles.avatarUser}}>
          <UserIcon size={18} color="white" />
        </div>
      )}
    </div>
  );
};