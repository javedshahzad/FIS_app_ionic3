import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
//import { Media, MediaObject } from '@ionic-native/media';

import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html',
})
export class AttendancePage {

  resourcedetails: any = localStorage.getItem('resourseData');  
  resourse: any = localStorage.getItem('resourseData');
  user: any = localStorage.getItem('userData');
  Data = this.navParams.get('data');
  reason: any;
  currentDate: any;
  userlocation: any;
  geoLatitude: any;
  geoLongitude: any;
  geoAccuracy: any;

  watchLocationUpdates: any;
  isWatching: boolean;
  geoAddress: any;

  comments: any;
  insertedValues: any;
  attendanceDetailsAll: any;
  reportingUsers: any;
  reportingUserssearchall: any;
  pet: string = "markattendance";
  tab_name: any;
  login_user: any;
  masterUserLocation: any;
  userFormFunctionList: any;

  showMyAttendance = 0;
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  showCheckIn = 0;
  showstartbreak = 0;
  showstopbreak = 0;
  showstartlunch = 0;
  showstoplunch = 0;
  showbtn = 0;
  showCheckOut = 0;
  showCheckOutformfn = 0;

  // audio: MediaObject;
  message: string = '';
  openpage: any;
  taskdetails:any;
  tasksearchdetails:any;
  tasksearchdetailsAll:any;
  login_user_type:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController, private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder, public platform: Platform
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.resourcedetails = this.resourcedetails ? JSON.parse(this.resourcedetails) : {};    
    this.resourse = this.resourse ? JSON.parse(this.resourse) : {};
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
    this.reason = 'Hi';
    this.login_user = this.user.UserInfoId
    var today = new Date();
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    this.currentDate = today.getDate() + '/' + monthname[(today.getMonth())] + '/' + today.getFullYear();
    this.getUserLocation();
    this.getuserformfunction();
    this.getUserCheckinDetails();
    this.login_user_type = this.resourse.TYPE_USER;

    if(this.login_user_type == 'Engineer') {
        this.getTaskDetails('Activity', null, 'ResourceManager');
    }

  }

  getUserCheckinDetails() {

    this.presentLoadingDefault(true);

    let params = {
      user_info_id: this.user.UserInfoId
    }
 
    this.authService.postData(params, 'attendance/getUserAttendanceDetails').then((result) => {
      this.attendanceDetailsAll = result;
      console.log(this.attendanceDetailsAll);
      if (this.attendanceDetailsAll.length > 0) {
        //debugger;
        if(this.attendanceDetailsAll[0].ATTENDANCE_TYPE == 'CHECKIN'){

          this.showCheckIn = 0;
          this.showCheckOut = 1;
          this.showstartbreak = 1;
          this.showstopbreak = 0;
          this.showstartlunch = 1;
          this.showstoplunch = 0;
          this.showbtn = 1;
        }else if(this.attendanceDetailsAll[0].ATTENDANCE_TYPE == 'BREAK'){
      
          this.showCheckIn = 0;
          this.showstartbreak = 0;
          this.showstopbreak = 1;
          this.showCheckOut = 0;          
          this.showstartlunch = 0;
          this.showstoplunch = 0;
          this.showbtn = 1;
        }else if(this.attendanceDetailsAll[0].ATTENDANCE_TYPE == 'LUNCH'){
          
          this.showCheckIn = 0;
          this.showstartbreak = 0;
          this.showstopbreak = 0;
          this.showstartlunch = 0;
          this.showstoplunch = 1;
          this.showCheckOut = 0;
          this.showbtn = 1;
        }else{
          this.showCheckIn = 1;
          this.showstartbreak = 0;
          this.showstopbreak = 0;
          this.showstartlunch = 0;
          this.showstoplunch = 0;
          this.showCheckOut = 0;
          //this.showCheckOut = 1;
        }
        
      } else {

        this.showbtn = 0;
        this.showCheckIn = 1;        
        this.showstartbreak = 0;
        this.showstopbreak = 0;
        this.showstartlunch = 0;
        this.showstoplunch = 0;
        this.showCheckOut = 0;
        //this.showCheckOut = 1;        
      }

      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  getUserLocation() {

    this.presentLoadingDefault(true);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.geolocation.getCurrentPosition().then(resp => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
      this.geoAccuracy = resp.coords.accuracy;
      this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options)
        .then((result: NativeGeocoderReverseResult[]) => {
          console.log(result[0]);
          this.userlocation = result[0].countryName + ', ' + result[0].administrativeArea + ', ' + result[0].subAdministrativeArea + ', ' + result[0].postalCode;
          console.log(this.userlocation);
          this.getMasterUserLocation();
        }, error => {
          console.log(error)
        });

    }, error => {
      console.log('Error getting location', error);
    })
  }

  watchLocation() {
    this.isWatching = true;
    this.watchLocationUpdates = navigator.geolocation.watchPosition((position) => {
      this.geoLatitude = position.coords.latitude;
      this.geoLongitude = position.coords.longitude;
      this.getGeoencoder(position.coords.latitude, position.coords.longitude);
    });

    // this.watchLocationUpdates = this.geolocation.watchPosition();
    // this.watchLocationUpdates.subscribe((resp) => {
    //   this.geoLatitude = resp.coords.latitude;
    //   this.geoLongitude = resp.coords.longitude;          
    //   this.getGeoencoder(this.geoLatitude, this.geoLongitude);
    // });
  }

  stopLocationWatch() {
    this.isWatching = false;
    //this.watchLocationUpdates.unsubscribe();
    navigator.geolocation.clearWatch(this.watchLocationUpdates);
  }

  getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderReverseResult[]) => {
        this.userlocation = result[0].countryName + ', ' + result[0].administrativeArea + ', ' + result[0].subAdministrativeArea + ', ' + result[0].postalCode;
        //this.showCheckIn = 1;
        if (this.masterUserLocation.length > 0) {

          for (let i = 0; i < this.masterUserLocation.length; i++) {

            let distance = this.distance(parseFloat(this.masterUserLocation[i].LATITUDE), parseFloat(this.masterUserLocation[i].LONGITUDE), this.geoLatitude, this.geoLongitude, 'M');

            if (distance <= this.masterUserLocation[i].DISTANCE_COVERAGE) {
              this.userlocation = this.masterUserLocation[i].LOCATION_NAME;
              break;
            }
          }
        }
      })
      .catch((error: any) => {
        alert('Error getting location' + JSON.stringify(error));
      });
  }

  generateAddress(addressObj) {
    let obj = [];
    let address = "";
    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length)
        address += obj[val] + ', ';
    }
    return address.slice(0, -2);
  }

  checkIn(type: any) {
    let trans_type = '';

    if (this.showbtn == 1 && type == 'CHECKIN') {
      this.presentToast('User already checked-in.');
      return;
    }

    if (this.userlocation == null || this.userlocation == undefined || this.userlocation == '') {
      this.presentToast('User location should not be empty');
      return;
    }

    if (this.geoLatitude == null || this.geoLatitude == undefined || this.geoLatitude == '') {
      this.presentToast('User location should not be empty');
      return;
    }

    if (this.geoLongitude == null || this.geoLongitude == undefined || this.geoLongitude == '') {
      this.presentToast('User location should not be empty');
      return;
    }

    var app_platform: string = '';

    if (this.platform.is('ios')) {
      app_platform = 'ios';
    }

    if (this.platform.is('android')) {
      app_platform = 'android';
    }

    let attendance = {
      btn_type: 'IN',
      user_info_id: this.user.UserInfoId,
      user_name: this.user.Surname,
      checkin_location: this.userlocation,
      checkout_location: null,
      checkin_latitude: this.geoLatitude,
      checkin_longitude: this.geoLongitude,
      checkout_latitude: null,
      checkout_longitude: null,
      modified_by: this.user.UserInfoId,
      attendance_type: type

    }

    this.presentLoadingDefault(true);
    this.authService.postData(attendance, 'attendance/getInserUserAttendance').then((result) => {
      this.presentLoadingDefault(false);
      // this.audio = this.media.create('http://flexion.fakhruddinproperties.com:8883/thankyou/thankyou.mp3');
      // this.audio.play();
      this.insertedValues = result;
      this.showbtn = 1;
      console.log(this.insertedValues);
      let time = moment().format("hh:mm A");
      this.message = this.user.Surname + ' is checked in from' + this.userlocation + ' at ' + time;
      trans_type = 'ATTENDANCE';


      let push_message = {
        title: this.user.Surname,
        content: 'Attendance',
        message: this.message,
        app_platform: app_platform,
        user_info_id: this.user.ManagerID,
        loggedin_user_id: this.user.UserInfoId,
        trans_type: trans_type
      };

      this.authService.postData(push_message, 'pushnotification/pushnotificationsinglechat').then((result) => {
        this.message = "";
      }, (err) => {
        this.presentToast(err);
      });

      this.watchLocation();
      this.getUserCheckinDetails();
    }, err => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  checkOut(type: any) {

    if (this.attendanceDetailsAll.length == 0) {
      this.presentToast('Please Click Ckeck-in before Check-out');
      this.showbtn = 0;
      return;
    }

    if (this.userlocation == null || this.userlocation == undefined || this.userlocation == '') {
      this.presentToast('User location should not be empty');
      return;
    }

    if (this.geoLatitude == null || this.geoLatitude == undefined || this.geoLatitude == '') {
      this.presentToast('User location should not be empty');
      return;
    }

    if (this.geoLongitude == null || this.geoLongitude == undefined || this.geoLongitude == '') {
      this.presentToast('User location should not be empty');
      return;
    }

    var app_platform: string = '';

    if (this.platform.is('ios')) {
      app_platform = 'ios';
    }

    if (this.platform.is('android')) {
      app_platform = 'android';
    }

    let attendance = {
      btn_type: 'OUT',
      user_info_id: this.user.UserInfoId,
      user_name: this.user.Surname,
      checkin_location: null,
      checkout_location: this.userlocation,
      checkin_latitude: null,
      checkin_longitude: null,
      checkout_latitude: this.geoLatitude,
      checkout_longitude: this.geoLongitude,
      modified_by: this.user.UserInfoId,
      attendance_type: type

    }

    this.presentLoadingDefault(true);
    this.authService.postData(attendance, 'attendance/getInserUserAttendance').then((result) => {
      this.presentLoadingDefault(false);
      // this.audio = this.media.create('http://flexion.fakhruddinproperties.com:8883/thankyou/thankyou.mp3');
      // this.audio.play();
      this.insertedValues = result;
      console.log(this.insertedValues);
      this.showbtn = 0;
      this.stopLocationWatch();
      let time = moment().format("hh:mm A");
      this.message = this.user.Surname + ' is checked out from ' + this.userlocation + ' at ' + time;
      let trans_type = 'ATTENDANCE';

      let push_message = {
        title: this.user.Surname,
        content: 'Attendance',
        message: this.message,
        app_platform: app_platform,
        user_info_id: this.user.ManagerID,
        loggedin_user_id: this.user.UserInfoId,
        trans_type: trans_type
      };

      this.authService.postData(push_message, 'pushnotification/pushnotificationsinglechat').then((result) => {
        this.message = "";
        this.getUserCheckinDetails();
      }, (err) => {
        this.presentToast(err);
      });

    }, err => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  startbreak(type: any,action:any) {
    //let trans_type = '';

    if (this.userlocation == null || this.userlocation == undefined || this.userlocation == '') {
      this.presentToast('User location should not be empty');
      return;
    }

    if (this.geoLatitude == null || this.geoLatitude == undefined || this.geoLatitude == '') {
      this.presentToast('User location should not be empty');
      return;
    }

    if (this.geoLongitude == null || this.geoLongitude == undefined || this.geoLongitude == '') {
      this.presentToast('User location should not be empty');
      return;
    }
    let task_list = '';

    if(this.tasksearchdetails.length > 0){
        task_list = JSON.stringify(this.tasksearchdetails.filter(x=> x.STATUS ==3));
    }else{
      task_list = null;
    }
    

    let attendance = {
      btn_type: type,
      user_info_id: this.user.UserInfoId,
      user_name: this.user.Surname,
      checkin_location: this.userlocation,
      checkout_location: null,
      checkin_latitude: this.geoLatitude,
      checkin_longitude: this.geoLongitude,
      checkout_latitude: null,
      checkout_longitude: null,
      modified_by: this.user.UserInfoId,
      task_list : task_list,
      break_action: action

    }

    this.presentLoadingDefault(true);
    this.authService.postData(attendance, 'attendance/getInsertUserBreakAttendance').then((result) => {
      this.presentLoadingDefault(false);
      this.insertedValues = result;
      this.showbtn = 1;
      console.log(this.insertedValues);
      this.watchLocation();
      this.getUserCheckinDetails();

    }, err => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }
  


  getMasterUserLocation() {

    let params = {
      user_info_id: this.user.UserInfoId
    }

    this.authService.postData(params, 'attendance/getMasterUserLocation').then((result) => {
      this.masterUserLocation = result;
      console.log('master user location', this.masterUserLocation);
      //this.showCheckIn = 1;
      if (this.masterUserLocation.length > 0) {
        for (let i = 0; i < this.masterUserLocation.length; i++) {
          console.log(this.masterUserLocation[i].LATITUDE, this.masterUserLocation[i].LONGITUDE, this.geoLatitude, this.geoLongitude);
          let distance = this.distance(parseFloat(this.masterUserLocation[i].LATITUDE), parseFloat(this.masterUserLocation[i].LONGITUDE), this.geoLatitude, this.geoLongitude, 'M');

          if (distance <= this.masterUserLocation[i].DISTANCE_COVERAGE) {
            this.userlocation = this.masterUserLocation[i].LOCATION_NAME;
            break;
          }
        }
      }

      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  getuserformfunction() {
    this.presentLoadingDefault(true);
    let params = {
      user_info_id: this.user.UserInfoId
    }

    this.authService.postData(params, 'attendance/getUserFormFunction').then((result) => {
      this.userFormFunctionList = result;
      console.log('form function', this.userFormFunctionList);

      let checkout = this.userFormFunctionList.filter(x => x.FUNCTION_NAME == 'Check Out');
      let myattendance = this.userFormFunctionList.filter(x => x.FUNCTION_NAME == 'My Attendance ');


      if (checkout.length > 0) {
        this.showCheckOutformfn = 1;
      } else {
        this.showCheckOutformfn = 0;
      }

      if (myattendance.length > 0) {
        this.showMyAttendance = 1;
      } else {
        this.showMyAttendance = 0;
      }

      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  attendanceReport(type: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      reporting_user_id: null,
      type: type
    }]

    const myModal: Modal = this.modal.create('attendanceDetailPage', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });

  }

  UserattendanceReport(user_info_id: any, user_name: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      user_id: user_info_id,
      user_name: user_name
    }]

    const myModal: Modal = this.modal.create('userAttendanceReportPage', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });

  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = this.deg2rad(lat2 - lat1);
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "N") { dist = dist * 0.8684 }
      if (unit == "M") { dist = (dist * 1.609344) * 1000 }
      return dist;
    }
  }

  presentLoadingCustom(show) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img width = 50 height= 50 src="assets/imgs/logo.jpeg" />`,
      duration: 5000
    });

    if (show) {
      loading.present();
    } else {
      loading.dismissAll();
      loading = null
    }
  }

  getTaskDetails(type: any, label_user_id: any, tab_type: any) {

    this.presentLoadingDefault(true);

    this.openpage = tab_type;
    let params = {} as any;
    params.UserInfoId = this.user.UserInfoId;
    params.label_type = type;
    params.label_user_id = label_user_id;

    this.authService.postData(params, 'task/TaskManagementList').then((result) => {
      this.taskdetails = result;
      this.tasksearchdetails = result;
      console.log(this.tasksearchdetails);
      
      if (this.openpage == 'ResourceManager') {
        this.tasksearchdetails = this.tasksearchdetails.filter(x => x.STATUS != 4);
        this.tasksearchdetailsAll = this.tasksearchdetails;
      }

      if (this.openpage == 'ResourceManagerCompleted') {
        this.tasksearchdetails = this.tasksearchdetails.filter(x => x.STATUS == 4);
        this.tasksearchdetailsAll = this.tasksearchdetails;
      }

      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });

  }

}
