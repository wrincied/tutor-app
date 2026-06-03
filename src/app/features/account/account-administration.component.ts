import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { ActivityLogPanelComponent } from '../../shared/activity-log-panel/activity-log-panel.component';

@Component({
  selector: 'app-account-administration',
  standalone: true,
  imports: [ActivityLogPanelComponent],
  templateUrl: './account-administration.component.html',
  styleUrls: ['./account-page-host.scss', './account.component.scss'],
})
export class AccountAdministrationComponent {
  readonly i18n = inject(I18nService);
}
