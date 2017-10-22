import { Component } from '@angular/core';

import { SettingsPage } from '../settings/settings';
import { ThreatsPage } from '../threats/threats';
import { MapPage } from '../map/map';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ThreatsPage;
  tab2Root = MapPage;
  tab3Root = SettingsPage;

  constructor() {

  }
}
