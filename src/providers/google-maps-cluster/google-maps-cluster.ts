import { Injectable } from '@angular/core';
import * as MarkerClusterer from 'node-js-marker-clusterer';
import { DynamoDB } from '../../providers/providers';
import { AlertController, Events } from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class GoogleMapsCluster {

  threatDetails: any;
  markerCluster: any;
  private threatTable: string = 'spartanSecurity-threats';

  constructor(public db: DynamoDB,
              public events: Events,
              public alertCtrl: AlertController) {
    this.events.subscribe('refreshMap', () => {
      this.markerCluster.clearMarkers();
      this.getThreats().then((markers) => {
        this.markerCluster.addMarkers(markers);
      });
    });
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
        this.threatDetails = data.Items.map((item) => {
          return {
            userId: item.userId,
            threatId: item.threatId,
            created: item.created,
            type: item.type,
            description: item.description
          }
        });

        let markers = data.Items.map((item) => {
          return new google.maps.Marker({
            position: {
              lat: item.latitude,
              lng: item.longitude
            }
          })
        });

        markers.map((marker, index) => {
          marker.addListener('click', () => {
            this.threatAlert(index);
          })
        });

        resolve(markers);
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  threatAlert(index: number): void {
    let alert = this.alertCtrl.create({
      title: this.threatDetails[index].userId,
      subTitle: new Date(this.threatDetails[index].created).toString(),
      message: this.threatDetails[index].description
    });

    alert.present();
  }
}
