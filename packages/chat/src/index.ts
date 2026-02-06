/**
 * @abpjs/chat
 * ABP Framework Chat module for React
 * Translated from @volo/abp.ng.chat and @volo/abp.ng.chat.config v2.9.0
 *
 * Features in v2.9.0:
 * - Real-time messaging via SignalR
 * - Contact management with search
 * - Conversation history with pagination
 * - Unread message tracking
 * - Message read receipts
 *
 * Components:
 * - Chat: Main chat interface with contacts and conversation view
 * - ChatContacts: Contacts list with search and filtering
 * - ChatIcon: Chat icon with unread badge
 * - ConversationAvatar: User avatar with initials
 *
 * Services:
 * - ContactService: REST API for contacts
 * - ConversationService: REST API for conversations
 * - ChatConfigService: SignalR connection management
 *
 * Hooks:
 * - useChat: Complete chat state management hook
 */

// Enums
export * from './enums';

// Models
export * from './models';

// Services
export * from './services';

// Constants
export * from './constants';

// Hooks
export * from './hooks';

// Components
export * from './components';
