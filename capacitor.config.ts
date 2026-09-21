import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nafisride.app',
  appName: 'Nafis Ride',
  webDir: 'dist',
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    BackgroundGeolocation: {
      backgroundMessage: 'Nafis Ride is syncing live Captain & Passenger coordinates in Alwar.',
      backgroundTitle: 'Nafis Ride Background GPS Active',
    },
  },
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
};

export default config;
