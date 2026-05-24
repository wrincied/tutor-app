import { ChangeDetectorRef, Component, computed, inject, OnInit, signal } from '@angular/core';

import { DOCUMENT } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { ActivatedRoute, RouterLink } from '@angular/router';

import type { UserProfile } from '@interfaces';

import { purgeStaleOverlayLayers } from '../../core/utils/purge-stale-overlay-layers';

import { AuthService } from '../../core/services/auth.service';

import { I18nService } from '../../core/services/i18n.service';

import { UserService } from '../../core/services/user.service';

import { buildCountrySelectOptions } from '../../core/utils/country-select-options';

import { splitDisplayName } from '../../core/utils/oauth-display-name';

import { MarketingConsentService } from '../../core/services/marketing-consent.service';

import { AppSelectComponent } from '../../shared/app-select';



@Component({

  selector: 'app-onboarding',

  standalone: true,

  imports: [FormsModule, RouterLink, AppSelectComponent],

  templateUrl: './onboarding.component.html',

  styleUrl: './auth.scss',

})

export class OnboardingComponent implements OnInit {

  private readonly auth = inject(AuthService);

  private readonly userSvc = inject(UserService);

  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly document = inject(DOCUMENT);

  readonly i18n = inject(I18nService);
  readonly consent = inject(MarketingConsentService);



  email = '';

  firstName = '';

  lastName = '';

  country = 'AT';

  dataConsent = false;

  loading = signal(false);

  error = signal('');



  readonly countryOptions = computed(() => buildCountrySelectOptions(this.i18n.lang()));



  ngOnInit(): void {
    purgeStaleOverlayLayers(this.document);

    const profile = this.route.snapshot.data['profile'] as UserProfile | undefined;

    const fbUser = this.auth.firebaseUser();

    const oauthNames = splitDisplayName(fbUser?.displayName);

    this.applyProfile(profile, oauthNames, fbUser?.email ?? '');

  }



  private applyProfile(

    profile: UserProfile | undefined,

    oauthNames: ReturnType<typeof splitDisplayName>,

    fallbackEmail: string,

  ): void {

    if (!profile) {

      this.email = fallbackEmail;

      this.firstName = oauthNames.firstName ?? '';

      this.lastName = oauthNames.lastName ?? '';

      return;

    }



    this.email = profile.email || fallbackEmail;

    this.firstName = profile.first_name?.trim() || oauthNames.firstName || '';

    this.lastName = profile.last_name?.trim() || oauthNames.lastName || '';

    if (profile.country_settings) {

      this.country = profile.country_settings;

    }

    this.consent.syncFromProfile(profile);

    this.cdr.markForCheck();

  }



  acceptMarketingCookies(): void {
    this.consent.accept();
    this.userSvc.updateMarketingCookies(true).subscribe({ error: () => {} });
  }

  declineMarketingCookies(): void {
    this.consent.decline();
    this.userSvc.updateMarketingCookies(false).subscribe({ error: () => {} });
  }



  submit(): void {

    const t = this.i18n.authUi();

    this.error.set('');



    if (!this.dataConsent) {

      this.error.set(t.onboardingConsentRequired);

      return;

    }

    if (!this.firstName.trim()) {

      this.error.set(t.onboardingFirstNameRequired);

      return;

    }

    this.loading.set(true);

    this.userSvc

      .completeOnboarding({

        first_name: this.firstName.trim(),

        last_name: this.lastName.trim(),

        country_settings: this.country,

        data_consent_accepted: true,

        marketing_cookies_accepted: this.consent.isAccepted(),

      })

      .subscribe({

        next: (profile) => {

          this.loading.set(false);

          const user = this.auth.firebaseUser();

          if (user) {

            this.auth.navigateAfterAuth(profile, user);

          }

        },

        error: (err) => {

          this.loading.set(false);

          this.error.set(err?.error?.message ?? t.onboardingSaveError);

        },

      });

  }



  declineDataCollection(): void {

    const t = this.i18n.authUi();

    this.loading.set(true);

    this.userSvc.declineOnboarding().subscribe({

      next: () => {

        this.auth.logout().subscribe({

          error: () => {

            this.loading.set(false);

            this.error.set(t.onboardingDeclineError);

          },

        });

      },

      error: () => {

        this.loading.set(false);

        this.error.set(t.onboardingDeclineError);

      },

    });

  }

}


