import React, { useState, useRef, useEffect } from 'react';
import {
  User as UserIcon,
  Plus as PlusIcon,
  Send as SendIcon,
  ChevronDown as ChevronDownIcon,
  UserCircle as UserCircleIcon,
  LogOut as LogOutIcon,
  Calendar as CalendarIcon,
  Check as CheckIcon,
  X as XIcon,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { storage } from '@utils/storage';
import { logout } from '@services/auth-service';
import { useMiniRouter } from '@context/router-context';
import { STORAGE_KEYS } from '@utils/constants';
import { UserDetails } from '@types/login';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface NoteFormData {
  content: string;
  date: string;
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
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { navigate } = useMiniRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    defaultValues: {
      content: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const handleCreateNote = () => {
    setShowCreateNoteModal(true);
  };

  const onSubmitNote = (data: NoteFormData) => {
    // TODO: Implement actual note creation logic
    console.log('Creating note:', data);
    setShowCreateNoteModal(false);
    reset();
  };

  const handleCancelNote = () => {
    setShowCreateNoteModal(false);
    reset();
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    // TODO: Send to AI and get response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I received your message: "' + inputText + '". How can I help you with this?',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
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
        <div style={styles.messagesArea}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                ...styles.message,
                ...(message.type === 'user' ? styles.userMessage : styles.aiMessage),
              }}
            >
              <div style={styles.messageHeader}>
                <span style={styles.messageAuthor}>
                  {message.type === 'user' ? 'You' : 'AI Assistant'}
                </span>
                <span style={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div style={styles.messageContent}>{message.content}</div>
            </div>
          ))}
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
            placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
            rows={3}
          />
          <button
            style={{
              ...styles.sendButton,
              ...(inputText.trim() ? styles.sendButtonActive : {}),
            }}
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <SendIcon size={16} />
          </button>
        </div>
      </div>

      {/* Create Note Modal */}
      {showCreateNoteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal} ref={modalRef}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Create New Note</h3>
              <button style={styles.closeButton} onClick={handleCancelNote}>
                <XIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmitNote)} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Note Content</label>
                <textarea
                  {...register('content', {
                    required: 'Note content is required',
                    minLength: { value: 1, message: 'Note content cannot be empty' },
                  })}
                  style={{
                    ...styles.formTextArea,
                    ...(errors.content ? styles.formInputError : {}),
                  }}
                  placeholder="Write your note here..."
                  rows={3}
                />
                {errors.content && (
                  <span style={styles.errorMessage}>{errors.content.message}</span>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <CalendarIcon size={16} style={styles.labelIcon} />
                  Date
                </label>
                <input
                  type="date"
                  {...register('date', { required: 'Date is required' })}
                  style={{
                    ...styles.formInput,
                    ...(errors.date ? styles.formInputError : {}),
                  }}
                />
                {errors.date && <span style={styles.errorMessage}>{errors.date.message}</span>}
              </div>

              <div style={styles.formActions}>
                <button type="button" onClick={handleCancelNote} style={styles.cancelButton}>
                  <XIcon size={16} />
                  Cancel
                </button>
                <button type="submit" style={styles.submitButton}>
                  <CheckIcon size={16} />
                  Create Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    maxHeight: '600px',
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#ffffff',
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
    padding: '20px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    position: 'relative' as const,
  },
  userSectionWrapper: {
    position: 'relative' as const,
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  userIcon: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  userName: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'white',
    letterSpacing: '0.01em',
  },
  chevronIcon: {
    color: 'rgba(255, 255, 255, 0.8)',
    transition: 'transform 0.3s ease',
  },
  userMenu: {
    position: 'absolute' as const,
    top: '100%',
    left: '0',
    marginTop: '8px',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    minWidth: '160px',
    zIndex: 50,
    overflow: 'hidden',
    animation: 'fadeIn 0.2s ease-out',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderBottom: '1px solid #f3f4f6',
  },
  createButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    letterSpacing: '0.01em',
  },
  discussionContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    backgroundColor: '#fafbfc',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  message: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    animation: 'slideIn 0.3s ease-out',
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '500',
  },
  messageAuthor: {
    fontWeight: '600',
    color: '#4b5563',
  },
  messageTime: {
    opacity: 0.8,
    fontSize: '11px',
  },
  messageContent: {
    maxWidth: '85%',
    padding: '12px 16px',
    borderRadius: '16px',
    fontSize: '14px',
    lineHeight: '1.5',
    backgroundColor: '#ffffff',
    color: '#374151',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f1f3f4',
    wordWrap: 'break-word' as const,
  },
  inputContainer: {
    padding: '20px 24px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    background: 'linear-gradient(to top, #ffffff 0%, #fafbfc 100%)',
  },
  inputWrapper: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
    backgroundColor: '#ffffff',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    padding: '4px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
  },
  textArea: {
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'none' as const,
    outline: 'none',
    backgroundColor: 'transparent',
    color: '#374151',
    lineHeight: '1.5',
    minHeight: '20px',
    maxHeight: '120px',
  },
  sendButton: {
    padding: '10px',
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '40px',
    height: '40px',
  },
  sendButtonActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 8px rgba(102, 126, 234, 0.3)',
  },
  // Modal styles
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    width: '90%',
    maxWidth: '480px',
    maxHeight: '90vh',
    overflow: 'hidden',
    animation: 'modalSlideIn 0.3s ease-out',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 24px 16px',
    borderBottom: '1px solid #f1f3f4',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  headerActions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  headerCancelButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  headerSubmitButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  closeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  form: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '4px',
  },
  labelIcon: {
    color: '#6b7280',
  },
  formTextArea: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff',
    color: '#374151',
    lineHeight: '1.5',
    minHeight: '120px',
  },
  formInput: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff',
    color: '#374151',
  },
  formInputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorMessage: {
    fontSize: '12px',
    color: '#ef4444',
    fontWeight: '500',
    marginTop: '4px',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    paddingTop: '8px',
  },
  cancelButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '100px',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: '2px solid transparent',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    minWidth: '120px',
  },
};
