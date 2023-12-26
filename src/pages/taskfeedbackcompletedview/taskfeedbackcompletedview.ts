import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ActionSheetController, AlertController, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';

//import * as moment from 'moment';

import { CalendarModalOptions } from "ion2-calendar";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { SignaturePad } from 'angular2-signaturepad';


@IonicPage()
@Component({
  selector: 'page-taskfeedbackcompletedview',
  templateUrl: 'taskfeedbackcompletedview.html',
})
export class taskFeedbackCompletedViewePage {

  @ViewChild(SignaturePad) public signaturePad: SignaturePad;

  resourcedetails: any = localStorage.getItem('resourseData');
  user: any = localStorage.getItem('userData');
  Data = this.navParams.get('data');
  currentDate: any;
  userlocation: any;

  watchLocationUpdates: any;
  isWatching: boolean;
  geoAddress: any;

  comments: any;
  showbtn = 0;
  insertedValues: any;
  parkingDetailsAll: any;
  reportingUsers: any;
  reportingUserssearchall: any;
  pet: string = "validate";
  tab_name: any;
  login_user: any;
  masterUserLocation: any;
  userFormFunctionList: any;
  showCheckOut = 0;
  showMyAttendance = 0;
  available_hr: any;
  utilized_hr: any;
  ticketno: any;
  carparkingDetails: any;
  tokenNo: number;
  parkingAll: any;
  calendarshowheldon = 0;
  heldOn: any;
  heldOnDate: any;
  calendarshownextmeeting = 0;
  enableParkingReports = 0;
  enableParkingReception = 0;

  nextmeeting: any;
  nextmeetingDate: any;
  localDate: any;
  parkingReportDetails: any;

  options: CalendarModalOptions = {
    title: 'BASIC',
    canBackwardsSelected: true
  };

  pdfObj = null;
  jobcardno: any;
  callID: any;
  requestorName: any;
  unitDesc: any;
  submitJobCardNo = 1;
  jobdescripton = '';
  showsignature = 0;
  showsignaturebtn = 1;

  public profileImg: string;
  public base64Image: string;
  public photos: any = [];

  base64Str: any;
  kbytes: number;
  file_name: any;
  size: any;
  imageURI: any;
  feedbackType = '';

  public signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': 340,
    'canvasHeight': 200
  };

  public signatureImage: string;
  type1 = 0;
  type2 = 0;
  type3 = 0;
  type4 = 0;
  type5 = 0;

  showScanBtn = 1;
  submitfeedback = 1;
  callfilelistAll:any;
  callfilelist:any;

  condition1:boolean = true;
  condition2:boolean = true;
  condition3:boolean = true;
  condition4:boolean = true;
  condition5:boolean = true;
  user_location:any;
  
  seq_text:any;  
  task_title:any;
  task_created_by:any;
  task_assign_to:any;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController, private file: File, private fileOpener: FileOpener,
    private alertCtrl: AlertController, private actionsheetCtrl: ActionSheetController, private camera: Camera,
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.resourcedetails = this.resourcedetails ? JSON.parse(this.resourcedetails) : {};
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

  closeModal() {
    this.view.dismiss();
  }

  ionViewDidLoad() {
    console.log(this.Data[0].feedbackcalls);
    this.callID = this.Data[0].feedbackcalls.TASK_ID;
    this.seq_text = this.Data[0].feedbackcalls.SEQ_TEXT;
    this.task_title = this.Data[0].feedbackcalls.TITLE;
    this.task_created_by = this.Data[0].feedbackcalls.CREATED_BY_NAME;
    this.task_assign_to = this.Data[0].feedbackcalls.ASSIGNED_TO;


    this.user_location = this.Data[0].feedbackcalls.USER_LOCATION;
    this.getFeedbackCallsFiles();

    if (this.Data[0].feedbackcalls.JOB_CORD_NO > 0) {
      this.jobcardno = this.Data[0].feedbackcalls.JOB_CORD_NO;
      this.submitJobCardNo = 1;
    }

    

    if(this.Data[0].feedbackcalls.JOB_DESC != '' && this.Data[0].feedbackcalls.JOB_DESC != null ) {
      this.jobdescripton = this.Data[0].feedbackcalls.JOB_DESC;
    }else{
      this.jobdescripton = '';
    }
    
    if(this.Data[0].feedbackcalls.FEEDBACK_COMMENTS != '' && this.Data[0].feedbackcalls.FEEDBACK_COMMENTS != null){
      this.comments = this.Data[0].feedbackcalls.FEEDBACK_COMMENTS;
    }else{
      this.comments = '';      
    }

    if(this.Data[0].feedbackcalls.CALL_FEED_BACK_ID != '' && this.Data[0].feedbackcalls.CALL_FEED_BACK_ID != null && this.Data[0].feedbackcalls.CALL_FEED_BACK_ID != 0){
        this.showsignaturebtn = 1;
        this.submitfeedback  = 1;
    }else{
        this.showsignaturebtn = 0;
        this.submitfeedback = 1;
    }

    if(this.Data[0].feedbackcalls.FEED_BACK_TYPE > 0){

      if(this.Data[0].feedbackcalls.FEED_BACK_TYPE == 1){
        this.type1 = 1;
        this.type2 = 0;
        this.type3 = 0;
        this.type4 = 0;
        this.type5 = 0;
      }else if(this.Data[0].feedbackcalls.FEED_BACK_TYPE == 2){
        this.type1 = 0;
        this.type2 = 1;
        this.type3 = 0;
        this.type4 = 0;
        this.type5 = 0;
      }else if(this.Data[0].feedbackcalls.FEED_BACK_TYPE == 3){
        this.type1 = 0;
        this.type2 = 0;
        this.type3 = 1;
        this.type4 = 0;
        this.type5 = 0;
      }else if(this.Data[0].feedbackcalls.FEED_BACK_TYPE == 4){
        this.type1 = 0;
        this.type2 = 0;
        this.type3 = 0;
        this.type4 = 1;
        this.type5 = 0;
      }else if(this.Data[0].feedbackcalls.FEED_BACK_TYPE == 5){
        this.type1 = 0;
        this.type2 = 0;
        this.type3 = 0;
        this.type4 = 0;
        this.type5 = 1;
      }else{
        this.type1 = 0;
        this.type2 = 0;
        this.type3 = 0;
        this.type4 = 0;
        this.type5 = 0;
      }

    }else{
      this.type1 = 0;
      this.type2 = 0;
      this.type3 = 0;
      this.type4 = 0;
      this.type5 = 0;
    }

    this.requestorName = this.Data[0].feedbackcalls.REQUESTOR_NAME
    this.unitDesc = this.Data[0].feedbackcalls.UNIT;

    console.log(this.callID, this.jobcardno, this.requestorName, this.unitDesc);
  }

  getFeedbackCallsFiles() {
    this.presentLoadingDefault(true);
    let arr_data = {
      call_log_id: this.callID
    }

    let time_bf = new Date();

    //this.authService.postData(arr_data, 'Call_inspection/getFeedbackFilesAll').then((result) => {
      this.authService.getData({}, 'task/TaskUploadedFileList/' + this.callID).then((result) => {
      this.presentLoadingDefault(false);
      this.callfilelist = result;
      this.callfilelistAll = result;
      console.log(this.callfilelist);

      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);     
      console.log(seconds); 

      this.base64Image = this.getImage('JOBCARD');
      this.signatureImage = this.getImage('TASK SIGN');

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


  getImage(type:any) {
    let objFile = this.callfilelistAll.filter(o => o.REFERRENCETYPE === type);

    if(objFile.length > 0){
      let bytes = objFile[0].FILE_CONTENT.data;
      let file_name = objFile[0].FILE_NAME;
      let nameSplit = file_name.split('.');
      let extn = nameSplit[nameSplit.length - 1];
  
      if (extn == "jpg" || extn == "jpeg" || extn == "png") {
        if (this.callfilelistAll.length > 0) {
          return `data:image/${extn};base64,${this.encode(bytes)}`;
        } else {
          return '';
        }
      }
    }else{
      return '';
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
