/**
 * Tests for ConversationAvatar component
 * @abpjs/chat v2.9.0
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConversationAvatar } from '../../components/ConversationAvatar';
import type { ChatContactDto } from '../../models/chat-contact-dto';

describe('ConversationAvatar', () => {
  const mockContact: ChatContactDto = {
    userId: 'user-123',
    name: 'John',
    surname: 'Doe',
    username: 'johndoe',
    lastMessageSide: 1,
    lastMessage: 'Hello',
    lastMessageDate: new Date(),
    unreadMessageCount: 0,
  };

  it('should render avatar with initials', () => {
    render(<ConversationAvatar contact={mockContact} />);
    const avatar = screen.getByTestId('conversation-avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveTextContent('JD');
  });

  it('should render with first name initial only when no surname', () => {
    const contact = { ...mockContact, surname: '' };
    render(<ConversationAvatar contact={contact} />);
    const avatar = screen.getByTestId('conversation-avatar');
    expect(avatar).toHaveTextContent('J');
  });

  it('should render with username initial when no name', () => {
    const contact = { ...mockContact, name: '', surname: '' };
    render(<ConversationAvatar contact={contact} />);
    const avatar = screen.getByTestId('conversation-avatar');
    expect(avatar).toHaveTextContent('J');
  });

  it('should render question mark when no name or username', () => {
    const contact = { ...mockContact, name: '', surname: '', username: '' };
    render(<ConversationAvatar contact={contact} />);
    const avatar = screen.getByTestId('conversation-avatar');
    expect(avatar).toHaveTextContent('?');
  });

  it('should render smaller avatar when small prop is true', () => {
    render(<ConversationAvatar contact={mockContact} small />);
    const avatar = screen.getByTestId('conversation-avatar');
    expect(avatar).toHaveStyle({ width: '32px', height: '32px' });
  });

  it('should render larger avatar when small prop is false', () => {
    render(<ConversationAvatar contact={mockContact} small={false} />);
    const avatar = screen.getByTestId('conversation-avatar');
    expect(avatar).toHaveStyle({ width: '48px', height: '48px' });
  });

  it('should apply custom className', () => {
    render(<ConversationAvatar contact={mockContact} className="custom-class" />);
    const avatar = screen.getByTestId('conversation-avatar');
    expect(avatar).toHaveClass('custom-class');
  });

  it('should have aria-label for accessibility', () => {
    render(<ConversationAvatar contact={mockContact} />);
    const avatar = screen.getByTestId('conversation-avatar');
    expect(avatar).toHaveAttribute('aria-label', 'Avatar for John');
  });
});
