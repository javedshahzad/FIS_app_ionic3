import { Component } from '@angular/core';
import { ViewController, NavParams, NavController } from 'ionic-angular';
//import { DashboardPage } from '../dashboard/dashboard';

@Component({
  template:
    `<ion-list>    
     <button ion-item (click)="SignIn()">Sign In</button>
     <button ion-item (click)="SignOut()">Sign Out</button>
     </ion-list>
    `
})

export class PopoverTaskPage {

  constructor(public view: ViewController, public navParams: NavParams,public navCtrl: NavController) {
  }

  
  SignIn(){

  }

  SignOut(){

  }
  

}
