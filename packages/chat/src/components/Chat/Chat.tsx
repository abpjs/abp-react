/**
 * Chat Component
 * Main chat interface with contacts list and conversation view
 * Translated from @volo/abp.ng.chat ChatComponent v2.9.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ChatContactDto } from '../../models/chat-contact-dto';
import type { ChatMessageDto } from '../../models/chat-message-dto';
import { ChatContacts, getContactName } from '../ChatContacts';
import { ConversationAvatar } from '../ConversationAvatar';
import { ChatMessageSide } from '../../enums/chat-message-side';

export interface ChatProps {
  /** All contacts to display */
  contacts: ChatContactDto[];
  /** Messages map keyed by user ID */
  userMessages: Map<string, ChatMessageDto[]>;
  /** Currently selected contact */
  selectedContact?: ChatContactDto | null;
  /** Callback when a contact is selected */
  onSelectContact?: (contact: ChatContactDto) => void;
  /** Callback when sending a message */
  onSendMessage?: (targetUserId: string, message: string) => void;
  /** Callback when loading more messages (pagination) */
  onLoadMore?: (targetUserId: string) => void;
  /** Callback when marking conversation as read */
  onMarkAsRead?: (targetUserId: string) => void;
  /** Total unread message count */
  unreadMessageCount?: number;
  /** Whether contacts are loading */
  contactsLoading?: boolean;
  /** Whether messages are loading */
  messagesLoading?: boolean;
  /** Whether all messages are loaded (no more pagination) */
  allMessagesLoaded?: boolean;
  /** Whether to send message on Enter key */
  sendOnEnter?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Format message date for display
 */
function getDateFormat(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) {
    return 'Yesterday ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Chat component
 * Main chat interface with contacts and conversation view
 *
 * @example
 * ```tsx
 * <Chat
 *   contacts={contacts}
 *   userMessages={messages}
 *   selectedContact={selected}
 *   onSelectContact={handleSelect}
 *   onSendMessage={handleSend}
 * />
 * ```
 */
export function Chat({
  contacts,
  userMessages,
  selectedContact,
  onSelectContact,
  onSendMessage,
  onLoadMore,
  onMarkAsRead,
  unreadMessageCount: _unreadMessageCount = 0,
  contactsLoading = false,
  messagesLoading = false,
  allMessagesLoaded = false,
  sendOnEnter = true,
  className = '',
}: ChatProps): React.ReactElement {
  // Note: _unreadMessageCount is available for future use (e.g., showing in header)
  void _unreadMessageCount;
  const [message, setMessage] = useState('');
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const prevSelectedContactRef = useRef<string | null>(null);

  // Get messages for selected contact
  const selectedContactMessages = selectedContact
    ? userMessages.get(selectedContact.userId) || []
    : [];

  // Get contact display name
  const contactName = selectedContact ? getContactName(selectedContact) : '';

  // Scroll to bottom when contact changes or new messages arrive
  useEffect(() => {
    if (selectedContact && chatBoxRef.current) {
      // Only auto-scroll if it's a new contact or we're near the bottom
      if (prevSelectedContactRef.current !== selectedContact.userId) {
        scrollToEnd();
        prevSelectedContactRef.current = selectedContact.userId;
      }
    }
  }, [selectedContact, selectedContactMessages.length]);

  // Mark conversation as read when selecting a contact
  useEffect(() => {
    if (selectedContact && selectedContact.unreadMessageCount > 0) {
      onMarkAsRead?.(selectedContact.userId);
    }
  }, [selectedContact, onMarkAsRead]);

  const scrollToEnd = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      // Load more when scrolling near the top
      if (target.scrollTop < 50 && !messagesLoading && !allMessagesLoaded && selectedContact) {
        onLoadMore?.(selectedContact.userId);
      }
    },
    [messagesLoading, allMessagesLoaded, selectedContact, onLoadMore]
  );

  const handleSend = () => {
    if (!message.trim() || !selectedContact) return;

    onSendMessage?.(selectedContact.userId, message.trim());
    setMessage('');

    // Scroll to bottom after sending
    setTimeout(scrollToEnd, 100);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (sendOnEnter && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleContactSelect = (contact: ChatContactDto) => {
    onSelectContact?.(contact);
  };

  return (
    <div className={`chat ${className}`} style={styles.container} data-testid="chat">
      {/* Contacts sidebar */}
      <div className="chat-sidebar" style={styles.sidebar}>
        <ChatContacts
          contacts={contacts}
          selectedContact={selectedContact}
          onSelect={handleContactSelect}
          loading={contactsLoading}
        />
      </div>

      {/* Conversation area */}
      <div className="chat-main" style={styles.main}>
        {selectedContact ? (
          <>
            {/* Header */}
            <div className="chat-header" style={styles.header}>
              <ConversationAvatar contact={selectedContact} small />
              <span style={styles.headerName}>{contactName}</span>
            </div>

            {/* Messages */}
            <div
              ref={chatBoxRef}
              className="chat-messages"
              style={styles.messages}
              onScroll={handleScroll}
              data-testid="chat-messages"
            >
              {messagesLoading && (
                <div style={styles.loadingMore}>Loading...</div>
              )}
              {selectedContactMessages.map((msg, index) => (
                <div
                  key={`${msg.messageDate}-${index}`}
                  className={`chat-message ${msg.side === ChatMessageSide.Sender ? 'sent' : 'received'}`}
                  style={{
                    ...styles.messageWrapper,
                    justifyContent: msg.side === ChatMessageSide.Sender ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      ...styles.messageBubble,
                      ...(msg.side === ChatMessageSide.Sender
                        ? styles.messageSent
                        : styles.messageReceived),
                    }}
                  >
                    <div style={styles.messageText}>{msg.message}</div>
                    <div style={styles.messageTime}>
                      {getDateFormat(msg.messageDate)}
                      {msg.side === ChatMessageSide.Sender && msg.isRead && (
                        <span style={styles.readIndicator}> ✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="chat-input" style={styles.inputContainer}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                style={styles.textarea}
                data-testid="chat-input"
                rows={1}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!message.trim()}
                style={{
                  ...styles.sendButton,
                  ...(message.trim() ? {} : styles.sendButtonDisabled),
                }}
                data-testid="chat-send-button"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="chat-empty" style={styles.empty}>
            <div style={styles.emptyIcon}>💬</div>
            <div style={styles.emptyText}>Select a contact to start chatting</div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    height: '100%',
    minHeight: '500px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  sidebar: {
    width: '320px',
    flexShrink: 0,
    borderRight: '1px solid #e5e7eb',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  headerName: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#111827',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  loadingMore: {
    textAlign: 'center',
    padding: '8px',
    color: '#6b7280',
    fontSize: '14px',
  },
  messageWrapper: {
    display: 'flex',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '10px 14px',
    borderRadius: '16px',
    wordBreak: 'break-word',
  },
  messageSent: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    borderBottomRightRadius: '4px',
  },
  messageReceived: {
    backgroundColor: '#f3f4f6',
    color: '#111827',
    borderBottomLeftRadius: '4px',
  },
  messageText: {
    fontSize: '14px',
    lineHeight: '1.4',
  },
  messageTime: {
    fontSize: '11px',
    marginTop: '4px',
    opacity: 0.7,
  },
  readIndicator: {
    marginLeft: '4px',
  },
  inputContainer: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  textarea: {
    flex: 1,
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    resize: 'none',
    outline: 'none',
    minHeight: '44px',
    maxHeight: '120px',
  },
  sendButton: {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  empty: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '16px',
  },
};

export default Chat;
