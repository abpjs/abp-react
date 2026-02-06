/**
 * Chat Contacts Component
 * Displays a list of chat contacts with search functionality
 * Translated from @volo/abp.ng.chat ChatContactsComponent v2.9.0
 */

import React, { useState } from 'react';
import type { ChatContactDto } from '../../models/chat-contact-dto';
import { ConversationAvatar } from '../ConversationAvatar';
import { ChatMessageSide } from '../../enums/chat-message-side';

export interface ChatContactsProps {
  /** All contacts to display */
  contacts: ChatContactDto[];
  /** Currently selected contact */
  selectedContact?: ChatContactDto | null;
  /** Callback when a contact is selected */
  onSelect?: (contact: ChatContactDto) => void;
  /** Whether contacts are currently loading */
  loading?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Get display name from contact
 */
export function getContactName(contact: ChatContactDto): string {
  const { name, surname, username } = contact;
  if (name && surname) {
    return `${name} ${surname}`;
  }
  if (name) {
    return name;
  }
  return username || 'Unknown';
}

/**
 * Format date for display
 */
function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  if (diffDays < 7) {
    return d.toLocaleDateString([], { weekday: 'short' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/**
 * Chat Contacts component
 * Displays a searchable list of chat contacts
 *
 * @example
 * ```tsx
 * <ChatContacts
 *   contacts={contacts}
 *   selectedContact={selected}
 *   onSelect={handleSelect}
 * />
 * ```
 */
export function ChatContacts({
  contacts,
  selectedContact,
  onSelect,
  loading = false,
  className = '',
}: ChatContactsProps): React.ReactElement {
  const [filter, setFilter] = useState('');

  // Filter contacts based on search
  const filteredContacts = contacts.filter((contact) => {
    if (!filter) return true;
    const searchLower = filter.toLowerCase();
    return (
      contact.name?.toLowerCase().includes(searchLower) ||
      contact.surname?.toLowerCase().includes(searchLower) ||
      contact.username?.toLowerCase().includes(searchLower)
    );
  });

  // Separate contacts with messages from others
  const contactsWithMessages = filteredContacts.filter((c) => c.lastMessage);
  const otherContacts = filteredContacts.filter((c) => !c.lastMessage);

  const handleContactClick = (contact: ChatContactDto) => {
    onSelect?.(contact);
  };

  return (
    <div className={`chat-contacts ${className}`} style={styles.container} data-testid="chat-contacts">
      <div className="chat-contacts-search" style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search contacts..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.searchInput}
          data-testid="chat-contacts-search"
        />
      </div>

      <div className="chat-contacts-list" style={styles.list}>
        {loading ? (
          <div style={styles.loading}>Loading contacts...</div>
        ) : filteredContacts.length === 0 ? (
          <div style={styles.empty}>No contacts found</div>
        ) : (
          <>
            {/* Contacts with messages */}
            {contactsWithMessages.map((contact) => (
              <button
                key={contact.userId}
                type="button"
                onClick={() => handleContactClick(contact)}
                className={`chat-contact-item ${selectedContact?.userId === contact.userId ? 'active' : ''}`}
                style={{
                  ...styles.contactItem,
                  ...(selectedContact?.userId === contact.userId ? styles.contactItemActive : {}),
                }}
                data-testid={`chat-contact-${contact.userId}`}
              >
                <ConversationAvatar contact={contact} small />
                <div style={styles.contactInfo}>
                  <div style={styles.contactHeader}>
                    <span style={styles.contactName}>{getContactName(contact)}</span>
                    {contact.lastMessageDate && (
                      <span style={styles.contactTime}>
                        {formatDate(contact.lastMessageDate)}
                      </span>
                    )}
                  </div>
                  <div style={styles.lastMessageRow}>
                    <span style={styles.lastMessage}>
                      {contact.lastMessageSide === ChatMessageSide.Sender && 'You: '}
                      {contact.lastMessage}
                    </span>
                    {contact.unreadMessageCount > 0 && (
                      <span style={styles.unreadBadge} data-testid="unread-badge">
                        {contact.unreadMessageCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}

            {/* Other contacts (no messages yet) */}
            {otherContacts.length > 0 && (
              <>
                <div style={styles.sectionHeader}>Other Contacts</div>
                {otherContacts.map((contact) => (
                  <button
                    key={contact.userId}
                    type="button"
                    onClick={() => handleContactClick(contact)}
                    className={`chat-contact-item ${selectedContact?.userId === contact.userId ? 'active' : ''}`}
                    style={{
                      ...styles.contactItem,
                      ...(selectedContact?.userId === contact.userId ? styles.contactItemActive : {}),
                    }}
                    data-testid={`chat-contact-${contact.userId}`}
                  >
                    <ConversationAvatar contact={contact} small />
                    <div style={styles.contactInfo}>
                      <span style={styles.contactName}>{getContactName(contact)}</span>
                    </div>
                  </button>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRight: '1px solid #e5e7eb',
  },
  searchContainer: {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
  },
  searchInput: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
  },
  list: {
    flex: 1,
    overflowY: 'auto',
  },
  loading: {
    padding: '24px',
    textAlign: 'center',
    color: '#6b7280',
  },
  empty: {
    padding: '24px',
    textAlign: 'center',
    color: '#6b7280',
  },
  sectionHeader: {
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    backgroundColor: '#f9fafb',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.2s',
  },
  contactItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  contactInfo: {
    flex: 1,
    minWidth: 0,
  },
  contactHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2px',
  },
  contactName: {
    fontWeight: 500,
    fontSize: '14px',
    color: '#111827',
  },
  contactTime: {
    fontSize: '12px',
    color: '#6b7280',
  },
  lastMessageRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: '13px',
    color: '#6b7280',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
  },
  unreadBadge: {
    minWidth: '20px',
    height: '20px',
    padding: '0 6px',
    borderRadius: '10px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '8px',
  },
};

export default ChatContacts;
