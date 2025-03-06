import { type IMessage } from 'react-native-gifted-chat';
import { getNetworkErrorInfo } from 'shuttlex-integration';
import { v4 as uuidv4 } from 'uuid';

import { convertMessageToChatFormat } from '../../../../screens/ride/AiChatScreen/utils';
import { profileIdSelector } from '../../../passenger/redux/selectors';
import { createAppAsyncThunk } from '../../../redux/hooks';
import { chatIdSelector } from './selectors';
import {
  ChatsTypeFromAPI,
  CreateChatAPIRequest,
  CreateChatAPIResponse,
  GetAllMessagesAPIResponse,
  GetChatByIdAPIResponse,
  GetLastChatAPIResponse,
  GetMessageByIdAPIResponse,
  NewMessageFromBack,
  SendMessageAPIRequest,
  SendMessageAPIResponse,
} from './types';

export const createChat = createAppAsyncThunk<CreateChatAPIResponse, void>(
  'chat/createChat',
  async (_, { rejectWithValue, chatAxios }) => {
    try {
      const result = await chatAxios.post<CreateChatAPIResponse>('/ai', {
        chatName: uuidv4(),
        chatType: ChatsTypeFromAPI.ai,
      } as CreateChatAPIRequest);

      return result.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const sendMessage = createAppAsyncThunk<SendMessageAPIResponse, string>(
  'chat/sendMessage',
  async (content, { rejectWithValue, chatAxios, getState }) => {
    const chatId = chatIdSelector(getState());
    try {
      const result = await chatAxios.post<SendMessageAPIResponse>(`/${chatId}/messages`, {
        content: content,
        senderType: 'Passenger',
      } as SendMessageAPIRequest);

      return result.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getAllMessagesByChatId = createAppAsyncThunk<IMessage[], { amount: number; page: number }>(
  'chat/getAllMessagesByChatId',
  async (data, { rejectWithValue, chatAxios, getState }) => {
    const chatId = chatIdSelector(getState());
    const currentUserId = profileIdSelector(getState());

    try {
      const result = await chatAxios.get<GetAllMessagesAPIResponse>(
        `/${chatId}/messages?amount=${data.amount}&page=${data.page}`,
      );
      return result.data.messages.map(msg => convertMessageToChatFormat(msg, currentUserId));
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getLastChat = createAppAsyncThunk<GetLastChatAPIResponse, void>(
  'chat/getLastChat',
  async (_, { rejectWithValue, chatAxios }) => {
    try {
      const result = await chatAxios.get<GetLastChatAPIResponse>(`/${ChatsTypeFromAPI.ai}/last`);
      return result.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getChatById = createAppAsyncThunk<GetChatByIdAPIResponse, string>(
  'chat/getChatById',
  async (chatId, { rejectWithValue, chatAxios }) => {
    try {
      const result = await chatAxios.get<GetChatByIdAPIResponse>(`${chatId}`);
      return result.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);

export const getMessageById = createAppAsyncThunk<GetMessageByIdAPIResponse, NewMessageFromBack>(
  'chat/getMessageById',
  async (data, { rejectWithValue, chatAxios }) => {
    try {
      const result = await chatAxios.get<GetMessageByIdAPIResponse>(`/${data.chatId}/messages/${data.messageId}`);
      return result.data;
    } catch (error) {
      return rejectWithValue(getNetworkErrorInfo(error));
    }
  },
);
