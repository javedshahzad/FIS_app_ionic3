import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import Swal from 'sweetalert2'
import { CallmanagementPage } from '../callmanagement/callmanagement';


@IonicPage()
@Component({
  selector: 'page-callsfeedbackcompletedlist',
  templateUrl: 'callsfeedbackcompletedlist.html',
})
export class completedfeedbackpage {
  lpocommentsdetails: any
  lpocommentsForm: FormGroup
  insertedValues: any;
  calldata: any
  departmentdata: any;
  userinfodata: any;
  Callprocurementvalue: any;
  searchData = { "search_value": "" };
  Callprocurement = this.navParams.get('data');
  user: any = localStorage.getItem('userData');

  resourse: any = JSON.parse(localStorage.getItem('resourseData'));
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


  ionViewDidLoad() {
    this.getFeedbackCalls();
  }    
  

  getFeedbackCalls() {
    this.presentLoadingDefault(true);
    let arr_data = {
      Resoursename: this.resourse.EMPNAME,
      TYPE_ID: this.resourse.TYPE_ID
    }

    let time_bf = new Date();

    this.authService.postData(arr_data, 'Call_inspection/getFeedbackCompletedCallsAll').then((result) => {
      this.presentLoadingDefault(false);
      this.Callprocurementvalue = result;
      this.Callprocurement = result;

      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);     
      console.log(seconds); 

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
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
 

  openupdatefeedback(item = [] as any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = [{
      feedbackcalls: item
    }];
    const myModal: Modal = this.modal.create('callsfeedbackcompletedviewepage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => { 
      this.searchData.search_value = '';     
      this.ionViewDidLoad();
    });

    myModal.onWillDismiss((data) => {      
    });

  }


  SearchcallManagement() {

    let call_id = parseInt(this.searchData.search_value);
    let item = this.searchData.search_value;
    if (item != '') {
      if (isNaN(call_id)) {
        this.Callprocurementvalue = this.Callprocurement.filter(call => (call.REQUESTOR_NAME ? call.REQUESTOR_NAME.includes(item) : false));
      } else if (!isNaN(call_id)) {
        this.Callprocurementvalue = this.Callprocurement.filter(call => call.CALL_LOG_ID === call_id);
      }
    } else {
      this.Callprocurementvalue = this.Callprocurement;
    }
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