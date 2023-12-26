import { Component } from '@angular/core';
import { NavController, NavParams,ToastController,LoadingController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { DashboardPage } from '../dashboard/dashboard';
import { InventoryItemPage } from '../inventoryItem/inventoryItem';

/**
 * Generated class for the InventorylistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-inventorylist',
  templateUrl: 'inventorylist.html',
})
export class InventorylistPage {
  stores_id = this.navParams.get('stores_id');
  inventoryitemList : any;
  myModalData: any;
  category_id: any;
  s_id: any;
  searchData = {"search_value": ""};
  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,
    public authService:RestProvider, public toastCtrl:ToastController) {
  }

  ionViewDidLoad() {
    this.presentLoadingDefault(true);
   // console.log(this.stores_id);
      this.authService.getData({},'inventory/inventorybystoresid/'+this.stores_id).then((result) => {
      //  console.log(result);
      this.inventoryitemList = result;
      if(this.inventoryitemList.length > 0){
        this.presentLoadingDefault(false);
      }else{
        this.presentLoadingDefault(false);
        this.presentToast(`No data found`);
      }
      }, (err) => {
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  SearchInventory(){
    // Your app login API web service call triggers 
    this.presentLoadingDefault(true);
      if(this.searchData.search_value){
        this.authService.postData(this.searchData,'inventory/getInventorySearchList').then((result) => {
        this.inventoryitemList = result;
        if(this.inventoryitemList.length == 0){
          this.presentToast("No data found.");
          this.presentLoadingDefault(false);
        }else{
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
        this.inventoryitemList  = this.inventoryitemList;
      } 
  }

  goBack(){
    this.navCtrl.setRoot(DashboardPage);
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

  SearchimagesById(category_id :any,stores_id :any){
    this.myModalData = [
      this.category_id = category_id,
      this.s_id = stores_id
    ]
    this.navCtrl.push(InventoryItemPage, {'category_id':this.myModalData}, {animate: false});
  }

}
