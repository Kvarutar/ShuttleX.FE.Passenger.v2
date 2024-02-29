import { NativeModulesStatic } from 'react-native';

type CustomModule = {
  navigateToLocationSettings: () => void;
  setSoftInputMode: (arg0: 'adjustResize' | 'adjustPan') => void;
};

declare module 'react-native' {
  export const NativeModules: NativeModulesStatic & { CustomModule: CustomModule };
}
