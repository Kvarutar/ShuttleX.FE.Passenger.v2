import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type IMessage } from 'react-native-gifted-chat';
import { ChatCore } from 'shuttlex-integration';

import { logger } from '../../../App';
import { RootStackParamList } from '../../../Navigate/props';

const AiChatScreen = () => {
  const navigation = useNavigation<NativeStackScreenProps<RootStackParamList, 'AiChatScreen'>['navigation']>();
  const { t } = useTranslation();

  const [messages, setMessages] = useState<IMessage[]>([
    { _id: 'test1', text: 'testing', createdAt: new Date(), user: { _id: 'test', name: 'Aoan' } },
    { _id: 'test2', text: 'testing2', createdAt: new Date(), user: { _id: 'test2', name: 'Aoan2' } },
    { _id: 'test3', text: 'testing', createdAt: new Date(), user: { _id: 'test', name: 'Aoan' } },
    { _id: 'test4', text: 'testing2', createdAt: new Date(), user: { _id: 'test2', name: 'Aoan2' } },
  ]);

  return (
    <ChatCore
      userId="test"
      chatName={t('ride_AiPopup_header')}
      messages={messages}
      onSend={newMessages => setMessages(prevMessages => [...prevMessages, ...newMessages])}
      onBackButtonPress={navigation.goBack}
      errorLogger={logger.error}
    />
  );
};

export default AiChatScreen;
