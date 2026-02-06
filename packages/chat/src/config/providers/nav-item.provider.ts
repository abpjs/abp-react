/**
 * Chat Nav Item Provider
 * Provides navigation item configuration for the Chat module.
 * @since 3.0.0
 */

import { getNavItemsService, type NavItemsService, type NavItem } from '@abpjs/theme-shared';
import { eChatPolicyNames } from '../enums/policy-names';
import { ChatIcon } from '../../components/ChatIcon';

/**
 * Chat nav item configuration metadata.
 * This is the configuration used to create the nav item.
 */
export interface ChatNavItemConfig {
  id: string;
  requiredPolicy: string;
  component: string;
  order: number;
}

/**
 * Default chat nav item configuration metadata.
 * Contains the metadata for the ChatIcon nav item.
 */
export const CHAT_NAV_ITEM_CONFIG: ChatNavItemConfig = {
  id: 'Chat.ChatIconComponent',
  requiredPolicy: eChatPolicyNames.Messaging,
  component: 'ChatIconComponent',
  order: 99.99,
};

/**
 * Creates the NavItem for the Chat module.
 * @returns NavItem configuration for ChatIcon
 */
function createChatNavItem(): NavItem {
  return {
    id: CHAT_NAV_ITEM_CONFIG.id,
    requiredPolicy: CHAT_NAV_ITEM_CONFIG.requiredPolicy,
    component: ChatIcon,
    order: CHAT_NAV_ITEM_CONFIG.order,
  };
}

/**
 * Configures chat nav items using the provided NavItemsService.
 * @param navItems - The NavItemsService instance to configure nav items with
 * @returns A function that adds chat nav items when called
 */
export function configureNavItems(navItems: NavItemsService): () => void {
  return () => {
    navItems.addItems([createChatNavItem()]);
  };
}

/**
 * Initializes chat nav items using the global NavItemsService.
 * Convenience function that uses the global NavItemsService singleton.
 * @returns A function that adds chat nav items when called
 */
export function initializeChatNavItems(): () => void {
  const navItems = getNavItemsService();
  return configureNavItems(navItems);
}

/**
 * Chat nav item providers object.
 * Can be used for DI-style configuration.
 */
export const CHAT_NAV_ITEM_PROVIDERS = {
  configureNavItems,
};
