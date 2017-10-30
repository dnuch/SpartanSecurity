import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavParams, Platform } from 'ionic-angular';
import { GoogleMaps } from '../../providers/google-maps/google-maps';
@Component({
  selector: 'map-modal',
  templateUrl: 'map-modal.html'
})
export class MapModal {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  currentThreat: any;

  constructor(public navParams: NavParams,
              public platform: Platform,
              public googleMap: GoogleMaps) {
  }

  ionViewWillEnter(): void {
    this.currentThreat = this.navParams.get('threatCoord');
    let marker = new google.maps.Marker({
      position: {
        lat: this.currentThreat.latitude,
        lng: this.currentThreat.longitude
      },
      map: this.googleMap.map,
      title: 'some text!'
    });
  }

  ionViewDidLoad(): void {
    this.currentThreat = this.navParams.get('threatCoord');
    this.googleMap.init(this.mapElement.nativeElement,
                        this.pleaseConnect.nativeElement,
                        this.currentThreat);
  }
}
