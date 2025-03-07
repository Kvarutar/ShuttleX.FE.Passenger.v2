import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type IMessage } from 'react-native-gifted-chat';
import { useSelector } from 'react-redux';
import { ChatCore } from 'shuttlex-integration';

import { logger } from '../../../App';
import { profileIdSelector } from '../../../core/passenger/redux/selectors';
import { useAppDispatch } from '../../../core/redux/hooks';
import { clearNewMessageFromBack } from '../../../core/ride/redux/chat';
import {
  allMessagesSelector,
  hasMoreMessagesSelector,
  isAllMessagesLoadingSelector,
  messagesAmountSelector,
  newMessageFromBackSelector,
} from '../../../core/ride/redux/chat/selectors';
import { getAllMessagesByChatId, getMessageById, sendMessage } from '../../../core/ride/redux/chat/thunks';
import { RootStackParamList } from '../../../Navigate/props';
import { convertMessagesToString, convertMessageToChatFormat } from './utils';

const AiChatScreen = () => {
  const navigation = useNavigation<NativeStackScreenProps<RootStackParamList, 'AiChatScreen'>['navigation']>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const messagesFromBack = useSelector(allMessagesSelector);
  const currentUserId = useSelector(profileIdSelector);
  const isMessagesLoading = useSelector(isAllMessagesLoadingSelector);
  const messagesAmount = useSelector(messagesAmountSelector);
  const hasMoreMessages = useSelector(hasMoreMessagesSelector);
  const newMessageFromBack = useSelector(newMessageFromBackSelector);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

  //First render: All messages from back we send to chat and show them to user at the first render
  useEffect(() => {
    if (messagesFromBack && messagesFromBack.length > 0 && !isInitialLoadDone) {
      setMessages(messagesFromBack);
      setIsInitialLoadDone(true);
      setCurrentPage(1);
    }
  }, [messagesFromBack, isInitialLoadDone]);

  // Render when we need more messages from back
  const loadEarlierMessages = useCallback(async () => {
    if (isMessagesLoading || !hasMoreMessages) {
      return;
    }

    try {
      const olderMessages = await dispatch(
        getAllMessagesByChatId({ amount: messagesAmount, page: currentPage }),
      ).unwrap();

      if (olderMessages && olderMessages.length > 0) {
        setMessages(prevMessages => {
          const newMessages = olderMessages.filter(msg => !prevMessages.some(prevMsg => prevMsg._id === msg._id));
          return [...prevMessages, ...newMessages];
        });

        setCurrentPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error loading earlier messages:', error);
    }
  }, [dispatch, currentPage, messagesAmount, isMessagesLoading, hasMoreMessages]);

  // Rendered when we got new message from ai or other person
  useEffect(() => {
    const fetchNewMessageFromBack = async () => {
      if (!newMessageFromBack) {
        return;
      }

      try {
        const newMessage = await dispatch(
          getMessageById({
            chatId: newMessageFromBack.chatId,
            messageId: newMessageFromBack.messageId,
          }),
        ).unwrap();

        const formattedMessage = convertMessageToChatFormat(newMessage, currentUserId);

        setMessages(prevMessages => [formattedMessage, ...(prevMessages ?? [])]);
        dispatch(clearNewMessageFromBack());
      } catch (error) {
        console.error('Error fetching new message:', error);
      }
    };

    fetchNewMessageFromBack();
  }, [newMessageFromBack, dispatch, currentUserId]);

  const onSend = async (newMessages: IMessage[]) => {
    //To show message instantly after sending it
    setMessages(prevMessages => [...newMessages, ...prevMessages]);
    await dispatch(sendMessage(convertMessagesToString(newMessages)));
  };

  if (!currentUserId) {
    return;
  }

  return (
    <ChatCore
      userId={currentUserId}
      chatName={t('ride_AiPopup_header')}
      messages={messages}
      onSend={newMessages => onSend(newMessages)}
      onBackButtonPress={navigation.goBack}
      errorLogger={logger.error}
      onLoadEarlier={loadEarlierMessages}
      loadEarlier={hasMoreMessages}
      isLoadingEarlier={isMessagesLoading}
    />
  );
};

export default AiChatScreen;
