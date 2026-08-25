import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderProfileMenuComponent } from '../header-profile-menu/header-profile-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [HeaderProfileMenuComponent],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent {}
