import { AppState } from '../../../redux/store';

export const chatIdSelector = (state: AppState) => state.chat.chatId;
export const allMessagesSelector = (state: AppState) => state.chat.chatInfo.allMessages;
export const newMessageFromBackSelector = (state: AppState) => state.chat.chatInfo.newMessageFromBack;
export const hasMoreMessagesSelector = (state: AppState) => state.chat.chatInfo.hasMoreMessages;
export const isAllMessagesLoadingSelector = (state: AppState) => state.chat.loading.allMessages;
export const isLastChatLoadingSelector = (state: AppState) => state.chat.loading.lastChat;
export const lastChatErrorSelector = (state: AppState) => state.chat.errors.lastChat;
export const messagesAmountSelector = (state: AppState) => state.chat.messagesAmount;
