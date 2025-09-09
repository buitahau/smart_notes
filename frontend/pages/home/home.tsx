import React, { useState, useRef, useEffect } from 'react';
import {
  User as UserIcon,
  Plus as PlusIcon,
  Send as SendIcon,
  ChevronDown as ChevronDownIcon,
  UserCircle as UserCircleIcon,
  LogOut as LogOutIcon,
  Calendar as CalendarIcon,
  FileText as FileTextIcon,
} from 'lucide-react';
import { storage } from '@utils/storage';
import { logout } from '@services/auth-service';
import { useMiniRouter } from '@context/router-context';
import { STORAGE_KEYS } from '@utils/constants';
import { UserDetails } from '@types/login';
import { noteService, Note } from '@services/note-service';
import { queryService } from '@services/query-service';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI assistant. How can I help you with your notes today?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [userName, setUserName] = useState(''); // This would come from auth context
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { navigate } = useMiniRouter();

  const handleCreateNote = () => {
    navigate('create-note');
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userInput = inputText.trim().toLowerCase();
     // Show loading indicator
     const loadingMessageId = `loading-${Date.now()}`;
     setMessages(prev => [...prev, {
       id: loadingMessageId,
       type: 'ai',
       content: 'Thinking...',
       timestamp: new Date(),
     }]);
    const originalInput = inputText;
    setInputText('');

    // Call query service
    const response = await queryService.sendQuery(userInput);
    const todayNotes = response.notes;
    let notesContent = "";
    if (todayNotes.length === 0) {
      notesContent += "No notes found for today.";
    } else {
      todayNotes.forEach((note, index) => {
        const noteDate = new Date(note.date || note.createdAt);
        const timeString = noteDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        notesContent += `📝 **${timeString}**\n${note.content}\n\n`;
      });
    }

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: notesContent,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiResponse]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleProfile = () => {
    // TODO: Implement profile functionality
    console.log('Open profile');
    setShowUserMenu(false);
  };

  const handleLogout = async () => {
    await storage.clear();
    await logout();
    navigate('login');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const loadProfile = async () => {
      const userDetail = (await storage.get(STORAGE_KEYS.USER)) as UserDetails;
      setUserName(userDetail.username ?? '');
    };
    loadProfile();

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollToBottom = () => {
    const messagesArea = document.getElementById('messages-area');
    if (messagesArea) {
      messagesArea.scrollTop = messagesArea.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div style={styles.container}>
      {/* Part 1: Header with user name and Create Note button */}
      <div style={styles.header}>
        <div style={styles.userSectionWrapper} ref={userMenuRef}>
          <div style={styles.userSection} onClick={toggleUserMenu}>
            <UserIcon size={20} style={styles.userIcon} />
            <span style={styles.userName}>{userName}</span>
            <ChevronDownIcon
              size={14}
              style={{
                ...styles.chevronIcon,
                transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </div>

          {/* User dropdown menu */}
          {showUserMenu && (
            <div style={styles.userMenu}>
              <div style={styles.menuItem} onClick={handleProfile}>
                <UserCircleIcon size={16} />
                <span>Profile</span>
              </div>
              <div style={styles.menuItem} onClick={handleLogout}>
                <LogOutIcon size={16} />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>

        <button style={styles.createButton} onClick={handleCreateNote}>
          <PlusIcon size={16} />
          Create Note
        </button>
      </div>

      {/* Part 2: Discussion view between user and AI */}
      <div style={styles.discussionContainer}>
        <div style={styles.messagesArea} id="messages-area">
          <div style={styles.messagesWrapper}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  ...styles.messageWrapper,
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {message.type === 'ai' && (
                  <div style={styles.avatar}>
                    <span style={styles.avatarText}>AI</span>
                  </div>
                )}
                <div
                  style={{
                    ...styles.messageBubble,
                    ...(message.type === 'user' ? styles.userBubble : styles.aiBubble),
                    whiteSpace: 'pre-line', // This will respect newlines in the message
                  }}
                >
                  <div style={styles.messageContent}>
                    {message.content.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                  <div style={styles.messageTime}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {message.type === 'user' && (
                  <div style={{...styles.avatar, backgroundColor: '#4f46e5'}}>
                    <UserIcon size={16} color="white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Part 3: Text input area */}
      <div style={styles.inputContainer}>
        <div style={styles.inputWrapper}>
          <textarea
            style={styles.textArea}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
          />
          <button
            style={{
              ...styles.sendButton,
              ...(inputText.trim() ? styles.sendButtonActive : {}),
            }}
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <SendIcon size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    maxHeight: '800px',
    width: '100%',
    maxWidth: '480px',
    backgroundColor: '#f9fafb',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: '#ffffff',
    color: '#111827',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
  },
  discussionContainer: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    backgroundColor: '#f9fafb',
  },
  messagesWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  messageWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    maxWidth: '85%',
    marginLeft: 'auto',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: 'white',
    fontWeight: '600',
    fontSize: '12px',
  },
  messageBubble: {
    padding: '12px 16px',
    borderRadius: '18px',
    maxWidth: '100%',
    position: 'relative',
    fontSize: '15px',
    lineHeight: '1.4',
  },
  aiBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: '4px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  userBubble: {
    backgroundColor: '#4f46e5',
    color: 'white',
    borderBottomRightRadius: '4px',
  },
  messageContent: {
    wordBreak: 'break-word',
  },
  messageTime: {
    fontSize: '11px',
    opacity: 0.8,
    marginTop: '4px',
    textAlign: 'right' as const,
  },
  inputContainer: {
    padding: '16px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e5e7eb',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    backgroundColor: '#f3f4f6',
    borderRadius: '24px',
    padding: '8px 12px',
  },
  textArea: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    resize: 'none',
    outline: 'none',
    padding: '8px 0',
    fontFamily: 'inherit',
    fontSize: '15px',
    lineHeight: '1.5',
    maxHeight: '120px',
  },
  sendButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#e5e7eb',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  sendButtonActive: {
    backgroundColor: '#4f46e5',
    color: 'white',
  },
};
