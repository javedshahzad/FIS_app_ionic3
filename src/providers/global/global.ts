import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalProvider {
  public userDetail = {} as any;
  public async load() {};
  public LPOStatus = ["lpo not yet approved","mgr approved","finance approved","Approved","coo approved","ceo approved"] as any;
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  userlocation: any;
  geoLatitude: number;
  geoLongitude: number;
  constructor(public http: HttpClient, private nativeGeocoder: NativeGeocoder) {
    console.log('Hello GlobalProvider Provider');
    this.getCurrentLocation();
  }
  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position)
      this.geoLatitude = position.coords.latitude;
      this.geoLongitude = position.coords.longitude;
      this.getGeoencoder(position.coords.latitude, position.coords.longitude);
    });

  }
  getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderReverseResult[]) => {
        console.log(result)
        this.userlocation = result[0].countryName + ', ' + result[0].administrativeArea + ', ' + result[0].subAdministrativeArea + ', ' + result[0].postalCode;
        console.log(this.userlocation);
      })
      .catch((error: any) => {
        console.log('Error getting location' + JSON.stringify(error));
      });
  }
}
