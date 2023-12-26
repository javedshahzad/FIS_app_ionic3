import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';


@IonicPage()

@Component({
  selector: 'page-ppmoptions',
  templateUrl: 'ppm_options.html',
})

export class ppmoptions {
  Scheduledata = this.navParams.get('data');
  calinspectioncommentsForm: FormGroup;
  ScheduleList: any;
  Pending_length: any;
  Processsing_length: any;
  Finished_length: any;
  SchedulePendingList: any;
  PPMScheduleList: any;
  BUILDING_ID: any;
  user: any = localStorage.getItem('userData');
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public authService: RestProvider, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public view: ViewController, private modal: ModalController,) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.calinspectioncommentsForm = this.formBuilder.group({
      comments_show: ['', Validators.compose([Validators.required])],
      comments: ['', Validators.compose([Validators.required])],
      ITEM_ID: ['', Validators.compose([Validators.required])],
      TASK_ID: ['', Validators.compose([Validators.required])]
    });
  }

  showBtn = -1;
  isOpen = false;
  oldBtn = -1;
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

  ngOnInit() {
    // console.log('ppm scedule',this.Scheduledata);
    this.BUILDING_ID = this.Scheduledata.BUILDING_ID;
    this.GetScheduleList(this.Scheduledata.ScheduleNo);
  }

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


  showUndoBtn(index) {
    if (this.isOpen = false) {
      this.isOpen = true;
      this.oldBtn = index;
      this.showBtn = index;
    } else {
      if (this.oldBtn == index) {
        this.isOpen = false;
        this.showBtn = -1;
        this.oldBtn = -1;
      } else {
        this.showBtn = index;
        this.oldBtn = index;
      }
    }
  }

  GetScheduleList(ScheduleNo) {
    let url;
    this.BUILDING_ID = this.BUILDING_ID ? this.BUILDING_ID : '0';
    if (ScheduleNo == 1) {
      url = 'ppm/Schedule1janmarch/' + this.BUILDING_ID;
    } else if (ScheduleNo == 2) {
      url = 'ppm/SCHEDULE_JUN/' + this.BUILDING_ID;
    } else if (ScheduleNo == 3) {
      url = 'ppm/SCHEDULE_SEP/' + this.BUILDING_ID;
    } else if (ScheduleNo == 4) {
      url = 'ppm/SCHEDULE_DEC/' + this.BUILDING_ID;
    }
    this.presentLoadingDefault(true);
    this.authService.getData({}, url).then((result) => {
      this.ScheduleList = result;
      this.SchedulePendingList = this.ScheduleList;
      this.PPMScheduleList = this.ScheduleList;
      this.presentLoadingDefault(false);
      if (this.ScheduleList.length > 0) {
        this.getCount();
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  GetSchedulePendingList(SCHEDULE_NO) {
    this.authService.postData({ SCHEDULE_NO: SCHEDULE_NO, BUILDING_ID: this.BUILDING_ID }, 'ppm/get_schedule_pending_list/').then((result) => {
      this.SchedulePendingList = result;
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  getCount() {
    this.Pending_length = this.ScheduleList.filter(call => call.STATUS === 0);
    this.Processsing_length = this.ScheduleList.filter(call => call.STATUS === -1);
    this.Finished_length = this.ScheduleList.filter(call => call.STATUS === 1);
  };

  search_btn() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    this.Scheduledata.PPMScheduleList = this.PPMScheduleList
    const myModal: Modal = this.modal.create('PpmAdvanceSearchPage', { data: this.Scheduledata }, myModalOptions);
    myModal.present();
    myModal.onDidDismiss(() => {
      // console.log("I have dismissed.");
    });
    myModal.onWillDismiss(() => {
      this.ngOnInit();
    });
  }
 
  options_btn(option) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    if (option == -1) {
      this.Scheduledata.ScheduleList = this.ScheduleList.filter(call => call.STATUS == -1);
    } else if (option == 1) {
      this.Scheduledata.ScheduleList = this.ScheduleList.filter(call => call.STATUS == 1);
    } else {
      this.Scheduledata.ScheduleList = this.ScheduleList.filter(call => call.STATUS == 0);
    }
    this.Scheduledata.STATUS = option;
    const myModal: Modal = this.modal.create('ppmscheduledetails', { data: this.Scheduledata }, myModalOptions);
    myModal.present();
    myModal.onDidDismiss(() => {
      // console.log("I have dismissed.");
    });
    myModal.onWillDismiss(() => {
      this.ngOnInit();
      //  console.log("I'm about to dismiss");
    });
  }

}