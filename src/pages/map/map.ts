import { Component, ElementRef, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';

import { GoogleMaps } from '../../providers/google-maps/google-maps';
import { GoogleMapsCluster } from '../../providers/google-maps-cluster/google-maps-cluster';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  mapLoaded: boolean = false;
  threatMap: any;

  constructor(public platform: Platform,
              public maps: GoogleMaps,
              public mapCluster: GoogleMapsCluster) {
  }

  ionViewWillEnter(): void {
    if(this.mapLoaded)
      google.maps.event.trigger(this.threatMap, 'resize');
  }

  ionViewDidLoad(): void {
    this.maps.init(this.mapElement.nativeElement,
                                    this.pleaseConnect.nativeElement,
                                    false).then((map) => {
      this.mapLoaded = true;
      this.threatMap = map;
      this.mapCluster.addCluster(this.threatMap);
    });
  }
}
