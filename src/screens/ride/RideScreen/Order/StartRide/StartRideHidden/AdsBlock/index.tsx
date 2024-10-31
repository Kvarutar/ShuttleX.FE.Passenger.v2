import { ImageBackground, ImageSourcePropType, StyleSheet, View } from 'react-native';

import { AdsBlockProps, renderBlockProps, UriType } from './types';

const AdsBlock = ({
  firstImgUri,
  secondImgUri,
  firstContent,
  secondContent,
  bigImagePlace = 'none',
  containerStyle,
}: AdsBlockProps) => {
  const computedStyles = StyleSheet.create({
    right: {
      flex: bigImagePlace === 'right' ? 2 : 1,
      marginLeft: 4,
    },
    left: {
      flex: bigImagePlace === 'left' ? 2 : 1,
    },
  });

  const isColor = (value: string) => /^#[0-9A-F]{3,8}$/i.test(value);

  const getImageSource = (image: UriType): ImageSourcePropType | string => {
    if (typeof image === 'string') {
      return isColor(image) ? image : { uri: image };
    }
    return image;
  };

  const renderBlock = ({ uri, content, style }: renderBlockProps) => {
    const imageSource = getImageSource(uri);

    if (typeof imageSource === 'string') {
      return <View style={[styles.background, style, { backgroundColor: imageSource }]}>{content}</View>;
    }

    return (
      <ImageBackground source={imageSource} style={[styles.background, style]} resizeMode="cover">
        {content}
      </ImageBackground>
    );
  };

  if (bigImagePlace === 'none') {
    return renderBlock({
      uri: firstImgUri,
      content: firstContent,
      style: [styles.container, containerStyle],
    });
  }

  if (!secondImgUri || !secondContent) {
    console.error('`secondImgUri` and `secondContent` are required when `bigImagePlace` is not `none`.');
  } else {
    return (
      <View style={[styles.container, styles.twoImageContainer, containerStyle]}>
        {renderBlock({ uri: firstImgUri, content: firstContent, style: computedStyles.left })}
        {renderBlock({ uri: secondImgUri, content: secondContent, style: computedStyles.right })}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  background: {
    padding: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  container: {
    height: 260,
    marginBottom: 4,
  },
  twoImageContainer: {
    flexDirection: 'row',
  },
});

export default AdsBlock;
