import { Image, StyleSheet, View } from 'react-native';
import { useTheme } from 'shuttlex-integration';

import aipopup from '../../../../../../assets/images/aipopup';

const SecondCard = () => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    photoContainer: {
      backgroundColor: colors.backgroundPrimaryColor,
    },
  });
  return (
    <View style={styles.container}>
      <View style={[styles.photoContainer, styles.firstPhoto, computedStyles.photoContainer]}>
        <Image source={aipopup.firstCard} style={styles.image} />
      </View>
      <View style={[styles.photoContainer, styles.secondPhoto, computedStyles.photoContainer]}>
        <Image source={aipopup.secondCard} style={styles.image} />
      </View>
      <View style={[styles.photoContainer, styles.thirdPhoto, computedStyles.photoContainer]}>
        <Image source={aipopup.thirdCard} style={styles.image} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10%',
  },
  photoContainer: {
    borderRadius: 10,
    width: '60%',
    aspectRatio: 1,
    padding: 2,
  },
  firstPhoto: {
    transform: [{ rotate: '15deg' }],
    marginLeft: '50%',
    marginTop: '5%',
  },
  secondPhoto: {
    marginLeft: '-20%',
  },
  thirdPhoto: {
    marginLeft: '-10%',
    marginTop: '5%',
    transform: [{ rotate: '-15deg' }],
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default SecondCard;
