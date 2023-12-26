import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { CreateTaskPage } from '../createtask/createtask';
import { userresorcelistPage } from '../userresorcelist/userresorcelist';

@IonicPage()
@Component({
  selector: 'page-res-manager-userlist',
  templateUrl: 'res-manager-userlist.html',
})


export class ResManagerUserlistPage {
  modaltype = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  resourse: any = localStorage.getItem('resourseData');
  insertedValues: any;
  taskListdetails = [] as any;
  pushnotificationValues: any;
  tasksearchdetails = {
    assignedUser: [] as any
  } as any;
  taskdetails = {
    assignedUser: [] as any
  } as any;
  completedcolor = 'block';
  productivity_total_percentage: any;
  myModalData: any;
  TYPE: any;
  USER_ID: any;
  USER_NAME: any;
  TASK_TYPE: any;
  today: any;
  CREATED_ON: any;
  pagetype: any;
  open_task_count: any;
  percent: any;
  productivity_percent: any;
  rm_user_id: any;
  searchData = { "search_value": "" };
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.resourse = this.resourse ? JSON.parse(this.resourse) : {};
    this.today = Date.now();
    this.rm_user_id = 0;
    this.productivity_total_percentage = 0;
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
      this.loading.dismiss();
      this.loading = null
    }
  };

  ionViewWillLoad() {
    console.log(this.modaltype);
    this.getUserTaskList();
  }

  // createtask() {

  //   const myModalOptions: ModalOptions = {
  //     enableBackdropDismiss: false
  //   };

  //   let myModalData = [{
  //     assign_user_id: this.modaltype[1],
  //     assign_user_name: this.modaltype[2],
  //     TASK_ID: 0
  //   }];

  //   let myModal: Modal = this.modal.create(CreateTaskPage, { data: myModalData }, myModalOptions);

  //   myModal.onWillDismiss(() => {
  //   });
  //   myModal.present();

  // }

  createtask() {

    let myModalData = [{
      assign_user_id: this.modaltype[1],
      assign_user_name: this.modaltype[2],
      TASK_ID: 0
    }];

    this.navCtrl.push(CreateTaskPage, { data: myModalData }, { animate: false });

  } 

  getUserTaskList() {

    this.presentLoadingDefault(true);
    this.rm_user_id = this.modaltype[1];
    this.authService.getData({}, 'task/resourceManagerUserv2/' + this.rm_user_id).then((result) => {
      this.presentLoadingDefault(false);
      this.tasksearchdetails = result;
      if (this.resourse.TYPE_USER == "Engineer") {
        this.tasksearchdetails.assignedUser = this.tasksearchdetails.assignedUser.filter(x => x.USER_INFO_ID == this.user.UserInfoId);
      }

      this.percent = [] as any;

      for (let k = 0; k < this.tasksearchdetails.assignedUser.length; k++) {

        let _percent = 0;

        if (this.tasksearchdetails.assignedtasktimeList.length > 0) {

          let assignedtasktimeList = this.tasksearchdetails.assignedtasktimeList.filter(m => m.ASSIGNED_USER_INFO_ID == this.tasksearchdetails.assignedUser[k].USER_INFO_ID);

          console.log('assignedtasktimeList', assignedtasktimeList);

          if(assignedtasktimeList.length > 0) {
              let percentage = Math.round(assignedtasktimeList[0].TASK_PERCENTAGE / assignedtasktimeList[0].PERCENTAGE_COUNT);
              this.tasksearchdetails.assignedUser[k].percent = percentage;
          }else{
              this.tasksearchdetails.assignedUser[k].percent = _percent;
          }

        } else {
            this.tasksearchdetails.assignedUser[k].percent = _percent;
        }
      }

      this.tasksearchdetails.assignedUser = this.tasksearchdetails.assignedUser;
      this.taskdetails = this.tasksearchdetails;

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });

  }

  totalSeconds(time) {
    var parts = time.split(':');
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  openUserTaskModal(type: any, USER_ID: any, COUNT: any, USER_NAME: any, TASK_TYPE: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    this.myModalData = [
      this.TYPE = type,
      this.USER_ID = USER_ID,
      this.USER_NAME = USER_NAME,
      this.TASK_TYPE = TASK_TYPE ? TASK_TYPE : null
    ]
    debugger;
    this.navCtrl.push(userresorcelistPage, { data: this.myModalData }, { animate: false });

    // let myModal: Modal = this.modal.create('userresorcelistPage', { data: this.myModalData }, myModalOptions);
    // myModal.present();
    // myModal.onDidDismiss((data) => {
    //   this.getUserTaskList();
    // });
    // myModal.onWillDismiss((data) => {
    // });

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

  openModal(TASK_ID: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: TASK_ID,
      task_data_val: this.taskdetails.assignedtaskList.filter(item => item.TASK_ID === TASK_ID)
    }];

    let myModal: Modal = this.modal.create('TaskCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      this.getUserTaskList();
    });

    myModal.onWillDismiss((data) => {
    });
  }

  update_task(TASK_ID: any, type: any) {
    let task = this.taskdetails.assignedtaskList.filter(item => item.TASK_ID === TASK_ID);
    if (type == "start") {
      task[0].NEXT_STATUS = 3;
      task[0].task_comments = "In Progress";
    } else if (type == "complete") {
      task[0].NEXT_STATUS = 4;
      task[0].task_comments = "completed";
    } else if (type == "close") {
      let millis = new Date().getTime() - new Date(task[0].START_TIME).getTime();
      var complete_time = this.convertMS(millis);
      task[0].task_time = complete_time;
      task[0].NEXT_STATUS = 6;
      task[0].task_comments = "closed";
    } else if (type == "reopen") {
      task[0].NEXT_STATUS = 3;
      task[0].task_comments = "In Progress";
    }

    task[0].modified_by = this.user.UserInfoId;
    this.presentLoadingDefault(true);
    this.authService.postData(task[0], 'task/UpdateTask').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Data successfully Updated");
      this.insertedValues = result;

      if (task[0].NEXT_STATUS == 4) {
        var app_platform: string = '';
        if (this.platform.is('ios')) {
          app_platform = 'ios';
        }

        if (this.platform.is('android')) {
          app_platform = 'android';
        }

        let push_message = {} as any;
        push_message.title = this.user.Surname
        push_message.message = 'Task No: ' + task[0].SEQ_TEXT + "\n" + 'Title: ' + task[0].TITLE + "\n Comments: " + 'Status Changed from ' + task[0].STATUS_NAME + ' to ' + task[0].task_comments;
        push_message.app_platform = app_platform;
        push_message.task_assignee_id = task[0].ASSIGNED_USER_INFO_ID;
        push_message.task_created_by = task[0].CREATED_BY;
        push_message.new_task = null;
        push_message.loggedin_user_id = this.user.UserInfoId;
        push_message.task_id = TASK_ID;
        push_message.trans_type = 'TMS';
        push_message.seq_text = task[0].SEQ_TEXT;

        this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
          this.presentLoadingDefault(false);
          this.pushnotificationValues = result;
        }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast("Something went to wrong, please try again later");
        });
      }
      this.closeModal();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
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
    let TASK_DATA = {
      task_id: TASK_ID,
      modified_by: this.user.UserInfoId
    }
    this.presentLoadingDefault(true);
    this.authService.postData(TASK_DATA, 'task/DeleteTask').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Task Deleted Successfully");
      this.insertedValues = result;
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
      task_data_val: this.taskdetails.assignedtaskList.filter(item => item.TASK_ID === TASK_ID)
    }];

    let myModal: Modal = this.modal.create('TaskFileUploadsPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

    myModal.onWillDismiss((data) => {
    });
  }


  openModalUpdateTask(TASK_ID: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: TASK_ID,
      task_data_val: this.taskdetails.assignedtaskList.filter(item => item.TASK_ID === TASK_ID)
    }];

    let myModal: Modal = this.modal.create('UpdateTaskPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      this.getUserTaskList();
    });

    myModal.onWillDismiss((data) => {
    });

  }

  openModalTaskReminder(TASK_ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: TASK_ID,
      task_data_val: this.taskdetails.assignedtaskList.filter(item => item.TASK_ID === TASK_ID)
    }];

    let myModal: Modal = this.modal.create('TaskReminderPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {

    });

    myModal.onWillDismiss((data) => {
    });
  }

  UpdateimportantTask(TASK_ID: any, update_val: any) {
    let TASK_DATA = {
      task_id: TASK_ID,
      UserInfoId: this.user.UserInfoId,
      modified_by: this.user.UserInfoId,
      update_value: update_val
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

    let task = this.taskdetails.assignedtaskList.filter(item => item.TASK_ID === TASK_ID);

    let TASK_DATA = {
      task_id: TASK_ID,
      UserInfoId: this.user.UserInfoId,
      modified_by: this.user.UserInfoId,
      update_value: update_val
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

  pintotask(TASK_ID: any, TASK_TO_PIN: any) {
    let TASK_DATA = {
      task_id: TASK_ID,
      UserInfoId: this.user.UserInfoId,
      modified_by: this.user.UserInfoId,
      task_pin_no: TASK_TO_PIN
    }
    this.authService.postData(TASK_DATA, 'task/updatetasktopin').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Pin task is updated");
      this.ionViewWillLoad();

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  openModalRemoveTask(TASK_ID: any) {
    let TASK_DATA = {
      task_id: TASK_ID,
      user_info_id: this.user.UserInfoId
    }
    this.presentLoadingDefault(true);
    this.authService.postData(TASK_DATA, 'task/UserAccessDelete').then((result) => {
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  subtaskcreate(TASK_ID: any, TITLE: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      assign_user_id: this.modaltype[1],
      assign_user_name: this.modaltype[2],
      TASK_ID: TASK_ID,
      TITLE: TITLE
    }]

    let myModal: Modal = this.modal.create(CreateTaskPage, { data: myModalData }, myModalOptions);
    myModal.present();
    myModal.onDidDismiss((data) => {
      this.getUserTaskList();
    });
    myModal.onWillDismiss((data) => {
    });
  }

  SearchUserDetail() {

    var username = this.searchData.search_value;
    if (this.taskdetails.assignedUser.length > 0) {
      if (username != '') {
        this.tasksearchdetails.assignedUser = this.taskdetails.assignedUser.filter(x => x.USER_SURNAME.includes(username));
      } else {

        this.tasksearchdetails.assignedUser = this.taskdetails.assignedUser;
      }
    }

  }

  getImage(row_no) {

    let objFile = this.tasksearchdetails.assignedUser.find(o => o.PROFILE_IMG_ID === row_no);
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

}
