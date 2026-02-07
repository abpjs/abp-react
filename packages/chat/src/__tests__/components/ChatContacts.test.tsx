/**
 * Tests for ChatContacts component
 * @abpjs/chat v2.9.0
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatContacts, getContactName } from '../../components/ChatContacts';
import type { ChatContactDto } from '../../models/chat-contact-dto';
import { ChatMessageSide } from '../../enums/chat-message-side';

describe('ChatContacts', () => {
  const mockContacts: ChatContactDto[] = [
    {
      userId: 'user-1',
      name: 'John',
      surname: 'Doe',
      username: 'johndoe',
      lastMessageSide: ChatMessageSide.Sender,
      lastMessage: 'Hello there!',
      lastMessageDate: new Date(),
      unreadMessageCount: 2,
    },
    {
      userId: 'user-2',
      name: 'Jane',
      surname: 'Smith',
      username: 'janesmith',
      lastMessageSide: ChatMessageSide.Receiver,
      lastMessage: 'How are you?',
      lastMessageDate: new Date(),
      unreadMessageCount: 0,
    },
    {
      userId: 'user-3',
      name: 'Bob',
      surname: 'Brown',
      username: 'bobbrown',
      lastMessageSide: 0,
      lastMessage: '',
      lastMessageDate: new Date(),
      unreadMessageCount: 0,
    },
  ];

  it('should render contacts list', () => {
    render(<ChatContacts contacts={mockContacts} />);
    const container = screen.getByTestId('chat-contacts');
    expect(container).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<ChatContacts contacts={mockContacts} />);
    const search = screen.getByTestId('chat-contacts-search');
    expect(search).toBeInTheDocument();
    expect(search).toHaveAttribute('placeholder', 'Search contacts...');
  });

  it('should render all contacts with messages', () => {
    render(<ChatContacts contacts={mockContacts} />);
    expect(screen.getByTestId('chat-contact-user-1')).toBeInTheDocument();
    expect(screen.getByTestId('chat-contact-user-2')).toBeInTheDocument();
  });

  it('should filter contacts by search', () => {
    render(<ChatContacts contacts={mockContacts} />);
    const search = screen.getByTestId('chat-contacts-search');

    fireEvent.change(search, { target: { value: 'john' } });

    expect(screen.getByTestId('chat-contact-user-1')).toBeInTheDocument();
    expect(screen.queryByTestId('chat-contact-user-2')).not.toBeInTheDocument();
  });

  it('should filter contacts by username', () => {
    render(<ChatContacts contacts={mockContacts} />);
    const search = screen.getByTestId('chat-contacts-search');

    fireEvent.change(search, { target: { value: 'janesmith' } });

    expect(screen.queryByTestId('chat-contact-user-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('chat-contact-user-2')).toBeInTheDocument();
  });

  it('should call onSelect when contact is clicked', () => {
    const handleSelect = vi.fn();
    render(<ChatContacts contacts={mockContacts} onSelect={handleSelect} />);

    fireEvent.click(screen.getByTestId('chat-contact-user-1'));

    expect(handleSelect).toHaveBeenCalledWith(mockContacts[0]);
  });

  it('should highlight selected contact', () => {
    render(
      <ChatContacts
        contacts={mockContacts}
        selectedContact={mockContacts[0]}
      />
    );
    const selectedContact = screen.getByTestId('chat-contact-user-1');
    expect(selectedContact).toHaveClass('active');
  });

  it('should show unread badge for contacts with unread messages', () => {
    render(<ChatContacts contacts={mockContacts} />);
    const badge = screen.getByTestId('unread-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('2');
  });

  it('should show loading state', () => {
    render(<ChatContacts contacts={[]} loading />);
    expect(screen.getByText('Loading contacts...')).toBeInTheDocument();
  });

  it('should show empty state', () => {
    render(<ChatContacts contacts={[]} />);
    expect(screen.getByText('No contacts found')).toBeInTheDocument();
  });

  it('should show "You:" prefix for sent messages', () => {
    render(<ChatContacts contacts={mockContacts} />);
    expect(screen.getByText(/You: Hello there!/)).toBeInTheDocument();
  });

  it('should show "Other Contacts" section for contacts without messages', () => {
    render(<ChatContacts contacts={mockContacts} />);
    expect(screen.getByText('Other Contacts')).toBeInTheDocument();
    expect(screen.getByTestId('chat-contact-user-3')).toBeInTheDocument();
  });

  describe('formatDate display', () => {
    it('should show "Yesterday" for messages from yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const contacts: ChatContactDto[] = [
        {
          userId: 'user-y',
          name: 'Yesterday',
          surname: 'User',
          username: 'yuser',
          lastMessageSide: ChatMessageSide.Receiver,
          lastMessage: 'Old message',
          lastMessageDate: yesterday,
          unreadMessageCount: 0,
        },
      ];
      render(<ChatContacts contacts={contacts} />);
      expect(screen.getByText('Yesterday')).toBeInTheDocument();
    });

    it('should show weekday for messages 2-6 days ago', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const expectedWeekday = threeDaysAgo.toLocaleDateString([], { weekday: 'short' });

      const contacts: ChatContactDto[] = [
        {
          userId: 'user-w',
          name: 'Weekday',
          surname: 'User',
          username: 'wuser',
          lastMessageSide: ChatMessageSide.Receiver,
          lastMessage: 'Older message',
          lastMessageDate: threeDaysAgo,
          unreadMessageCount: 0,
        },
      ];
      render(<ChatContacts contacts={contacts} />);
      expect(screen.getByText(expectedWeekday)).toBeInTheDocument();
    });

    it('should show month/day for messages older than 7 days', () => {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      const expectedDate = tenDaysAgo.toLocaleDateString([], { month: 'short', day: 'numeric' });

      const contacts: ChatContactDto[] = [
        {
          userId: 'user-o',
          name: 'Old',
          surname: 'User',
          username: 'ouser',
          lastMessageSide: ChatMessageSide.Receiver,
          lastMessage: 'Very old message',
          lastMessageDate: tenDaysAgo,
          unreadMessageCount: 0,
        },
      ];
      render(<ChatContacts contacts={contacts} />);
      expect(screen.getByText(expectedDate)).toBeInTheDocument();
    });
  });

  it('should apply custom className', () => {
    render(<ChatContacts contacts={mockContacts} className="custom-contacts" />);
    const container = screen.getByTestId('chat-contacts');
    expect(container).toHaveClass('custom-contacts');
  });

  it('should filter contacts by surname', () => {
    render(<ChatContacts contacts={mockContacts} />);
    const search = screen.getByTestId('chat-contacts-search');

    fireEvent.change(search, { target: { value: 'Doe' } });

    expect(screen.getByTestId('chat-contact-user-1')).toBeInTheDocument();
    expect(screen.queryByTestId('chat-contact-user-2')).not.toBeInTheDocument();
  });
});

describe('getContactName', () => {
  it('should return full name when name and surname exist', () => {
    const contact = {
      userId: '1',
      name: 'John',
      surname: 'Doe',
      username: 'johndoe',
    } as ChatContactDto;
    expect(getContactName(contact)).toBe('John Doe');
  });

  it('should return name only when no surname', () => {
    const contact = {
      userId: '1',
      name: 'John',
      surname: '',
      username: 'johndoe',
    } as ChatContactDto;
    expect(getContactName(contact)).toBe('John');
  });

  it('should return username when no name', () => {
    const contact = {
      userId: '1',
      name: '',
      surname: '',
      username: 'johndoe',
    } as ChatContactDto;
    expect(getContactName(contact)).toBe('johndoe');
  });

  it('should return "Unknown" when no name or username', () => {
    const contact = {
      userId: '1',
      name: '',
      surname: '',
      username: '',
    } as ChatContactDto;
    expect(getContactName(contact)).toBe('Unknown');
  });
});
