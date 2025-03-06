import { type IMessage } from 'react-native-gifted-chat';
import { NetworkErrorDetailsWithBody, Nullable } from 'shuttlex-integration';

export enum ChatsTypeFromAPI {
  ride = 'Ride',
  ai = 'AssistentAi',
  support = 'Support',
}

export type ChatState = {
  chatId: Nullable<string>;
  chatInfo: {
    allMessages: IMessage[];
    hasMoreMessages: boolean;
    newMessageFromBack: Nullable<NewMessageFromBack>;
  };
  loading: {
    allMessages: boolean;
    lastChat: boolean;
  };
  errors: {
    allMessages: Nullable<NetworkErrorDetailsWithBody<any>>;
    lastChat: Nullable<NetworkErrorDetailsWithBody<any>>;
  };
  messagesAmount: number;
};

export type ChatTypeFromAPI = {
  id: string;
  name: string;
  type: string;
  participants: {
    id: string;
    userType: string;
  }[];
};

export type CreateChatAPIResponse = string;
export type CreateChatAPIRequest = {
  chatName: string;
  chatType: ChatsTypeFromAPI;
};

export type GetLastChatAPIResponse = ChatTypeFromAPI;
export type GetChatByIdAPIResponse = ChatTypeFromAPI;

export type MessageTypeFromAPI = {
  id: string;
  chatId: string;
  senderId: string;
  senderType: string;
  content: string;
  sentAt: string;
  readAt: string;
};

export type NewMessageFromBack = {
  chatId: string;
  messageId: string;
};

export type GetAllMessagesAPIResponse = {
  chatId: string;
  messages: MessageTypeFromAPI[];
};

export type SendMessageAPIResponse = string;
export type SendMessageAPIRequest = {
  content: string;
  senderType: string;
};

export type GetMessageByIdAPIResponse = MessageTypeFromAPI;
