/**
 * Chat Icon Component
 * Displays a chat icon with unread message count badge
 * Translated from @volo/abp.ng.chat.config ChatIconComponent v2.9.0
 */

import React from 'react';

export interface ChatIconProps {
  /** Number of unread messages to display */
  unreadCount?: number;
  /** Callback when the icon is clicked */
  onClick?: () => void;
  /** Optional CSS class name */
  className?: string;
  /** Size of the icon in pixels */
  size?: number;
}

/**
 * Chat Icon component
 * Displays a chat bubble icon with an optional unread count badge
 *
 * @example
 * ```tsx
 * <ChatIcon unreadCount={5} onClick={() => navigate('/chat')} />
 * ```
 */
export function ChatIcon({
  unreadCount = 0,
  onClick,
  className = '',
  size = 24,
}: ChatIconProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`chat-icon ${className}`}
      style={styles.button}
      data-testid="chat-icon"
      aria-label={unreadCount > 0 ? `Chat - ${unreadCount} unread messages` : 'Chat'}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={styles.icon}
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      {unreadCount > 0 && (
        <span
          className="chat-icon-badge"
          style={styles.badge}
          data-testid="chat-icon-badge"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  button: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: 'inherit',
    borderRadius: '6px',
    transition: 'background-color 0.2s',
  },
  icon: {
    display: 'block',
  },
  badge: {
    position: 'absolute',
    top: '0',
    right: '0',
    minWidth: '18px',
    height: '18px',
    padding: '0 5px',
    borderRadius: '9px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'translate(25%, -25%)',
  },
};

export default ChatIcon;
