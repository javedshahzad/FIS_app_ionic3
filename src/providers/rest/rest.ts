// import { Http, Headers, RequestOptions, Response } from  '@angular/http';
import { HTTP } from '@ionic-native/http';
import { Injectable } from '@angular/core';

import { Network } from '@ionic-native/network';
import 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
/*
  Generated class for the RestProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class RestProvider {
hostname = 'http://flexion.fakhruddinproperties.com:8882'
//hostname = 'http://localhost:8882';
 apiUrl = this.hostname+'/api/'
  constructor(public http: HTTP, private network: Network) {
    this.http.setSSLCertMode("nocheck")
    this.http.setDataSerializer('json');
    this.http.setHeader("*","Accept", "application/json");
    this.http.setHeader("*","Content-Type", "application/json");  
    console.log('Hello RestProvider Provider');
  }  
  public postData(json?: any,sufix?:string) {  
   
    return new Promise((resolve, reject) =>{
      this.http.setRequestTimeout(180);
      console.log(this.apiUrl+sufix)
      this.http.post(this.apiUrl+sufix, json,{}).then((resp) => {
      let responseData =JSON.parse(resp.data);
        resolve(responseData);
      },(err) => {
      //  console.log(err);
        reject(err.error);
      });
    });
  }
  public getData(json,sufix) {
    
   // this.http.setHeader("*","Content-Type", "application/json"); 
  return new Promise((resolve, reject) =>{
    console.log(this.apiUrl+sufix)
     this.http.get(this.apiUrl+sufix, json, {}).then((resp) => {
      let responseData =JSON.parse(resp.data);
      resolve(responseData);
    },(err) => {
      console.log(err);
      reject(err.error);
    });
  });
}

public getDataWithTimeout(json,sufix) {
  
 // this.http.setHeader("*","Content-Type", "application/json"); 
  return new Promise((resolve, reject) =>{
     this.http.setRequestTimeout(180000);
     console.log(this.apiUrl+sufix)
      this.http.get(this.apiUrl+sufix, json, {}).then((resp) => {
      let responseData =JSON.parse(resp.data);
      resolve(responseData);
    },(err) => {
      console.log(err);
      reject(err.error);
    });
  });
} 
  public loginPostData(json?:object,sufix?:any) {   
    return new Promise((resolve, reject) =>{
      console.log(this.apiUrl+sufix)
      this.http.post(this.apiUrl+sufix, json, {}).then((resp) => {
        let responseData =JSON.parse(resp.data);
        resolve(responseData);
      },(err) => {
        console.log(err);
        reject(err.error);
      });
    });
  }

  public postFormData(json?:any,sufix?:any) {   
    //this.http.setHeader("*","Content-Type",'application/x-www-form-urlencoded'); 
      return new Promise((resolve, reject) =>{
        console.log(this.apiUrl+sufix)
      this.http.post(this.apiUrl+sufix, json , {}).then(data => {
        resolve(data);
      },(err) => {
        console.log(err);
        reject(err);
      })
    });
  }

  public dashboardPostData(json?: object, sufix?: any) {
    return new Promise((resolve, reject) => {
      if(this.network.type === 'none') {
        reject('Poor Internet connection.');
      } else {
        this.http.setRequestTimeout(180);
        this.http.post(this.apiUrl + sufix, json, {}).then((resp) => {
          let responseData = JSON.parse(resp.data);
          resolve(responseData);
        }, (err) => {
          let error = this.handleError(err);
          reject(error);
        });        
      }
    });
  }


  private handleError (error: any) {
    
    console.log('Get error => ',error);
    let headers = error.headers;
    let errMsg: string = '';
    let err = error.error || error;
      errMsg = err || 'Poor Internet connection.';
      error.status = error.status || 0
      if( error.status >= 400 ) {
        if( error.status == 500 ){
          errMsg = err;
        } else {
          error = JSON.parse(err);
          errMsg = error.error;
        }
      } else {
        if(headers == ''){
          errMsg = 'Poor Internet connection.';
        }else{
          errMsg = err.message ? err.message : err.toString();
        }
        console.log(errMsg);
      }
    return 'Poor Internet connection.';
  }

}
