import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';

/**
 * Generated class for the LpocalldetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lpocalldetails',
  templateUrl: 'lpocalldetails.html',
})
export class LpocalldetailsPage {
  callcomplientsdetails:any;
  callcomplientsdetails_length:any;
  callmaterialdetails:any;
  calldata = this.navParams.get('data');
  constructor(public navCtrl: NavController, public navParams: NavParams,public view: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LpocalldetailsPage');
    this.callcomplientsdetails = this.calldata[0].callcomplientsdetails[0];
    this.callmaterialdetails = this.calldata[0].callcomplientsdetails[1];
    if(this.callcomplientsdetails.length > 0){
      this.callcomplientsdetails_length = 1;
    }else{
      this.callcomplientsdetails_length = 0;
    }
    console.log(this.callcomplientsdetails);
  }
  closeModal() {
    this.view.dismiss();
  }

  showBtn=-1;
  isOpen=false;
  oldBtn=-1;
showUndoBtn(index){
  if(this.isOpen=false){
    this.isOpen=true;
    this.oldBtn=index;
    this.showBtn=index;
  }else {
    if(this.oldBtn == index){
      this.isOpen=false;    
      this.showBtn=-1;
      this.oldBtn=-1;
    } else {
      this.showBtn=index;
      this.oldBtn=index;
    }
  }
}

showBtn1=-1;
isOpen1=false;
oldBtn1=-1;
showUndoBtn1(index){
if(this.isOpen1=false){
  this.isOpen1=true;
  this.oldBtn1=index;
  this.showBtn1=index;
}else {
  if(this.oldBtn1 == index){
    this.isOpen1=false;    
    this.showBtn1=-1;
    this.oldBtn1=-1;
  } else {
    this.showBtn1=index;
    this.oldBtn1=index;
  }
}
}
}
