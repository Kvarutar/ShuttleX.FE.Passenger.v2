import shuttlexAuthInstanceInitializer from './authClient';
import shuttlexPassengerInstanceInitializer from './passengerClient';

const axiosInitilizers = {
  shuttlexAuthAxios: shuttlexAuthInstanceInitializer,
  shuttlexPassengerAxios: shuttlexPassengerInstanceInitializer,
};

export default axiosInitilizers;
