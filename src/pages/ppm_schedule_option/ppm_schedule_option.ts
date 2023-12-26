import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { DashboardPage } from '../dashboard/dashboard';
@IonicPage()
@Component({
  selector: 'page-ppmscheduleoption',
  templateUrl: 'ppm_schedule_option.html',
})
export class PpmscheduleoptionModule {
  Scheduledata: any = this.navParams.get('data');
  lpoDetails: any;
  lpoDetailsdata: any;
  Lpomanament: any;
  
  Schedule: any = {
    SCHEDULE_1: 0,
    SCHEDULE_2: 0,
    SCHEDULE_3: 0,
    SCHEDULE_4: 0
  };

  searchData = { "search_value": "" };
  user: any = localStorage.getItem('userData');
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
  }
  ionViewDidLoad() {
    //   console.log('ionViewDidLoad lpoPage');
    this.GetScheduleList();
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

  closeModal() {
    this.view.dismiss();
  }

  goBack() {
    this.navCtrl.setRoot(DashboardPage);
  }
 
  GetScheduleList() {
    this.presentLoadingDefault(true);
    let BUILDING_ID = this.Scheduledata.BUILDING_ID;
    this.authService.getData({}, 'ppm/getScheduleCount/' + BUILDING_ID).then((result) => {
      //  console.log(result)
      this.Schedule = result;
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }
 
  Schedule_btn(ScheduleNo) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    this.Scheduledata.ScheduleNo = ScheduleNo;
    let mymodaldata = this.Scheduledata;
    const myModal: Modal = this.modal.create('ppmoptions', { data: mymodaldata }, myModalOptions);
    myModal.present();
    myModal.onDidDismiss(() => {
      //   console.log("I have dismissed.");
    });
    myModal.onWillDismiss(() => {
      //  console.log("I'm about to dismiss");
    });

  }

  SearchManagement() {
    let call_id = this.searchData.search_value;
    if (call_id != '') {
      this.Lpomanament = this.lpoDetails.filter(call => call.VENDOR_NAME.includes(call_id));
    } else {
      this.Lpomanament = this.lpoDetails;
    }
  }
}