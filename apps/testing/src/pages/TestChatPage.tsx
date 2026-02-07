/**
 * Test page for @abpjs/chat package
 * Tests: Chat components, hooks, services, constants, enums
 * @since 2.9.0 - New package
 * @updated 3.0.0 - Added config subpackage with policy names, route providers, nav item providers
 * @updated 3.1.0 - Internal Angular refactoring (subscription management, getters), no public API changes
 * @updated 3.2.0 - Version bump only (dependency updates to @abp/ng.theme.shared ~3.2.0)
 */
import { useState } from 'react'
import {
  // Components
  Chat,
  ChatContacts,
  ChatIcon,
  ConversationAvatar,
  getContactName,
  // Enums
  ChatMessageSide,
  eChatComponents,
  eChatRouteNames,
  // Constants
  CHAT_ROUTE_PATH,
  CHAT_API_BASE,
  CHAT_HUB_PATH,
  // Models
  createChatContactDto,
  createChatMessageDto,
  // v3.0.0 Config imports
  eChatPolicyNames,
  CHAT_ROUTE_PROVIDERS,
  configureRoutes,
  initializeChatRoutes,
  CHAT_NAV_ITEM_PROVIDERS,
  configureNavItems,
  initializeChatNavItems,
  CHAT_NAV_ITEM_CONFIG,
} from '@abpjs/chat'
import type {
  ChatContactDto,
  ChatMessageDto,
} from '@abpjs/chat'

// Mock contacts for demo
const mockContacts: ChatContactDto[] = [
  createChatContactDto({
    userId: 'user-1',
    name: 'John',
    surname: 'Doe',
    username: 'johndoe',
    lastMessageSide: ChatMessageSide.Sender,
    lastMessage: 'Hey, how are you?',
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    unreadMessageCount: 0,
  }),
  createChatContactDto({
    userId: 'user-2',
    name: 'Jane',
    surname: 'Smith',
    username: 'janesmith',
    lastMessageSide: ChatMessageSide.Receiver,
    lastMessage: 'Thanks for the update!',
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    unreadMessageCount: 3,
  }),
  createChatContactDto({
    userId: 'user-3',
    name: 'Bob',
    surname: 'Wilson',
    username: 'bobwilson',
    lastMessageSide: ChatMessageSide.Receiver,
    lastMessage: 'See you tomorrow',
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadMessageCount: 1,
  }),
  createChatContactDto({
    userId: 'user-4',
    name: 'Alice',
    surname: 'Brown',
    username: 'alicebrown',
    lastMessage: '',
    lastMessageDate: new Date(),
    unreadMessageCount: 0,
  }),
]

// Mock messages for demo
const mockMessages: ChatMessageDto[] = [
  createChatMessageDto({
    message: 'Hello! How are you doing?',
    messageDate: new Date(Date.now() - 1000 * 60 * 10),
    isRead: true,
    side: ChatMessageSide.Receiver,
  }),
  createChatMessageDto({
    message: 'I\'m doing great, thanks for asking! Working on a new project.',
    messageDate: new Date(Date.now() - 1000 * 60 * 8),
    isRead: true,
    side: ChatMessageSide.Sender,
  }),
  createChatMessageDto({
    message: 'That sounds exciting! What\'s it about?',
    messageDate: new Date(Date.now() - 1000 * 60 * 6),
    isRead: true,
    side: ChatMessageSide.Receiver,
  }),
  createChatMessageDto({
    message: 'Hey, how are you?',
    messageDate: new Date(Date.now() - 1000 * 60 * 5),
    isRead: true,
    side: ChatMessageSide.Sender,
  }),
]

function TestChatComponent() {
  const [selectedContact, setSelectedContact] = useState<ChatContactDto | null>(null)
  const [messages, setMessages] = useState<Map<string, ChatMessageDto[]>>(() => {
    const map = new Map<string, ChatMessageDto[]>()
    map.set('user-1', mockMessages)
    map.set('user-2', [
      createChatMessageDto({
        message: 'I sent you the report.',
        messageDate: new Date(Date.now() - 1000 * 60 * 35),
        isRead: true,
        side: ChatMessageSide.Sender,
      }),
      createChatMessageDto({
        message: 'Thanks for the update!',
        messageDate: new Date(Date.now() - 1000 * 60 * 30),
        isRead: false,
        side: ChatMessageSide.Receiver,
      }),
    ])
    return map
  })
  const [showChat, setShowChat] = useState(false)

  const handleSendMessage = (targetUserId: string, message: string) => {
    console.log('Sending message to', targetUserId, ':', message)
    setMessages(prev => {
      const updated = new Map(prev)
      const existing = updated.get(targetUserId) || []
      updated.set(targetUserId, [
        ...existing,
        createChatMessageDto({
          message,
          messageDate: new Date(),
          isRead: false,
          side: ChatMessageSide.Sender,
        }),
      ])
      return updated
    })
  }

  const totalUnread = mockContacts.reduce((sum, c) => sum + c.unreadMessageCount, 0)

  return (
    <div className="test-section">
      <h2>Chat Component</h2>

      <div className="test-card">
        <h3>Toggle Chat Interface</h3>
        <p>Show/hide the full Chat component with contacts and conversation:</p>
        <button onClick={() => setShowChat(!showChat)}>
          {showChat ? 'Hide Chat' : 'Show Chat'}
        </button>
      </div>

      {showChat && (
        <div className="test-card">
          <h3>Chat Interface Preview</h3>
          <div style={{ height: '600px', border: '1px solid #333', borderRadius: '8px' }}>
            <Chat
              contacts={mockContacts}
              userMessages={messages}
              selectedContact={selectedContact}
              onSelectContact={setSelectedContact}
              onSendMessage={handleSendMessage}
              onMarkAsRead={(userId) => console.log('Mark as read:', userId)}
              onLoadMore={(userId) => console.log('Load more for:', userId)}
              unreadMessageCount={totalUnread}
              sendOnEnter={true}
            />
          </div>
        </div>
      )}

      <div className="test-card">
        <h3>Component Props</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Prop</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>contacts</td><td>ChatContactDto[]</td><td>List of contacts to display</td></tr>
            <tr><td style={{ padding: '8px' }}>userMessages</td><td>Map&lt;string, ChatMessageDto[]&gt;</td><td>Messages keyed by user ID</td></tr>
            <tr><td style={{ padding: '8px' }}>selectedContact</td><td>ChatContactDto | null</td><td>Currently selected contact</td></tr>
            <tr><td style={{ padding: '8px' }}>onSelectContact</td><td>(contact) =&gt; void</td><td>Callback when contact is selected</td></tr>
            <tr><td style={{ padding: '8px' }}>onSendMessage</td><td>(userId, msg) =&gt; void</td><td>Callback when message is sent</td></tr>
            <tr><td style={{ padding: '8px' }}>onLoadMore</td><td>(userId) =&gt; void</td><td>Callback for pagination</td></tr>
            <tr><td style={{ padding: '8px' }}>onMarkAsRead</td><td>(userId) =&gt; void</td><td>Callback to mark as read</td></tr>
            <tr><td style={{ padding: '8px' }}>sendOnEnter</td><td>boolean</td><td>Send on Enter key (default: true)</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestChatContactsComponent() {
  const [selectedContact, setSelectedContact] = useState<ChatContactDto | null>(null)

  return (
    <div className="test-section">
      <h2>ChatContacts Component</h2>

      <div className="test-card">
        <h3>Contacts List Preview</h3>
        <div style={{ width: '320px', height: '400px', border: '1px solid #333', borderRadius: '8px' }}>
          <ChatContacts
            contacts={mockContacts}
            selectedContact={selectedContact}
            onSelect={setSelectedContact}
          />
        </div>
        {selectedContact && (
          <p style={{ marginTop: '1rem' }}>
            Selected: <strong>{getContactName(selectedContact)}</strong>
          </p>
        )}
      </div>

      <div className="test-card">
        <h3>getContactName Helper</h3>
        <p>Utility function to format contact display name:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
{`import { getContactName } from '@abpjs/chat';

// Full name when both name and surname exist
getContactName({ name: 'John', surname: 'Doe', username: 'johndoe' })
// => "John Doe"

// Name only when no surname
getContactName({ name: 'John', surname: '', username: 'johndoe' })
// => "John"

// Username as fallback
getContactName({ name: '', surname: '', username: 'johndoe' })
// => "johndoe"

// "Unknown" as final fallback
getContactName({ name: '', surname: '', username: '' })
// => "Unknown"`}
        </pre>
      </div>
    </div>
  )
}

function TestConversationAvatarComponent() {
  return (
    <div className="test-section">
      <h2>ConversationAvatar Component</h2>

      <div className="test-card">
        <h3>Avatar Sizes</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <ConversationAvatar contact={mockContacts[0]} />
            <p style={{ fontSize: '12px', marginTop: '4px' }}>Normal (48px)</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <ConversationAvatar contact={mockContacts[0]} small />
            <p style={{ fontSize: '12px', marginTop: '4px' }}>Small (32px)</p>
          </div>
        </div>
      </div>

      <div className="test-card">
        <h3>Avatar Colors</h3>
        <p style={{ marginBottom: '1rem' }}>Colors are deterministically generated from user ID:</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {mockContacts.map((contact) => (
            <div key={contact.userId} style={{ textAlign: 'center' }}>
              <ConversationAvatar contact={contact} />
              <p style={{ fontSize: '12px', marginTop: '4px' }}>{contact.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="test-card">
        <h3>Initials Logic</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Contact</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Initials</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>John Doe</td><td>JD</td></tr>
            <tr><td style={{ padding: '8px' }}>John (no surname)</td><td>J</td></tr>
            <tr><td style={{ padding: '8px' }}>username only</td><td>First letter of username</td></tr>
            <tr><td style={{ padding: '8px' }}>No info</td><td>?</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestChatIconComponent() {
  const [unreadCount, setUnreadCount] = useState(5)

  return (
    <div className="test-section">
      <h2>ChatIcon Component</h2>

      <div className="test-card">
        <h3>Icon Preview</h3>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <ChatIcon unreadCount={0} onClick={() => console.log('Chat clicked!')} />
            <p style={{ fontSize: '12px', marginTop: '4px' }}>No unread</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <ChatIcon unreadCount={5} onClick={() => console.log('Chat clicked!')} />
            <p style={{ fontSize: '12px', marginTop: '4px' }}>5 unread</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <ChatIcon unreadCount={99} onClick={() => console.log('Chat clicked!')} />
            <p style={{ fontSize: '12px', marginTop: '4px' }}>99 unread</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <ChatIcon unreadCount={150} onClick={() => console.log('Chat clicked!')} />
            <p style={{ fontSize: '12px', marginTop: '4px' }}>150+ (shows 99+)</p>
          </div>
        </div>
      </div>

      <div className="test-card">
        <h3>Interactive Demo</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <ChatIcon
            unreadCount={unreadCount}
            onClick={() => alert(`You have ${unreadCount} unread messages!`)}
            size={32}
          />
          <button onClick={() => setUnreadCount(c => c + 1)}>Add Unread</button>
          <button onClick={() => setUnreadCount(0)}>Clear All</button>
        </div>
      </div>
    </div>
  )
}

function TestEnums() {
  return (
    <div className="test-section">
      <h2>Enums</h2>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>ChatMessageSide Enum <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.9.0)</span></h3>
        <p>Indicates whether a message was sent or received:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>Sender</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>{ChatMessageSide.Sender}</td>
              <td>Message sent by current user</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>Receiver</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>{ChatMessageSide.Receiver}</td>
              <td>Message received from other user</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>eChatComponents Enum <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.9.0)</span></h3>
        <p>Component keys for replacement/customization:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(eChatComponents).map(([key, value]) => (
              <tr key={key}>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{key}</td>
                <td style={{ padding: '8px', fontFamily: 'monospace', color: '#888' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>eChatRouteNames Enum <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.9.0)</span></h3>
        <p>Route name keys for localization:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(eChatRouteNames).map(([key, value]) => (
              <tr key={key}>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{key}</td>
                <td style={{ padding: '8px', fontFamily: 'monospace', color: '#888' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestConstants() {
  return (
    <div className="test-section">
      <h2>Constants</h2>

      <div className="test-card">
        <h3>Route Constants</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Constant</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>CHAT_ROUTE_PATH</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>{CHAT_ROUTE_PATH}</td>
              <td>Default route path for chat page</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>CHAT_API_BASE</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>{CHAT_API_BASE}</td>
              <td>Base API path for chat endpoints</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>CHAT_HUB_PATH</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>{CHAT_HUB_PATH}</td>
              <td>SignalR hub path for real-time messaging</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestServices() {
  const [serviceInfo, setServiceInfo] = useState<string>('')

  const showContactService = () => {
    setServiceInfo(`ContactService (v2.9.0)

Properties:
- apiName: string (default: 'default')

Methods:
- getContactsByInput(params?: GetContactsInput): Promise<ChatContactDto[]>

Usage:
const service = new ContactService(restService);
const contacts = await service.getContactsByInput({
  filter: 'john',
  includeOtherContacts: true
});`)
  }

  const showConversationService = () => {
    setServiceInfo(`ConversationService (v2.9.0)

Properties:
- apiName: string (default: 'default')

Methods:
- sendMessageByInput(body: SendMessageInput): Promise<void>
- getConversationByInput(params?: GetConversationInput): Promise<ChatConversationDto>
- markConversationAsReadByInput(body: MarkConversationAsReadInput): Promise<void>

Usage:
const service = new ConversationService(restService);

// Send message
await service.sendMessageByInput({
  targetUserId: 'user-123',
  message: 'Hello!'
});

// Get conversation
const conversation = await service.getConversationByInput({
  targetUserId: 'user-123',
  skipCount: 0,
  maxResultCount: 20
});

// Mark as read
await service.markConversationAsReadByInput({
  targetUserId: 'user-123'
});`)
  }

  const showChatConfigService = () => {
    setServiceInfo(`ChatConfigService (v2.9.0)

Properties:
- apiName: string (default: 'default')
- connectedUserId: string
- connection: HubConnection | null
- unreadMessagesCount: number

Methods:
- initSignalR(hubUrl: string): Promise<void>
- stopSignalR(): Promise<void>
- getConnectionState(): HubConnectionState | null
- isConnected(): boolean
- onMessage(callback: (msg: ChatMessage) => void): () => void
- onUnreadCountChange(callback: (count: number) => void): () => void
- setTotalUnreadMessageCount(): Promise<void>
- updateUnreadCount(count: number): void
- incrementUnreadCount(amount?: number): void
- decrementUnreadCount(amount?: number): void

Singleton Functions:
- getChatConfigService(rest?, getAccessToken?): ChatConfigService
- resetChatConfigService(): void

Usage:
// Initialize
const chatConfig = getChatConfigService(restService, getAccessToken);
await chatConfig.initSignalR('/signalr-hubs/chat');

// Listen for messages
const unsubscribe = chatConfig.onMessage((message) => {
  console.log('New message from:', message.senderUsername);
  console.log('Text:', message.text);
});

// Cleanup
unsubscribe();
await chatConfig.stopSignalR();`)
  }

  return (
    <div className="test-section">
      <h2>Services</h2>

      <div className="test-card">
        <h3>Service Overview</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={showContactService}>ContactService</button>
          <button onClick={showConversationService}>ConversationService</button>
          <button onClick={showChatConfigService}>ChatConfigService</button>
        </div>
        {serviceInfo && (
          <pre style={{ marginTop: '1rem', padding: '1rem', borderRadius: '4px', overflow: 'auto', whiteSpace: 'pre-wrap', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
            {serviceInfo}
          </pre>
        )}
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>SignalR Integration <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.9.0)</span></h3>
        <p>Real-time messaging via SignalR with automatic reconnection:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
{`import { getChatConfigService } from '@abpjs/chat';
import { useAuth, useRest } from '@abpjs/core';

function ChatPage() {
  const { rest } = useRest();
  const { getAccessToken } = useAuth();

  useEffect(() => {
    const chatConfig = getChatConfigService(rest, getAccessToken);

    // Initialize SignalR connection
    chatConfig.initSignalR('/signalr-hubs/chat')
      .then(() => console.log('Connected!'))
      .catch(err => console.error('Failed to connect:', err));

    // Subscribe to incoming messages
    const unsubscribe = chatConfig.onMessage((message) => {
      console.log('New message:', message);
      // Handle new message (update UI, show notification, etc.)
    });

    // Cleanup
    return () => {
      unsubscribe();
      chatConfig.stopSignalR();
    };
  }, []);
}`}
        </pre>
      </div>
    </div>
  )
}

function TestModels() {
  return (
    <div className="test-section">
      <h2>Models</h2>

      <div className="test-card">
        <h3>ChatContactDto</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
{`interface ChatContactDto {
  userId: string;
  name: string;
  surname: string;
  username: string;
  lastMessageSide: number;
  lastMessage: string;
  lastMessageDate: Date | string;
  unreadMessageCount: number;
}

// Factory function
const contact = createChatContactDto({
  userId: 'user-123',
  name: 'John',
  surname: 'Doe',
  unreadMessageCount: 5
});`}
        </pre>
      </div>

      <div className="test-card">
        <h3>ChatMessageDto</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
{`interface ChatMessageDto {
  message: string;
  messageDate: Date | string;
  isRead: boolean;
  readDate: Date | string;
  side: ChatMessageSide;
}

// Factory function
const message = createChatMessageDto({
  message: 'Hello!',
  side: ChatMessageSide.Sender
});`}
        </pre>
      </div>

      <div className="test-card">
        <h3>ChatMessage (SignalR)</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
{`// Real-time message received via SignalR
interface ChatMessage {
  senderUserId: string;
  senderUsername: string;
  senderName: string;
  senderSurname: string;
  text: string;
}

// Factory function
const signalRMessage = createChatMessage({
  senderUserId: 'user-456',
  senderUsername: 'janesmith',
  senderName: 'Jane',
  senderSurname: 'Smith',
  text: 'Hello from SignalR!'
});`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Input Types</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
{`// GetContactsInput
const contactsInput = createGetContactsInput({
  filter: 'john',
  includeOtherContacts: true
});

// GetConversationInput (with pagination)
const conversationInput = createGetConversationInput({
  targetUserId: 'user-123',
  skipCount: 0,
  maxResultCount: 20
});

// SendMessageInput
const sendInput = createSendMessageInput({
  targetUserId: 'user-123',
  message: 'Hello!'
});

// MarkConversationAsReadInput
const markReadInput = createMarkConversationAsReadInput({
  targetUserId: 'user-123'
});`}
        </pre>
      </div>
    </div>
  )
}

function TestUseChatHook() {
  return (
    <div className="test-section">
      <h2>useChat Hook</h2>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Complete Chat State Management <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.9.0)</span></h3>
        <p>The <code>useChat</code> hook provides complete chat state management:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
{`import { useChat } from '@abpjs/chat';
import { useRest, useAuth } from '@abpjs/core';

function ChatPage() {
  const { rest } = useRest();
  const { getAccessToken } = useAuth();

  const {
    // State
    contacts,
    selectedContact,
    userMessages,
    unreadMessageCount,
    contactsLoading,
    messagesLoading,
    allMessagesLoaded,

    // Actions
    selectContact,
    sendMessage,
    loadMoreMessages,
    markAsRead,
    refreshContacts,

    // Service access
    chatConfigService,
  } = useChat({
    rest,
    getAccessToken,
    hubUrl: '/signalr-hubs/chat',
    includeOtherContacts: true,
    maxResultCount: 20,
  });

  return (
    <Chat
      contacts={contacts}
      userMessages={userMessages}
      selectedContact={selectedContact}
      unreadMessageCount={unreadMessageCount}
      contactsLoading={contactsLoading}
      messagesLoading={messagesLoading}
      allMessagesLoaded={allMessagesLoaded}
      onSelectContact={selectContact}
      onSendMessage={sendMessage}
      onLoadMore={loadMoreMessages}
      onMarkAsRead={markAsRead}
    />
  );
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Hook Return Values</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Return Value</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>contacts</td><td>ChatContactDto[]</td><td>List of contacts</td></tr>
            <tr><td style={{ padding: '8px' }}>selectedContact</td><td>ChatContactDto | null</td><td>Currently selected contact</td></tr>
            <tr><td style={{ padding: '8px' }}>userMessages</td><td>Map&lt;string, ChatMessageDto[]&gt;</td><td>Messages by user ID</td></tr>
            <tr><td style={{ padding: '8px' }}>unreadMessageCount</td><td>number</td><td>Total unread messages</td></tr>
            <tr><td style={{ padding: '8px' }}>contactsLoading</td><td>boolean</td><td>Contacts loading state</td></tr>
            <tr><td style={{ padding: '8px' }}>messagesLoading</td><td>boolean</td><td>Messages loading state</td></tr>
            <tr><td style={{ padding: '8px' }}>allMessagesLoaded</td><td>boolean</td><td>Pagination complete</td></tr>
            <tr><td style={{ padding: '8px' }}>selectContact</td><td>(contact) =&gt; void</td><td>Select a contact</td></tr>
            <tr><td style={{ padding: '8px' }}>sendMessage</td><td>(userId, msg) =&gt; Promise</td><td>Send a message</td></tr>
            <tr><td style={{ padding: '8px' }}>loadMoreMessages</td><td>(userId) =&gt; Promise</td><td>Load more (pagination)</td></tr>
            <tr><td style={{ padding: '8px' }}>markAsRead</td><td>(userId) =&gt; Promise</td><td>Mark conversation read</td></tr>
            <tr><td style={{ padding: '8px' }}>refreshContacts</td><td>() =&gt; Promise</td><td>Refresh contacts list</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestV300Features() {
  return (
    <div className="test-section">
      <h2>v3.0.0 Features <span style={{ color: '#4f4', fontSize: '14px' }}>(New)</span></h2>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Config Subpackage <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.0.0)</span></h3>
        <p>
          Version 3.0.0 introduces a config subpackage with enums, route providers, and nav item providers.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`// Config exports available from main package
import {
  // Config enums
  eChatPolicyNames,
  eChatRouteNames,  // Now in config, re-exported for backward compat

  // Route providers
  CHAT_ROUTE_PROVIDERS,
  configureRoutes,
  initializeChatRoutes,

  // Nav item providers
  CHAT_NAV_ITEM_PROVIDERS,
  configureNavItems,
  initializeChatNavItems,
  CHAT_NAV_ITEM_CONFIG,
} from '@abpjs/chat';`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>eChatPolicyNames Enum <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.0.0)</span></h3>
        <p>New enum for permission policy checks:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(eChatPolicyNames).map(([key, value]) => (
              <tr key={key}>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{key}</td>
                <td style={{ padding: '8px', fontFamily: 'monospace', color: '#888' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`import { eChatPolicyNames } from '@abpjs/chat';

// Check permissions
const hasChatPermission = grantedPolicies[eChatPolicyNames.Messaging];

// Use in route configuration
{
  path: '/chat',
  requiredPolicy: eChatPolicyNames.Messaging
}`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Route Providers <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.0.0)</span></h3>
        <p>New route configuration providers:</p>
        <p style={{ marginTop: '0.5rem' }}>
          <code>CHAT_ROUTE_PROVIDERS:</code>{' '}
          <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
            {typeof CHAT_ROUTE_PROVIDERS === 'object' ? 'object' : 'undefined'}
          </code>
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <code>configureRoutes:</code>{' '}
          <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
            {typeof configureRoutes}
          </code>
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <code>initializeChatRoutes:</code>{' '}
          <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
            {typeof initializeChatRoutes}
          </code>
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`import {
  configureRoutes,
  initializeChatRoutes,
  CHAT_ROUTE_PROVIDERS
} from '@abpjs/chat';
import { getRoutesService } from '@abpjs/core';

// Option 1: Use configureRoutes with RoutesService
const routes = getRoutesService();
const addRoutes = configureRoutes(routes);
addRoutes(); // Adds chat route (invisible)

// Option 2: Use convenience function
const addRoutes2 = initializeChatRoutes();
addRoutes2();

// Option 3: Use providers object
CHAT_ROUTE_PROVIDERS.configureRoutes(routes);`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Nav Item Providers <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.0.0)</span></h3>
        <p>Providers for navigation item configuration (ChatIcon in navbar):</p>
        <p style={{ marginTop: '0.5rem' }}>
          <code>CHAT_NAV_ITEM_PROVIDERS:</code>{' '}
          <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
            {typeof CHAT_NAV_ITEM_PROVIDERS === 'object' ? 'object' : 'undefined'}
          </code>
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <code>configureNavItems:</code>{' '}
          <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
            {typeof configureNavItems}
          </code>
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <code>initializeChatNavItems:</code>{' '}
          <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
            {typeof initializeChatNavItems}
          </code>
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <code>CHAT_NAV_ITEM_CONFIG:</code>
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Property</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>id</td>
              <td style={{ padding: '8px', fontFamily: 'monospace', color: '#888' }}>{CHAT_NAV_ITEM_CONFIG.id}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>requiredPolicy</td>
              <td style={{ padding: '8px', fontFamily: 'monospace', color: '#888' }}>{CHAT_NAV_ITEM_CONFIG.requiredPolicy}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>component</td>
              <td style={{ padding: '8px', fontFamily: 'monospace', color: '#888' }}>{CHAT_NAV_ITEM_CONFIG.component}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>order</td>
              <td style={{ padding: '8px', fontFamily: 'monospace', color: '#888' }}>{CHAT_NAV_ITEM_CONFIG.order}</td>
            </tr>
          </tbody>
        </table>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`import {
  configureNavItems,
  initializeChatNavItems,
  CHAT_NAV_ITEM_PROVIDERS,
  CHAT_NAV_ITEM_CONFIG
} from '@abpjs/chat';
import { getNavItemsService } from '@abpjs/theme-shared';

// Option 1: Use configureNavItems with NavItemsService
const navItems = getNavItemsService();
const addNavItems = configureNavItems(navItems);
addNavItems(); // Adds ChatIcon to navbar

// Option 2: Use convenience function
const addNavItems2 = initializeChatNavItems();
addNavItems2();

// Option 3: Use providers object
CHAT_NAV_ITEM_PROVIDERS.configureNavItems(navItems);

// Access default config
console.log(CHAT_NAV_ITEM_CONFIG.id); // 'Chat.ChatIconComponent'`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Route Names Update <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.0.0)</span></h3>
        <p>
          In v3.0.0, <code>eChatRouteNames</code> was moved to config/enums and the value changed from <code>'AbpChat::Chat'</code> to <code>'Chat'</code>.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(eChatRouteNames).map(([key, value]) => (
              <tr key={key}>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{key}</td>
                <td style={{ padding: '8px', fontFamily: 'monospace', color: '#888' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>v3.0.0 API Summary</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Export</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>eChatPolicyNames</td>
              <td>const object</td>
              <td>Permission policy names</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>CHAT_ROUTE_PROVIDERS</td>
              <td>object</td>
              <td>Route configuration providers</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>configureRoutes, initializeChatRoutes</td>
              <td>function</td>
              <td>Route initialization functions</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>CHAT_NAV_ITEM_PROVIDERS</td>
              <td>object</td>
              <td>Nav item configuration providers</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>configureNavItems, initializeChatNavItems</td>
              <td>function</td>
              <td>Nav item initialization functions</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>CHAT_NAV_ITEM_CONFIG</td>
              <td>object</td>
              <td>Default nav item configuration</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>eChatRouteNames</td>
              <td>const object</td>
              <td>Route names (value changed to 'Chat')</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestAPISummary() {
  return (
    <div className="test-section">
      <h2>Complete API Summary</h2>

      <div className="test-card">
        <h3>Complete Package Exports</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Category</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Export</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }} rowSpan={4}>Components</td>
              <td style={{ padding: '8px' }}>Chat</td>
              <td>React Component</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>ChatContacts</td>
              <td>React Component</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>ChatIcon</td>
              <td>React Component</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>ConversationAvatar</td>
              <td>React Component</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }} rowSpan={3}>Enums</td>
              <td style={{ padding: '8px' }}>ChatMessageSide</td>
              <td>enum (Sender=1, Receiver=2)</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>eChatComponents</td>
              <td>const object</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>eChatRouteNames</td>
              <td>const object</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }} rowSpan={3}>Services</td>
              <td style={{ padding: '8px' }}>ContactService</td>
              <td>class</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>ConversationService</td>
              <td>class</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>ChatConfigService</td>
              <td>class (SignalR)</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }} rowSpan={3}>Constants</td>
              <td style={{ padding: '8px' }}>CHAT_ROUTE_PATH</td>
              <td>string ("/chat")</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>CHAT_API_BASE</td>
              <td>string ("/api/chat")</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>CHAT_HUB_PATH</td>
              <td>string ("/signalr-hubs/chat")</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>Hooks</td>
              <td style={{ padding: '8px' }}>useChat</td>
              <td>React Hook</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestV320Features() {
  return (
    <div className="test-section">
      <h2>v3.2.0 Features <span style={{ color: '#4f4', fontSize: '14px' }}>(Current)</span></h2>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Version Bump <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.2.0)</span></h3>
        <p>
          Version 3.2.0 is a dependency update release with no public API changes.
          The Angular package updated its dependency on <code>@abp/ng.theme.shared</code> from <code>~3.1.0</code> to <code>~3.2.0</code>.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Package</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>v3.1.0</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>v3.2.0</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}>@abp/ng.theme.shared</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>~3.1.0</td>
              <td style={{ padding: '8px', fontFamily: 'monospace', color: '#4f4' }}>~3.2.0</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>v3.2.0 Summary</h3>
        <p style={{ color: '#888' }}>
          This release contains no code changes - only a dependency version bump.
          All APIs remain unchanged from v3.1.0. The React translation did not require any updates.
        </p>
      </div>
    </div>
  )
}

function TestV310Features() {
  return (
    <div className="test-section">
      <h2>v3.1.0 Features</h2>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Internal Angular Refactoring <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.1.0)</span></h3>
        <p>
          Version 3.1.0 includes internal Angular refactoring that does not affect the React implementation.
          No public API changes were made in this release.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Change</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Angular</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>React</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}>ChatIconComponent</td>
              <td style={{ padding: '8px' }}>Subscription management refactored (listenToMessages, listenToRouterEvents)</td>
              <td style={{ padding: '8px' }}>useEffect cleanup (unchanged)</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>ChatConfigService</td>
              <td style={{ padding: '8px' }}>Added isChatEnabled/signalRUrl getters, NavItemsService injection</td>
              <td style={{ padding: '8px' }}>Props-based configuration (unchanged)</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>ChatComponent</td>
              <td style={{ padding: '8px' }}>Added NGXS Store injection</td>
              <td style={{ padding: '8px' }}>Uses React hooks/props (unchanged)</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>Dependencies</td>
              <td style={{ padding: '8px' }}>@abp/ng.theme.shared &gt;=3.1.0</td>
              <td style={{ padding: '8px' }}>@abpjs/theme-shared workspace:*</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>React Patterns Already in Use <span style={{ color: '#4f4', fontSize: '12px' }}>(No Changes Needed)</span></h3>
        <p>
          The React implementation already uses equivalent patterns for all Angular v3.1.0 changes:
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`// ChatIcon - React already uses useEffect for cleanup
function ChatIcon({ unreadCount, onClick }) {
  // No subscriptions needed - React props are reactive
  return (
    <button onClick={onClick}>
      {unreadCount > 0 && <span>{unreadCount}</span>}
    </button>
  );
}

// ChatConfigService - getters equivalent
class ChatConfigService {
  get isChatEnabled(): boolean {
    return this.connection?.state === HubConnectionState.Connected;
  }
  // Already exposed as isConnected() method
}

// Chat component - uses hooks instead of Store injection
function Chat({ contacts, userMessages, ... }) {
  // State managed via props and callbacks
  // No need for NGXS Store - React uses lifting state up
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>v3.1.0 Summary</h3>
        <p style={{ color: '#888' }}>
          This release focused on internal Angular code quality improvements including subscription
          management in ChatIconComponent, convenience getters in ChatConfigService, and NGXS Store
          injection in ChatComponent. All existing APIs from v3.0.0 remain unchanged and fully
          compatible. The React translation did not require any updates.
        </p>
      </div>
    </div>
  )
}

export function TestChatPage() {
  return (
    <div>
      <h1>@abpjs/chat Tests (v3.2.0)</h1>
      <p style={{ marginBottom: '8px' }}>Testing chat components, hooks, services, and SignalR integration.</p>
      <p style={{ fontSize: '14px', color: '#4f4', marginBottom: '16px' }}>
        Version 3.2.0 - Version bump only (dependency updates)
      </p>

      <TestV320Features />
      <TestV310Features />
      <TestV300Features />
      <TestAPISummary />
      <TestChatComponent />
      <TestChatContactsComponent />
      <TestConversationAvatarComponent />
      <TestChatIconComponent />
      <TestUseChatHook />
      <TestEnums />
      <TestConstants />
      <TestServices />
      <TestModels />
    </div>
  )
}

export default TestChatPage
