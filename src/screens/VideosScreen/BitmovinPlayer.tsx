import { PlayerView, ScalingMode, SourceType, usePlayer } from 'bitmovin-player-react-native';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { IS_IOS, LoadingSpinner, useTheme } from 'shuttlex-integration';

import passengerColors from '../../shared/colors/colors.ts';
import { BitmovinPlayerProps } from './types.tsx';

const BitmovinPlayer = ({ videoUrl, pause, isActive }: BitmovinPlayerProps) => {
  const { colors } = useTheme();

  const player = usePlayer({
    styleConfig: {
      isUiEnabled: false,
      scalingMode: ScalingMode.Zoom,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const isPaused = !isActive || pause;

  const onReady = useCallback(() => {
    isPaused ? player.pause() : player.play();
  }, [isPaused, player]);

  const onPlaybackFinishedHandler = useCallback(() => {
    player.seek(0);
    player.play();
  }, [player]);

  const onSourceLoadHandler = useCallback((isLoad: boolean) => () => setIsLoading(isLoad), []);

  useEffect(() => {
    player.load({
      url: videoUrl,
      type: IS_IOS ? SourceType.HLS : SourceType.DASH,
    });

    (async () => {
      const isMuted = await player.isMuted();

      if (isMuted) {
        player.unmute();
      }
    })();

    return player.destroy;
  }, [player, videoUrl]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  useEffect(() => {
    if (!isActive) {
      player.seek(0);
    }
  }, [isActive, player]);

  return (
    <>
      <PlayerView
        onSourceLoaded={onSourceLoadHandler(false)}
        onSourceLoad={onSourceLoadHandler(true)}
        onPlaybackFinished={onPlaybackFinishedHandler}
        style={styles.video}
        player={player}
        onReady={onReady}
      />

      {isLoading && (
        <LoadingSpinner
          style={StyleSheet.absoluteFill}
          endColor={colors.primaryColor}
          startColor={passengerColors.videosColors.bottomContentBg}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  video: {
    flex: 1,
  },
});

export default BitmovinPlayer;
