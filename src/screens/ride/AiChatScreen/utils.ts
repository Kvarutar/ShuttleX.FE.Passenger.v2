import { type IMessage } from 'react-native-gifted-chat';

import { MessageTypeFromAPI } from '../../../core/ride/redux/chat/types';

export const convertMessageToChatFormat = (message: MessageTypeFromAPI, currentUserId?: string): IMessage => {
  const imageRegex = /!\[image\]\((.*?)\)/;
  const match = message.content.match(imageRegex);

  return {
    _id: message.id,
    text: match ? message.content.replace(imageRegex, '').trim() : message.content,
    createdAt: Number(message.sentAt),
    user: {
      _id: message.senderId === currentUserId ? currentUserId : message.senderId,
      name: message.senderType,
    },
    image: match ? match[1] : undefined,
  };
};

export const convertMessagesToString = (messages: IMessage[]): string => {
  return messages
    .map(message => {
      let content = '';
      if (message.text) {
        content += message.text;
      }
      if (message.image) {
        content += `![image](${message.image})`;
      }
      return content;
    })
    .join('');
};
