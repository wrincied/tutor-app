import { Routes } from '@angular/router';
import type { PageTitleKey } from '@interfaces';
import { environment } from '@environment';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard, emailVerifiedGuard } from './core/guards/auth.guard';
import {
  dataConsentGuard,
  onboardingGuard,
  onboardingPageGuard,
} from './core/guards/onboarding.guard';
import { onboardingProfileResolver } from './core/resolvers/onboarding-profile.resolver';

/** В designMode корень сразу показывает landing-v2; в prod остаётся старый LandingComponent. */
const rootLandingLoad =
  (environment as { designMode?: boolean }).designMode === true
    ? () =>
        import('./features/landing-v2/landing-v2.component').then((m) => m.LandingV2Component)
    : () => import('./features/landing/landing.component').then((m) => m.LandingComponent);

export const routes: Routes = [
  {
    path: '',
    loadComponent: rootLandingLoad,
    data: { title: 'landing' satisfies PageTitleKey },
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
    data: { title: 'login' satisfies PageTitleKey },
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register.component').then((m) => m.RegisterComponent),
    data: { title: 'register' satisfies PageTitleKey },
  },
  {
    path: 'legal/data-processing',
    loadComponent: () =>
      import('./features/legal/legal-document.component').then((m) => m.LegalDocumentComponent),
    data: { doc: 'data-processing', title: 'legalDataProcessing' satisfies PageTitleKey },
  },
  {
    path: 'legal/impressum',
    loadComponent: () =>
      import('./features/legal/legal-document.component').then((m) => m.LegalDocumentComponent),
    data: { doc: 'impressum', title: 'legalImpressum' satisfies PageTitleKey },
  },
  {
    path: 'legal/cookies',
    loadComponent: () =>
      import('./features/legal/legal-document.component').then((m) => m.LegalDocumentComponent),
    data: { doc: 'cookies', title: 'legalCookies' satisfies PageTitleKey },
  },
  {
    path: 'admin-login',
    loadComponent: () =>
      import('./features/auth/admin-login.component').then((m) => m.AdminLoginComponent),
    data: { title: 'adminLogin' satisfies PageTitleKey },
  },
  {
    path: 'app',
    canActivate: [authGuard],
    children: [
      {
        path: 'verify-email-notice',
        loadComponent: () =>
          import('./features/auth/verify-email-notice.component').then(
            (m) => m.VerifyEmailNoticeComponent,
          ),
        data: { title: 'verifyEmail' satisfies PageTitleKey },
      },
      {
        path: 'onboarding',
        canActivate: [emailVerifiedGuard, onboardingPageGuard],
        resolve: { profile: onboardingProfileResolver },
        loadComponent: () =>
          import('./features/auth/onboarding.component').then((m) => m.OnboardingComponent),
        data: { title: 'onboarding' satisfies PageTitleKey },
      },
      {
        // Admin console: GitHub + role only — no email verify / onboarding / consent gates
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/admin-shell.component').then((m) => m.AdminShellComponent),
        data: { title: 'admin' satisfies PageTitleKey },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/admin/admin-overview.component').then(
                (m) => m.AdminOverviewComponent,
              ),
            data: { title: 'admin' satisfies PageTitleKey },
          },
          {
            path: 'users',
            loadComponent: () =>
              import('./features/admin/admin-users.component').then((m) => m.AdminUsersComponent),
            data: { title: 'adminUsers' satisfies PageTitleKey },
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./features/admin/admin-settings.component').then((m) => m.AdminSettingsComponent),
            data: { title: 'adminSettings' satisfies PageTitleKey },
          },
          {
            path: 'landing',
            loadComponent: () =>
              import('./features/admin/admin-landing.component').then((m) => m.AdminLandingComponent),
            data: { title: 'adminLanding' satisfies PageTitleKey },
          },
        ],
      },
      {
        path: '',
        canActivate: [emailVerifiedGuard, dataConsentGuard, onboardingGuard],
        children: [
          { path: '', redirectTo: 'home', pathMatch: 'full' },
          {
            path: 'home',
            loadComponent: () =>
              import('./features/home/home.component').then((m) => m.HomeComponent),
            data: { title: 'home' satisfies PageTitleKey },
          },
          {
            path: 'students',
            loadComponent: () =>
              import('./features/students/students.component').then((m) => m.StudentsComponent),
            data: { title: 'students' satisfies PageTitleKey },
          },
          {
            path: 'calendar',
            loadComponent: () =>
              import('./features/calendar/calendar.component').then((m) => m.CalendarComponent),
            data: { title: 'calendar' satisfies PageTitleKey },
          },
          {
            path: 'finance',
            loadComponent: () =>
              import('./features/finance/finance.component').then((m) => m.FinanceComponent),
            data: { title: 'finance' satisfies PageTitleKey },
          },
          {
            path: 'finance/breakdown/:panel',
            loadComponent: () =>
              import('./features/finance/finance-breakdown.component').then(
                (m) => m.FinanceBreakdownComponent,
              ),
            data: { title: 'finance' satisfies PageTitleKey },
          },
          {
            path: 'pricing',
            loadComponent: () =>
              import('./features/pricing/pricing.component').then((m) => m.PricingComponent),
            data: { title: 'pricing' satisfies PageTitleKey },
          },
          {
            path: 'account',
            loadComponent: () =>
              import('./features/account/account-shell.component').then((m) => m.AccountShellComponent),
            data: { title: 'account' satisfies PageTitleKey },
            children: [
              { path: '', redirectTo: 'customization', pathMatch: 'full' },
              {
                path: 'customization',
                loadComponent: () =>
                  import('./features/account/account-customization.component').then(
                    (m) => m.AccountCustomizationComponent,
                  ),
                data: { title: 'accountCustomization' satisfies PageTitleKey },
              },
              {
                path: 'profile',
                loadComponent: () =>
                  import('./features/account/account-profile.component').then(
                    (m) => m.AccountProfileComponent,
                  ),
                data: { title: 'accountProfile' satisfies PageTitleKey },
              },
              {
                path: 'administration',
                loadComponent: () =>
                  import('./features/account/account-administration.component').then(
                    (m) => m.AccountAdministrationComponent,
                  ),
                data: { title: 'accountAdministration' satisfies PageTitleKey },
              },
            ],
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
