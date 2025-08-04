import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b9530b25ee6a4871860e2c55de61d006',
  appName: 'izzyz-pre-market-momentum-scanner',
  webDir: 'dist',
  server: {
    url: 'https://b9530b25-ee6a-4871-860e-2c55de61d006.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;