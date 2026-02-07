/**
 * Tests for Chat component
 * @abpjs/chat v2.9.0
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Chat } from '../../components/Chat';
import type { ChatContactDto } from '../../models/chat-contact-dto';
import type { ChatMessageDto } from '../../models/chat-message-dto';
import { ChatMessageSide } from '../../enums/chat-message-side';

describe('Chat', () => {
  const mockContacts: ChatContactDto[] = [
    {
      userId: 'user-1',
      name: 'John',
      surname: 'Doe',
      username: 'johndoe',
      lastMessageSide: 1,
      lastMessage: 'Hello!',
      lastMessageDate: new Date(),
      unreadMessageCount: 0,
    },
  ];

  const mockMessages: ChatMessageDto[] = [
    {
      message: 'Hello!',
      messageDate: new Date(),
      isRead: true,
      readDate: new Date(),
      side: ChatMessageSide.Sender,
    },
    {
      message: 'Hi there!',
      messageDate: new Date(),
      isRead: true,
      readDate: new Date(),
      side: ChatMessageSide.Receiver,
    },
  ];

  const mockUserMessages = new Map<string, ChatMessageDto[]>();
  mockUserMessages.set('user-1', mockMessages);

  it('should render chat component', () => {
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
      />
    );
    const chat = screen.getByTestId('chat');
    expect(chat).toBeInTheDocument();
  });

  it('should show empty state when no contact selected', () => {
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
      />
    );
    expect(screen.getByText('Select a contact to start chatting')).toBeInTheDocument();
  });

  it('should show conversation when contact is selected', () => {
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
        selectedContact={mockContacts[0]}
      />
    );
    expect(screen.getByTestId('chat-messages')).toBeInTheDocument();
    expect(screen.getByTestId('chat-input')).toBeInTheDocument();
  });

  it('should display messages for selected contact', () => {
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
        selectedContact={mockContacts[0]}
      />
    );
    expect(screen.getByText('Hello!')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  it('should show contact name in header', () => {
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
        selectedContact={mockContacts[0]}
      />
    );
    // Name appears in both contacts list and header, so use getAllByText
    const nameElements = screen.getAllByText('John Doe');
    expect(nameElements.length).toBeGreaterThanOrEqual(2); // In contacts and header
  });

  it('should call onSelectContact when contact is clicked', () => {
    const handleSelect = vi.fn();
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
        onSelectContact={handleSelect}
      />
    );
    fireEvent.click(screen.getByTestId('chat-contact-user-1'));
    expect(handleSelect).toHaveBeenCalledWith(mockContacts[0]);
  });

  it('should call onSendMessage when message is sent', () => {
    const handleSend = vi.fn();
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
        selectedContact={mockContacts[0]}
        onSendMessage={handleSend}
      />
    );

    const input = screen.getByTestId('chat-input');
    const sendButton = screen.getByTestId('chat-send-button');

    fireEvent.change(input, { target: { value: 'New message' } });
    fireEvent.click(sendButton);

    expect(handleSend).toHaveBeenCalledWith('user-1', 'New message');
  });

  it('should send message on Enter key when sendOnEnter is true', () => {
    const handleSend = vi.fn();
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
        selectedContact={mockContacts[0]}
        onSendMessage={handleSend}
        sendOnEnter={true}
      />
    );

    const input = screen.getByTestId('chat-input');
    fireEvent.change(input, { target: { value: 'Enter message' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: false });

    expect(handleSend).toHaveBeenCalledWith('user-1', 'Enter message');
  });

  it('should not send message on Shift+Enter', () => {
    const handleSend = vi.fn();
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
        selectedContact={mockContacts[0]}
        onSendMessage={handleSend}
        sendOnEnter={true}
      />
    );

    const input = screen.getByTestId('chat-input');
    fireEvent.change(input, { target: { value: 'Multiline' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });

    expect(handleSend).not.toHaveBeenCalled();
  });

  it('should disable send button when message is empty', () => {
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
        selectedContact={mockContacts[0]}
      />
    );

    const sendButton = screen.getByTestId('chat-send-button');
    expect(sendButton).toBeDisabled();
  });

  it('should enable send button when message has content', () => {
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
        selectedContact={mockContacts[0]}
      />
    );

    const input = screen.getByTestId('chat-input');
    const sendButton = screen.getByTestId('chat-send-button');

    fireEvent.change(input, { target: { value: 'Test' } });
    expect(sendButton).not.toBeDisabled();
  });

  it('should clear input after sending message', () => {
    const handleSend = vi.fn();
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
        selectedContact={mockContacts[0]}
        onSendMessage={handleSend}
      />
    );

    const input = screen.getByTestId('chat-input');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(screen.getByTestId('chat-send-button'));

    expect(input).toHaveValue('');
  });

  it('should show loading state for messages', () => {
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
        selectedContact={mockContacts[0]}
        messagesLoading={true}
      />
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
        className="custom-chat"
      />
    );
    const chat = screen.getByTestId('chat');
    expect(chat).toHaveClass('custom-chat');
  });

  it('should call onMarkAsRead when selecting a contact with unread messages', () => {
    const handleMarkAsRead = vi.fn();
    const contactWithUnread: ChatContactDto = {
      ...mockContacts[0],
      unreadMessageCount: 5,
    };
    render(
      <Chat
        contacts={[contactWithUnread]}
        userMessages={mockUserMessages}
        selectedContact={contactWithUnread}
        onMarkAsRead={handleMarkAsRead}
      />
    );
    expect(handleMarkAsRead).toHaveBeenCalledWith('user-1');
  });

  it('should not call onMarkAsRead when contact has 0 unread messages', () => {
    const handleMarkAsRead = vi.fn();
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
        selectedContact={mockContacts[0]}
        onMarkAsRead={handleMarkAsRead}
      />
    );
    expect(handleMarkAsRead).not.toHaveBeenCalled();
  });

  it('should call onLoadMore when scrolling near the top', () => {
    const handleLoadMore = vi.fn();
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
        selectedContact={mockContacts[0]}
        onLoadMore={handleLoadMore}
        messagesLoading={false}
        allMessagesLoaded={false}
      />
    );

    const messagesDiv = screen.getByTestId('chat-messages');
    fireEvent.scroll(messagesDiv, { target: { scrollTop: 10 } });

    expect(handleLoadMore).toHaveBeenCalledWith('user-1');
  });

  it('should not call onLoadMore when allMessagesLoaded is true', () => {
    const handleLoadMore = vi.fn();
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
        selectedContact={mockContacts[0]}
        onLoadMore={handleLoadMore}
        messagesLoading={false}
        allMessagesLoaded={true}
      />
    );

    const messagesDiv = screen.getByTestId('chat-messages');
    fireEvent.scroll(messagesDiv, { target: { scrollTop: 10 } });

    expect(handleLoadMore).not.toHaveBeenCalled();
  });

  it('should not call onLoadMore when messagesLoading is true', () => {
    const handleLoadMore = vi.fn();
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
        selectedContact={mockContacts[0]}
        onLoadMore={handleLoadMore}
        messagesLoading={true}
        allMessagesLoaded={false}
      />
    );

    const messagesDiv = screen.getByTestId('chat-messages');
    fireEvent.scroll(messagesDiv, { target: { scrollTop: 10 } });

    expect(handleLoadMore).not.toHaveBeenCalled();
  });

  it('should not send empty/whitespace-only message', () => {
    const handleSend = vi.fn();
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
        selectedContact={mockContacts[0]}
        onSendMessage={handleSend}
      />
    );

    const input = screen.getByTestId('chat-input');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(screen.getByTestId('chat-send-button'));

    expect(handleSend).not.toHaveBeenCalled();
  });

  it('should not send on Enter when sendOnEnter is false', () => {
    const handleSend = vi.fn();
    render(
      <Chat
        contacts={mockContacts}
        userMessages={mockUserMessages}
        selectedContact={mockContacts[0]}
        onSendMessage={handleSend}
        sendOnEnter={false}
      />
    );

    const input = screen.getByTestId('chat-input');
    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: false });

    expect(handleSend).not.toHaveBeenCalled();
  });

  it('should show read indicator for read sent messages', () => {
    const readMessages: ChatMessageDto[] = [
      {
        message: 'Read message',
        messageDate: new Date(),
        isRead: true,
        readDate: new Date(),
        side: ChatMessageSide.Sender,
      },
    ];
    const readMap = new Map<string, ChatMessageDto[]>();
    readMap.set('user-1', readMessages);

    render(
      <Chat
        contacts={mockContacts}
        userMessages={readMap}
        selectedContact={mockContacts[0]}
      />
    );

    // The read indicator ✓✓ should be present
    expect(screen.getByText(/✓✓/)).toBeInTheDocument();
  });

  it('should not show read indicator for unread sent messages', () => {
    const unreadMessages: ChatMessageDto[] = [
      {
        message: 'Unread message',
        messageDate: new Date(),
        isRead: false,
        readDate: new Date(),
        side: ChatMessageSide.Sender,
      },
    ];
    const unreadMap = new Map<string, ChatMessageDto[]>();
    unreadMap.set('user-1', unreadMessages);

    render(
      <Chat
        contacts={mockContacts}
        userMessages={unreadMap}
        selectedContact={mockContacts[0]}
      />
    );

    expect(screen.queryByText(/✓✓/)).not.toBeInTheDocument();
  });
});
