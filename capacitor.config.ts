import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.br.runmind.app',
  appName: 'RunMind',
  webDir: 'out',
  server: {
    url: 'https://staging.runmind.com.br',
    cleartext: false,
    androidScheme: 'https',
    allowNavigation: [
      'staging.runmind.com.br',
      'runmind.com.br',
      'www.runmind.com.br',
    ],
  },
  ios: {
    contentInset: 'automatic',
    scheme: 'RunMind',
  },
  android: {
    allowMixedContent: false,
  },
}

export default config
