/**
 * Chat Config Service
 * Service for managing SignalR connection and real-time chat messaging
 * Translated from @volo/abp.ng.chat.config ChatConfigService v2.9.0
 */
import * as signalR from '@microsoft/signalr';
import type { RestService } from '@abpjs/core';
import type { ChatMessage } from '../models/chat-message';

/**
 * Callback type for message events
 */
export type MessageCallback = (message: ChatMessage) => void;

/**
 * Service for managing real-time chat functionality via SignalR
 */
export class ChatConfigService {
  /**
   * The API name used for REST requests.
   */
  apiName = 'default';

  /**
   * Currently connected user ID
   */
  connectedUserId: string = '';

  /**
   * SignalR hub connection instance
   */
  connection: signalR.HubConnection | null = null;

  /**
   * Total count of unread messages
   */
  unreadMessagesCount: number = 0;

  private rest: RestService;
  private getAccessToken: () => string | Promise<string>;
  private messageSubscribers: Set<MessageCallback> = new Set();
  private unreadCountSubscribers: Set<(count: number) => void> = new Set();
  private isInitialized: boolean = false;

  constructor(
    rest: RestService,
    getAccessToken: () => string | Promise<string>
  ) {
    this.rest = rest;
    this.getAccessToken = getAccessToken;
  }

  /**
   * Initialize the SignalR connection
   * @param hubUrl The URL of the chat hub (e.g., '/signalr-hubs/chat')
   */
  async initSignalR(hubUrl: string): Promise<void> {
    if (this.isInitialized && this.connection) {
      return;
    }

    const tokenFactory = async () => {
      const token = await this.getAccessToken();
      return token;
    };

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: tokenFactory,
      })
      .withAutomaticReconnect()
      .build();

    // Set up message handler
    this.connection.on('ReceiveChatMessage', (message: ChatMessage) => {
      this.handleMessage(message);
    });

    try {
      await this.connection.start();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to start SignalR connection:', error);
      throw error;
    }
  }

  /**
   * Stop the SignalR connection
   */
  async stopSignalR(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch (error) {
        console.error('Failed to stop SignalR connection:', error);
      }
      this.connection = null;
      this.isInitialized = false;
    }
  }

  /**
   * Get the current connection state
   */
  getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state ?? null;
  }

  /**
   * Handle incoming chat message
   */
  private handleMessage(message: ChatMessage): void {
    // Notify all subscribers
    this.messageSubscribers.forEach((callback) => {
      try {
        callback(message);
      } catch (error) {
        console.error('Error in message subscriber callback:', error);
      }
    });
  }

  /**
   * Subscribe to incoming chat messages
   * @param callback Function to call when a message is received
   * @returns Unsubscribe function
   */
  onMessage(callback: MessageCallback): () => void {
    this.messageSubscribers.add(callback);
    return () => {
      this.messageSubscribers.delete(callback);
    };
  }

  /**
   * Subscribe to unread message count changes
   * @param callback Function to call when count changes
   * @returns Unsubscribe function
   */
  onUnreadCountChange(callback: (count: number) => void): () => void {
    this.unreadCountSubscribers.add(callback);
    return () => {
      this.unreadCountSubscribers.delete(callback);
    };
  }

  /**
   * Set the total unread message count by fetching from API
   */
  async setTotalUnreadMessageCount(): Promise<void> {
    try {
      const response = await this.rest.request<null, { totalUnreadMessageCount: number }>({
        method: 'GET',
        url: '/api/chat/contact/total-unread-message-count',
      });
      this.unreadMessagesCount = response.totalUnreadMessageCount;
      this.notifyUnreadCountChange();
    } catch (error) {
      console.error('Failed to get total unread message count:', error);
    }
  }

  /**
   * Update the unread message count
   * @param count New count value
   */
  updateUnreadCount(count: number): void {
    this.unreadMessagesCount = count;
    this.notifyUnreadCountChange();
  }

  /**
   * Increment the unread message count
   * @param amount Amount to increment by (default: 1)
   */
  incrementUnreadCount(amount: number = 1): void {
    this.unreadMessagesCount += amount;
    this.notifyUnreadCountChange();
  }

  /**
   * Decrement the unread message count
   * @param amount Amount to decrement by (default: 1)
   */
  decrementUnreadCount(amount: number = 1): void {
    this.unreadMessagesCount = Math.max(0, this.unreadMessagesCount - amount);
    this.notifyUnreadCountChange();
  }

  private notifyUnreadCountChange(): void {
    this.unreadCountSubscribers.forEach((callback) => {
      try {
        callback(this.unreadMessagesCount);
      } catch (error) {
        console.error('Error in unread count subscriber callback:', error);
      }
    });
  }

  /**
   * Check if the connection is currently active
   */
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

// Singleton instance
let _chatConfigInstance: ChatConfigService | null = null;

/**
 * Get or create the ChatConfigService singleton
 * @param rest RestService instance (required on first call)
 * @param getAccessToken Function to get access token (required on first call)
 */
export function getChatConfigService(
  rest?: RestService,
  getAccessToken?: () => string | Promise<string>
): ChatConfigService {
  if (!_chatConfigInstance) {
    if (!rest || !getAccessToken) {
      throw new Error(
        'ChatConfigService requires RestService and getAccessToken on first initialization'
      );
    }
    _chatConfigInstance = new ChatConfigService(rest, getAccessToken);
  }
  return _chatConfigInstance;
}

/**
 * Reset the ChatConfigService singleton (useful for testing)
 */
export function resetChatConfigService(): void {
  if (_chatConfigInstance) {
    _chatConfigInstance.stopSignalR();
    _chatConfigInstance = null;
  }
}
