import { Component, ViewChild } from '@angular/core';
import { IonicPage, Content, NavController, Platform, NavParams, ActionSheetController, AlertController, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';

//import * as moment from 'moment';

import { CalendarModalOptions } from "ion2-calendar";

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

// import { AngularCropperjsComponent } from 'angular-cropperjs';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { SignaturePad } from 'angular2-signaturepad';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';

@IonicPage()
@Component({
  selector: 'page-taskcompleteupdate',
  templateUrl: 'taskcompleteupdate.html',
})

export class TaskCompleteUpdatePage {

  @ViewChild(SignaturePad) public signaturePad: SignaturePad;
  @ViewChild(Content) content: Content;

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
  submitJobCardNo = 0;
  jobdescripton = '';
  showsignature = 0;
  showsignaturebtn = 0;

  public profileImg: string;
  public base64Image: string;
  public photos: any = [];

  base64Str: any;
  kbytes: number;
  file_name: any;
  size: any;
  imageURI: any;
  feedbackType = '';
  base64Str_scan: any;
  scan_file_name: any;

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

  showScanBtn = 0;

  geoLatitude: any;
  geoLongitude: any;
  geoAccuracy: any;
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  TASK_ID: any;
  TITLE: any;
  SEQ_TEXT: any;
  CREATED_BY_NAME: any;
  ASSIGNED_TO: any;
  pushnotificationValues: any;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController, private file: File, private fileOpener: FileOpener,
    private alertCtrl: AlertController, private actionsheetCtrl: ActionSheetController, private camera: Camera,
    private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder
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
    this.watchLocation();
    console.log(this.Data[0].feedbackcalls);
    this.TASK_ID = this.Data[0].feedbackcalls[0].TASK_ID;
    this.TITLE = this.Data[0].feedbackcalls[0].TITLE;
    this.SEQ_TEXT = this.Data[0].feedbackcalls[0].SEQ_TEXT;
    this.CREATED_BY_NAME = this.Data[0].feedbackcalls[0].CREATED_BY_NAME;
    this.ASSIGNED_TO = this.Data[0].feedbackcalls[0].ASSIGNED_TO;

    if (this.Data[0].feedbackcalls[0].JOB_CORD_NO > 0) {
      this.jobcardno = this.Data[0].feedbackcalls[0].JOB_CORD_NO;
      this.submitJobCardNo = 1;
    }

    if (this.Data[0].feedbackcalls[0].JOB_DESC != '' && this.Data[0].feedbackcalls[0].JOB_DESC != null) {
      this.jobdescripton = this.Data[0].feedbackcalls[0].JOB_DESC;
    } else {
      this.jobdescripton = '';
    }

  }

  validateticketno() {
    console.log(this.jobcardno, this.jobdescripton);

    let _month = new Date().getMonth() + 1;

    this.base64Str = this.base64Image.split(',');
    let file_size = this.calculateImageSize(this.base64Str[1]);
    this.file_name = 'jobcard' + this.jobcardno + '_' + new Date().getDate() + _month + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.jpeg';


    if (this.base64Image == '') {
      this.presentToast('Please scan job card');
      return;
    }

    if (this.jobcardno == undefined || this.jobcardno == '' || this.jobcardno == null) {
      this.presentToast('Invalid Job Card No');
      return;
    }

    if (this.jobdescripton == undefined || this.jobdescripton == '' || this.jobdescripton == null) {
      this.presentToast('Please enter description');
      return;
    }

    if (this.jobcardno.length > 0) {

      let params = {
        call_log_id: this.callID,
        job_card_no: this.jobcardno,
        description: this.jobdescripton,
        imageURI_data: this.base64Image,
        comments: this.jobdescripton,
        name: this.file_name,
        size_data: file_size,
        modified_by: this.user.UserInfoId,
        created_by: this.user.UserInfoId
      }

      this.authService.postData(params, 'Call_inspection/getUpdateJobCardNo').then((result) => {
        this.insertedValues = result;
        this.submitJobCardNo = 1;
        console.log(this.insertedValues);
        if (this.insertedValues == 100) {
          this.presentToast('Job Card No Already exist.');
          return;
        } else {
          this.submitJobCardNo = 1;
          this.presentToast('Job Card No Updated successfully.');
        }

      }, (err) => {
        this.presentToast(err);
      });

    } else {
      this.presentToast('Invalid Job Card No');
      return;
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

  openBrowser() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Option',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Scan Document',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'ios-camera-outline' : null,
          handler: () => {
            this.takePhoto();
          }
        },
        {
          text: 'Choose photo from Gallery',
          icon: !this.platform.is('ios') ? 'ios-images-outline' : null,
          handler: () => {
            this.openGallery();
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    }
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.showScanBtn = 1;

      // let scanDoc = {
      //   image: this.base64Image,
      //   status: 0
      // }

      // this.photos.push(scanDoc);
      // console.log(this.photos);
    }, (err) => {
      console.log(err);
    });
  }

  openGallery() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }

    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.showScanBtn = 1;

      // let scanDoc = {
      //   image: this.base64Image,
      //   status: 0
      // }

      // this.photos.push(scanDoc);
      // console.log(this.photos);
      //this.photos.push(this.base64Image);
    }, (err) => {
      console.log(err);
    })
  }


  // save() {
  //   let croppedImgB64String: string = this.angularCropper.cropper.getCroppedCanvas().toDataURL('image/jpeg', (100 / 100));
  //   this.croppedImage = croppedImgB64String;
  //   this.imageURI = croppedImgB64String;
  //   this.photos.push(croppedImgB64String);
  //   this.show_profile_image = 0;
  //   this.show_profile_image_crop = 1;
  //   this.photos.reverse();
  // }

  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
      title: 'Sure you want to delete this photo? There is NO undo!',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Agree clicked');
            //this.photos.splice(index, 1);
            this.base64Image = '';
            this.showScanBtn = 0;

          }
        }
      ]
    });
    confirm.present();
  }


  calculateImageSize(base64String) {
    let padding;
    let inBytes;
    let base64StringLength;
    if (base64String.endsWith('==')) { padding = 2; }
    else if (base64String.endsWith('=')) { padding = 1; }
    else { padding = 0; }

    base64StringLength = base64String.length;
    console.log(base64StringLength);
    inBytes = (base64StringLength / 4) * 3 - padding;
    console.log(inBytes);
    this.kbytes = inBytes / 1000;
    return this.kbytes;
  }

  Uploadmyprofile(id: any) {
    let _month = new Date().getMonth() + 1;

    this.base64Str = this.photos[id].image.split(',');
    let file_size = this.calculateImageSize(this.base64Str[1]);
    this.file_name = 'feedback' + this.callID + '_' + new Date().getDate() + _month + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.jpeg';


    let params = {
      Call_No: this.callID,
      Job_Card_Number: this.jobcardno,
      imageURI_data: this.photos[id].image,
      comments: this.jobdescripton,
      name: this.file_name,
      size_data: file_size,
      modified_by: this.user.UserInfoId,
      created_by: this.user.UserInfoId
    }

    console.log(params);
    this.presentLoadingDefault(true);
    this.authService.postData(params, 'Call_inspection/getUploadFeedbackDocument').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("File is uploaded successfully");
      this.insertedValues = result;
      this.photos[id].status = 1;
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  openSignatureModel() {
    this.showsignature = 1;
  }

  drawCancel() {
    this.showsignaturebtn = 0;
    this.showsignature = 0;
    this.signaturePad.clear();
  }

  drawComplete() {
    this.signatureImage = this.signaturePad.toDataURL();
    this.showsignature = 0;
    this.content.scrollToBottom();
    this.showsignaturebtn = 1;
    //this.navCtrl.push(HomePage, {signatureImage: this.signatureImage});
  }

  drawClear() {
    // this.showsignature = 0;
    this.signaturePad.clear();
  }

  selecttype(type: any) {

    this.feedbackType = type;

    if (type == 1) {
      this.type1 = 1;
      this.type2 = 0;
      this.type3 = 0;
      this.type4 = 0;
      this.type5 = 0;
    }
    if (type == 2) {
      this.type1 = 0;
      this.type2 = 1;
      this.type3 = 0;
      this.type4 = 0;
      this.type5 = 0;
    }
    if (type == 3) {
      this.type1 = 0;
      this.type2 = 0;
      this.type3 = 1;
      this.type4 = 0;
      this.type5 = 0;
    }
    if (type == 4) {
      this.type1 = 0;
      this.type2 = 0;
      this.type3 = 0;
      this.type4 = 1;
      this.type5 = 0;
    }
    if (type == 5) {
      this.type1 = 0;
      this.type2 = 0;
      this.type3 = 0;
      this.type4 = 0;
      this.type5 = 1;
    }

    console.log(this.feedbackType);

  }

  insertCustomerFeedback() {
    //debugger;
    this.presentLoadingDefault(true);
    let _month = new Date().getMonth() + 1;
    let file_size = 0;
    let scan_file_size = 0;
    let jobcardno_len = 0;


    if (this.signatureImage != '' && this.signatureImage != undefined && this.signatureImage != null) {
      this.base64Str = this.signatureImage.split(',');
      file_size = this.calculateImageSize(this.base64Str[1]);
      this.file_name = 'sign' + this.callID + '_' + new Date().getDate() + _month + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.jpeg';
    }

    if (this.base64Image != '' && this.base64Image != undefined && this.base64Image != null) {

      if (this.jobcardno != '' && this.jobcardno != null && this.jobcardno != undefined) {
        this.base64Str_scan = this.base64Image.split(',');
        scan_file_size = this.calculateImageSize(this.base64Str_scan[1]);
        this.scan_file_name = 'jobcard' + this.jobcardno + '_' + new Date().getDate() + _month + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.jpeg';
      } else {
        this.presentToast('Please enter Job Card.');
        return;
      }

    }

    if (this.signatureImage == '') {
      this.presentToast('Signature should not be empty.');
      return;
    }

    if (this.feedbackType == undefined || this.feedbackType == '' || this.feedbackType == null) {
      this.presentToast('Please select feedback');
      return;
    }

    if (this.jobcardno != '' && this.jobcardno != null && this.jobcardno != undefined) {
      jobcardno_len = this.jobcardno.length
    } else {
      jobcardno_len = 0;
    }

    if (jobcardno_len > 0) {

      this.jobdescripton = '';

      let params = {
        task_id: this.TASK_ID,
        job_card_no: this.jobcardno,
        description: this.jobdescripton,
        imageURI_data: this.base64Image,
        comments: this.jobdescripton,
        name: this.scan_file_name,
        size_data: scan_file_size,
        modified_by: this.user.UserInfoId,
        created_by: this.user.UserInfoId
      }

      this.authService.postData(params, 'task/getUpdateJobCardNo').then((result) => {
        this.insertedValues = result;
        this.submitJobCardNo = 1;
        console.log(this.insertedValues);

        if (this.insertedValues == 100) {
          this.presentLoadingDefault(false);
          this.presentToast('Job Card No Already exist.');
          return;

        } else {

          this.submitJobCardNo = 1;

          let params1 = {
            task_id: this.TASK_ID,
            Job_Card_Number: this.jobcardno,
            imageURI_data: this.signatureImage,
            comments: this.comments,
            name: this.file_name,
            size_data: file_size,
            modified_by: this.user.UserInfoId,
            created_by: this.user.UserInfoId,
            feedback_type: this.feedbackType,
            user_location: this.userlocation,
            latitude: this.geoLatitude,
            longitude: this.geoLongitude,
            module_name: 'TASK'
          }

          this.authService.postData(params1, 'task/getInsertCustomerFeedbackWithLocation').then((result) => {
            this.presentToast("Customer feedback is updated successfully");
            this.comments = null;
            this.insertedValues = result;
            let task = this.Data[0].feedbackcalls;

            let millis = new Date().getTime() - new Date(task[0].TASK_START_TIME).getTime();
            var task_time = this.convertMS(millis);
            task[0].task_time = task_time;
            task[0].NEXT_STATUS = 4;
            task[0].task_comments = "completed";
            task[0].current_value = 'Status is updated to Completed.';
            task[0].prev_value = 'Previous status is ' + task[0].STATUS_NAME;
            task[0].modified_by = this.user.UserInfoId;

            this.authService.postData(task[0], 'task/getUpdateTaskStatus').then((result) => {
              this.presentLoadingDefault(false);
              this.presentToast("Data successfully Updated");
              this.insertedValues = result;

              var app_platform: string = '';
              if (this.platform.is('ios')) {
                app_platform = 'ios';
              }

              if (this.platform.is('android')) {
                app_platform = 'android';
              }

              let push_message = {} as any;
              push_message.title = this.user.Surname
              push_message.message = 'Task No: ' + task[0].SEQ_TEXT + '\nTitle: ' + task[0].TITLE + "\n Comments: " + 'Status Changed from ' + task[0].STATUS_NAME + ' to ' + task[0].task_comments;
              push_message.app_platform = app_platform;
              push_message.task_assignee_id = task[0].ASSIGNED_USER_INFO_ID;
              push_message.task_created_by = task[0].CREATED_BY;
              push_message.new_task = null;
              push_message.loggedin_user_id = this.user.UserInfoId;
              push_message.task_id = this.TASK_ID;
              push_message.trans_type = 'TMS';

              this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
                this.presentLoadingDefault(false);
                this.pushnotificationValues = result;
              }, (err) => {
                this.presentLoadingDefault(false);
                this.presentToast("Something went to wrong, please try again later");
              });

              this.closeModal();
            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast("Something went to wrong, please try again later");
            });
          }, (err) => {
            this.presentLoadingDefault(false);
            this.presentToast(err);
          });

        }

      }, (err) => {
        this.presentToast(err);
      });

    }
    else {

      let params1 = {
        task_id: this.TASK_ID,
        Job_Card_Number: this.jobcardno,
        imageURI_data: this.signatureImage,
        comments: this.comments,
        name: this.file_name,
        size_data: file_size,
        modified_by: this.user.UserInfoId,
        created_by: this.user.UserInfoId,
        feedback_type: this.feedbackType,
        user_location: this.userlocation,
        latitude: this.geoLatitude,
        longitude: this.geoLongitude,
        module_name: 'TASK'
      }

      this.authService.postData(params1, 'task/getInsertCustomerFeedbackWithLocation').then((result) => {
        this.presentToast("Customer feedback is updated successfully");
        this.comments = null;
        this.insertedValues = result;
        let task = this.Data[0].feedbackcalls;

        let millis = new Date().getTime() - new Date(task[0].TASK_START_TIME).getTime();
        var task_time = this.convertMS(millis);
        task[0].task_time = task_time;
        task[0].NEXT_STATUS = 4;
        task[0].task_comments = "completed";
        task[0].current_value = 'Status is updated to Completed.';
        task[0].prev_value = 'Previous status is ' + task[0].STATUS_NAME;
        task[0].modified_by = this.user.UserInfoId;

        this.authService.postData(task[0], 'task/getUpdateTaskStatus').then((result) => {
          this.presentLoadingDefault(false);
          this.presentToast("Data successfully Updated");
          this.insertedValues = result;

          var app_platform: string = '';
          if (this.platform.is('ios')) {
            app_platform = 'ios';
          }

          if (this.platform.is('android')) {
            app_platform = 'android';
          }

          let push_message = {} as any;
          push_message.title = this.user.Surname
          push_message.message = 'Task No: ' + task[0].SEQ_TEXT + '\nTitle: ' + task[0].TITLE + "\n Comments: " + 'Status Changed from ' + task[0].STATUS_NAME + ' to ' + task[0].task_comments;
          push_message.app_platform = app_platform;
          push_message.task_assignee_id = task[0].ASSIGNED_USER_INFO_ID;
          push_message.task_created_by = task[0].CREATED_BY;
          push_message.new_task = null;
          push_message.loggedin_user_id = this.user.UserInfoId;
          push_message.task_id = this.TASK_ID;
          push_message.trans_type = 'TMS';

          this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
            this.presentLoadingDefault(false);
            this.pushnotificationValues = result;
          }, (err) => {
            this.presentLoadingDefault(false);
            this.presentToast("Something went to wrong, please try again later");
          });

          this.closeModal();
        }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast("Something went to wrong, please try again later");
        });
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    }

  }

  completeWithoutFeedback() {

    let _month = new Date().getMonth() + 1;
    let scan_file_size = 0;
    let jobcardno_len = 0;

    if (this.base64Image != '' && this.base64Image != undefined && this.base64Image != null) {

      if (this.jobcardno != '' && this.jobcardno != null && this.jobcardno != undefined) {
        this.base64Str_scan = this.base64Image.split(',');
        scan_file_size = this.calculateImageSize(this.base64Str_scan[1]);
        this.scan_file_name = 'jobcard' + this.jobcardno + '_' + new Date().getDate() + _month + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.jpeg';
      } else {
        this.presentToast('Please enter Job Card.');
        return;
      }
     
    }

    if (this.jobcardno != '' && this.jobcardno != null && this.jobcardno != undefined) {
      jobcardno_len = this.jobcardno.length
    } else {
      jobcardno_len = 0;
    }

    this.jobdescripton = '';

    if (jobcardno_len > 0) {

      let params = {
        task_id: this.TASK_ID,
        job_card_no: this.jobcardno,
        description: this.jobdescripton,
        imageURI_data: this.base64Image,
        comments: this.jobdescripton,
        name: this.scan_file_name,
        size_data: scan_file_size,
        modified_by: this.user.UserInfoId,
        created_by: this.user.UserInfoId
      }

      this.presentLoadingDefault(true);
      this.authService.postData(params, 'task/getUpdateJobCardNo').then((result) => {
        this.insertedValues = result;
        this.submitJobCardNo = 1;
        console.log(this.insertedValues);

        if (this.insertedValues == 100) {

          this.presentLoadingDefault(false);
          this.presentToast('Job Card No Already exist.');
          return;

        } else {

          let task = this.Data[0].feedbackcalls;
          let millis = new Date().getTime() - new Date(task[0].TASK_START_TIME).getTime();
          var task_time = this.convertMS(millis);
          task[0].task_time = task_time;
          task[0].NEXT_STATUS = 4;
          task[0].task_comments = "completed";
          task[0].current_value = 'Status is updated to Completed.';
          task[0].prev_value = 'Previous status is ' + task[0].STATUS_NAME;
          task[0].modified_by = this.user.UserInfoId;

          this.authService.postData(task[0], 'task/getUpdateTaskStatus').then((result) => {
            this.presentLoadingDefault(false);
            this.presentToast("Data successfully Updated");
            this.insertedValues = result;

            var app_platform: string = '';
            if (this.platform.is('ios')) {
              app_platform = 'ios';
            }

            if (this.platform.is('android')) {
              app_platform = 'android';
            }

            let push_message = {} as any;
            push_message.title = this.user.Surname
            push_message.message = 'Task No: ' + task[0].SEQ_TEXT + '\nTitle: ' + task[0].TITLE + "\n Comments: " + 'Status Changed from ' + task[0].STATUS_NAME + ' to ' + task[0].task_comments;
            push_message.app_platform = app_platform;
            push_message.task_assignee_id = task[0].ASSIGNED_USER_INFO_ID;
            push_message.task_created_by = task[0].CREATED_BY;
            push_message.new_task = null;
            push_message.loggedin_user_id = this.user.UserInfoId;
            push_message.task_id = this.TASK_ID;
            push_message.trans_type = 'TMS';

            this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
              this.presentLoadingDefault(false);
              this.pushnotificationValues = result;
            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast("Something went to wrong, please try again later");
            });

            this.closeModal();
          }, (err) => {
            this.presentLoadingDefault(false);
            this.presentToast("Something went to wrong, please try again later");
          });

        }

      }, (err) => {
        this.presentToast(err);
      });

    } else {

      let task = this.Data[0].feedbackcalls;
      let millis = new Date().getTime() - new Date(task[0].TASK_START_TIME).getTime();
      var task_time = this.convertMS(millis);
      task[0].task_time = task_time;
      task[0].NEXT_STATUS = 4;
      task[0].task_comments = "completed";
      task[0].current_value = 'Status is updated to Completed.';
      task[0].prev_value = 'Previous status is ' + task[0].STATUS_NAME;
      task[0].modified_by = this.user.UserInfoId;

      this.authService.postData(task[0], 'task/getUpdateTaskStatus').then((result) => {
        this.presentLoadingDefault(false);
        this.presentToast("Data successfully Updated");
        this.insertedValues = result;

        var app_platform: string = '';
        if (this.platform.is('ios')) {
          app_platform = 'ios';
        }

        if (this.platform.is('android')) {
          app_platform = 'android';
        }

        let push_message = {} as any;
        push_message.title = this.user.Surname
        push_message.message = 'Task No: ' + task[0].SEQ_TEXT + '\nTitle: ' + task[0].TITLE + "\n Comments: " + 'Status Changed from ' + task[0].STATUS_NAME + ' to ' + task[0].task_comments;
        push_message.app_platform = app_platform;
        push_message.task_assignee_id = task[0].ASSIGNED_USER_INFO_ID;
        push_message.task_created_by = task[0].CREATED_BY;
        push_message.new_task = null;
        push_message.loggedin_user_id = this.user.UserInfoId;
        push_message.task_id = this.TASK_ID;
        push_message.trans_type = 'TMS';
        push_message.seq_text = task[0].SEQ_TEXT;

        this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
          this.presentLoadingDefault(false);
          this.pushnotificationValues = result;
        }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast("Something went to wrong, please try again later");
        });

        this.closeModal();
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast("Something went to wrong, please try again later");
      });

    }

  }

  convertMS(milliseconds) {
    var day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
      day: day,
      hour: hour,
      minute: minute,
      seconds: seconds
    };
  }

  watchLocation() {
    this.isWatching = true;
    this.watchLocationUpdates = navigator.geolocation.watchPosition((position) => {
      this.geoLatitude = position.coords.latitude;
      this.geoLongitude = position.coords.longitude;
      this.getGeoencoder(position.coords.latitude, position.coords.longitude);
    });

  }

  getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderReverseResult[]) => {
        this.userlocation = result[0].countryName + ', ' + result[0].administrativeArea + ', ' + result[0].subAdministrativeArea + ', ' + result[0].postalCode;
        console.log(this.userlocation);
      })
      .catch((error: any) => {
        console.log('Error getting location' + JSON.stringify(error));
      });
  }

  //Stop location update watch
  stopLocationWatch() {
    this.isWatching = false;
    //this.watchLocationUpdates.unsubscribe();
    navigator.geolocation.clearWatch(this.watchLocationUpdates);
  }

}
