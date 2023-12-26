import { Component } from '@angular/core';
import { NavController, NavParams,ToastController, LoadingController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { InventorylistPage } from '../inventorylist/inventorylist';
import { DashboardPage } from '../dashboard/dashboard';
/**
 * Generated class for the InventoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-inventory',
  templateUrl: 'inventory.html',
})
export class InventoryPage {
  inventoryList : any;
  inventoryDetails:any;
  inventoryListall:any;
  StoreList:any;
  myprofilecount:any;
  myprofile:any;
  searchData = {"search_value": ""};
  stores_id : any;
  user: any = localStorage.getItem('userData');
  userdata : any = JSON.parse(this.user);
  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,
    public authService:RestProvider, public toastCtrl:ToastController) {
  }

  goBack(){
    this.navCtrl.setRoot(DashboardPage);
  }

  ionViewDidLoad() {
    this.myprofilecount =0;
    //this.getmyprofiledetails();
    console.log('ionViewDidLoad InventoryPage');
    this.getstores();
  }

  getstores(){
    let myTitle ='INVENTORY LIST';
    this.presentLoadingDefault(true);
    this.authService.getData({},'inventory/getInventoryItemList').then((result) => {
      this.inventoryList = result;
      this.inventoryListall = result;
      if(this.inventoryList.length > 0){
        this.presentLoadingDefault(false);
       // console.log('List ',this.inventoryList);
      }else{
        this.presentLoadingDefault(false);
        this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  SearchInventory(){
    // Your app login API web service call triggers 
    this.presentLoadingDefault(true);
      if(this.searchData.search_value){
        this.authService.postData(this.searchData,'inventory/getSourceSearchList').then((result) => {
        this.inventoryListall = result;
        if(this.inventoryListall.length == 0){
          this.presentToast("No data found.");
          this.presentLoadingDefault(false);
        }else if(this.inventoryListall.length > 0){
          this.presentLoadingDefault(false);
        }
       //   console.log('List ',this.inventoryList);
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast("Something went to wrong, please try again later");
      });
      }else if(this.searchData.search_value ==''){
        this.presentLoadingDefault(false);
      }else{
        this.presentLoadingDefault(false);
        this.inventoryListall  = this.inventoryList;
      } 
  }
  SearchInventoryById(STORE_ID:any){
      this.navCtrl.push(InventorylistPage, {'stores_id':STORE_ID}, {animate: false});
  }
  
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
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
