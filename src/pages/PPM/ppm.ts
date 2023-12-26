import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { DashboardPage } from '../dashboard/dashboard';



@Component({
  selector: 'page-ppm',
  templateUrl: 'ppm.html',
})
export class PpmPageModule {
  buildingList: any;
  myprofilecount: any;
  myprofile: any;
  searchData = { "search_value": "" };
  user: any = localStorage.getItem('userData');
  userdata: any = JSON.parse(this.user);
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad lpoPage');
    this.myprofilecount = 0;
    this.getAllBuilding();
  }
  getAllBuilding() {
    // Your app login API web service call triggers 
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'ppm/GetAllBuilding').then((result) => {
      this.presentLoadingDefault(false);
      this.buildingList = result;
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
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

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  goBack() {
    this.navCtrl.setRoot(DashboardPage);
  }

  // SearchcallManagement(){
  //   let building = this.searchData.search_value
  // }
 
  building_btn(BUILDING_ID, BUILDING_NAME) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = {
      BUILDING_ID: BUILDING_ID,
      BUILDING_NAME: BUILDING_NAME
    }

    const myModal: Modal = this.modal.create('PpmscheduleoptionModule', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      //  console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      //  console.log("I'm about to dismiss");
    });

  }

  getmyprofiledetails() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'account/Getmyprofileupdate/' + this.userdata.UserInfoId + '').then((result) => {
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

  getImage(row_no, item: any) {

    let objFile = this.myprofile.find(o => o.ID === row_no);
    let bytes = objFile.FILE_CONTENT.data;
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];

    if (extn == "jpg" || extn == "jpeg" || extn == "png") {
      if (this.myprofile.length > 0) {
        return `data:image/${extn};base64,${this.encode(bytes)}`;
      } else {
        return `./assets/imgs/no-found-photo.png`
      }
    }
  }

  encode(input) {
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