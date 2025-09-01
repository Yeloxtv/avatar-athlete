import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e729377f90414d75b3687ffdb7118877',
  appName: 'RPG Hybride',
  webDir: 'dist',
  server: {
    url: 'https://e729377f-9041-4d75-b368-7ffdb7118877.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
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