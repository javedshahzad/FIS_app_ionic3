import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, ToastController, LoadingController, ViewController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { CallNumber } from '@ionic-native/call-number';


@IonicPage()
@Component({
  selector: 'page-hotoupdatestatus',
  templateUrl: 'hotoupdatestatus.html',
})
export class HotoUpdateStatusPage {

  paymentcommentsdetails: any;
  pushnotificationValues: any;
  paymentcommentsForm: FormGroup
  insertedValues: any;
  payment_req_data = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  PAYMENT_DETAIL: any;
  COMMENT_TYPE: any;
  userlist: any;


  resourcedetails: any = localStorage.getItem('resourseData');
  btnTxtApprove: any = "Approve";
  btnTxtReject: any = "Reject";
  btnTxtSave: any = "Save";
  btnTxtYes: any = 'Approve';
  btnTxtApproveandForward: any = 'Approve & Forward';
  btnTxtCheck: any = 'Check';

  lnkceoapp = 0;
  lnkmanagement = 0;
  lbkConf = 0;
  lnkrevertcheck = 1;
  showDetailsBox = 0;

  showIsHardCopyCheckBox = 0;
  isChecked: boolean = false;

  LEASE_NUMBER: any = this.payment_req_data[0].LEASE_NUMBER;
  HOTODETAILS: any;
  PAYMENT_COMMENTS: any;

  paymentattachmentlist: any;
  paymentattachmentDelete: any;
  lpoManagerList: any;

  mlist: any;
  resource_type_id:any;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private callNumber: CallNumber,
    public loadingCtrl: LoadingController, public view: ViewController, public alertCtrl: AlertController
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.resourcedetails = this.resourcedetails ? JSON.parse(this.resourcedetails) : {};

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
    const Data = this.navParams.get('data');

    this.resource_type_id = this.resourcedetails.TYPE_ID;

    this.HOTODETAILS = Data[0].HOTODETAILS;
    this.LEASE_NUMBER = this.HOTODETAILS.LEASE_NUMBER
    console.log(this.HOTODETAILS);

    this.presentLoadingDefault(true);
    this.authService.getData({}, 'hoto/HotoCommentsList/' + this.LEASE_NUMBER).then((result) => {
      this.paymentcommentsdetails = result;
      console.log(this.paymentcommentsdetails);
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

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

  showBtn = -1;
  isOpen = false;
  oldBtn = -1;
  showUndoBtn(index) {
    if (this.isOpen == false) {
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

  callmobileNumber(mobileno: any) {
    console.log('Call Number', mobileno);
    this.callNumber.callNumber(mobileno, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  ApproveHotoStatusUpdate() {
    console.log(this.HOTODETAILS)
    console.log(this.LEASE_NUMBER);
    console.log(this.PAYMENT_COMMENTS);

    if (this.PAYMENT_COMMENTS.trim() != null && this.PAYMENT_COMMENTS.trim() != "") {

      let updatedata = [{
        old_data: JSON.stringify(this.HOTODETAILS),
        COMMENTS: this.PAYMENT_COMMENTS.trim(),
        LEASE_NUMBER: this.LEASE_NUMBER,
        modified_by: this.user.UserInfoId,
        resourceType: this.resourcedetails.TYPE_USER,
        resourceTypeId: this.resourcedetails.TYPE_ID,
        status: 3
      }];

      console.log(updatedata[0]);
      this.presentLoadingDefault(true);
      this.authService.postData(updatedata[0], 'hoto/getUpdateHotoStatus').then((result) => {
        this.insertedValues = result;
        console.log(this.insertedValues);
        this.presentLoadingDefault(false);
        this.closeModal();
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });

    } else {
      this.presentToast('Please enter description');
      return;
    }

  }


}