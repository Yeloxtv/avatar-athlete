import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.playandtrain.app',
  appName: 'PlayAndTrain',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1b23',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    }
  }
};

export default config;