import { Component } from '@angular/core';
import { NavController, NavParams,ToastController,LoadingController,Modal, ModalController, ModalOptions,ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
//import { CallnotificationPage } from '../callnotification/callnotification';
import { MgresclatedPage } from '../mgresclated/mgresclated'
import { CeoesclatedPage } from '../ceoesclated/ceoesclated'
import { DashboardPage } from '../dashboard/dashboard';

/**
 * Generated class for the EscalationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-escalation',
  templateUrl: 'escalation.html',
})
export class EscalationPage {
  CallinspectionList:any;
  callManagementDetails:any;
  MGR_ESCLATED_COUNT_length:any;
  CEO_ESCLATED_COUNT_length:any;
  myprofilecount:any;
  myprofile:any;
  SearchListall:any;
  searchData = { "search_value": "" };  
  user: any = localStorage.getItem('userData');
  userdata : any = JSON.parse(this.user);
  resourse: any = JSON.parse(localStorage.getItem('resourseData'));
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService:RestProvider, public toastCtrl:ToastController,private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
        this.user = this.user ? JSON.parse(this.user) : {};   
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad EscalationPage');
    this.myprofilecount =0;
    //this.getmyprofiledetails();
  }
  closeModal() {
    this.view.dismiss();
  }
  ngOnInit() {   
    console.log('ionViewDidLoad');
    this.Callinspectiondata();
    //this.getNotificationList();
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
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position:'middle'
    });
    toast.present();
  }

  goBack(){
    this.navCtrl.setRoot(DashboardPage);
  }
  
  Callinspectiondata(){
    this.presentLoadingDefault(true);
    let data ={
      Resoursename : this.resourse.EMPNAME,
      TYPE_ID : this.resourse.TYPE_ID
    }
    this.authService.postData(data,'Call_inspection/CallinspectionList/').then((result) => {
      this.presentLoadingDefault(false);
      this.CallinspectionList = result;
      this.callManagementDetails = result;
      if(this.CallinspectionList.length > 0){
        this.getength();
       // this.Closedcalldata();
        //console.log('List ',this.CallinspectionList);
      }else{
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }
  getength(){
    let MGR_ESCLATED_COUNT  = this.CallinspectionList.filter(call => call.STATUS_ID === 0 && call.TYPE_NAME == "MGR_ESCLATED_COUNT");
    let CEO_ESCLATED_COUNT  = this.CallinspectionList.filter(call => call.STATUS_ID === 0 && call.TYPE_NAME == "CEO_ESCLATED_COUNT");;
    if(MGR_ESCLATED_COUNT.length > 0){
      this.MGR_ESCLATED_COUNT_length = MGR_ESCLATED_COUNT[0].STATUS_COUNT;
    }else{
      this.MGR_ESCLATED_COUNT_length = 0;
    }
    if(CEO_ESCLATED_COUNT.length > 0){
      this.CEO_ESCLATED_COUNT_length = CEO_ESCLATED_COUNT[0].STATUS_COUNT;
    }else{
      this.CEO_ESCLATED_COUNT_length = 0;
    }
  }
  MGR_ESCLATED_COUNT_btn(){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata =[{
      inspection :1,
      searchdatavalue : {}
    }]

    const myModal: Modal = this.modal.create(MgresclatedPage, {data :mymodaldata},  myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });
  }
  CEO_ESCLATED_COUNTbtn(){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata =[{
      inspection :1,
      searchdatavalue : {}
    }]

    const myModal: Modal = this.modal.create(CeoesclatedPage, {data :mymodaldata},  myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });
  }

  SearchcallManagement(){
    
    if(this.searchData.search_value){
      
      this.presentLoadingDefault(true);
      this.authService.postData(this.searchData,'Call_inspection/getCallSearchList').then((result) => {
      this.SearchListall = result;
     //console.log(this.SearchListall);
      if(this.SearchListall.length == 0){
        this.presentToast("No data found.");
        this.presentLoadingDefault(false);
      }else if(this.SearchListall.length > 0){
        if(this.SearchListall[0].MGR_ESCLATED_COUNT > 0){
          this.presentLoadingDefault(false);
          const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
          };
      
          let mymodaldata =[{
            inspection :1,
            searchdatavalue : this.SearchListall
          }]
      
          const myModal: Modal = this.modal.create(MgresclatedPage, {data :mymodaldata},  myModalOptions);
      
          myModal.present();
      
          myModal.onDidDismiss(() => {
            console.log("I have dismissed.");
          });
      
          myModal.onWillDismiss(() => {
            console.log("I'm about to dismiss");
          });
        }else if(this.SearchListall[0].CEO_ESCLATED_COUNT > 0){
          this.presentLoadingDefault(false);
          const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
          };
      
          let mymodaldata =[{
            inspection : 1,
            searchdatavalue : this.SearchListall
          }]
      
          const myModal: Modal = this.modal.create(CeoesclatedPage, {data :mymodaldata},  myModalOptions);
      
          myModal.present();
      
          myModal.onDidDismiss(() => {
            console.log("I have dismissed.");
          });
      
          myModal.onWillDismiss(() => {
            console.log("I'm about to dismiss");
          });
        }
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
    }else if(this.searchData.search_value ==''){
      this.presentLoadingDefault(false);
    }else{
      this.presentLoadingDefault(false);
      this.SearchListall;
    } 
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
