/**
 * @abpjs/chat
 * ABP Framework Chat module for React
 * Translated from @volo/abp.ng.chat and @volo/abp.ng.chat.config v3.2.0
 *
 * Changes in v3.2.0:
 * - Version bump only (dependency updates to @abp/ng.theme.shared ~3.2.0)
 * - No public API changes
 *
 * Changes in v3.1.0:
 * - Internal Angular refactoring (subscription management in ChatIconComponent)
 * - Added isChatEnabled and signalRUrl getters to ChatConfigService (internal)
 * - Added NavItemsService injection to ChatConfigService for chat toggle (internal)
 * - Added Store injection to ChatComponent (internal Angular state management)
 * - No public API changes - React implementation unchanged
 *
 * Features:
 * - Real-time messaging via SignalR
 * - Contact management with search
 * - Conversation history with pagination
 * - Unread message tracking
 * - Message read receipts
 * - Config subpackage with policy names, route providers, nav item providers
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
 *
 * Config (v3.0.0):
 * - eChatPolicyNames: Policy names for permission checking
 * - eChatRouteNames: Route names for navigation (moved from enums)
 * - CHAT_ROUTE_PROVIDERS: Route configuration providers
 * - CHAT_NAV_ITEM_PROVIDERS: Nav item configuration providers
 */

// Config subpackage (v3.0.0)
export * from './config';

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
