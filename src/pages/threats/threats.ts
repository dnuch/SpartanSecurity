import { Component } from '@angular/core';
import { Events, NavController, ModalController } from 'ionic-angular';

import { ThreatCreatePage } from '../threat-create/threat-create';
import { MapModal } from '../map-modal/map-modal';

import { DynamoDB, User } from '../../providers/providers';

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
              public events: Events) {
    this.refreshThreats();
  }

  refreshData(refresher) {
    this.refresher = refresher;
    this.refreshThreats();
    console.log(AWS.config.credentials);
  }

  refreshThreats() {
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
      if(this.refresher) {
        this.refresher.complete();
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  generateId() {
    let len = 16;
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charLength = chars.length;
    let result = "";
    let randoms = window.crypto.getRandomValues(new Uint32Array(len));
    for(let i = 0; i < len; i++) {
      result += chars[randoms[i] % charLength];
    }
    return result.toLowerCase();
  }

  addThreat() {
    let id = this.generateId();
    let addModal = this.modalCtrl.create(ThreatCreatePage, { 'id': id });
    addModal.onDidDismiss(item => {
      if(item) {
        item.userId = AWS.config.credentials.identityId;
        item.created = (new Date().getTime());
        this.db.getDocumentClient().put({
          'TableName': this.threatTable,
          'Item': item,
          'ConditionExpression': 'attribute_not_exists(id)'
        }).promise().then(() => {
          this.refreshThreats();
          this.events.publish('refreshMap');
        }).catch((err, data) => {
          console.log(err, data);
        });
      }
    });
    addModal.present();
  }

  deleteThreat(threat, index) {
    this.db.getDocumentClient().delete({
      'TableName': this.threatTable,
      'Key': {
        'userId': AWS.config.credentials.identityId,
        'threatId': threat.threatId
      }
    }).promise().then(() => {
      this.events.publish('refreshMap');
      this.items.splice(index, 1);
    }).catch((err) => {
      console.log('there was an error', err);
    });
  }

  getDate(itemDate) {
    return new Date(itemDate).toString();
  }

  showMap(item) {
    let threatCoordinates = {
      'latitude': item.latitude,
      'longitude': item.longitude
    };
    this.navCtrl.push(MapModal, {
      threatCoord: threatCoordinates
    });
  }
}
