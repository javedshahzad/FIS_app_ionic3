import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CallnotificationPage } from '../callnotification/callnotification';
import { MgresclatedPage } from '../mgresclated/mgresclated'
import { CeoesclatedPage } from '../ceoesclated/ceoesclated'

@Component({
  selector: 'page-callmanagement',
  templateUrl: 'callmanagement.html',
})

export class CallmanagementPage {
  callManagementDetails: any;
  callcommentsForm: FormGroup
  insertedValues: any;
  Callmanament: any;
  CallinspectionList: any;
  Callinspection: any;
  CallEstimation: any;
  CallProcurement: any;
  CallWorkAssignment: any;
  AllCalls: any;
  callinspectiondetails: any;
  Callinspection_length: any;
  CallEstimation_length: any;
  CallProcurement_length: any;
  CallWorkAssignment_length: any;
  closedCallinspectionList: any;
  Call_Confrim_length: any;
  Add_Call_Inspection: any;
  AllCalls_length: any;
  workcompleted_length: any;
  callManagement_notification: any;
  closed_call_list: any;
  SearchListall: any;
  notificationall = {
    MynotificationList: [] as any,
    TodayNotification: [] as any,
    YesterdayNotification: [] as any,
    LastWeekNotification: [] as any
  } as any;
  CEO_ESCLATED_COUNT_length: any;
  MGR_ESCLATED_COUNT_length: any;
  public toggled: boolean = false;
  not_startlist: any;
  myprofilecount: any;
  myprofile: any;
  searchData = { "search_value": "" };
  user: any = localStorage.getItem('userData');
  userdata: any = JSON.parse(this.user);
  resourse: any = JSON.parse(localStorage.getItem('resourseData'));
  feedback_call_length = 0;
  completed_feedback_call_length = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.callcommentsForm = this.formBuilder.group({
      Comments: ['', Validators.compose([Validators.required])]
    });
  }

  notification() {
    this.navCtrl.push(CallnotificationPage, {}, { animate: false });
  }
  
  closeModal() {
    this.view.dismiss();
  }

  public toggle(): void {
    this.toggled = !this.toggled;
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

  ngOnInit() {
    console.log('ngOnInit');
    // this.Callinspectiondata();
    // this.getNotificationList();
    // this.myprofilecount = 0;
    // this.getmyprofiledetails();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
    this.myprofilecount = 0;
    //this.getNotificationList();
    this.Callinspectiondata();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }

  Callinspectiondata() {
    this.presentLoadingDefault(true);
    let data = {
      Resoursename: this.resourse.EMPNAME,
      TYPE_ID: this.resourse.TYPE_ID
    }
    this.authService.postData(data, 'Call_inspection/CallinspectionList/').then((result) => {
      this.presentLoadingDefault(false);
      this.CallinspectionList = result;
      this.callManagementDetails = result;
      if (this.CallinspectionList.length > 0) {
        this.getength();
      } else {
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  getNotificationList() {
    this.presentLoadingDefault(true);
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId
    }

    this.authService.postData(userdata, 'notification/notificationList').then((result) => {
      this.notificationall = result;
      this.presentLoadingDefault(false);
      this.callManagement_notification = this.notificationall.MynotificationList.filter(call => call.LABEL_TYPE === 'CM')
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  getength() {
    let AllCalls_count = 0;
    for (let i = 0; i < this.CallinspectionList.length; i++) {
      if (this.CallinspectionList[i].TYPE_NAME == "Status Count") {
        AllCalls_count += this.CallinspectionList[i].STATUS_COUNT;
      }
    }
    let Call_Confrim = this.CallinspectionList.filter(call => call.STATUS_ID === 233 || call.STATUS_ID === 232 && call.TYPE_NAME == "Status Count");
    let Callinspection_count = this.CallinspectionList.filter(call => call.STATUS_ID === 236 && call.TYPE_NAME == "Status Count");
    let CallEstimation_count = this.CallinspectionList.filter(call => call.STATUS_ID === 237 && call.TYPE_NAME == "Status Count");
    let CallProcurement_count = this.CallinspectionList.filter(call => call.STATUS_ID === 261 && call.TYPE_NAME == "Status Count");
    let CallWorkAssignment_count = this.CallinspectionList.filter(call => call.STATUS_ID === 238 && call.TYPE_NAME == "Status Count");
    this.AllCalls_length = AllCalls_count;
    let workcompleted_count = this.CallinspectionList.filter(call => call.STATUS_ID === 256 && call.TYPE_NAME == "Interm Status Count");
    let closed_call_list_count = this.CallinspectionList.filter(call => call.STATUS_ID === 0 && call.TYPE_NAME == "IS_CLOSED");
    
    if(closed_call_list_count.length > 0){
      this.closed_call_list = closed_call_list_count[0].STATUS_COUNT;
    }else{
      this.closed_call_list = 0;
    }
    
    let MGR_ESCLATED_COUNT = this.CallinspectionList.filter(call => call.STATUS_ID === 0 && call.TYPE_NAME == "MGR_ESCLATED_COUNT");
    let CEO_ESCLATED_COUNT = this.CallinspectionList.filter(call => call.STATUS_ID === 0 && call.TYPE_NAME == "CEO_ESCLATED_COUNT");
    let FEEDBACK_COUNT = this.CallinspectionList.filter(call => call.STATUS_ID === 0 && call.TYPE_NAME == "FEEDBACK_CALL");
    let COMPLETED_FEEDBACK_COUNT = this.CallinspectionList.filter(call => call.STATUS_ID === 0 && call.TYPE_NAME == "COMPLETED_FEEDBACK_CALL");

    if (MGR_ESCLATED_COUNT.length > 0) {
      this.MGR_ESCLATED_COUNT_length = MGR_ESCLATED_COUNT[0].STATUS_COUNT;
    } else {
      this.MGR_ESCLATED_COUNT_length = 0;
    }
    if (CEO_ESCLATED_COUNT.length > 0) {
      this.CEO_ESCLATED_COUNT_length = CEO_ESCLATED_COUNT[0].STATUS_COUNT;
    } else {
      this.CEO_ESCLATED_COUNT_length = 0;
    }

    if (FEEDBACK_COUNT.length > 0) {
      this.feedback_call_length = FEEDBACK_COUNT[0].STATUS_COUNT;
    } else {
      this.feedback_call_length = 0;
    }

    if (COMPLETED_FEEDBACK_COUNT.length > 0) {
      this.completed_feedback_call_length = COMPLETED_FEEDBACK_COUNT[0].STATUS_COUNT;
    } else {
      this.completed_feedback_call_length = 0;
    }

    if (Call_Confrim.length > 0) {
      var arr2 = 0;
      let arr1 = Call_Confrim[0].STATUS_COUNT;
      if (Call_Confrim.length > 1) {
        arr2 = Call_Confrim[1].STATUS_COUNT;
      } else {
        arr2 = 0
      }
      this.Call_Confrim_length = arr1 + arr2;
    } else {
      this.Call_Confrim_length = 0;
    }
    if (Callinspection_count.length > 0) {
      this.Callinspection_length = Callinspection_count[0].STATUS_COUNT;
    } else {
      this.Callinspection_length = 0;
    }
    if (CallEstimation_count.length > 0) {
      this.CallEstimation_length = CallEstimation_count[0].STATUS_COUNT;
    } else {
      this.CallEstimation_length = 0;
    }
    if (CallProcurement_count.length > 0) {
      this.CallProcurement_length = CallProcurement_count[0].STATUS_COUNT;
    } else {
      this.CallProcurement_length = 0;
    }
    if (CallWorkAssignment_count.length > 0) {
      this.CallWorkAssignment_length = CallWorkAssignment_count[0].STATUS_COUNT;
    } else {
      this.CallWorkAssignment_length = 0;
    }
    if (workcompleted_count.length > 0) {
      this.workcompleted_length = workcompleted_count[0].STATUS_COUNT;
    } else {
      this.workcompleted_length = 0;
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

  goBack() {
    this.navCtrl.setRoot(DashboardPage);
  }

  insertCallComments(i: any) {
    let CallCommentsData = this.callcommentsForm.value;
    let callDetailes = this.callManagementDetails[i];
    //console.log(this.user);
    //console.log(callDetailes);
    CallCommentsData.CALL_LOG_ID = callDetailes.CALL_LOG_ID;
    CallCommentsData.Status = callDetailes.STATUS_NAME;
    CallCommentsData.created_by = this.user.UserInfoId;
    CallCommentsData.modified_by = this.user.UserInfoId;
    CallCommentsData.Reference_Id = 0;
    CallCommentsData.ReferenceType = 0;
    //console.log(CallCommentsData);
    this.presentLoadingDefault(true);
    this.authService.postData(CallCommentsData, 'call_management/CallCommentsinsert').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Comments successfully saved");
      this.insertedValues = result;
      this.resetForm();
      // console.log('List ',this.insertedValues);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }
  resetForm() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  openModal(CALL_LOG_ID: any, STATUS_NAME: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = [{
      CALL_LOG_ID: CALL_LOG_ID,
      STATUS_NAME: STATUS_NAME
    }];

    const myModal: Modal = this.modal.create('callcomments', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      console.log("I have dismissed.");
      console.log(data);
    });

    myModal.onWillDismiss((data) => {
      console.log("I'm about to dismiss");
      console.log(data);
    });

  }


  opencallModal() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('createcall', myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });

  }

  Callinspectionbtn() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      inspection: this.CallinspectionList.filter(call => call.STATUS_ID === 236 && call.TYPE_NAME == "Status Count")
    }]

    const myModal: Modal = this.modal.create('inspectionoption', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });

  }

  CallEstimationbtn() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      inspection: this.CallinspectionList.filter(call => call.STATUS_ID === 237 && call.TYPE_NAME == "Status Count")
    }]

    const myModal: Modal = this.modal.create('estimationoption', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });

  }


  CallProcurementbtn() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      inspection: this.CallinspectionList.filter(call => call.STATUS_ID === 261 && call.TYPE_NAME == "Status Count")
    }]

    const myModal: Modal = this.modal.create('procurementoption', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });

  }

  CallWorkAssignmentbtn() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      inspection: this.CallinspectionList.filter(call => call.STATUS_ID === 238 && call.TYPE_NAME == "Status Count")
    }]

    const myModal: Modal = this.modal.create('workassignmentoption', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });

  }
  CallAllCallsbtn(btn: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      inspection: btn
    }]

    const myModal: Modal = this.modal.create('allactivecallspage', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });

  }
  workcompleted() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      inspection: this.CallinspectionList.filter(call => call.STATUS_ID === 256 && call.TYPE_NAME == "Interm Status Count")
    }]

    const myModal: Modal = this.modal.create('workcompletedoption', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });
  }


  customerfeedback() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      inspection: null
    }]

    const myModal: Modal = this.modal.create('callfeedbackpage', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
      this.ionViewDidLoad();
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });
  }

  completedfeedback() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      inspection: null
    }]

    const myModal: Modal = this.modal.create('completedfeedbackpage', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
      this.ionViewDidLoad();
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });
  }


  Callconfrimbtn() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      inspection: this.CallinspectionList.filter(call => call.STATUS_ID === 233 || call.STATUS_ID === 232 && call.TYPE_NAME == "Status Count")
    }]

    const myModal: Modal = this.modal.create('callconfirmationpage', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });
  }


  MGR_ESCLATED_COUNT_btn() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      inspection: 1
    }]

    const myModal: Modal = this.modal.create(MgresclatedPage, { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });
  }
  CEO_ESCLATED_COUNTbtn() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      inspection: 1
    }]

    const myModal: Modal = this.modal.create(CeoesclatedPage, { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });
  }

  SearchcallManagement() {

    if (this.searchData.search_value) {

      this.presentLoadingDefault(true);
      this.authService.postData(this.searchData, 'Call_inspection/getCallSearchList').then((result) => {
        this.SearchListall = result;
        // console.log(this.SearchListall);
        if (this.SearchListall.length == 0) {
          this.presentToast("No data found.");
          this.presentLoadingDefault(false);
        } else if (this.SearchListall.length > 0) {
          if (this.SearchListall[0].STATUS_ID == 240 || this.SearchListall[0].STATUS_NAME == 'CLOSED') {
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };

            let mymodaldata = [{
              inspection: 1,
              CALL_LOG_ID: this.SearchListall[0].CALL_LOG_ID
            }]

            const myModal: Modal = this.modal.create('allactivecallspage', { data: mymodaldata }, myModalOptions);

            myModal.present();

            myModal.onDidDismiss(() => {
              /* console.log("I have dismissed."); */
            });

            myModal.onWillDismiss(() => {
              /* console.log("I'm about to dismiss"); */
            });

          } else if (this.SearchListall[0].STATUS_ID == 232 || this.SearchListall[0].STATUS_ID == 233) {
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };

            let mymodaldata = [{
              inspection: this.SearchListall
            }]

            const myModal: Modal = this.modal.create('callconfirmationpage', { data: mymodaldata }, myModalOptions);

            myModal.present();

            myModal.onDidDismiss(() => {
              console.log("I have dismissed.");
            });

            myModal.onWillDismiss(() => {
              console.log("I'm about to dismiss");
            });
          } else if (this.SearchListall[0].INTERM_STATUS_ID == 241) {
            let data = {
              Resoursename: this.resourse.EMPNAME,
              INTERM_STATUS_ID: 241,
              TYPE_ID: this.resourse.TYPE_ID
            }
            this.authService.postData(data, 'Call_inspection/getnotstartinspection/').then((result) => {
              this.presentLoadingDefault(false);
              this.not_startlist = result;
              var item = parseInt(this.searchData.search_value);
              var finallist = [];
              if (isNaN(item)) {
                finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
              } else {
                finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
              }


              const myModalOptions: ModalOptions = {
                enableBackdropDismiss: false
              };

              let mymodaldata = [{
                inspection: finallist[0]
              }]

              const myModal: Modal = this.modal.create('Callinspectionpage', { data: mymodaldata }, myModalOptions);

              myModal.present();

              myModal.onDidDismiss(() => {
                console.log("I have dismissed.");
              });

              myModal.onWillDismiss(() => {
                console.log("I'm about to dismiss");
              });

            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast("Something went to wrong, please try again later");
            });
          } else if (this.SearchListall[0].INTERM_STATUS_ID == 242) {
            let data = {
              Resoursename: this.resourse.EMPNAME,
              INTERM_STATUS_ID: 242,
              TYPE_ID: this.resourse.TYPE_ID
            }
            this.authService.postData(data, 'Call_inspection/getnotstartinspection/').then((result) => {
              this.presentLoadingDefault(false);
              this.not_startlist = result;
              var item = parseInt(this.searchData.search_value);
              var finallist = [];
              if (isNaN(item)) {
                finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
              } else {
                finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
              }

              const myModalOptions: ModalOptions = {
                enableBackdropDismiss: false
              };

              let mymodaldata = [{
                inspection: finallist[0]
              }]

              const myModal: Modal = this.modal.create('Callinspectionpage', { data: mymodaldata }, myModalOptions);

              myModal.present();

              myModal.onDidDismiss(() => {
                console.log("I have dismissed.");
              });

              myModal.onWillDismiss(() => {
                console.log("I'm about to dismiss");
              });

            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast("Something went to wrong, please try again later");
            });
          } else if (this.SearchListall[0].INTERM_STATUS_ID == 246) {
            let data = {
              Resoursename: this.resourse.EMPNAME,
              INTERM_STATUS_ID: 246,
              TYPE_ID: this.resourse.TYPE_ID,
            }
            this.authService.postData(data, 'Call_inspection/getAllCallList/').then((result) => {
              this.presentLoadingDefault(false);
              this.not_startlist = result;
              var item = parseInt(this.searchData.search_value);
              var finallist = [];
              if (isNaN(item)) {
                finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
              } else {
                finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
              }


              const myModalOptions: ModalOptions = {
                enableBackdropDismiss: false
              };

              let mymodaldata = [{
                inspection: finallist[0]
              }]

              const myModal: Modal = this.modal.create('callestimationpage', { data: mymodaldata }, myModalOptions);

              myModal.present();

              myModal.onDidDismiss(() => {
                console.log("I have dismissed.");
              });

              myModal.onWillDismiss(() => {
                console.log("I'm about to dismiss");
              });
            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast("Something went to wrong, please try again later");
            });
          } else if (this.SearchListall[0].INTERM_STATUS_ID == 249) {
            let data = {
              Resoursename: this.resourse.EMPNAME,
              INTERM_STATUS_ID: 249,
              TYPE_ID: this.resourse.TYPE_ID,
            }
            this.authService.postData(data, 'Call_inspection/getAllCallList/').then((result) => {
              this.presentLoadingDefault(false);
              this.not_startlist = result;
              var item = parseInt(this.searchData.search_value);
              var finallist = [];
              if (isNaN(item)) {
                finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
              } else {
                finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
              }

              const myModalOptions: ModalOptions = {
                enableBackdropDismiss: false
              };

              let mymodaldata = [{
                inspection: finallist[0]
              }]

              const myModal: Modal = this.modal.create('callestimationpage', { data: mymodaldata }, myModalOptions);

              myModal.present();

              myModal.onDidDismiss(() => {
                console.log("I have dismissed.");
              });

              myModal.onWillDismiss(() => {
                console.log("I'm about to dismiss");
              });
            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast("Something went to wrong, please try again later");
            });
          } else if (this.SearchListall[0].INTERM_STATUS_ID == 248) {
            let data = {
              Resoursename: this.resourse.EMPNAME,
              INTERM_STATUS_ID: 248,
              TYPE_ID: this.resourse.TYPE_ID
            }
            this.authService.postData(data, 'Call_inspection/getAllCallList/').then((result) => {
              this.presentLoadingDefault(false);
              this.not_startlist = result;
              var item = parseInt(this.searchData.search_value);
              var finallist = [];
              if (isNaN(item)) {
                finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
              } else {
                finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
              }

              const myModalOptions: ModalOptions = {
                enableBackdropDismiss: false
              };

              let mymodaldata = [{
                inspection: finallist[0]
              }]

              const myModal: Modal = this.modal.create('callestimationpage', { data: mymodaldata }, myModalOptions);

              myModal.present();

              myModal.onDidDismiss(() => {
                console.log("I have dismissed.");
              });

              myModal.onWillDismiss(() => {
                console.log("I'm about to dismiss");
              });
            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast("Something went to wrong, please try again later");
            });
          } else if (this.SearchListall[0].INTERM_STATUS_ID == 247) {
            let data = {
              Resoursename: this.resourse.EMPNAME,
              INTERM_STATUS_ID: 247,
              TYPE_ID: this.resourse.TYPE_ID
            }
            this.authService.postData(data, 'Call_inspection/getAllCallList/').then((result) => {
              this.presentLoadingDefault(false);
              this.not_startlist = result;
              var item = parseInt(this.searchData.search_value);
              var finallist = [];
              if (isNaN(item)) {
                finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
              } else {
                finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
              }

              const myModalOptions: ModalOptions = {
                enableBackdropDismiss: false
              };

              let mymodaldata = [{
                inspection: finallist[0]
              }]

              const myModal: Modal = this.modal.create('callestimationpage', { data: mymodaldata }, myModalOptions);

              myModal.present();

              myModal.onDidDismiss(() => {
                console.log("I have dismissed.");
              });

              myModal.onWillDismiss(() => {
                console.log("I'm about to dismiss");
              });
            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast("Something went to wrong, please try again later");
            });
          } else if (this.SearchListall[0].INTERM_STATUS_ID == 262) {
            let data = {
              Resoursename: this.resourse.EMPNAME,
              INTERM_STATUS_ID: 262,
              TYPE_ID: this.resourse.TYPE_ID
            }
            this.authService.postData(data, 'Call_inspection/getAllCallList/').then((result) => {
              this.presentLoadingDefault(false);
              this.not_startlist = result;
              var item = parseInt(this.searchData.search_value);
              var finallist = [];
              if (isNaN(item)) {
                finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
              } else {
                finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
              }

              const myModalOptions: ModalOptions = {
                enableBackdropDismiss: false
              };

              let mymodaldata = [{
                inspection: finallist[0]
              }]

              const myModal: Modal = this.modal.create('callprocurementpage', { data: mymodaldata }, myModalOptions);

              myModal.present();

              myModal.onDidDismiss(() => {
                console.log("I have dismissed.");
              });

              myModal.onWillDismiss(() => {
                console.log("I'm about to dismiss");
              });
            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast("Something went to wrong, please try again later");
            });
          } else if (this.SearchListall[0].INTERM_STATUS_ID == 281) {
            let data = {
              Resoursename: this.resourse.EMPNAME,
              INTERM_STATUS_ID: 281,
              TYPE_ID: this.resourse.TYPE_ID
            }
            this.authService.postData(data, 'Call_inspection/getAllCallList/').then((result) => {
              this.presentLoadingDefault(false);
              this.not_startlist = result;
              var item = parseInt(this.searchData.search_value);
              var finallist = [];
              if (isNaN(item)) {
                finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
              } else {
                finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
              }

              const myModalOptions: ModalOptions = {
                enableBackdropDismiss: false
              };

              let mymodaldata = [{
                inspection: finallist[0]
              }]

              const myModal: Modal = this.modal.create('callprocurementpage', { data: mymodaldata }, myModalOptions);

              myModal.present();

              myModal.onDidDismiss(() => {
                console.log("I have dismissed.");
              });

              myModal.onWillDismiss(() => {
                console.log("I'm about to dismiss");
              });
            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast("Something went to wrong, please try again later");
            });
          } else if (this.SearchListall[0].INTERM_STATUS_ID == 251) {
            let data = {
              Resoursename: this.resourse.EMPNAME,
              INTERM_STATUS_ID: 251,
              TYPE_ID: this.resourse.TYPE_ID
            }
            this.authService.postData(data, 'Call_inspection/getAllCallList/').then((result) => {
              this.presentLoadingDefault(false);
              this.not_startlist = result;
              var item = parseInt(this.searchData.search_value);
              var finallist = [];
              if (isNaN(item)) {
                finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
              } else {
                finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
              }

              const myModalOptions: ModalOptions = {
                enableBackdropDismiss: false
              };

              let mymodaldata = [{
                inspection: finallist[0]
              }]

              const myModal: Modal = this.modal.create('callworkassignmentpage', { data: mymodaldata }, myModalOptions);

              myModal.present();

              myModal.onDidDismiss(() => {
                console.log("I have dismissed.");
              });

              myModal.onWillDismiss(() => {
                console.log("I'm about to dismiss");
              });
            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast("Something went to wrong, please try again later");
            });
          } else if (this.SearchListall[0].INTERM_STATUS_ID == 252) {
            let data = {
              Resoursename: this.resourse.EMPNAME,
              INTERM_STATUS_ID: 252,
              TYPE_ID: this.resourse.TYPE_ID
            }
            this.authService.postData(data, 'Call_inspection/getAllCallList/').then((result) => {
              this.presentLoadingDefault(false);
              this.not_startlist = result;
              var item = parseInt(this.searchData.search_value);
              var finallist = [];
              if (isNaN(item)) {
                finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
              } else {
                finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
              }

              const myModalOptions: ModalOptions = {
                enableBackdropDismiss: false
              };

              let mymodaldata = [{
                inspection: finallist[0]
              }]

              const myModal: Modal = this.modal.create('callworkassignmentpage', { data: mymodaldata }, myModalOptions);

              myModal.present();

              myModal.onDidDismiss(() => {
                console.log("I have dismissed.");
              });

              myModal.onWillDismiss(() => {
                console.log("I'm about to dismiss");
              });
            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast("Something went to wrong, please try again later");
            });
          } else if (this.SearchListall[0].INTERM_STATUS_ID == 260) {
            let data = {
              Resoursename: this.resourse.EMPNAME,
              INTERM_STATUS_ID: 260,
              TYPE_ID: this.resourse.TYPE_ID
            }
            this.authService.postData(data, 'Call_inspection/getAllCallList/').then((result) => {
              this.presentLoadingDefault(false);
              this.not_startlist = result;
              var item = parseInt(this.searchData.search_value);
              var finallist = [];
              if (isNaN(item)) {
                finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
              } else {
                finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
              }

              const myModalOptions: ModalOptions = {
                enableBackdropDismiss: false
              };

              let mymodaldata = [{
                inspection: finallist[0]
              }]

              const myModal: Modal = this.modal.create('callworkassignmentpage', { data: mymodaldata }, myModalOptions);

              myModal.present();

              myModal.onDidDismiss(() => {
                console.log("I have dismissed.");
              });

              myModal.onWillDismiss(() => {
                console.log("I'm about to dismiss");
              });
            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast("Something went to wrong, please try again later");
            });
          } else if (this.SearchListall[0].INTERM_STATUS_ID == 254) {
            let data = {
              Resoursename: this.resourse.EMPNAME,
              INTERM_STATUS_ID: 254,
              TYPE_ID: this.resourse.TYPE_ID
            }
            this.authService.postData(data, 'Call_inspection/getAllCallList/').then((result) => {
              this.presentLoadingDefault(false);
              this.not_startlist = result;
              var item = parseInt(this.searchData.search_value);
              var finallist = [];
              if (isNaN(item)) {
                finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
              } else {
                finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
              }

              const myModalOptions: ModalOptions = {
                enableBackdropDismiss: false
              };

              let mymodaldata = [{
                inspection: finallist[0]
              }]

              const myModal: Modal = this.modal.create('callworkassignmentpage', { data: mymodaldata }, myModalOptions);

              myModal.present();

              myModal.onDidDismiss(() => {
                console.log("I have dismissed.");
              });

              myModal.onWillDismiss(() => {
                console.log("I'm about to dismiss");
              });
            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast("Something went to wrong, please try again later");
            });
          } else if (this.SearchListall[0].INTERM_STATUS_ID == 256 && this.SearchListall[0].IS_BILLED != 1) {
            let data = {
              Resoursename: this.resourse.EMPNAME,
              INTERM_STATUS_ID: 256,
              TYPE_ID: this.resourse.TYPE_ID
            }
            this.authService.postData(data, 'Call_inspection/getAllCallList/').then((result) => {
              this.presentLoadingDefault(false);
              this.not_startlist = result;
              var item = parseInt(this.searchData.search_value);
              var finallist = [];
              if (isNaN(item)) {
                finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value && call.IS_BILLED != 1));
              } else {
                finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item && call.IS_BILLED != 1));
              }

              const myModalOptions: ModalOptions = {
                enableBackdropDismiss: false
              };

              let mymodaldata = [{
                inspection: finallist[0],
              }]

              const myModal: Modal = this.modal.create('billingpage', { data: mymodaldata }, myModalOptions);

              myModal.present();

              myModal.onDidDismiss(() => {
                console.log("I have dismissed.");
              });

              myModal.onWillDismiss(() => {
                console.log("I'm about to dismiss");
              });

            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast("Something went to wrong, please try again later");
            });
          } else if (this.SearchListall[0].IS_BILLED == 1) {

            let data = {
              Resoursename: this.resourse.EMPNAME,
              INTERM_STATUS_ID: 256,
              TYPE_ID: this.resourse.TYPE_ID
            }
            this.authService.postData(data, 'Call_inspection/getAllCallList/').then((result) => {
              this.presentLoadingDefault(false);
              this.not_startlist = result;
              var item = parseInt(this.searchData.search_value);
              var finallist = [];
              if (isNaN(item)) {
                finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value && call.IS_BILLED == 1));
              } else {
                finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item && call.IS_BILLED == 1));
              }


              const myModalOptions: ModalOptions = {
                enableBackdropDismiss: false
              };

              let mymodaldata = [{
                inspection: finallist[0],
              }]

              const myModal: Modal = this.modal.create('closedpage', { data: mymodaldata }, myModalOptions);

              myModal.present();

              myModal.onDidDismiss(() => {
                console.log("I have dismissed.");
              });

              myModal.onWillDismiss(() => {
                console.log("I'm about to dismiss");
              });

            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast("Something went to wrong, please try again later");
            });
          }
        }
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast("Something went to wrong, please try again later");
      });
    } else if (this.searchData.search_value == '') {
      this.presentLoadingDefault(false);
    } else {
      this.presentLoadingDefault(false);
      this.SearchListall;
    }
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
  getmyprofiledetails() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'account/Getmyprofileupdate/' + this.userdata.UserInfoId + '').then((result) => {
      this.myprofile = result;
      //console.log('Profile',this.myprofile);
      this.presentLoadingDefault(false);
      if (this.myprofile.length > 0) {
        this.myprofilecount = 1;
      } else {
        //this.presentToast("No data found.");
      }
    }, (err) => {
      this.presentToast("Something went to wrong, please try again later");
    });
  }
  getImage(row_no, item: any) {

    let objFile = this.myprofile.find(o => o.ID === row_no);
    let bytes = objFile.FILE_CONTENT.data;
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];

    if (extn == "jpg" || extn == "jpeg" || extn == "png") {
      if (this.myprofile.length > 0) {
        return `data:image/${extn};base64,${this.encode(bytes)}`;
      } else {
        return `./assets/imgs/no-found-photo.png`
      }
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
