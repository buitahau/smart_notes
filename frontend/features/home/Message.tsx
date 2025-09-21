import React from 'react';
import { User as UserIcon, Bot as BotIcon } from 'lucide-react';
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
  const noteDate = new Date(note.date || note.createdAt);
  const timeString = noteDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      style={{
        ...styles.noteCard,
        animation: `fadeInUp 0.4s ease ${index * 0.1}s both`,
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
      <div style={styles.noteTime}>
        <ClockIcon size={13} />
        {timeString}
      </div>
      <div style={styles.noteContent}>
        {note.content}
      </div>
    </div>
  );
};

const NotesDisplay: React.FC<{
  notes: Note[] | undefined;
  styles: { [key: string]: React.CSSProperties };
  intent?: string;
  messageContent?: string;
}> = ({ notes, styles, intent, messageContent }) => {
  if (!notes || notes.length === 0) {
    const emptyState = getEmptyState({ intent, messageContent });

    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyStateIcon}>{emptyState.icon}</div>
        <div style={styles.emptyStateText}>
          {emptyState.text}
        </div>
      </div>
    );
  }

  const title = getHeaderTitle({ intent, messageContent });

  return (
    <div style={styles.notesContainer}>
      <div style={styles.notesHeader}>
        <div style={styles.notesTitle}>{title}</div>
        <div style={styles.notesCount}>{notes?.length || 0}</div>
      </div>
      {notes?.map((note, index) => (
        <NoteCard key={`${note.id}-${index}`} note={note} index={index} styles={styles} />
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
          {isAI && message.notes ? (
            <div>
              <div style={{ marginBottom: '12px', fontSize: '15px', color: '#374151' }}>
                {message.content}
              </div>
              <NotesDisplay
                notes={message.notes}
                styles={styles}
                intent={message.intent}
                messageContent={message.content}
              />
            </div>
          ) : isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {message.content}
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