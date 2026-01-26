import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AbpProvider, type ABP, type Config, eLayoutType } from '@abpjs/core'
import { ThemeBasicProvider, LAYOUTS } from '@abpjs/theme-basic'
import { AccountProvider, ACCOUNT_ROUTES } from '@abpjs/account'
import { SETTING_MANAGEMENT_ROUTES } from '@abpjs/setting-management'
import {
  TbHome,
  TbInfoCircle,
  TbDashboard,
  TbTestPipe,
  TbBox,
  TbPalette,
  TbLayout,
  TbUser,
  TbShield,
  TbBuilding,
  TbId,
  TbToggleRight,
  TbSettings,
} from 'react-icons/tb'
import './index.css'
import App from './App.tsx'

interface AppConfig {
  oAuthConfig: {
    issuer: string
    redirectUri: string
    clientId: string
    responseType: string
    scope: string
    requireHttps: boolean
  }
  application: {
    baseUrl: string
    name: string
  }
  apis: {
    [key: string]: {
      url: string
      rootNamespace: string
    }
  }
}

// Define app-specific routes
const appRoutes: ABP.FullRoute[] = [
  { name: 'Home', path: '', order: 1, layout: eLayoutType.application, icon: <TbHome /> },
  { name: 'About', path: 'about', order: 2, layout: eLayoutType.application, icon: <TbInfoCircle /> },
  {
    name: 'Dashboard',
    path: 'dashboard',
    order: 3,
    requiredPolicy: 'AdministrationService.RoleManagements',
    layout: eLayoutType.application,
    icon: <TbDashboard />
  },
  // Test pages for each package (grouped under Tests)
  {
    name: 'Tests',
    path: 'test',
    order: 10,
    layout: eLayoutType.application,
    icon: <TbTestPipe />,
    children: [
      { name: 'Core', path: 'core', order: 1, layout: eLayoutType.application, icon: <TbBox /> },
      { name: 'Theme Shared', path: 'theme-shared', order: 2, layout: eLayoutType.application, icon: <TbPalette /> },
      { name: 'Theme Basic', path: 'theme-basic', order: 3, layout: eLayoutType.application, icon: <TbLayout /> },
      { name: 'Account', path: 'account', order: 4, layout: eLayoutType.application, icon: <TbUser /> },
      { name: 'Permission Management', path: 'permission-management', order: 5, layout: eLayoutType.application, icon: <TbShield /> },
      { name: 'Tenant Management', path: 'tenant-management', order: 6, layout: eLayoutType.application, icon: <TbBuilding /> },
      { name: 'Identity', path: 'identity', order: 7, layout: eLayoutType.application, icon: <TbId /> },
      { name: 'Feature Management', path: 'feature-management', order: 8, layout: eLayoutType.application, icon: <TbToggleRight /> },
      { name: 'Setting Management', path: 'setting-management', order: 9, layout: eLayoutType.application, icon: <TbSettings /> },
    ]
  },
]

// Combine app routes with package routes
// Note: In v0.9.0, route exports are objects with a `routes` property
// Add icons to setting-management routes for sidebar display
const settingRoutes = SETTING_MANAGEMENT_ROUTES.routes.map(route => ({
  ...route,
  icon: <TbSettings />,
}))
const routes: ABP.FullRoute[] = [...appRoutes, ...ACCOUNT_ROUTES.routes, ...settingRoutes]

// Define requirements with layout components from theme.basic
const requirements: Config.Requirements = {
  layouts: LAYOUTS
}

async function loadConfig(): Promise<AppConfig> {
  const response = await fetch('/appconfig.json')
  return response.json()
}

async function bootstrap() {
  const config = await loadConfig()

  const environment = {
    production: false,
    application: config.application,
    apis: config.apis,
    oAuthConfig: {
      authority: config.oAuthConfig.issuer,
      client_id: config.oAuthConfig.clientId,
      redirect_uri: config.oAuthConfig.redirectUri,
      post_logout_redirect_uri: config.oAuthConfig.redirectUri,
      response_type: config.oAuthConfig.responseType,
      scope: config.oAuthConfig.scope,
      automaticSilentRenew: true,
      includeIdTokenInSilentRenew: true,
    },
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <AbpProvider environment={environment} routes={routes} requirements={requirements}>
          <ThemeBasicProvider
              appName='Testing app'
            >
            <AccountProvider options={{ redirectUrl: '/' }}>
              <App />
            </AccountProvider>
          </ThemeBasicProvider>
        </AbpProvider>
      </BrowserRouter>
    </StrictMode>,
  )
}

bootstrap()
