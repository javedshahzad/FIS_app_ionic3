import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { CommentsLabelsPage } from '../commentslabels/commentslabels';
import { MyprofilePage } from '../myprofile/myprofile'

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-commentstocomments',
  templateUrl: 'commentstocomments.html',
})
export class CommentsToCommentsPage {
  CmtData = {
        MyCmt: [] as any,
        MyCmttoCmt: [] as any,
        MyDataall: [] as any
  } as any;
  myprofilecount:any;
  myprofile:any;
  searchData = { "search_value": "" };  
  user: any = localStorage.getItem('userData');
  userdata : any = JSON.parse(this.user);
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  loading = this.loadingCtrl.create();
  presentLoadingDefault(show) {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create();
    }
    if (show) {
      this.loading.present();
    }
    else {
      this.loading.dismissAll();
      this.loading = null
    }
  };

  goBack() {
    this.navCtrl.setRoot(DashboardPage);
  }

  returndetails() {
    let myTitle = 'Comments';
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId
  }
    this.presentLoadingDefault(true);
    this.authService.postData(userdata, 'comments/CommentsListSummary').then((result) => {
      this.CmtData = result;
      this.presentLoadingDefault(false);
      console.log(this.CmtData);
      console.log(this.CmtData.MyDataall);
      if(this.CmtData.MyDataall.length > 0) {
        this.presentLoadingDefault(false);
      }else{
        this.presentLoadingDefault(false);
        this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  ionViewDidLoad() {
    this.returndetails();
    this.myprofilecount =0;
    //this.getmyprofiledetails();
  }
  profile(){
    this.navCtrl.push(MyprofilePage, {}, { animate: false });
  }
  openDetailModal(type: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let flag = 'N';

    let myModalData = [{
      type: type
    }];

    if (type =='CMT' && this.CmtData.MyCmt.LABEL_COUNT > 0 ){
      flag = 'Y'
    }

    if (type =='CMTTOCMT' && this.CmtData.MyCmttoCmt.LABEL_COUNT > 0 ){
      flag = 'Y'
    }

    if(flag == 'Y') {
      let myModal: Modal = this.modal.create(CommentsLabelsPage, { data: myModalData }, myModalOptions);
      myModal.present();

      myModal.onDidDismiss(() => {
        // console.log("I have dismissed.");
        // console.log(data);
      });

      myModal.onWillDismiss(() => {
        //this.ionViewDidLoad();
        // console.log("I'm about to dismiss");
        // console.log(data);
      });
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
