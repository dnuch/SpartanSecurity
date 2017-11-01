import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ConfirmPage } from '../pages/confirm/confirm';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { TabsPage } from '../pages/tabs/tabs';
import { ThreatsPage } from '../pages/threats/threats';
import { ThreatCreatePage } from '../pages/threat-create/threat-create';
import { MapPage } from '../pages/map/map';
import { MapModal } from '../pages/map-modal/map-modal';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';

import { User } from '../providers/user';
import { Cognito } from '../providers/aws.cognito';
import { DynamoDB } from '../providers/aws.dynamodb';

import { ConnectivityService } from '../providers/connectivity-service/connectivity-service';
import { Network } from '@ionic-native/network';
import { GoogleMaps } from '../providers/google-maps/google-maps';
import { GoogleMapsCluster } from '../providers/google-maps-cluster/google-maps-cluster';
import { Geolocation } from '@ionic-native/geolocation';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    ConfirmPage,
    SettingsPage,
    AboutPage,
    AccountPage,
    TabsPage,
    ThreatsPage,
    ThreatCreatePage,
    MapPage,
    MapModal
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    ConfirmPage,
    SettingsPage,
    AboutPage,
    AccountPage,
    TabsPage,
    ThreatsPage,
    ThreatCreatePage,
    MapPage,
    MapModal
  ],
  providers: [
    Camera,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    User,
    Cognito,
    DynamoDB,
    ConnectivityService,
    Network,
    Geolocation,
    GoogleMaps,
    GoogleMapsCluster
  ]
})
export class AppModule {}

declare let AWS;
AWS.config.customUserAgent = AWS.config.customUserAgent + ' Ionic';
