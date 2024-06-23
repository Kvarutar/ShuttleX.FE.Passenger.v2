import { Platform, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { MenuUserImage, Text, useTheme } from 'shuttlex-integration';

import { contractorInfoSelector } from '../../../../core/ride/redux/trip/selectors';

const isPlatformIos = Platform.OS === 'ios';

const VisiblePart = () => {
  const contractorInfo = useSelector(contractorInfoSelector);
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    plateNumber: {
      borderColor: colors.iconPrimaryColor,
      paddingVertical: isPlatformIos ? 10 : 8,
    },
    number: {
      fontFamily: isPlatformIos ? 'Dealerplate' : 'Dealerplate California',
      marginBottom: isPlatformIos ? -4 : 0,
    },
  });

  if (!contractorInfo) {
    return <></>;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.infoWrapper}>
        <MenuUserImage url="https://sun9-34.userapi.com/impg/ZGuJiFBAp-93En3yLK7LWZNPxTGmncHrrtVgbg/hd6uHaUv1zE.jpg?size=1200x752&quality=96&sign=e79799e4b75c839d0ddb1a2232fe5d60&type=album" />
        <View style={styles.info}>
          <Text numberOfLines={1} style={styles.name}>
            {contractorInfo.name}
          </Text>
          <Text numberOfLines={1} style={styles.carModel}>
            {contractorInfo.car.model}
          </Text>
        </View>
      </View>
      <View style={[styles.plateNumber, computedStyles.plateNumber]}>
        <Text style={[styles.number, computedStyles.number]}>{contractorInfo.car.plateNumber}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  infoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter Medium',
  },
  carModel: {
    fontSize: 12,
    fontFamily: 'Inter Medium',
  },
  info: {
    gap: 8,
    flexShrink: 1,
    marginLeft: 20,
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 24,
  },
  number: {
    fontSize: 22,
  },
  plateNumber: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});

export default VisiblePart;
