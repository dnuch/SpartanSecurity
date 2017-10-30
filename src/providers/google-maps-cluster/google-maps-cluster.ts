import { Injectable } from '@angular/core';
import * as MarkerClusterer from 'node-js-marker-clusterer';
import 'rxjs/add/operator/map';

@Injectable()
export class GoogleMapsCluster {

  markerCluster: any;
  locations: any;
  markers: any;

  constructor() {
    console.log('GoogleMapsCluster Provider init');
  }

  addCluster(map) {
    if(google.maps){
      //Convert locations into array of markers
      this.markers = this.locations.map((location) => {
        return new google.maps.Marker({
          position: location
        });
      });
      this.markerCluster = new MarkerClusterer(map, this.markers, {imagePath: 'assets/m'});
    } else {
      console.warn('Google maps needs to be loaded before adding a cluster');
    }
  }

  setLocation(items) {
    this.locations = items.map((item) => {
      return {
        lat: item.latitude,
        lng: item.longitude
      };
    });
  }
}
