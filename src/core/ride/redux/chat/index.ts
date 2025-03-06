import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { NetworkErrorDetailsWithBody } from 'shuttlex-integration';

import { createChat, getAllMessagesByChatId, getLastChat } from './thunks';
import { ChatState, NewMessageFromBack } from './types';

const initialState: ChatState = {
  chatId: null,
  chatInfo: {
    allMessages: [],
    hasMoreMessages: false,
    newMessageFromBack: null,
  },
  messagesAmount: 10,

  loading: {
    allMessages: false,
    lastChat: false,
  },
  errors: {
    allMessages: null,
    lastChat: null,
  },
};

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setNewMessageFromBack(state, action: PayloadAction<NewMessageFromBack>) {
      state.chatInfo.newMessageFromBack = action.payload;
    },
    clearNewMessageFromBack(state) {
      state.chatInfo.newMessageFromBack = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createChat.fulfilled, (state, action) => {
        state.chatId = action.payload;
      })
      //All Messages
      .addCase(getAllMessagesByChatId.pending, state => {
        state.loading.allMessages = true;
      })
      .addCase(getAllMessagesByChatId.fulfilled, (state, action) => {
        state.loading.allMessages = false;
        state.chatInfo.allMessages = action.payload;
        state.chatInfo.hasMoreMessages = action.payload.length === state.messagesAmount;
      })
      .addCase(getAllMessagesByChatId.rejected, (state, action) => {
        state.errors.allMessages = action.payload as NetworkErrorDetailsWithBody<any>;
        state.loading.allMessages = false;
      })

      //Last Chat
      .addCase(getLastChat.pending, state => {
        state.loading.lastChat = true;
        state.errors.lastChat = null;
      })
      .addCase(getLastChat.fulfilled, (state, action) => {
        state.loading.lastChat = false;
        state.chatId = action.payload.id;
        state.errors.lastChat = null;
      })
      .addCase(getLastChat.rejected, (state, action) => {
        state.errors.lastChat = action.payload as NetworkErrorDetailsWithBody<any>;
        state.loading.lastChat = false;
      });
  },
});

export const { setNewMessageFromBack, clearNewMessageFromBack } = slice.actions;

export default slice.reducer;
