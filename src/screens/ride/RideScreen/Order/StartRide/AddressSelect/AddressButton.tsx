import { StyleSheet } from 'react-native';
import { Bar, Text } from 'shuttlex-integration';

import { AddressButtonProps } from './props';

const AddressButton = ({ icon, text, onPress, style }: AddressButtonProps) => {
  return (
    <Bar onPress={onPress} style={[styles.container, style]}>
      {icon}
      <Text style={styles.text}>{text}</Text>
    </Bar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    height: 42,
  },
  text: {
    fontFamily: 'Inter Medium',
    fontSize: 12,
    marginLeft: 8,
  },
});

export default AddressButton;
