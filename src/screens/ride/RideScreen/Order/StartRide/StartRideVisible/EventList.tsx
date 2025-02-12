import { Image, StyleSheet, View } from 'react-native';

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
  console.log(cards);

  return (
    <View style={[styles.container, computedStyles.container]}>
      {cards.map((item, index) => (
        <View key={index} style={computedStyles.card}>
          <Image source={item} style={styles.image} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 36,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default EventsList;
