import { StyleSheet, View } from 'react-native';
import {
  Button,
  ButtonShadows,
  ButtonShapes,
  ButtonSizes,
  CircleButtonModes,
  InputXIcon,
  Text,
  useTheme,
} from 'shuttlex-integration';

import { TitleWithCloseButtonProps } from './props';

const TitleWithCloseButton = ({ title, onBackButtonPress }: TitleWithCloseButtonProps): JSX.Element => {
  const { colors } = useTheme();

  const computedStyles = StyleSheet.create({
    title: {
      color: colors.textSecondaryColor,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.title, computedStyles.title]}>{title}</Text>
      <Button
        shadow={ButtonShadows.Weak}
        shape={ButtonShapes.Circle}
        mode={CircleButtonModes.Mode2}
        size={ButtonSizes.S}
        onPress={onBackButtonPress}
      >
        <InputXIcon color={colors.textPrimaryColor} />
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter Bold',
    fontSize: 14,
  },
});

export default TitleWithCloseButton;
