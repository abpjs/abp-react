/**
 * Chat Route Provider
 * Provides route configuration for the Chat module.
 * @since 3.0.0
 */

import { getRoutesService, type RoutesService, eLayoutType } from '@abpjs/core';
import { eChatRouteNames } from '../enums/route-names';
import { eChatPolicyNames } from '../enums/policy-names';

/**
 * Configures chat routes using the provided RoutesService.
 * @param routes - The RoutesService instance to configure routes with
 * @returns A function that adds chat routes when called
 */
export function configureRoutes(routes: RoutesService): () => void {
  return () => {
    routes.add([
      {
        path: '/chat',
        name: eChatRouteNames.Chat,
        requiredPolicy: eChatPolicyNames.Messaging,
        layout: eLayoutType.application,
        iconClass: 'fas fa-envelope',
        invisible: true,
      },
    ]);
  };
}

/**
 * Initializes chat routes using the global RoutesService.
 * Convenience function that uses the global RoutesService singleton.
 * @returns A function that adds chat routes when called
 */
export function initializeChatRoutes(): () => void {
  const routes = getRoutesService();
  return configureRoutes(routes);
}

/**
 * Chat route providers object.
 * Can be used for DI-style configuration.
 */
export const CHAT_ROUTE_PROVIDERS = {
  configureRoutes,
};
