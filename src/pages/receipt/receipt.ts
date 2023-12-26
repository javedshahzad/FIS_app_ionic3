import { Component } from '@angular/core';
import { NavController, NavParams,ToastController,LoadingController,Modal, ModalController, ModalOptions,ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup} from '@angular/forms';
import { DashboardPage } from '../dashboard/dashboard';
/**
 * Generated class for the ReceiptPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-receipt',
  templateUrl: 'receipt.html',
})
export class ReceiptPage {
receiptForm:FormGroup;
receiptList:any;
submited_count:any;
Collected_On_Site_count:any;
Received_from_site_count:any;
All_Receipts_count:any;
All_Security_Cheque:any;
myprofilecount:any;
myprofile:any;
searchData = { "search_value": "" };  
user: any = localStorage.getItem('userData');
userdata : any = JSON.parse(this.user);
  buildingList: any;
  insertedValues: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private modal: ModalController,
              public authService:RestProvider, public toastCtrl:ToastController,
              public loadingCtrl: LoadingController, public view: ViewController) { 
      this.user = this.user ? JSON.parse(this.user) : {};  
  }
  ionViewDidLoad() {
   this.getreceipt();
   this.myprofilecount =0;
  // this.getmyprofiledetails();
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

  goBack(){
    this.navCtrl.setRoot(DashboardPage);
  }

  getreceipt(){
    this.presentLoadingDefault(true);
    this.authService.getData({},'receipts/getreceiptsList').then((result) => {
      this.receiptList = result;
      if(this.receiptList.length > 0){
        this. getength();
        this.presentLoadingDefault(false);
       // console.log('List ',this.receiptList);
      }else{
        this.presentLoadingDefault(false);
      }
}, (err) => {
  this.presentLoadingDefault(false);
  this.presentToast("Something went to wrong, please try again later");
});
  }
  getength(){
   this.submited_count =  this.receiptList.filter(call => call.STATUS === 1);
   this.Collected_On_Site_count =  this.receiptList.filter(call => call.STATUS === 2);
   this.Received_from_site_count =  this.receiptList.filter(call => call.STATUS === 3);
   this.All_Receipts_count =  this.receiptList.filter(call => call.IS_SECURITY_CHQ === 0);
   this.All_Security_Cheque =  this.receiptList.filter(call => call.IS_SECURITY_CHQ === 1);
  }

  opencreateModal(){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('ReceiptcreatePage',  myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
      console.log("I'm about to dismiss");
    });

  }

  Collected_On_Site_btn(){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata =[{
          submited : this.receiptList.filter(call => call.STATUS === 2),
          type:2
    }]

    const myModal: Modal = this.modal.create('ReceiptListPage', {data :mymodaldata}, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
      console.log("I'm about to dismiss");
    });

  }

  Received_from_site_btn(){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata =[{
          submited : this.receiptList.filter(call => call.STATUS === 3),
          type:3
    }]

    const myModal: Modal = this.modal.create('ReceiptListPage', {data :mymodaldata}, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
      console.log("I'm about to dismiss");
    });

  }

  submited_btn(){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata =[{
          submited : this.receiptList.filter(call => call.STATUS === 1),
          type:1
    }]

    const myModal: Modal = this.modal.create('ReceiptListPage', {data :mymodaldata}, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
      console.log("I'm about to dismiss");
    });

  }

  All_Receipts_btn(){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata =[{
        submited : this.receiptList.filter(call => call.IS_SECURITY_CHQ === 0),
        type:0
    }]

    const myModal: Modal = this.modal.create('ReceiptListPage', {data :mymodaldata}, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
      console.log("I'm about to dismiss");
    });

  }

  Security_Cheque_btn(){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata =[{
        submited : this.receiptList.filter(call => call.IS_SECURITY_CHQ === 1),
        type:0
    }]

    const myModal: Modal = this.modal.create('ReceiptListPage', {data :mymodaldata}, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
      console.log("I'm about to dismiss");
    });

  }

  getmyprofiledetails(){
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'account/Getmyprofileupdate/'+this.userdata.UserInfoId+'').then((result) => {
      this.myprofile = result;
      //console.log('Profile',this.myprofile);
      this.presentLoadingDefault(false);
      if (this.myprofile.length > 0) {
        this.myprofilecount = 1;
      } else {
        //this.presentToast("No data found.");
      }
    }, (err) => {
      this.presentToast("Something went to wrong, please try again later");
    });
  }
  getImage(row_no,item:any){

    let objFile = this.myprofile.find(o => o.ID === row_no);
    let bytes = objFile.FILE_CONTENT.data;
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];
  
  if (extn == "jpg" || extn =="jpeg" || extn =="png") {
    if(this.myprofile.length > 0){
      return `data:image/${extn};base64,${this.encode(bytes)}`;
    }else{
      return `./assets/imgs/no-found-photo.png`
    }
  } 
}

encode (input) {
  var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  var i = 0;

  while (i < input.length) {
      chr1 = input[i++];
      chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
      chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
          enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
          enc4 = 64;
      }
      output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                keyStr.charAt(enc3) + keyStr.charAt(enc4);
  }
  return output;
}
}
