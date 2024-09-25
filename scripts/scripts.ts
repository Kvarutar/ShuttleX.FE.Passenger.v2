import os from 'os';
import fs from 'fs';
import child_process from 'child_process';
import { ExecArgs, FormattedCommand } from './types';

const isWin = os.platform() === 'win32';

const print = (mode: 'info' | 'error', message: string) => {
  switch (mode) {
    case 'info':
      console.log('\x1b[36m%s\x1b[0m', 'info', message);
      break;
    case 'error':
      console.error('\x1b[31m%s\x1b[0m', 'error', message);
      break;
  }
};

const prepareGoogleServices = (env: 'dev' | 'prod') => {
  print('info', 'Preparing google-services.json');

  fs.copyFileSync(`./scripts/google-services/google-services-${env}.json`, './android/app/google-services.json');
  // TODO: copy google-services plist file, when ios will be connected to firebase

  print('info', `google-services.json for ${env} successfully prepared`);
};

const exec = ({ unixCommand, winCommand }: ExecArgs) => {
  const formatCommand = (command: string): FormattedCommand => {
    const splittedCommand = command.split(' ');
    const executable = splittedCommand[0];
    const args = splittedCommand.slice(1);
    return { executable, args };
  };

  const formattedCommand = formatCommand(isWin ? winCommand : unixCommand);
  const command = child_process.spawn(
    formattedCommand.executable,
    [...formattedCommand.args, ...process.argv.slice(2)],
    {
      stdio: 'inherit',
      shell: true,
    },
  );

  command.on('close', code => code !== 0 && process.stdout.write(`child process exited with code ${code}`));
};

switch (process.env.npm_lifecycle_event) {
  case 'ios:dev':
    prepareGoogleServices('dev');
    exec({ unixCommand: "npx react-native run-ios --scheme 'ShuttleX_Passenger_dev'", winCommand: '' });
    break;
  case 'ios:prod':
    prepareGoogleServices('prod');
    exec({ unixCommand: "npx react-native run-ios --scheme 'ShuttleX_Passenger'", winCommand: '' });
    break;
  case 'android:dev':
    prepareGoogleServices('dev');
    exec({
      unixCommand:
        'npx react-native run-android --mode=devdebug && adb shell am start -n com.shuttlex.passenger.dev/com.shuttlex.passenger.MainActivity',
      winCommand:
        'npx react-native run-android --mode=devdebug & adb shell am start -n com.shuttlex.passenger.dev/com.shuttlex.passenger.MainActivity',
    });
    break;
  case 'android:prod':
    prepareGoogleServices('prod');
    exec({
      unixCommand: 'npx react-native run-android --mode=proddebug',
      winCommand: 'npx react-native run-android --mode=proddebug',
    });
    break;
  case 'build:android:assemble:dev:debug':
    prepareGoogleServices('dev');
    exec({
      unixCommand: 'cd android && ./gradlew assembleDevDebug',
      winCommand: 'cd android & .\\gradlew assembleDevDebug',
    });
    break;
  case 'build:android:assemble:dev:release':
    prepareGoogleServices('dev');
    exec({
      unixCommand: 'cd android && ./gradlew assembleDevRelease',
      winCommand: 'cd android & .\\gradlew assembleDevRelease',
    });
    break;
  case 'build:android:assemble:prod:debug':
    prepareGoogleServices('prod');
    exec({
      unixCommand: 'cd android && ./gradlew assembleProdDebug',
      winCommand: 'cd android & .\\gradlew assembleProdDebug',
    });
    break;
  case 'build:android:assemble:prod:release':
    prepareGoogleServices('prod');
    exec({
      unixCommand: 'cd android && ./gradlew assembleProdRelease',
      winCommand: 'cd android & .\\gradlew assembleProdRelease',
    });
    break;
  case 'build:android:bundle:prod:release':
    prepareGoogleServices('prod');
    exec({
      unixCommand: 'cd android && ./gradlew bundleProdRelease',
      winCommand: 'cd android & .\\gradlew bundleProdRelease',
    });
    break;
  default:
    print('error', 'unknown command');
}
