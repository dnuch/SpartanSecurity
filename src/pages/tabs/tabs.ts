import { Component } from '@angular/core';

import { SettingsPage } from '../settings/settings';
import { ThreatsPage } from '../threats/threats';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ThreatsPage;
  tab2Root = SettingsPage;

  constructor() {

  }
}
