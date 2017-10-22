import { Component } from '@angular/core';
import { NavParams, ViewController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-threats-create',
  templateUrl: 'threat-create.html'
})
export class ThreatCreatePage {

  isReadyToSave: boolean;
  item: any;
  threatDescription: String;
  isAndroid: boolean;

  threatOptions: Array<{ type: String , description: String }>;

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController,
              public platform: Platform,
              public geolocation: Geolocation) {
    this.isAndroid = platform.is('android');

    this.threatOptions = [
      {
        type: "Violence",
        description: "Any hostile or violent act, gesture and/or comment that harms or has the intent to harm another individual."
      },
      {
        type: "Assault",
        description: "Any hostile physical act by applying intentional force, such as striking, hitting, pushing or pulling, with or without a weapon by an individual, or individuals, against another person, with the intent to wound, maim or disfigure any person; or to endanger the life of any person; or to cause hurt or injury to a person that interferes with the health, safety or comfort of that person"
      },
      {
        type: "Sexual Assault",
        description: "Sexual Assault is an assault within any one of the assault definitions which is committed in circumstances of a sexual nature such that the sexual integrity of the victim is violated"
      },
      {
        type: "Harassment",
        description: "Any act made by an individual that causes another individual to fear for their safety or the safety of anyone known to them"
      }
    ];

    this.threatDescription = this.threatOptions[0].description;

    this.item = {
      'threatId': navParams.get('id'),
      'type': this.threatOptions[0].type
    };

    this.isReadyToSave = true;
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  done() {
    this.geolocation.getCurrentPosition().then((geoposition) => {
      this.item.latitude = geoposition.coords.latitude;
      this.item.longitude = geoposition.coords.longitude;
    });
    this.viewCtrl.dismiss(this.item);
  }
}
