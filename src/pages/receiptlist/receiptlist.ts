import { Component } from '@angular/core';
import {IonicPage,NavController, NavParams,ToastController,LoadingController,ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ReceiptPage } from '../receipt/receipt';
/**
 * Generated class for the ReceiptPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-receiptlist',
  templateUrl: 'receiptlist.html',
})
export class ReceiptListPage {
createcommentsForm:FormGroup
user : any = localStorage.getItem('userData');
  buildingList: any;
  insertedValues: any;
  BUILDING:any;
  commentmodel = 'none';
  Receiptlist:any;
  ResourseList:any;
  Acknowledge_show ='none';
  type:any;
  selectedvalue:any;
  Receiptlistmodel = this.navParams.get('data');
  constructor(public navCtrl: NavController, public navParams: NavParams,private formBuilder: FormBuilder,public authService:RestProvider, public toastCtrl:ToastController,
              public loadingCtrl: LoadingController, public view: ViewController) { 
      this.user = this.user ? JSON.parse(this.user) : {}; 

      this.createcommentsForm = this.formBuilder.group({
        comments: ['', Validators.compose([Validators.required])]
      });
  }
  ionViewDidLoad() {
//console.log('Receiptlist',this.Receiptlistmodel);
this.Receiptlist = this.Receiptlistmodel[0].submited;
this.type = this.Receiptlistmodel[0].type;
this.GetAllresourse_list();
  }
  GetAllresourse_list(){
    this.presentLoadingDefault(true);
    this.authService.getData({},'Lpo/Getallresourse/'+this.user.UserInfoId+'').then((result) => {
      this.presentLoadingDefault(false);
      this.ResourseList = result[0];
     // console.log('ResourseList ',this.ResourseList);
      if(this.ResourseList.TYPE_ID === 1 && this.type == 1 || this.ResourseList.USER_INFO_ID == 2){
        this.Acknowledge_show = 'block';
      }else if(this.ResourseList.TYPE_ID === 2 && this.type == 2 || this.ResourseList.USER_INFO_ID == 2){
        this.Acknowledge_show = 'block';
      }else if(this.ResourseList.TYPE_ID === 3 && this.type ==3 || this.ResourseList.USER_INFO_ID == 2){
        this.Acknowledge_show = 'block';
      }else if(this.type ==0){
        this.Acknowledge_show = 'none';
      }
    }, (err) => {
        this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
      });
    }

  onClosecommentmodel(){
      this.commentmodel = 'none';
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }
  loading = this.loadingCtrl.create(); 
  presentLoadingDefault(show) { 
    if(!this.loading){
      this.loading = this.loadingCtrl.create(); 
    }  
    if(show){
      this.loading.present();
    }
    else{
      this.loading.dismissAll();
      this.loading =null
    }
  };

  closeModal() {
    this.view.dismiss();
  }

  Acknowledge_btn(item:any){
      this.selectedvalue = item;
      this.commentmodel ='block';
  }
  insertcommentsData(){
    this.presentLoadingDefault(true);
    let commentsForm = this.createcommentsForm.value;
    if(this.selectedvalue.STATUS == 1){
    commentsForm.status = 2;
    }else if(this.selectedvalue.STATUS == 2){
        commentsForm.status = 3;
    }else if(this.selectedvalue.STATUS == 3){
        commentsForm.status = 4;
    }
    commentsForm.ID = this.selectedvalue.ID;
    commentsForm.UserInfoId = this.user.UserInfoId;
    commentsForm.created_by= this.user.UserInfoId;
    commentsForm.modified_by= this.user.UserInfoId;
    this.authService.postData(commentsForm,'receipts/receipt_acknowledge/').then((result) => {
      this.presentLoadingDefault(false);
      this.navCtrl.setRoot(ReceiptPage);
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
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

}
