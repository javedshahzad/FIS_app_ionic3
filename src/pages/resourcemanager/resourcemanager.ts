import { Component } from '@angular/core';
import { IonicPage, PopoverController, Platform, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { CreateTaskPage } from '../createtask/createtask';
import { ResManagerUserlistPage } from '../res-manager-userlist/res-manager-userlist';
import { userresorcelistPage } from '../userresorcelist/userresorcelist';

@IonicPage()
@Component({
  selector: 'page-resourcemanager',
  templateUrl: 'resourcemanager.html',
})

export class resourcemanagerPage {
  userdetails: any;
  searchData = { "search_value": "" };
  taskdetails = {
    assignedtaskList: [] as any,
    tasklistcount: [] as any,
    current_week: [] as any,
    next_week: [] as any,
  } as any;
  percent = [] as any;
  myModalData: any;
  taskdetailsall: any;
  taskdetailsearchall = {} as any;
  userCreatedTaskCount: number = 0;
  userCreatedTaskOverdueCount: number = 0;
  TYPE: any;
  USER_ID: any;
  USER_NAME: any;
  TASK_TYPE: any;
  productivity_percentage: any;
  rm_task_count: number = 0;
  resourse: any = localStorage.getItem('resourseData');
  user: any = localStorage.getItem('userData');
  login_user_type: any;
  pet: string = "pending";
  tab_name: any;

  tasksearchdetails: any;
  today: any;
  openpage: any;
  showassignedto = 0;
  attendance: any;

  attendanceDetailsAll: any;

  showCheckIn = 0;
  showstartbreak = 0;
  showstopbreak = 0;
  showstartlunch = 0;
  showstoplunch = 0;
  showbtn = 0;
  showCheckOut = 0;

  allowtransaction = 0;

  hierachytitle: any;
  show_hierachy = 0;
  expandlist: any;
  expandlistnxt: any;
  hierachyList: any;
  insertedValues: any;
  pushnotificationValues: any;

  Callprocurementvalue: any;
  Callprocurement: any;
  tasksearchdetailsAll: any;
  ImageList:any;
  
  showBtn = -1;
  isOpen = false;
  oldBtn = -1;

  ppmlistAll: any;
  ppmlistSearch:any;
  calllistAll:any;
  calllistSearch:any;
  Lpomanament:any;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController,
    private popoverCtrl: PopoverController,
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.resourse = this.resourse ? JSON.parse(this.resourse) : {};
    this.today = Date.now();
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
    // this.getuser();

      this.login_user_type = this.resourse.TYPE_USER;
      
      this.showBtn = -1;
      this.isOpen  = false;
      this.oldBtn  = -1;

      if (this.login_user_type == 'Engineer') {
        this.getTaskDetails('Pending', null, 'ResourceManager');
        this.getUserCheckinDetails();
      } else {
        this.gettask();
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

        if (this.attendanceDetailsAll[0].ATTENDANCE_TYPE == 'CHECKIN') {

          this.allowtransaction = 1;

        } else if (this.attendanceDetailsAll[0].ATTENDANCE_TYPE == 'BREAK') {

          this.allowtransaction = 0;

        } else if (this.attendanceDetailsAll[0].ATTENDANCE_TYPE == 'LUNCH') {

          this.allowtransaction = 0;

        } else {
          this.showCheckIn = 1;
          this.showCheckOut = 1;
        }

      } else {
        this.allowtransaction = 0;
        this.showbtn = 0;
        this.showCheckIn = 1;
        this.showCheckIn = 1;
      }

      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  closeModal() {
    this.view.dismiss();
  }

  segmentChanged(event) {

    console.log(event.value);
    let tabValue = event.value;

    this.tab_name = event.value;

    if (tabValue == 'pending') {
      this.getTaskDetails('Pending', null, 'ResourceManager');
    } else if (tabValue == 'confirm') {
      this.getTaskDetails('ResourceManagerCompletedtask', null, 'ResourceManagerCompleted');
    } else if (tabValue == 'feedback') {
      this.getFeedbackCalls()
    } else if (tabValue == 'ppm') {
      this.getPpmListAll();
    }else if (tabValue == 'calls') {
      this.getCallsListAll();
    }

  }

  gettask() {
    console.log(this.resourse);
    this.presentLoadingDefault(true);
    let user_type = "Supervisor";
    this.authService.getData({}, `task/resourcemanager/${this.user.UserInfoId}/${user_type}`).then((result) => {
      this.presentLoadingDefault(false);
      this.taskdetails = result;
      this.userCreatedTaskCount = 0;
      this.userCreatedTaskOverdueCount = 0;
      console.log(this.taskdetails );

      if (this.resourse.TYPE_USER == "Supervisor") {
        this.taskdetails.assignedtaskList = this.taskdetails.assignedtaskList.filter(x => x.USER_INFO_ID == this.user.UserInfoId);
        this.taskdetails.tasktime = this.taskdetails.tasktime.filter(x => x.ASSIGNED_USER_INFO_ID == this.user.UserInfoId);
      } else if (this.resourse.TYPE_USER == "Engineer") {
        this.taskdetails.assignedtaskList = this.taskdetails.assignedtaskList.filter(x => x.USER_INFO_ID == this.user.ManagerID);
        this.taskdetails.tasktime = this.taskdetails.tasktime.filter(x => x.ASSIGNED_USER_INFO_ID == this.user.ManagerID);
      }
      //var total_time = "10:00:00";
      //  this.taskdetails.assignedtaskList = this.taskdetails.assignedtaskList.filter(x=> x.TYPE_USER == "Supervisor");  TYPE_USER
      for (var j = 0; j < this.taskdetails.assignedtaskList.length; j++) {
        let _percent = 0;
        if (this.taskdetails.tasktime.length > 0) {
          let taskTimelist = this.taskdetails.tasktime.filter(x => x.ASSIGNED_USER_INFO_ID == this.taskdetails.assignedtaskList[j].USER_INFO_ID);
          if (taskTimelist.length > 0) {
            for (let k = 0; k < taskTimelist.length; k++) {
              if (taskTimelist[k].TASK_PERCENTAGE) {
                _percent += taskTimelist[k].TASK_PERCENTAGE;
              }
            }
            this.taskdetails.assignedtaskList[j].percent = Math.round(_percent / this.taskdetails.tasktime.length);
          } else {
            this.taskdetails.assignedtaskList[j].percent = _percent;
          }
        } else {
          this.taskdetails.assignedtaskList[j].percent = _percent;
        }
      }
      if (this.taskdetails.tasktime.length > 0) {
        let totalpercent = 0;
        for (let x = 0; x < this.taskdetails.tasktime.length; x++) {
          if (this.taskdetails.tasktime[x].TASK_PERCENTAGE>0) {

            // let splitTime = this.taskdetails.tasktime[x].TASK_TIME.split(':');
            // let work_time = parseInt(splitTime[0]) + ':' + parseInt(splitTime[1]) + ':' + parseInt(splitTime[2]);
            // totalpercent += Math.round(100 * (this.totalSeconds(work_time) / this.totalSeconds(total_time)));
            totalpercent += this.taskdetails.tasktime[x].TASK_PERCENTAGE;
          } else {
            totalpercent += 0;
          }
        };
        this.productivity_percentage = Math.round(totalpercent / this.taskdetails.tasktime.length);
      } else {
        this.productivity_percentage = 0;
      }
      this.taskdetailsearchall = this.taskdetails.assignedtaskList;
      //console.log('task list all -->', this.taskdetails);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });

  }

  totalSeconds(time) {
    var parts = time.split(':');
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }


  getImage(row_no, item: any) {

    let objFile = this.taskdetails.assignedtaskList.find(o => o.PROFILE_IMG_ID === row_no);
    if (objFile.FILE_CONTENT) {
      let bytes = objFile.FILE_CONTENT.data;
      let file_name = objFile.FILE_NAME;
      let nameSplit = file_name.split('.');
      let extn = nameSplit[nameSplit.length - 1];

      if (extn == "jpg" || extn == "jpeg" || extn == "png") {
        if (objFile.MYPROFILECOUNT > 0) {
          return `data:image/${extn};base64,${this.encode(bytes)}`;
        } else {
          return `./assets/imgs/no-found-photo.png`;
        }
      }
    } else {
      if (objFile.FILE_PATH) {
        return objFile.FILE_PATH;
      } else {
        return `./assets/imgs/no-found-photo.png`;
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


  openUserTaskModal(type: any, USER_ID: any, COUNT: any, USER_NAME: any, TASK_TYPE: any) {

    let flag = 0;
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    this.myModalData = [
      this.TYPE = type,
      this.USER_ID = USER_ID,
      this.USER_NAME = USER_NAME,
      this.TASK_TYPE = TASK_TYPE ? TASK_TYPE : null
    ]
    if (COUNT == 0) {
      flag = 1;
    }
    if (flag == 0) {
      // let myModal: Modal = this.modal.create('userresorcelistPage', { data: this.myModalData }, myModalOptions);
      // myModal.present();
      // myModal.onDidDismiss((data) => {
      //   this.gettask();
      // });
      // myModal.onWillDismiss((data) => {
      // });
      this.navCtrl.push(userresorcelistPage, { data: this.myModalData }, { animate: false });
    } else {
      this.presentToast(`No Data found.`);
    }

  }



  openUserAssignedTaskModal(type: any, USER_ID: any, COUNT: any, USER_NAME: any, TASK_TYPE: any) {

    let flag = 0;
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    
    this.myModalData = [
      this.TYPE = type,
      this.USER_ID = USER_ID,
      this.USER_NAME = USER_NAME,
      this.TASK_TYPE = TASK_TYPE ? TASK_TYPE : null
    ]
    if (COUNT == 0) {
      flag = 1;
    }
    if (flag == 0) {
      let myModal: Modal = this.modal.create('userresorcetasklistPage', { data: this.myModalData }, myModalOptions);
      myModal.present();
      myModal.onDidDismiss((data) => {
        this.gettask();
      });
      myModal.onWillDismiss((data) => {
      });
    } else {
      this.presentToast(`No Data found.`);
    }

  }

  openCallAssign(Type: any, AssignedToId: any, Count: any = 0) {
    let data = {
      CallLog_AssignedToId: AssignedToId,
      TYPE_ID: Type ? Type : 2
    }
    if (Count > 0) {
      this.presentLoadingDefault(true);
      this.authService.postData(data, 'Call_inspection/getCallogListRMTypeid').then((result) => {
        this.presentLoadingDefault(false);

        let mymodaldata = [{
          inspection: result
        }]
        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };


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
    } else {
      this.presentToast("No Data found");
    }

  }


  openCalTaskModal(type: any, USER_ID: any, COUNT: any, USER_NAME: any) {
    let flag = 0;
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    this.myModalData = [
      this.TYPE = type,
      this.USER_ID = USER_ID,
      this.USER_NAME = USER_NAME
    ]
    if (COUNT == 0) {
      flag = 1;
    }
    if (flag == 0) {
      let myModal: Modal = this.modal.create('CalLogTaskListPage', { data: this.myModalData }, myModalOptions);
      myModal.present();
      myModal.onDidDismiss((data) => {
        this.gettask();
      });
      myModal.onWillDismiss((data) => {
      });
    } else {
      this.presentToast(`No Data found.`);
    }
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  Searchuser() {
    var username = this.searchData.search_value;
    if (username != '') {
      this.taskdetails.assignedtaskList = this.taskdetailsearchall.filter(x => x.ASSIGNED_TO.includes(username));
    } else {
      this.taskdetails.assignedtaskList = this.taskdetailsearchall;
    }
  }


  // openResourseModal(type: any, USER_ID: any, COUNT: any, USER_NAME: any) {

  //   const myModalOptions: ModalOptions = {
  //     enableBackdropDismiss: false
  //   };

  //   this.myModalData = [
  //     this.TYPE = type,
  //     this.USER_ID = USER_ID,
  //     this.USER_NAME = USER_NAME
  //   ]
  //   if (COUNT > 0) {
  //     let myModal: Modal = this.modal.create('ResManagerUserlistPage', { data: this.myModalData }, myModalOptions);
  //     myModal.present();
  //     myModal.onDidDismiss((data) => {
  //       this.gettask();
  //     });
  //     myModal.onWillDismiss((data) => {
  //     });
  //   } else {
  //     this.presentToast(`No Data found.`);
  //   }

  // }

  openResourseModal(type: any, USER_ID: any, COUNT: any, USER_NAME: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    this.myModalData = [
      this.TYPE = type,
      this.USER_ID = USER_ID,
      this.USER_NAME = USER_NAME
    ]
    if (COUNT > 0) {
      this.navCtrl.push(ResManagerUserlistPage, {data: this.myModalData}, { animate: false });
      // let myModal: Modal = this.modal.create('ResManagerUserlistPage', { data: this.myModalData }, myModalOptions);
      // myModal.present();
      // myModal.onDidDismiss((data) => {
      //   this.gettask();
      // });
      // myModal.onWillDismiss((data) => {
      // });
    } else {
      this.presentToast(`No Data found.`);
    }

  }

  openModal(type: any) {

    let flag = 0;

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    if (type == "Active") {

      this.myModalData = [
        this.TYPE = type
      ]
      flag = 1;

    } else if (type == "ResourceManagerCompletedtask") {

      this.myModalData = [0,
        this.TYPE = type,
        'ResourceManagerCompleted'
      ]

      flag = 2;

    } else if (type == "Activity") {

      this.myModalData = [0,
        this.TYPE = "Activity",
        'ResourceManager'
      ]

      flag = 2;

    }

    if (flag == 0) {
      let myModal: Modal = this.modal.create('TaskGroupLabelPage', { data: this.myModalData }, myModalOptions);
      myModal.present();
      myModal.onDidDismiss((data) => {
        this.gettask();
      });
      myModal.onWillDismiss((data) => {
      });

    } else if (flag == 2) {
      let myModal: Modal = this.modal.create('TaskManagementDetailPage', { data: this.myModalData }, myModalOptions);
      myModal.present();
      myModal.onDidDismiss((data) => {
        this.gettask();
      });
      myModal.onWillDismiss((data) => {
      });
    } else {
      this.presentToast(`No Data found.`);
    }
  }

  completedfeedback() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      inspection: null
    }]

    const myModal: Modal = this.modal.create('taskCompletedfeedbackpage', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });
  }


  openAttendance() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModal: Modal = this.modal.create('AttendancePage', {}, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
      this.ionViewWillLoad();
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
      this.ionViewWillLoad();
    });
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
      for (var j = 0; j < this.tasksearchdetails.length; j++) {
        this.tasksearchdetails[j].COMMENTS = this.createTextLinks(this.tasksearchdetails[j].COMMENTS);
      }

      if (this.openpage == 'ResourceManager') {
        this.tasksearchdetails = this.tasksearchdetails.filter(x => x.STATUS != 4 && x.STATUS != 6);
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

  createTextLinks(text) {

    return (text || "").replace(
      /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
      function (match, space, url) {
        var hyperlink = url;
        if (!hyperlink.match('^https?:\/\/')) {
          hyperlink = 'http://' + hyperlink;
        }
        return space + ' <a href="' + hyperlink + '">' + url + '</a> ';
      }
    );
  };

  /// Below is button functions

  openhierachy(TASK_ID: any, TITLE: any) {
    this.hierachytitle = {};
    this.hierachytitle.TITLE = TITLE;
    this.hierachytitle.SEQ_TEXT = TASK_ID;
    var split_val = TASK_ID.split(".");
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/TaskManagementhierachy/' + split_val[0]).then((result) => {
      this.show_hierachy = 1;
      this.hierachyList = result;
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  markasread(TASK_ID: any) {

    let TASK_DATA = {
      task_id: TASK_ID,
      user_info_id: this.user.UserInfoId,
      modified_by: this.user.UserInfoId
    }
    this.presentLoadingDefault(true);
    this.authService.postData(TASK_DATA, 'task/MarkAsReadTask').then((result) => {
      this.presentLoadingDefault(false);
      this.insertedValues = result;
      this.ionViewWillLoad();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }


  openModalTaskUpload(TASK_ID: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: TASK_ID,
      task_data_val: this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID)
    }];

    let myModal: Modal = this.modal.create('TaskFileUploadsPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {

    });

    myModal.onWillDismiss((data) => {
    });
  }


  opentaskcommentModal(TASK_ID: any, index: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: TASK_ID,
      task_data_val: this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID)
    }];

    let myModal: Modal = this.modal.create('TaskCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      if (this.searchData.search_value != '') {
        this.getsearchlist();
        let expand = this.tasksearchdetails;
        for (var i = 0; i < expand.length; i++) {
          if (expand[i].TASK_ID == TASK_ID) {
            this.showBtn = i;
          }
        }
      } else {

        if (this.tab_name == 'pending') {
          this.getTaskDetails('Pending', null, 'ResourceManager');
        } else if (this.tab_name == 'confirm') {
          this.getTaskDetails('ResourceManagerCompletedtask', null, 'ResourceManagerCompleted');
        }

      }
    });

    myModal.onWillDismiss((data) => {
    });
  }


  getsearchlist() {
    let data = {
      SearchData: this.searchData.search_value,
      UserInfoId: this.user.UserInfoId
    }
    this.presentLoadingDefault(true);
    this.authService.postData(data, 'task/TaskManagementSearch').then((result) => {
      this.tasksearchdetails = result;
      this.taskdetails = result;
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  SearchTaskDetail() {

    let search_value = this.searchData.search_value;

    if (this.tab_name == 'feedback') {

      if (search_value != '') {

        this.Callprocurementvalue = this.Callprocurement.filter(item => (item.SEQ_TEXT ? item.SEQ_TEXT.includes(search_value) : '') || (item.ASSIGNED_TO ? item.ASSIGNED_TO.includes(search_value) : '') || (item.TITLE ? item.TITLE.includes(search_value) : ''));

        console.log('Search...', this.Callprocurementvalue);
      } else {
        this.Callprocurementvalue = this.Callprocurement;
        console.log('No Search...', this.Callprocurementvalue);
      }

    } else {

      if (search_value != '') {

        this.tasksearchdetails = this.tasksearchdetailsAll.filter(item => (item.SEQ_TEXT ? item.SEQ_TEXT.includes(search_value) : '') || (item.ASSIGNED_TO ? item.ASSIGNED_TO.includes(search_value) : '') || (item.TITLE ? item.TITLE.includes(search_value) : ''));

        console.log('Search...', this.tasksearchdetails);
      } else {
        this.tasksearchdetails = this.tasksearchdetailsAll;
        console.log('No Search...', this.tasksearchdetails);
      }
    }


  }


  update_task(TASK_ID: any, type: any) {

    if (this.allowtransaction == 1) {

      let inprocessingtask = this.tasksearchdetails.filter(item => item.TASK_ID != TASK_ID && item.STATUS == 3);
      let task = this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID);

      if (inprocessingtask.length == 0) {

        if(this.openpage == 'ResourceManager' && type == 'complete') {
            this.openupdatefeedback(TASK_ID);
            
        } else {

          if (type == "start") {

            task[0].NEXT_STATUS = 3;
            task[0].task_comments = "In Progress";
            task[0].current_value = 'Status is updated to In Progress.';
            task[0].prev_value = 'Previous status is ' + task[0].STATUS_NAME;

          } else if (type == "complete") {

            let millis = new Date().getTime() - new Date(task[0].START_TIME).getTime();
            var task_time = this.convertMS(millis);

            task[0].task_time = task_time;
            task[0].NEXT_STATUS = 4;
            task[0].task_comments = "completed";
            task[0].current_value = 'Status is updated to Completed.';
            task[0].prev_value = 'Previous status is ' + task[0].STATUS_NAME;

          } else if (type == "close") {

            task[0].NEXT_STATUS = 6;
            task[0].task_comments = "closed";
            task[0].current_value = 'Status is updated to closed.';
            task[0].prev_value = 'Previous status is ' + task[0].STATUS_NAME;

          } else if (type == "reopen") {

            task[0].NEXT_STATUS = 3;
            task[0].task_comments = "In Progress";
            task[0].current_value = 'Status is updated to In Progress.';
            task[0].prev_value = 'Previous status is ' + task[0].STATUS_NAME;

          } else if (type == "pause") {

            task[0].NEXT_STATUS = 8;
            task[0].task_comments = "Pause";
            task[0].current_value = 'Status is updated to Pause.';
            task[0].prev_value = 'Previous status is ' + task[0].STATUS_NAME;

          } else if (type == "resume") {

            task[0].NEXT_STATUS = 3;
            task[0].task_comments = "In Progress";
            task[0].current_value = 'Status is updated to In Progress.';
            task[0].prev_value = 'Previous status is ' + task[0].STATUS_NAME;

          }

          task[0].modified_by = this.user.UserInfoId;
          this.presentLoadingDefault(true);
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
            push_message.task_id = TASK_ID;
            push_message.trans_type = 'TMS';
            push_message.seq_text = task[0].SEQ_TEXT;
            debugger;
            this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
              this.presentLoadingDefault(false);
              this.pushnotificationValues = result;
            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast("Something went to wrong, please try again later");
            });

            this.ionViewWillLoad();
            //this.closeModal();
          }, (err) => {
            this.presentLoadingDefault(false);
            this.presentToast("Something went to wrong, please try again later");
          });

        }
      } else {
          let msg = 'The task no ' + inprocessingtask[0].SEQ_TEXT + ' in process, Please complete/ pause before start another task.'
          this.presentToast(msg);
          return;
      }

    } else {
      this.presentToast("Please check in before update task");
      return;
    }


  }

  openupdatefeedback(TASK_ID: any) {

    let task = this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID);
    let millis = new Date().getTime() - new Date(task[0].START_TIME).getTime();
    var task_time = this.convertMS(millis);
    task[0].task_time = task_time;
    task[0].NEXT_STATUS = 4;
    task[0].task_comments = "completed";
    task[0].current_value = 'Status is updated to Completed.';
    task[0].prev_value = 'Previous status is ' + task[0].STATUS_NAME;
    task[0].modified_by = this.user.UserInfoId;

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = [{
      feedbackcalls: task
    }];
    const myModal: Modal = this.modal.create('TaskCompleteUpdatePage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      this.searchData.search_value = '';
      this.ionViewWillLoad();
    });

    myModal.onWillDismiss((data) => {
    });

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


  delete_task(TASK_ID: any) {

    if (this.allowtransaction == 1) {
      let task = this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID);

      let TASK_DATA = {
        task_id: TASK_ID,
        modified_by: this.user.UserInfoId,
        current_value: 'The task is deleted.',
        prev_value: task[0].STATUS_NAME,
        ASSIGNED_USER_INFO_ID: task[0].ASSIGNED_USER_INFO_ID,
        CREATED_BY: task[0].CREATED_BY
      }
      this.presentLoadingDefault(true);
      this.authService.postData(TASK_DATA, 'task/DeleteTask').then((result) => {
        this.presentLoadingDefault(false);
        this.presentToast("Task Deleted Successfully");
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
        push_message.message = 'Task No: ' + task[0].SEQ_TEXT + "\n" + 'Title: ' + task[0].TITLE + "\n Comments: The task is deleted";
        push_message.app_platform = app_platform;
        push_message.task_assignee_id = task[0].ASSIGNED_USER_INFO_ID;
        push_message.task_created_by = task[0].CREATED_BY;
        push_message.new_task = null;
        push_message.loggedin_user_id = this.user.UserInfoId;
        push_message.task_id = TASK_ID;
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
    } else {
      this.presentToast("Please check in before delete task.");
      return;
    }


  }

  UpdateimportantTask(TASK_ID: any, update_val: any) {
    let task = this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID);

    let TASK_DATA = {
      task_id: TASK_ID,
      UserInfoId: this.user.UserInfoId,
      modified_by: this.user.UserInfoId,
      update_value: update_val,
      ASSIGNED_USER_INFO_ID: task[0].ASSIGNED_USER_INFO_ID,
      CREATED_BY: task[0].CREATED_BY
    }
    this.authService.postData(TASK_DATA, 'task/updatetask_to_important').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Task Updated Successfully");
      //this.insertedValues = result;
      this.closeModal();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  UpdatethubmsTask(TASK_ID: any, update_val: any, ASSIGNED_USER_INFO_ID: any, CREATED_BY: any) {

    let task = this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID);

    let TASK_DATA = {
      task_id: TASK_ID,
      UserInfoId: this.user.UserInfoId,
      modified_by: this.user.UserInfoId,
      update_value: update_val,
      current_value: 'Good Job...',
      prev_value: task[0].STATUS_NAME,
      ASSIGNED_USER_INFO_ID: task[0].ASSIGNED_USER_INFO_ID,
      CREATED_BY: task[0].CREATED_BY
    }
    this.authService.postData(TASK_DATA, 'task/updatetask_to_thumbs').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Task Updated Successfully");

      var app_platform: string = '';
      if (this.platform.is('ios')) {
        app_platform = 'ios';
      }

      if (this.platform.is('android')) {
        app_platform = 'android';
      }

      let push_message = {} as any;
      push_message.title = this.user.Surname
      push_message.message = 'Task No: ' + task[0].SEQ_TEXT + "\n" + 'Title: ' + task[0].TITLE + "\n Comments: Good Job..";
      push_message.app_platform = app_platform;
      push_message.task_assignee_id = ASSIGNED_USER_INFO_ID;
      push_message.task_created_by = CREATED_BY;
      push_message.new_task = null;
      push_message.loggedin_user_id = this.user.UserInfoId;
      push_message.task_id = TASK_ID;
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

  pintotask(TASK_ID: any, TASK_TO_PIN: any, type: any) {
    console.log('pin', TASK_ID);
    //let task = this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID);

    let TASK_DATA = {
      task_id: TASK_ID,
      UserInfoId: this.user.UserInfoId,
      modified_by: this.user.UserInfoId,
      task_pin_no: TASK_TO_PIN
    }
    this.authService.postData(TASK_DATA, 'task/updatetasktopin').then((result) => {
      this.presentLoadingDefault(false);
      if (type == 'Pin') {
        this.presentToast("Task pin is updated.");
      } else {
        this.presentToast("Task unpin is updated.");
      }
      this.ionViewWillLoad();

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });

  }


  openModalRemoveTask(TASK_ID: any) {
    let task = this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID);

    let TASK_DATA = {
      task_id: TASK_ID,
      user_info_id: this.user.UserInfoId,
      current_value: this.user.Surname + ' is removed from this task no ' + task[0].SEQ_TEXT + '-' + task[0].TITLE,
      prev_value: task[0].STATUS_NAME,
      ASSIGNED_USER_INFO_ID: task[0].ASSIGNED_USER_INFO_ID,
      CREATED_BY: task[0].CREATED_BY
    }
    this.presentLoadingDefault(true);
    this.authService.postData(TASK_DATA, 'task/UserAccessDelete').then((result) => {
      this.presentLoadingDefault(false);
      var app_platform: string = '';
      if (this.platform.is('ios')) {
        app_platform = 'ios';
      }

      if (this.platform.is('android')) {
        app_platform = 'android';
      }

      let push_message = {} as any;
      push_message.title = this.user.Surname
      push_message.message = 'Task No: ' + task[0].SEQ_TEXT + "\n" + 'Title: ' + task[0].TITLE + "\n Comments: " + this.user.Surname + ' is removed from this task.';
      push_message.app_platform = app_platform;
      push_message.task_assignee_id = task[0].ASSIGNED_USER_INFO_ID;
      push_message.task_created_by = task[0].CREATED_BY;
      push_message.new_task = null;
      push_message.loggedin_user_id = this.user.UserInfoId;
      push_message.task_id = TASK_ID;
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

  getFeedbackCalls() {
    this.presentLoadingDefault(true);
    let params = {} as any;
    params.UserInfoId = this.user.UserInfoId;
    params.label_type = null;
    params.label_user_id = null;

    let time_bf = new Date();

    this.authService.postData(params, 'task/getsubmittedfeedbackfortask').then((result) => {
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

  getPpmListAll() {
    this.presentLoadingDefault(true);
    let params = {} as any;
    params.UserInfoId = this.user.UserInfoId;

    let time_bf = new Date();

    this.authService.postData(params, 'ppm/getResurceManagerPpmList').then((result) => {
      this.presentLoadingDefault(false);
      this.ppmlistAll = result;
      this.ppmlistSearch = result;

      console.log(this.ppmlistAll);

      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log(seconds);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  getCallsListAll() {
    this.presentLoadingDefault(true);
    let params = {} as any;
    params.UserInfoId = this.user.UserInfoId;
    params.Resoursename = this.resourse.EMPNAME,
    params.INTERM_STATUS_ID = 251,
    params.TYPE_ID = this.resourse.RESOURCE_ID;   
    let time_bf = new Date();

    this.authService.postData(params, 'task/getUserAssignedCalls').then((result) => {
      this.presentLoadingDefault(false);
      this.calllistAll = result;
      this.calllistSearch = result;

      console.log(this.calllistAll);

      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log(seconds);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }


  opensubmittedfeedback(item = [] as any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = [{
      feedbackcalls: item
    }];
    const myModal: Modal = this.modal.create('taskFeedbackCompletedViewePage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      this.searchData.search_value = '';
    });

    myModal.onWillDismiss((data) => {
    });

  }


  moveToResult(TASK_ID: any): void {
  
    let params = {
      user_info_id: this.user.UserInfoId,
      task_id: TASK_ID
    }

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'task/getMoveTaskToRoiResult').then((result) => {
      console.log('result', result);
      
      this.presentLoadingDefault(false);
      //this.getTaskDetails('ResourceManagerCompletedtask', null, 'ResourceManagerCompleted');
      this.ionViewWillLoad();

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  Getallimagelist(TASK_ID: any, count: any) {
    if (count > 0) {
      this.presentLoadingDefault(true);
      
      this.authService.getData({}, 'task/TaskUploadedFileList/' + TASK_ID).then((result) => {

        this.presentLoadingDefault(false);
        this.ImageList = result;

        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };
        const myModalData = [{
          ImageList: this.ImageList,
          page_name: 'TASK'
        }];

        const myModal: Modal = this.modal.create('lpoimagelist', { data: myModalData }, myModalOptions);
        myModal.present();
        myModal.onDidDismiss((data) => {
        });
        myModal.onWillDismiss((data) => {
        });

      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    } else {
      this.presentToast('No Image Found');
    }
  }

  openModalinspection(CALL_LOG_ID: any, STATUS_ID: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      CALL_LOG_ID: CALL_LOG_ID,
      STATUS_ID: STATUS_ID,
      Inspectiondata: this.calllistSearch.filter(call => call.CALL_LOG_ID === CALL_LOG_ID)
    }]

    const myModal: Modal = this.modal.create('callworkassignmentdetails', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });
  }

  openCallModal(CALL_LOG_ID: any, STATUS_NAME: any, REQUESTOR_NAME) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = [{
      CALL_LOG_ID: CALL_LOG_ID,
      STATUS_NAME: STATUS_NAME,
      REQUESTOR_NAME: REQUESTOR_NAME
    }];

    const myModal: Modal = this.modal.create('callcomments', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      console.log("I have dismissed.");
      console.log(data);
    });

  }


  openModalLpo(CALL_LOG_ID) {
    let data = {
      CALL_LOG_ID: CALL_LOG_ID,
    }
    this.presentLoadingDefault(true);
    this.authService.postData(data, 'Lpo/Get_lpoList_by_Call_log').then((result: any) => {
      console.log(result);
      this.Lpomanament = result;
      if (result.length > 0) {
        if (this.Lpomanament[0].STATUS_ID === 1 && this.Lpomanament[0].NEXT_APPROVAL_TYPE === 1) {
          const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
          };

          let mymodaldata = [{
            Lpomanament: this.Lpomanament.filter(call => call.STATUS_ID === 1 && call.NEXT_APPROVAL_TYPE === 1),
            type: 'Manager'
          }]

          const myModal: Modal = this.modal.create('lpooption', { data: mymodaldata }, myModalOptions);

          myModal.present();

          myModal.onDidDismiss(() => {
            console.log("I have dismissed.");
          });

          myModal.onWillDismiss(() => {
            console.log("I'm about to dismiss");
          });
        } else if (this.Lpomanament[0].STATUS_ID === 1 && (this.Lpomanament[0].NEXT_APPROVAL_TYPE === 9 || this.Lpomanament[0].NEXT_APPROVAL_TYPE === 13)) {
          const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
          };

          let mymodaldata = [{
            Lpomanament: this.Lpomanament.filter(call => call.STATUS_ID === 1 && (call.NEXT_APPROVAL_TYPE === 9 || call.NEXT_APPROVAL_TYPE === 13)),
            type: 'Finance-MGR'
          }]

          const myModal: Modal = this.modal.create('lpooption', { data: mymodaldata }, myModalOptions);

          myModal.present();

          myModal.onDidDismiss(() => {
            console.log("I have dismissed.");
          });

          myModal.onWillDismiss(() => {
            console.log("I'm about to dismiss");
          });
        } else if (this.Lpomanament[0].STATUS_ID === 1 && this.Lpomanament[0].NEXT_APPROVAL_TYPE === 23) {
          const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
          };

          let mymodaldata = [{
            Lpomanament: this.Lpomanament.filter(call => call.STATUS_ID === 1 && call.NEXT_APPROVAL_TYPE === 23),
            type: 'General Manager'
          }]

          const myModal: Modal = this.modal.create('lpooption', { data: mymodaldata }, myModalOptions);

          myModal.present();

          myModal.onDidDismiss(() => {
            console.log("I have dismissed.");
          });

          myModal.onWillDismiss(() => {
            console.log("I'm about to dismiss");
          });

        } else if (this.Lpomanament[0].STATUS_ID === 3) {
          const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
          };

          let mymodaldata = [{
            Lpomanament: this.Lpomanament.filter(call => call.STATUS_ID === 3),
            type: 'COO'
          }]

          const myModal: Modal = this.modal.create('lpooption', { data: mymodaldata }, myModalOptions);

          myModal.present();

          myModal.onDidDismiss(() => {
            console.log("I have dismissed.");
          });

          myModal.onWillDismiss(() => {
            console.log("I'm about to dismiss");
          });
        } else if (this.Lpomanament[0].STATUS_ID === 4) {
          const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
          };

          let mymodaldata = [{
            Lpomanament: this.Lpomanament.filter(call => call.STATUS_ID === 4),
            type: 'CEO'
          }]

          const myModal: Modal = this.modal.create('lpooption', { data: mymodaldata }, myModalOptions);

          myModal.present();

          myModal.onDidDismiss(() => {
            console.log("I have dismissed.");
          });

          myModal.onWillDismiss(() => {
            console.log("I'm about to dismiss");
          });
        } else if (this.Lpomanament[0].STATUS_ID === 0 && this.Lpomanament[0].IS_REJECTED != 0) {
          const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
          };

          let mymodaldata = [{
            Lpomanament: this.Lpomanament.filter(call => call.STATUS_ID === 0 && call.IS_REJECTED != 0),
            type: 'Rejected'
          }]

          const myModal: Modal = this.modal.create('lpooption', { data: mymodaldata }, myModalOptions);

          myModal.present();

          myModal.onDidDismiss(() => {
            console.log("I have dismissed.");
          });

          myModal.onWillDismiss(() => {
            console.log("I'm about to dismiss");
          });
        } else if (this.Lpomanament[0].STATUS_ID === 5) {
          const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
          };

          let mymodaldata = [{
            Lpomanament: this.Lpomanament.filter(call => call.STATUS_ID === 5),
            type: 'CEO_App'
          }]

          const myModal: Modal = this.modal.create('lpooption', { data: mymodaldata }, myModalOptions);

          myModal.present();

          myModal.onDidDismiss(() => {
            console.log("I have dismissed.");
          });

          myModal.onWillDismiss(() => {
            console.log("I'm about to dismiss");
          });
        }
      } else {
        this.presentToast("No Lpo data found");
      }
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
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

  getCallTask(CALL_LOG_ID) {
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

  
  
}
