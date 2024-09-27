import { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

export type UriType = ImageSourcePropType | string;

export type AdsBlockProps = {
  bigImagePlace?: 'left' | 'right' | 'none';
  firstImgUri: UriType;
  firstContent: React.ReactNode;
  secondImgUri?: UriType;
  secondContent?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export type renderBlockProps = {
  uri: UriType;
  content: React.ReactNode;
  style: StyleProp<ViewStyle>;
};
