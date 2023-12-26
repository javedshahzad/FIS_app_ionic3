import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
  constructor(public http: HttpClient) {
    console.log('Hello GlobalProvider Provider');
  }

}
