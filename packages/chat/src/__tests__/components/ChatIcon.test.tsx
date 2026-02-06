/**
 * Tests for ChatIcon component
 * @abpjs/chat v2.9.0
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatIcon } from '../../components/ChatIcon';

describe('ChatIcon', () => {
  it('should render chat icon', () => {
    render(<ChatIcon />);
    const icon = screen.getByTestId('chat-icon');
    expect(icon).toBeInTheDocument();
  });

  it('should render without badge when unreadCount is 0', () => {
    render(<ChatIcon unreadCount={0} />);
    const badge = screen.queryByTestId('chat-icon-badge');
    expect(badge).not.toBeInTheDocument();
  });

  it('should render badge with unread count', () => {
    render(<ChatIcon unreadCount={5} />);
    const badge = screen.getByTestId('chat-icon-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('5');
  });

  it('should display 99+ when unread count exceeds 99', () => {
    render(<ChatIcon unreadCount={150} />);
    const badge = screen.getByTestId('chat-icon-badge');
    expect(badge).toHaveTextContent('99+');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<ChatIcon onClick={handleClick} />);
    const icon = screen.getByTestId('chat-icon');
    fireEvent.click(icon);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply custom className', () => {
    render(<ChatIcon className="custom-class" />);
    const icon = screen.getByTestId('chat-icon');
    expect(icon).toHaveClass('custom-class');
  });

  it('should have aria-label without unread messages', () => {
    render(<ChatIcon unreadCount={0} />);
    const icon = screen.getByTestId('chat-icon');
    expect(icon).toHaveAttribute('aria-label', 'Chat');
  });

  it('should have aria-label with unread messages', () => {
    render(<ChatIcon unreadCount={3} />);
    const icon = screen.getByTestId('chat-icon');
    expect(icon).toHaveAttribute('aria-label', 'Chat - 3 unread messages');
  });

  it('should render SVG icon', () => {
    render(<ChatIcon />);
    const icon = screen.getByTestId('chat-icon');
    const svg = icon.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
