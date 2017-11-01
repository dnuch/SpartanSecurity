import { Injectable } from '@angular/core';
import * as MarkerClusterer from 'node-js-marker-clusterer';
import { DynamoDB } from '../../providers/providers';
import 'rxjs/add/operator/map';

@Injectable()
export class GoogleMapsCluster {

  markerCluster: any;
  private threatTable: string = 'spartanSecurity-threats';

  constructor(public db: DynamoDB) {
  }

  addCluster(googleMap) {
    if(google.maps) {
      this.getThreats().then((markers) => {
        this.markerCluster = new MarkerClusterer(googleMap, markers, {imagePath: 'assets/m'});
      });
    } else {
      console.warn('Google maps needs to be loaded before adding a cluster');
    }
  }

  getThreats(): Promise<any> {
    return new Promise((resolve) => {
      this.db.getDocumentClient().scan({
        'TableName': this.threatTable,
        'IndexName': 'DateSorted',
        'ScanIndexForward': false
      }).promise().then((data) => {
        let markers = data.Items.map((item) => {
          return new google.maps.Marker({
            position: {
              lat: item.latitude,
              lng: item.longitude
            }
          })
        });
        resolve(markers);
      }).catch((err) => {
        console.log(err);
      });
    });
  }
}
