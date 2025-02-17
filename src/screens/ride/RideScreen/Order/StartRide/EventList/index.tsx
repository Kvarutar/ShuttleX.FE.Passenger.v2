import { Image, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import {
  eventFirstBigImg,
  eventFirstImg,
  eventSecondBigImg,
  eventSecondImg,
  eventThirdBigImg,
  eventThirdImg,
} from '../../../../../../../assets/images/eventImg';

const events = [eventFirstImg, eventSecondImg, eventThirdImg];
export const bigEvents = [eventFirstBigImg, eventSecondBigImg, eventThirdBigImg];

const EventsList = ({ isBottomWindowOpen = false }: { isBottomWindowOpen?: boolean }) => {
  const computedStyles = StyleSheet.create({
    container: {
      flexDirection: isBottomWindowOpen ? 'column' : 'row',
      marginBottom: isBottomWindowOpen ? 0 : 10,
    },
    scrollView: {
      marginRight: isBottomWindowOpen ? 0 : -12,
    },
    card: {
      width: isBottomWindowOpen ? '100%' : 152,
      height: isBottomWindowOpen ? 200 : 190,
      marginRight: isBottomWindowOpen ? 0 : 10,
      marginBottom: isBottomWindowOpen ? 10 : 0,
      borderRadius: 15,
      overflow: 'hidden',
      position: 'relative',
    },
  });

  const cards = isBottomWindowOpen ? bigEvents : events;

  return (
    <ScrollView
      style={computedStyles.scrollView}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      horizontal={!isBottomWindowOpen}
      scrollEventThrottle={16}
    >
      <View style={[computedStyles.container]}>
        {cards.map((item, index) => (
          <View key={index} style={computedStyles.card}>
            <Image source={item} style={styles.image} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});

export default EventsList;
