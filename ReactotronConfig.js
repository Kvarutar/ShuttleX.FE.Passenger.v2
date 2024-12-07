import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

const reactotron = Reactotron.configure()
  .useReactNative()
  .use(
    reactotronRedux({
      except: [
        'geolocation/setGeolocationIsLocationEnabled',
        'geolocation/setGeolocationAccuracy',
        'geolocation/setGeolocationIsPermissionGranted',
        'geolocation/setGeolocationCoordinates',
        'signalr/update-passenger-geo/fulfilled',
        'signalr/update-passenger-geo/pending',
        'signalr/update-passenger-geo/rejected',
        'map/setMapCars',
      ],
    }),
  )
  .connect();

export default reactotron;
