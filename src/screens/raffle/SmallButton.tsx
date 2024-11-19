import { Button, ButtonShadows, ButtonShapes, ButtonSizes, CircleButtonModes } from 'shuttlex-integration';

import { SmallButtonProps } from './types';

const SmallButton = ({
  icon,
  onPress,
  containerStyle,
  mode = CircleButtonModes.Mode2,
}: SmallButtonProps): JSX.Element => (
  <Button
    containerStyle={containerStyle}
    shadow={ButtonShadows.Weak}
    shape={ButtonShapes.Circle}
    mode={mode}
    size={ButtonSizes.S}
    onPress={onPress}
  >
    {icon}
  </Button>
);

export default SmallButton;
