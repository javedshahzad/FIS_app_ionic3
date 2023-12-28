import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ViewPhotosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-photos',
  templateUrl: 'view-photos.html',
})
export class ViewPhotosPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private modal:ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewPhotosPage');
  }
  closeModal(){
    this.modal.dismiss();
  }
}
