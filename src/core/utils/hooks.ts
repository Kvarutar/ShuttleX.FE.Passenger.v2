import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { NativeModules, Platform } from 'react-native';

export let useKeyboardAutoSoftInputModeAndroid = () => {};

if (Platform.OS === 'android') {
  useKeyboardAutoSoftInputModeAndroid = () => {
    const isFocused = useIsFocused();

    useEffect(() => {
      NativeModules.CustomModule.setSoftInputMode('adjustResize');
      return () => NativeModules.CustomModule.setSoftInputMode('adjustPan');
    }, []);

    useEffect(() => {
      if (isFocused) {
        NativeModules.CustomModule.setSoftInputMode('adjustResize');
      } else {
        NativeModules.CustomModule.setSoftInputMode('adjustPan');
      }
    }, [isFocused]);
  };
}
