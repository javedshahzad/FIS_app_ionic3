import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { CreateTaskPage } from '../createtask/createtask';

@IonicPage()
@Component({
  selector: 'page-allactivecalls',
  templateUrl: 'allactivecalls.html',
})

export class allactivecallspage {
  lpocommentsdetails: any
  lpocommentsForm: FormGroup
  insertedValues: any;
  calldata: any;
  Callallactivevalue: any;
  Callallactivelist: any;
  searchData = { "search_value": "" };
  Callallactive = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  resourse: any = JSON.parse(localStorage.getItem('resourseData'));

  itemsToDisplay = [];
  Calldata: any;
  showbtn = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.lpocommentsForm = this.formBuilder.group({
      COMMENTS: ['', Validators.compose([Validators.required])],
      LPO_ID: ['', Validators.compose([Validators.required])],
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
  ionViewWillLoad() {
    this.Callinspectiondata();
  }

  Callinspectiondata() {
    if (this.Callallactive[0].inspection == 0) {

      this.showbtn = 0;

      this.presentLoadingDefault(true);
      let data = {
        Resoursename: this.resourse.EMPNAME,
        TYPE_ID: this.resourse.TYPE_ID,
        STATUS_ID: 238
      }

      let time_bf = new Date();

      this.authService.postData(data, 'Call_inspection/AllCallList/').then((result) => {
        this.presentLoadingDefault(false);
        this.Callallactivevalue = result;
        this.Callallactivelist = result;

        this.itemsToDisplay = [];
        let total_count = 10;
        let array_len = 0;

        if (total_count < this.Callallactivevalue.length) {
          array_len = total_count;
        } else {
          array_len = this.Callallactivevalue.length;
        }

        for (let i = 0; i < array_len; i++) {
          this.itemsToDisplay.push(this.Callallactivevalue[i]);
        }

        let time_af = new Date();
        let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
        //let x = this.secondsToDhms(seconds);
        console.log('Seconds:', seconds);
        //console.log(x);

      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast("Something went to wrong, please try again later");
      });

    } else if (this.Callallactive[0].inspection == 1) {
      this.showbtn = 1;
      this.presentLoadingDefault(true);
      let time_bf = new Date();
      this.authService.getData({}, 'Call_inspection/AllclosedCallList/').then((result) => {
        this.Callallactivevalue = result;
        this.Callallactivelist = result;
        if (this.Callallactive[0].CALL_LOG_ID != null) {
          this.Callallactivevalue = this.Callallactivelist.filter(call => call.CALL_LOG_ID === this.Callallactive[0].CALL_LOG_ID);
        }
        this.itemsToDisplay = [];
        let total_count = 10;
        let array_len = 0;
       if (total_count < this.Callallactivevalue.length) {
          array_len = total_count;
        } else {
          array_len = this.Callallactivevalue.length;
        }

        for (let i = 0; i < 10; i++) {
          this.itemsToDisplay.push(this.Callallactivevalue[i]);
        }

        let time_af = new Date();
        let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
        console.log('Seconds:', seconds);

        this.presentLoadingDefault(false);

      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast("Something went to wrong, please try again later");
      });
    }

  }

  // doinfinite() {
  //   let len = this.itemsToDisplay.length;
  //   for (let i = len; i < len + 10; i++) {
  //     this.itemsToDisplay.push(this.Callallactivevalue[i]);
  //   }
  // }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    let len = this.itemsToDisplay.length;

    setTimeout(() => {

      let total_count = len + 10;
      let array_len = 0;
      if (total_count < this.Callallactivevalue.length) {
        array_len = total_count;
      } else {
        array_len = this.Callallactivevalue.length;
      }

      for (let i = len; i < array_len; i++) {
        this.itemsToDisplay.push(this.Callallactivevalue[i]);
      }

      console.log(this.itemsToDisplay);
      console.log('Async operation has ended');
      infiniteScroll.complete();

    }, 500);
  }

  showBtn = -1;
  isOpen = false;
  oldBtn = -1;
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

  resetForm() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
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

  SearchcallManagement() {

    let item = this.searchData.search_value;

    if (item != '') {

      let filterData = this.Callallactivelist.filter(item => this.filter(item));
      this.Callallactivevalue = filterData;
      this.itemsToDisplay = [];
      for (let i = 0; i < this.Callallactivevalue.length; i++) {
        this.itemsToDisplay.push(this.Callallactivevalue[i]);
      }

    } else {
      this.Callallactivevalue = this.Callallactivelist;
      this.itemsToDisplay = [];
      for (let i = 0; i < 10; i++) {
        this.itemsToDisplay.push(this.Callallactivevalue[i]);
      }
    }
  }

  filter(item) {
    let _val = this.searchData.search_value;
    let _case_val = item['CALL_LOG_ID'] ? item['CALL_LOG_ID'].toString().toUpperCase() : '';
    let _lease_val = item['REQUESTOR_NAME'] ? item['REQUESTOR_NAME'].toString().toUpperCase() : '';
    return (_case_val.includes(_val.toUpperCase()) || _lease_val.includes(_val.toUpperCase()));
  }

  openModal(CALL_LOG_ID: any, REQUESTOR_NAME: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = [{
      CALL_LOG_ID: CALL_LOG_ID,
      REQUESTOR_NAME: REQUESTOR_NAME
    }];

    const myModal: Modal = this.modal.create('callcomments', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

  }
 
  createtask(CALL_LOG_ID, REQUESTOR_NAME, UNIT) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      TASK_ID: -1,
      CALL_LOG_ID: CALL_LOG_ID,
      REQUESTOR_NAME: REQUESTOR_NAME,
      UNIT: UNIT
    }]

    const myModal: Modal = this.modal.create(CreateTaskPage, { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });
  }


  gettask(CALL_LOG_ID) {
    let data = {
      CALL_LOG_ID: CALL_LOG_ID,
      UserInfoId: this.user.UserInfoId
    }
    this.presentLoadingDefault(true);
    this.authService.postData(data, 'Call_inspection/Get_tasklist_by_calllog').then((result: any) => {

      this.presentLoadingDefault(false);
      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let myModalData = [
        result,
        'CALL_LOG'
      ];

      let myModal: Modal = this.modal.create('TaskManagementDetailPage', { data: myModalData }, myModalOptions);
      myModal.present();
      myModal.onDidDismiss((data) => {
      });
      myModal.onWillDismiss((data) => {
      });
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " Days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " Hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " Mins, ") : "";
    return dDisplay + hDisplay + mDisplay;
  }

}