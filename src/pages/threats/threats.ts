import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';
import { ThreatCreatePage } from '../threat-create/threat-create';

import { DynamoDB, User } from '../../providers/providers';
import { MapModal } from '../map-modal/map-modal';
import { GoogleMapsCluster } from '../../providers/google-maps-cluster/google-maps-cluster';

declare let AWS: any;

@Component({
  selector: 'page-threats',
  templateUrl: 'threats.html'
})
export class ThreatsPage {

  public items: any;
  public refresher: any;
  private threatTable: string = 'spartanSecurity-threats';

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public user: User,
              public db: DynamoDB,
              public googleMapsCluster: GoogleMapsCluster) {
    this.refreshTasks();
  }

  refreshData(refresher) {
    this.refresher = refresher;
    this.refreshTasks();
  }

  refreshTasks() {
    this.db.getDocumentClient().query({
      'TableName': this.threatTable,
      'IndexName': 'DateSorted',
      'KeyConditionExpression': "#userId = :userId",
      'ExpressionAttributeNames': {
        '#userId': 'userId',
      },
      'ExpressionAttributeValues': {
        ':userId': AWS.config.credentials.identityId
      },
      'ScanIndexForward': false
    }).promise().then((data) => {
      this.items = data.Items;
      this.googleMapsCluster.locations = this.items.map((item) => {
        return {
          lat: item.latitude,
          lng: item.longitude
        };
      });
      if (this.refresher) {
        this.refresher.complete();
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  generateId() {
    var len = 16;
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charLength = chars.length;
    var result = "";
    let randoms = window.crypto.getRandomValues(new Uint32Array(len));
    for(var i = 0; i < len; i++) {
      result += chars[randoms[i] % charLength];
    }
    return result.toLowerCase();
  }

  addThreat() {
    let id = this.generateId();
    let addModal = this.modalCtrl.create(ThreatCreatePage, { 'id': id });
    addModal.onDidDismiss(item => {
      if (item) {
        item.userId = AWS.config.credentials.identityId;
        item.created = (new Date().getTime());
        this.db.getDocumentClient().put({
          'TableName': this.threatTable,
          'Item': item,
          'ConditionExpression': 'attribute_not_exists(id)'
        }, (err, data) => {
          if (err) { console.log(err); }
          this.refreshTasks();
        });
      }
    })
    addModal.present();
  }

  deleteThreat(threat, index) {
    this.db.getDocumentClient().delete({
      'TableName': this.threatTable,
      'Key': {
        'userId': AWS.config.credentials.identityId,
        'threatId': threat.threatId
      }
    }).promise().then((data) => {
      this.items.splice(index, 1);
    }).catch((err) => {
      console.log('there was an error', err);
    });
  }

  getDate(itemDate) {
    return new Date(itemDate).toString();
  }

  showMap(item) {
    let threatCoordinates = [
      {
      'latitude' : item.latitude,
      'longitude' : item.longitude
      }
    ];
    this.navCtrl.push(MapModal, {
      threatCoord: threatCoordinates[0]
    });
  }
}
