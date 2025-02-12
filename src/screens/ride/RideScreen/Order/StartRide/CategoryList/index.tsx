import { StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Bar, BarModes, SearchIcon, Text } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../../core/redux/hooks';
import { setIsAddressSelectVisible } from '../../../../../../core/ride/redux/order';

export const categories = ['Events', 'Places', 'Services', 'Landmarks'];

const CategoriesList = () => {
  const dispatch = useAppDispatch();

  const openAddressSelectHandler = () => dispatch(setIsAddressSelectVisible(true));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEventThrottle={16} style={styles.scrollView}>
      <Bar onPress={openAddressSelectHandler} mode={BarModes.Disabled} style={[styles.searchContainer]}>
        <SearchIcon />
      </Bar>
      {categories.map(item => (
        <TouchableOpacity key={item} style={[styles.button]}>
          <Text style={[styles.buttonText]}>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginVertical: 8,
  },
  searchContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    height: 40,
    paddingHorizontal: 17,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginRight: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#F3F3F3',
    borderWidth: 1,
  },

  buttonText: {
    fontSize: 16,
    lineHeight: 22,
  },
});

export default CategoriesList;
