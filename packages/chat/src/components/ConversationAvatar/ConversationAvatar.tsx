/**
 * Conversation Avatar Component
 * Displays a user avatar with initials and colored background
 * Translated from @volo/abp.ng.chat ConversationAvatarComponent v2.9.0
 */

import React from 'react';
import type { ChatContactDto } from '../../models/chat-contact-dto';

export interface ConversationAvatarProps {
  /** The contact to display avatar for */
  contact: ChatContactDto;
  /** Whether to display a smaller version */
  small?: boolean;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Generate a deterministic color based on user ID
 */
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate pastel-like colors
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 45%)`;
}

/**
 * Get contrast text color (white or black) based on background
 */
function getContrastColor(_hslColor: string): string {
  // For simplicity, use white for all as the colors are darker
  // Note: _hslColor parameter kept for potential future implementation
  void _hslColor;
  return '#ffffff';
}

/**
 * Get avatar initials from contact
 */
function getAvatarText(contact: ChatContactDto): string {
  if (contact.name && contact.surname) {
    return `${contact.name.charAt(0)}${contact.surname.charAt(0)}`.toUpperCase();
  }
  if (contact.name) {
    return contact.name.charAt(0).toUpperCase();
  }
  if (contact.username) {
    return contact.username.charAt(0).toUpperCase();
  }
  return '?';
}

/**
 * Conversation Avatar component
 * Displays a circular avatar with user initials
 *
 * @example
 * ```tsx
 * <ConversationAvatar contact={selectedContact} />
 * <ConversationAvatar contact={contact} small />
 * ```
 */
export function ConversationAvatar({
  contact,
  small = false,
  className = '',
}: ConversationAvatarProps): React.ReactElement {
  const avatarText = getAvatarText(contact);
  const backgroundColor = stringToColor(contact.userId || contact.username);
  const color = getContrastColor(backgroundColor);

  const size = small ? 32 : 48;
  const fontSize = small ? 12 : 16;

  return (
    <div
      className={`conversation-avatar ${small ? 'conversation-avatar--small' : ''} ${className}`}
      style={{
        ...styles.avatar,
        width: size,
        height: size,
        fontSize,
        backgroundColor,
        color,
      }}
      data-testid="conversation-avatar"
      aria-label={`Avatar for ${contact.name || contact.username}`}
    >
      {avatarText}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  avatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    fontWeight: 600,
    textTransform: 'uppercase',
    flexShrink: 0,
  },
};

export default ConversationAvatar;
