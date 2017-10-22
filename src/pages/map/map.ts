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

  threatMap: any;
  mapLoaded: any;

  constructor(public platform: Platform,
              public maps: GoogleMaps,
              public mapCluster: GoogleMapsCluster) {
  }

  ionViewDidEnter(): void {
    this.mapLoaded.then(() => this.mapCluster.addCluster(this.threatMap));
  }

  ionViewDidLoad(): void {
    this.mapLoaded = this.maps.init(this.mapElement.nativeElement,
                                   this.pleaseConnect.nativeElement,
                                   false).then((map) => {
      this.threatMap = map;
      this.mapCluster.addCluster(this.threatMap);
    });
  }
}
