  ### Spartan Security 
  
  This project is created for CMPE189(Internet Of Things) which leverages AWS Mobile Hub services to power the app. 

<p align="center">
  <img src="https://github.com/dnuch/SpartanSecurity/blob/master/src/assets/SpartanSecurity.gif" width="360" height="640" />
</p>

The following services are utilized:

<ul>
  <li>Cognito (Authentication)</li>
  <li>DynamoDB (Data Storage)</li>
  <li>S3 (File Storage)</li>
  <li>Google Maps API</li>
</ul>

 ### Running the app

```bash
ionic serve
```

To run the app on device, first add a platform, and then run it:

```bash
ionic cordova platform add ios
ionic cordova run ios
```

Or open the platform-specific project in the relevant IDE:

```bash
open platforms/ios/MyApp.xcodeproj
```

### Components in Progress:

<ul>
  <li>AWS user groups precedence</li>
</ul>
