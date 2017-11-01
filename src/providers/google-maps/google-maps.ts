import { Injectable } from '@angular/core';
import { ConnectivityService } from '../connectivity-service/connectivity-service';

@Injectable()
export class GoogleMaps {

  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  mapLoaded: any;
  mapLoadedObserver: any;
  apiKey: string = 'AIzaSyCDIe2rHExtc13_3pRhXWsYTdV7TFWwF0k';

  currentThreat: any;
  displayThreat: boolean;
  constructor(public connectivityService: ConnectivityService) {
  }

  init(mapElement: any, pleaseConnect: any, coordinates: any): Promise<any> {
    if (coordinates) {
      this.displayThreat = true;
      this.currentThreat = coordinates;
    }

    this.mapElement = mapElement;
    this.pleaseConnect = pleaseConnect;
    return this.loadGoogleMaps();
  }

  loadGoogleMaps(): Promise<any> {
    return new Promise((resolve) => {
      if(typeof google == "undefined" || typeof google.maps == "undefined") {
        console.log("Google maps JavaScript needs to be loaded.");
        this.disableMap();

        if(this.connectivityService.isOnline()) {
          window['mapInit'] = () => {
            this.initMap().then((map) => {
              resolve(map);
            });
            this.enableMap();
          };

          let script = document.createElement("script");
          script.id = "googleMaps";

          if(this.apiKey) {
            script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
          } else {
            script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
          }
          document.body.appendChild(script);
        }
      } else {
        if(this.connectivityService.isOnline()) {
          this.initMap();
          this.enableMap();
        } else {
          this.disableMap();
        }
      }
      this.addConnectivityListeners();
    });
  }

  initMap(): Promise<any> {
    this.mapInitialised = true;
    return new Promise((resolve) => {
      // SJSU centered
      let latLng;
      if(this.displayThreat) {
        latLng = new google.maps.LatLng(this.currentThreat.latitude, this.currentThreat.longitude);
        this.displayThreat = false;
      } else {
        latLng = new google.maps.LatLng(37.3351874, -121.8810715);
      }

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.mapElement, mapOptions);
      resolve(this.map);
    });
  }

  disableMap(): void {
    if(this.pleaseConnect){
      this.pleaseConnect.style.display = "block";
    }
  }

  enableMap(): void {
    if(this.pleaseConnect){
      this.pleaseConnect.style.display = "none";
    }
  }

  addConnectivityListeners(): void {
    this.connectivityService.watchOnline().subscribe(() => {
      console.log("online");
      setTimeout(() => {
        if(typeof google == "undefined" || typeof google.maps == "undefined"){
          this.loadGoogleMaps();
        } else {
          if(!this.mapInitialised) {
            this.initMap();
          }
          this.enableMap();
        }
      }, 2000);
    });

    this.connectivityService.watchOffline().subscribe(() => {
      console.log("offline");
      this.disableMap();
    });
  }
}
