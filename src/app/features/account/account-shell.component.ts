import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-account-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './account-shell.component.html',
  styleUrls: ['./account-shell.component.scss', './account.component.scss'],
})
export class AccountShellComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authSvc = inject(AuthService);
  readonly i18n = inject(I18nService);

  ngOnInit(): void {
    const billingResult = this.route.snapshot.queryParamMap.get('billing');
    if (billingResult === 'success' || billingResult === 'cancel') {
      void this.router.navigate(['/app/pricing'], {
        queryParams: { billing: billingResult },
        replaceUrl: true,
      });
    }
  }

  logout(): void {
    this.authSvc.logout().subscribe();
  }
}
