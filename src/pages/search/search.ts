import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController, ModalOptions, ToastController, LoadingController, Events } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { AssetpreventivemaintancePage } from '../assetpreventivemaintance/assetpreventivemaintance';
import { DashboardPage } from '../dashboard/dashboard';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  assetDetailsList: any;
  assetDetails: any;
  myprofilecount: any;
  myprofile: any;
  user: any = localStorage.getItem('userData');
  userdata: any = JSON.parse(this.user);
  searchData = { "search_value": "" };
  assetDetailsPrevMaintance:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events,
    public authService: RestProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    private modal: ModalController,
  ) {
  }

  //loading = this.loadingCtrl.create();

  SearchAssetDetail() {

    if (this.searchData.search_value) {
      this.presentLoadingDefault(true);
      this.authService.postData(this.searchData, 'asset_details/getAssetDetailsSearchList').then((result) => {
        this.presentLoadingDefault(false);
        this.assetDetailsList = result;
        if (this.assetDetailsList.length == 0)
          this.presentToast("No data found for this Barcode no");
      }, (err) => {
        this.presentToast("Something went to wrong, please try again later");
      });

    } else {
      this.presentToast("Enter the Barcode number");
    }

  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle',
      cssClass: 'toast-style'
    });
    toast.present();
  }

  goBack() {
    this.navCtrl.setRoot(DashboardPage);
  }

  ionViewDidLoad() {
    this.events.publish('userloggedin');
    this.myprofilecount = 0;
  }

  getAssetDetailPreventiveMaintancePage(assetDetailId) {
    debugger;
    this.assetDetails = assetDetailId
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'asset_details/getAssetDetailPrevMainById/' + assetDetailId).then((result) => {
      this.presentLoadingDefault(false);
      this.assetDetailsPrevMaintance = result;
      //this.navCtrl.setRoot(AssetpreventivemaintancePage, { 'assetDetail': this.assetDetailsPrevMaintance });
      this.getOpenAssetPreventMaintancePage();
    }, (err) => {
      this.presentToast("Something went to wrong, please try again later");
      this.presentLoadingDefault(false);
    });

  }

  getOpenAssetPreventMaintancePage(){

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    // let mymodaldata = [{
    //   inspection: this.assetDetailsPrevMaintance
    // }]

    const myModal: Modal = this.modal.create(AssetpreventivemaintancePage, { assetDetail: this.assetDetailsPrevMaintance }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });

  }

  // presentLoadingDefault(show) {
  //   if (show)
  //     this.loading.present();
  //   else
  //     this.loading.dismiss();
  // };

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

  getmyprofiledetails() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'account/Getmyprofileupdate/' + this.userdata.UserInfoId + '').then((result) => {
      this.myprofile = result;
      this.presentLoadingDefault(false);
      if (this.myprofile.length > 0) {
        this.myprofilecount = 1;
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
      chr2 = i < input.length ? input[i++] : Number.NaN; 
      chr3 = i < input.length ? input[i++] : Number.NaN; 

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
