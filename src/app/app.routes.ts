import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard, emailVerifiedGuard } from './core/guards/auth.guard';
import {
  dataConsentGuard,
  onboardingGuard,
  onboardingPageGuard,
} from './core/guards/onboarding.guard';
import { onboardingProfileResolver } from './core/resolvers/onboarding-profile.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'legal/data-processing',
    loadComponent: () =>
      import('./features/legal/legal-document.component').then((m) => m.LegalDocumentComponent),
    data: { doc: 'data-processing' },
  },
  {
    path: 'legal/cookies',
    loadComponent: () =>
      import('./features/legal/legal-document.component').then((m) => m.LegalDocumentComponent),
    data: { doc: 'cookies' },
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
      },
      {
        path: 'onboarding',
        canActivate: [emailVerifiedGuard, onboardingPageGuard],
        resolve: { profile: onboardingProfileResolver },
        loadComponent: () =>
          import('./features/auth/onboarding.component').then((m) => m.OnboardingComponent),
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
          },
          {
            path: 'students',
            loadComponent: () =>
              import('./features/students/students.component').then((m) => m.StudentsComponent),
          },
          {
            path: 'calendar',
            loadComponent: () =>
              import('./features/calendar/calendar.component').then((m) => m.CalendarComponent),
          },
          {
            path: 'finance',
            loadComponent: () =>
              import('./features/finance/finance.component').then((m) => m.FinanceComponent),
          },
          {
            path: 'pricing',
            loadComponent: () =>
              import('./features/pricing/pricing.component').then((m) => m.PricingComponent),
          },
          {
            path: 'account',
            loadComponent: () =>
              import('./features/account/account-shell.component').then((m) => m.AccountShellComponent),
            children: [
              { path: '', redirectTo: 'customization', pathMatch: 'full' },
              {
                path: 'customization',
                loadComponent: () =>
                  import('./features/account/account-customization.component').then(
                    (m) => m.AccountCustomizationComponent,
                  ),
              },
              {
                path: 'profile',
                loadComponent: () =>
                  import('./features/account/account-profile.component').then(
                    (m) => m.AccountProfileComponent,
                  ),
              },
            ],
          },
          {
            path: 'admin',
            canActivate: [adminGuard],
            loadComponent: () =>
              import('./features/admin/admin-dashboard.component').then(
                (m) => m.AdminDashboardComponent,
              ),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
