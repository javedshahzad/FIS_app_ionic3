import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';

import * as moment from 'moment';

import { CalendarModalOptions } from "ion2-calendar";

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';


@IonicPage()
@Component({
  selector: 'page-parking',
  templateUrl: 'parking.html',
})
export class ParkingPage {

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

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController, private file: File, private fileOpener: FileOpener,
    private barcodeScanner: BarcodeScanner
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


  ionViewDidLoad() {
    console.log(this.user.UserRole);

    let parkingReports = this.user.UserRole.filter(x => x.RoleName == 'PARKING_REPORTS');
    let parkingReception = this.user.UserRole.filter(x => x.RoleName == 'PARKING_RECEPTION');

    if (parkingReports.length > 0) {
      this.enableParkingReports = 1;
    } else {
      this.enableParkingReports = 0;
    }

    if (parkingReception.length > 0) {
      this.enableParkingReception = 1;
    } else {
      this.enableParkingReception = 0;
    }

    this.login_user = this.user.UserInfoId
    var today = new Date();
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.localDate = date;
    this.heldOn = date;
    this.heldOnDate = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();
    this.nextmeeting = date;
    this.nextmeetingDate = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();

    this.presentLoadingDefault(true);

    let params = {
      user_info_id: this.user.UserInfoId
    }

    this.authService.postData(params, 'parking/getCommonLinkDetails').then((result) => {
      this.parkingDetailsAll = result;
      console.log(this.parkingDetailsAll);
      if (this.parkingDetailsAll.length > 0) {
        this.available_hr = this.parkingDetailsAll[0].PARKING_CREDIT;
        this.utilized_hr = this.parkingDetailsAll[0].UTILIZED_HR;
      } else {
        this.available_hr = 0;
        this.utilized_hr = 0;
      }

      this.getParkingAll();
      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }




  segmentChanged(event) {
    console.log(event.value);
    let tabValue = event.value;
    this.tab_name = event.value;
    if (tabValue == 'validate') {
      console.log('validate');
    } else if (tabValue == 'reports') {
      console.log('reports');
    }
  }


  validateticketno() {
    console.log(this.ticketno, this.ticketno.length);

    if (this.ticketno.length > 0) {

      let params = {
        token_no: this.ticketno
      }

      debugger;

      this.authService.postData(params, 'parking/getCarParkingDetailsById').then((result) => {
        this.carparkingDetails = result;
        console.log(this.carparkingDetails);

        if(this.carparkingDetails.length == 0){
          this.presentToast('Invalid Token');
        }else{

          if(this.carparkingDetails[0].CAR_PARKING_DETAILS_ID == 0){
            this.presentToast('Invalid Token');
          }else if (this.carparkingDetails[0].GUEST_UP_BY != 0 && this.carparkingDetails[0].IS_GUEST == 1) {
            this.presentToast('Token Id already validated');
          } else {
            console.log(this.carparkingDetails[0].CAR_PARKING_DETAILS_ID);
            this.updateGuestStatus(this.carparkingDetails[0].CAR_PARKING_DETAILS_ID);
            this.getInsertupdateCommonLink(this.carparkingDetails[0].CAR_PARKING_DETAILS_ID);
          }
        }
       

      }, (err) => {
        this.presentToast(err);
      });

    } else {
      this.presentToast('Invalid Token');
    }
  }

  updateGuestStatus(id: any) {

    let params = {
      car_parking_details_id: this.ticketno,
      car_number: this.user.Surname,
      modified_by: this.user.UserInfoId,
    }

    this.authService.postData(params, 'parking/getCarParkingGuestUpdate').then((result) => {
      console.log(result);
      if (result > 0) {
        this.presentToast("Your Ticket " + this.ticketno + " is validated Successfully");
        this.ticketno = '';

      } else {
        this.presentToast("Car details not found");
        this.ticketno = '';
      }

    }, (err) => {
      this.presentToast(err);
    });

  }

  getInsertupdateCommonLink(id: any) {

    let params = {
      description: 'Guest Update',
      link_from_id: this.user.UserInfoId,
      link_type: 'Parking Guest Update',
      link_to_id: this.ticketno,
      modified_by: this.user.UserInfoId,
    }
    debugger;
    this.authService.postData(params, 'parking/getInsertUpdateCommonLink').then((result) => {
      console.log(result);
      this.getParkingAll();
    }, (err) => {
      this.presentToast(err);
    });

  }

  getParkingAll() {

    let params = {
      guest_by: this.user.UserInfoId,
    }

    this.authService.postData(params, 'parking/getParkingall').then((result) => {
      this.parkingAll = result;
      this.parkingAll = this.parkingAll.filter(x => x.STATUS == 0 && x.IS_GUEST == 1)
      console.log(this.parkingAll);

      if (this.parkingAll.length > 0) {

        for (let i = 0; i < this.parkingAll.length; i++) {
          let datest = "";
          console.log(this.parkingAll[i].CHECKIN_DATE_1);
          const ckdate = new Date(this.parkingAll[i].CHECKIN_DATE_1);
          console.log(ckdate);
          this.parkingAll[i].CHECKIN_DATE = ckdate;
          var today = new Date();
          let seconds = Math.round((today.getTime() - ckdate.getTime()) / 1000);
          let x = this.secondsToDhms(seconds);

          this.parkingAll[i].DISPLAY_HOURS = x;
          console.log(seconds, x);

        }
      }


    }, (err) => {
      this.presentToast(err);
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

  opencalendarheldon() {
    if (this.calendarshowheldon == 1) {
      this.calendarshowheldon = 0;
    } else {
      this.calendarshowheldon = 1;
    }
  }

  heldOnChange(event) {
    var today = new Date(event._d);
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.heldOn = date;
    this.heldOnDate = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();
    if (this.calendarshowheldon == 1) {
      this.calendarshowheldon = 0;
    } else {
      this.calendarshowheldon = 1;
    }
  }

  opencalendarnextmeetingshow() {
    if (this.calendarshownextmeeting == 1) {
      this.calendarshownextmeeting = 0;
    } else {
      this.calendarshownextmeeting = 1;
    }
  }

  nextmeetingonChange(event) {
    var today = new Date(event._d);
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.nextmeeting = date;
    this.nextmeetingDate = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();
    if (this.calendarshownextmeeting == 1) {
      this.calendarshownextmeeting = 0;
    } else {
      this.calendarshownextmeeting = 1;
    }
  }

  generateReport() {
    console.log(this.heldOnDate, this.nextmeetingDate);
    this.getParkingReportDetails();
  }

  getParkingReportDetails() {

    let from_date = null;
    let to_date = null;
    let user_id = this.user.UserInfoId;

    from_date = this.heldOnDate;
    to_date = this.nextmeetingDate;

    let params = {
      guest_by: user_id,
      status: 1,
      from_date: from_date,
      to_date: to_date
    }
    this.presentLoadingDefault(true);
    this.authService.postData(params, 'parking/getParkingReportAll').then((result) => {
      this.parkingReportDetails = result;

      for (let i = 0; i < this.parkingReportDetails.length; i++) {

        this.parkingReportDetails[i].CHECKIN_DATE_1 = new Date(this.parkingReportDetails[i].CHECKIN_DATE_1) //moment(this.parkingReportDetails[i].CHECKIN_DATE_1).format("DD-MM-YYYY hh:mm A");
        this.parkingReportDetails[i].CHECKOUT_DATE_1 = new Date(this.parkingReportDetails[i].CHECKOUT_DATE_1) //moment(this.parkingReportDetails[i].CHECKOUT_DATE_1).format("DD-MM-YYYY hh:mm A")

        let seconds = Math.round((this.parkingReportDetails[i].CHECKOUT_DATE_1.getTime() - this.parkingReportDetails[i].CHECKIN_DATE_1.getTime()) / 1000);
        let x = this.secondsToDhms(seconds);
        this.parkingReportDetails[i].TOTAL_HOURS = x;
      }

      console.log(this.parkingReportDetails);
      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  openAttendanceReport() {

    let from_date = moment(this.heldOnDate).format("DD-MM-YYYY");
    let to_date = moment(this.nextmeetingDate).format("DD-MM-YYYY");

    if (this.parkingReportDetails != undefined) {

      if (this.parkingReportDetails.length > 0) {

        for (let i = 0; i < this.parkingReportDetails.length; i++) {
          this.parkingReportDetails[i].CHECKIN_DATE_1 = moment(this.parkingReportDetails[i].CHECKIN_DATE_1).format("DD-MM-YYYY hh:mm A");
          this.parkingReportDetails[i].CHECKOUT_DATE_1 = moment(this.parkingReportDetails[i].CHECKOUT_DATE_1).format("DD-MM-YYYY hh:mm A");
        }

        var docDefinition = {
          content: [
            { text: 'Hour Utilization Report', style: 'header', decoration: 'underline' },
            '                                                  ',
            '                                                  ',
            {
              style: 'tableExample',
              table: {
                widths: [125, '*'],
                heights: ['auto', 'auto', 'auto', 'auto'],
                body: [
                  [{ text: 'From Date:', style: 'tablebody' }, { text: from_date, style: 'tablebody' }],
                  [{ text: 'To Date:', style: 'tablebody' }, { text: to_date, style: 'tablebody' }],
                  [{ text: 'Total Credit Hours Available:', style: 'tablebody' }, { text: this.available_hr, style: 'tablebody' }],
                  [{ text: 'Total Credit Hours Utilized:', style: 'tablebody' }, { text: this.utilized_hr, style: 'tablebody' }]

                ]
              }
            },
            '                          ',

            this.table(this.parkingReportDetails, ['CHECKIN_DATE_1', 'CAR_PARKING_DETAILS_IDS', 'CHECKOUT_DATE_1', 'TOTAL_HOURS'], ['Check In Date & Time', 'Ticket Id', 'Check Out Date & Time', 'Hours'])

          ],
          styles: {
            header: {
              fontSize: 16,
              bold: true,
              alignment: 'center'
            },
            tableHeader: {
              bold: true,
              fontSize: 12,
              background: 'black',
              color: 'white'
            },
            subheader: {
              fontSize: 14,
              bold: true,
              margin: [0, 15, 0, 0]
            },
            story: {
              italic: true,
              alignment: 'center',
              width: '50%',
            },
            itemsTableHeader: {
              bold: true,
              fontSize: 13,
              color: 'black'
            },
            tableExample: {
              margin: [0, 5, 0, 15]
            },
            tablebody: {
              fontSize: 12,
              bold: true,
              fillColor: 'grey',
              color: 'white'
            }
          }
        }

        this.pdfObj = pdfMake.createPdf(docDefinition);

        let file_name = 'attendance.pdf';

        if (this.platform.is('cordova')) {
          this.pdfObj.getBuffer((buffer) => {
            var blob = new Blob([buffer], { type: 'application/pdf' });
            const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
            this.file.writeFile(writeDirectory, file_name, blob, { replace: true }).then(fileEntry => {
              this.fileOpener.open(writeDirectory + file_name, 'application/pdf');
            });
          });
        } else {
          this.pdfObj.download();
        }

      } else {
        this.presentToast('No data found.');
        return;
      }

    } else {
      this.presentToast('Please generate report.');
      return;
    }




  }


  table(data, columns, display) {
    return {
      table: {
        headerRows: 1,
        body: this.buildTableBody(data, columns, display)
      }
    };
  }

  buildTableBody(data, columns, display) {
    var body = [];

    body.push(display);

    data.forEach(function (row) {
      var dataRow = [];

      columns.forEach(function (column) {
        dataRow.push(row[column]);
      })

      body.push(dataRow);
    });

    return body;
  }

  scanbarcode(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.ticketno = barcodeData.text;
     }).catch(err => {
         console.log('Error', err);
     });
  }
}
