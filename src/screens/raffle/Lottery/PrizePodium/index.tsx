import { StyleSheet, View } from 'react-native';
import { PrizePedestalIcon } from 'shuttlex-integration';

import { Prize } from '../../../../core/lottery/redux/types';
import PrizeBox from './PrizeBox';
import { PrizePodiumProps } from './types';

const getPrizeByPlace = (prizes: Prize[], place: number) => {
  return prizes.find(prize => prize.index + 1 === place);
};

const PrizePodium = ({ prizes, handleSurprisesPress }: PrizePodiumProps) => {
  const prizesToRender = [2, 1, 3].map(place => getPrizeByPlace(prizes, place));

  return (
    <View style={styles.container}>
      <View style={styles.prizes}>
        {prizesToRender.map((prize, index) =>
          prize ? <PrizeBox key={index} prize={prize} onPress={() => handleSurprisesPress(prize)} /> : <></>,
        )}
      </View>
      <PrizePedestalIcon
        secondPlaceColored={Boolean(prizesToRender[0]?.winnerId)}
        firstPlaceColored={Boolean(prizesToRender[1]?.winnerId)}
        thirdPlaceColored={Boolean(prizesToRender[2]?.winnerId)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 55,
  },
  prizes: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: -70,
    zIndex: 1,
  },
});

export default PrizePodium;
