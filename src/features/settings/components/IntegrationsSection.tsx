'use client'

import { useStrava } from '@/features/strava/hooks/useStrava'
import { useGoogleHealth } from '@/features/google-health/hooks/useGoogleHealth'
import { IntegrationCard } from './IntegrationCard'

// Google Fit icon (official colors from Wikimedia Commons)
function GoogleHealthIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 236.2 200" fill="none">
      <path fill="#EA4335" d="M22.6 105.8l11.9 11.9 25.7-25.6-11.8-11.9-5.4-5.4c-4.3-4.3-6.6-9.9-6.6-16 0-5.3 1.8-10.1 4.9-13.9 4.2-5.3 10.6-8.7 17.8-8.7 6.1 0 11.7 2.4 16.1 6.7l5.3 5.1 11.9 12 25.8-25.6-12-11.9-5.4-5.2C90.1 6.6 75.4 0 59.1 0 26.4 0 0 26.4 0 58.9 0 67 1.6 74.7 4.6 81.8c3 7.1 7.3 13.4 12.7 18.7l5.3 5.3"/>
      <polyline fill="#FBBC04" points="81.5,122.2 118.2,85.7 92.4,60 60.2,92.1 60.2,92.1 34.5,117.7 48.3,131.6 60.2,143.4 72.6,131"/>
      <polygon fill="#34A853" points="143.8,175.6 201.8,117.7 176,92.1 118.1,149.9 85.9,117.8 60.2,143.4 92.4,175.6 92.3,175.7 118.1,200 118.1,200 118.1,200 143.9,175.6 143.9,175.6"/>
      <path fill="#4285F4" d="M218.9 100.5c12-12 18.9-30.4 17-49-2.8-28.2-26.2-49.4-54.6-51.3C163.4-1 147 5.7 135.4 17.3L92.4 60l25.7 25.7 43-42.8c5.2-5.1 12.4-7.5 19.8-6.3 9.6 1.5 17.4 9.4 18.7 19 1 7.2-1.4 14.2-6.5 19.3L176 92.1l25.8 25.6 17.1-17.2z"/>
    </svg>
  )
}

// Strava icon (official brand chevron from API logo)
function StravaIcon() {
  return (
    <svg width="24" height="24" viewBox="116 24 60 36" fill="none">
      {/* Chevrons extracted from official Strava API logo */}
      <path d="M133.62 59.0022L150.597 26.22H139.32L133.619 37.6829L127.918 26.22H116.641L133.62 59.0022Z" fill="white" fillOpacity="0.6"/>
      <path d="M158.547 24.9302L141.57 57.7123H152.848L158.549 46.2495L164.25 57.7123H175.527L158.547 24.9302Z" fill="white"/>
    </svg>
  )
}

// Garmin Connect IQ icon (from official brand tile)
function GarminIcon() {
  return (
    <svg width="28" height="28" viewBox="44 50 60 60" fill="none">
      {/* IQ symbol extracted from connect-iq-tile.svg */}
      <path d="M79.7480533,98.1753618 C79.3960533,97.8221959 78.8797867,97.7030558 78.4040533,97.8413435 C76.5608533,98.3689646 74.61952,98.6583052 72.6077867,98.6583052 C61.1325867,98.6583052 51.82912,89.4525931 51.82912,78.0959737 C51.82912,66.7393545 61.1325867,57.5336423 72.6077867,57.5336423 C84.0829867,57.5336423 93.3821867,66.7393545 93.3821867,78.0959737 C93.3821867,80.1809282 93.0664533,82.1914201 92.4797867,84.0891541 C92.32832,84.5720976 92.4477867,85.1039737 92.8104533,85.4656496 L96.3304533,88.9951796 C97.0024533,89.6674711 98.15872,89.456848 98.52352,88.5760612 C99.8589867,85.3443819 100.599253,81.8063417 100.599253,78.0959737 C100.599253,62.7928336 88.0680533,50.3916094 72.6077867,50.3916094 C57.1453867,50.3916094 44.60992,62.7928336 44.60992,78.0959737 C44.60992,93.3969865 57.1453867,105.79821 72.6077867,105.79821 C76.2045867,105.79821 79.6477867,105.125919 82.81152,103.896222 C83.7117867,103.549438 83.9400533,102.377183 83.2552533,101.687872 L79.7480533,98.1753618 Z M100.914987,101.496396 L83.8717867,84.4167899 C83.31072,83.8530011 82.39552,83.8530011 81.8344533,84.4167899 L78.88832,87.3676386 C78.3272533,87.9314274 78.3272533,88.8462542 78.88832,89.410043 L95.93152,106.48965 C96.49472,107.053438 97.4056533,107.053438 97.9688533,106.48965 L100.914987,103.538801 C101.478187,102.970757 101.478187,102.058058 100.914987,101.496396 Z M33.40352,53.4084108 L28.9917867,53.4084108 C28.14912,53.4084108 27.4664533,54.0551723 27.4664533,54.850859 L27.4664533,102.621846 C27.4664533,103.417533 28.14912,104.064294 28.9917867,104.064294 L33.40352,104.064294 C34.2440533,104.064294 34.9288533,103.417533 34.9288533,102.621846 L34.9288533,54.850859 C34.9288533,54.0551723 34.2440533,53.4084108 33.40352,53.4084108 Z" fill="white"/>
    </svg>
  )
}

export function IntegrationsSection() {
  const {
    isConnected: isStravaConnected,
    isLoadingStatus: isStravaLoading,
    connect: connectStrava,
    disconnect: disconnectStrava,
    isDisconnecting: isStravaDisconnecting,
  } = useStrava()

  const {
    isConnected: isGoogleConnected,
    isLoadingStatus: isGoogleLoading,
    connect: connectGoogle,
    isConnecting: isGoogleConnecting,
    disconnect: disconnectGoogle,
    isDisconnecting: isGoogleDisconnecting,
  } = useGoogleHealth()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-display text-foreground mb-1">Integrações</h2>
        <p className="text-sm text-foreground-muted">
          Conecte seus apps de corrida para uma experiencia personalizada
        </p>
      </div>

      <div className="space-y-3">
        <IntegrationCard
          name="Strava"
          description="Sincronize suas corridas, rotas e historico de atividades"
          icon={<StravaIcon />}
          color="#FC4C02"
          isConnected={isStravaConnected}
          isLoading={isStravaLoading || isStravaDisconnecting}
          onConnect={connectStrava}
          onDisconnect={disconnectStrava}
        />

        <IntegrationCard
          name="Google Health"
          description="Dados de saúde, sono, frequência cardíaca e atividades"
          icon={<GoogleHealthIcon />}
          color="#F0F0F3"
          isConnected={isGoogleConnected}
          isLoading={isGoogleLoading || isGoogleDisconnecting || isGoogleConnecting}
          onConnect={connectGoogle}
          onDisconnect={disconnectGoogle}
        />

        <IntegrationCard
          name="Garmin Connect"
          description="HRV, VO2max, carga de treino e metricas avançadas"
          icon={<GarminIcon />}
          color="#0E6DB4"
          isConnected={false}
          isLoading={false}
          onConnect={() => {}}
          onDisconnect={() => {}}
          disabled
          disabledMessage="Em breve"
        />
      </div>
    </div>
  )
}
