import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { ActivatedRoute, RouterLink } from '@angular/router';

import type { UserProfile } from '@interfaces';

import { AuthService } from '../../core/services/auth.service';

import { I18nService } from '../../core/services/i18n.service';

import { UserService } from '../../core/services/user.service';

import { buildCountrySelectOptions } from '../../core/utils/country-select-options';

import { splitDisplayName } from '../../core/utils/oauth-display-name';

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

  readonly i18n = inject(I18nService);



  email = '';

  firstName = '';

  lastName = '';

  country = 'AT';

  dataConsent = false;

  marketingCookies: boolean | null = null;



  loading = signal(false);

  error = signal('');



  readonly countryOptions = computed(() => buildCountrySelectOptions(this.i18n.lang()));



  ngOnInit(): void {

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

  }



  acceptMarketingCookies(): void {

    this.marketingCookies = true;

  }



  declineMarketingCookies(): void {

    this.marketingCookies = false;

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

        marketing_cookies_accepted: this.marketingCookies === true,

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


