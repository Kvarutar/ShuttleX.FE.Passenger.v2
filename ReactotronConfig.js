import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

const reactotron = Reactotron.configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .use(
    reactotronRedux({
      except: [
        'geolocation/setGeolocationIsLocationEnabled',
        'geolocation/setGeolocationAccuracy',
        'geolocation/setGeolocationIsPermissionGranted',
      ],
    }),
  )
  .connect(); // let's connect!

export default reactotron;
