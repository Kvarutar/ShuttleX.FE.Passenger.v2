import { StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Bar, BarModes, SearchIcon, Text, useTheme } from 'shuttlex-integration';

import { useAppDispatch } from '../../../../../../core/redux/hooks';
import { setIsAddressSelectVisible } from '../../../../../../core/ride/redux/order';

const categories = ['Events', 'Places', 'Services', 'Landmarks'];

const CategoriesList = () => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  //Use in future
  const selectedCategory = categories[0];

  const openAddressSelectHandler = () => dispatch(setIsAddressSelectVisible(true));

  const computedStyles = StyleSheet.create({
    button: {
      backgroundColor: colors.backgroundPrimaryColor,
      borderColor: colors.backgroundSecondaryColor,
    },
    selected: {
      backgroundColor: colors.backgroundSecondaryColor,
    },
  });

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEventThrottle={16} style={styles.scrollView}>
      <Bar onPress={openAddressSelectHandler} mode={BarModes.Disabled} style={[styles.searchContainer]}>
        <SearchIcon />
      </Bar>

      {categories.map(item => (
        <TouchableOpacity
          key={item}
          style={[styles.button, computedStyles.button, selectedCategory === item ? computedStyles.selected : null]}
        >
          <Text style={[styles.buttonText]}>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginVertical: 8,
    height: 40,
    maxHeight: 40,
    minHeight: 40,
  },
  searchContainer: {
    width: 40,
    borderRadius: 20,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    paddingHorizontal: 17,
    borderRadius: 20,
    marginRight: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },

  buttonText: {
    fontFamily: 'Inter Medium',
    lineHeight: 22,
  },
});

export default CategoriesList;
