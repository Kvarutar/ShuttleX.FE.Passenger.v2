import { StyleSheet, View } from 'react-native';
import { Blur, Button } from 'shuttlex-integration';

import { AdsContentProps } from './types';

const AdsContent = ({ children, isNotAvailable, buttonProps, style }: AdsContentProps) => {
  return (
    <>
      {isNotAvailable && (
        <View style={[styles.notAvailable, StyleSheet.absoluteFill]}>
          <Blur iosBlurAmount={3} />
        </View>
      )}
      <View style={[styles.container, style]}>
        <View>{children}</View>
        {buttonProps?.text && <Button textStyle={styles.buttonText} style={styles.button} {...buttonProps} />}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    height: '100%',
  },
  button: {
    minWidth: 72,
    height: 28,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: 'Inter Medium',
    fontSize: 11,
  },
  notAvailable: {
    zIndex: 100,
  },
});

export default AdsContent;
