import { SafeAreaView } from 'shuttlex-integration';

import { AuthScreenProps } from './props';
import SignIn from './SignIn';

const AuthScreen = ({ navigation }: AuthScreenProps): JSX.Element => {
  const onSignInPress = () => {
    //TODO: implement logic for sign in button
  };
  return (
    <SafeAreaView>
      <SignIn onPress={onSignInPress} navigation={navigation} />
    </SafeAreaView>
  );
};

export default AuthScreen;
