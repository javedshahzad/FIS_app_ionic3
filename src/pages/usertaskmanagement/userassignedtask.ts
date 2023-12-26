import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { CreateTaskPage } from '../createtask/createtask';

@IonicPage()
@Component({
  selector: 'page-userassignedtask',
  templateUrl: 'userassignedtask.html',
})
export class UserAssignedTaskPage {
  modaltype = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  insertedValues: any;
  taskListdetails = [] as any;
  pushnotificationValues: any;
  tasksearchdetails = {
    assignedtaskList: [] as any
  } as any;
  taskdetails = {
    assignedtaskList: [] as any
  } as any;
  completedcolor = 'block';
  myModalData: any;
  TYPE: any;
  today: any;
  productivity_percentage : any;
  searchData = { "search_value": "" };
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
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
    let myTitle = 'Task List';
    this.presentLoadingDefault(true);    
    let  paramdata = {
      type: this.modaltype[0],
      AssignedUserId: this.modaltype[1],
      UserInfoId: this.user.UserInfoId
    }
    let url ='task/UserAssignedTaskList';
    this.authService.postData(paramdata, url).then((result) => {
      this.tasksearchdetails = result;
      this.taskdetails = result;
      if(this.modaltype[4] == "date"){
        this.tasksearchdetails.assignedtaskList = this.tasksearchdetails.assignedtaskList.filter(x=> x.START_DATE  == this.modaltype[3]);
        let percent = [];
        let total_time = "10:00:00";         
        for (let j = 0; j < this.tasksearchdetails.assignedtaskList.length; j++) {
          this.tasksearchdetails.assignedtaskList[j].COMMENTS = this.createTextLinks(this.tasksearchdetails.assignedtaskList[j].COMMENTS);
          if(this.tasksearchdetails.assignedtaskList[j].TASK_TIME){
            let splitTime1= this.tasksearchdetails.assignedtaskList[j].TASK_TIME.split(':');
            let work_time = parseInt(splitTime1[0])+':'+parseInt(splitTime1[1])+':'+parseInt(splitTime1[2]);
            percent.push(Math.round(100 * (this.totalSeconds(work_time) / this.totalSeconds(total_time))));
          }
        }
        if(percent.length>0){
          let totalpercent = 0;
          for(let x=0;x<percent.length;x++){
            totalpercent += percent[x];
          };
          this.productivity_percentage = Math.round(totalpercent);
        }else{
          this.productivity_percentage = 0;
        }
      } else{
        for (let k = 0; k < this.tasksearchdetails.assignedtaskList.length; k++) {
          this.tasksearchdetails.assignedtaskList[k].COMMENTS = this.createTextLinks(this.tasksearchdetails.assignedtaskList[k].COMMENTS);
        }
        this.productivity_percentage = 0;
      }

      this.presentLoadingDefault(false);
      if (this.taskdetails.assignedtaskList.length > 0) {
        this.presentLoadingDefault(false);
      } else {
        this.presentLoadingDefault(false);
        this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });

  }
   totalSeconds(time){
    let parts = time.split(':');
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  createTextLinks(text) {

    return (text || "").replace(
      /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
      function (match, space, url) {
        let hyperlink = url;
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
      let millis = new Date().getTime() - new Date(task[0].START_TIME).getTime();
      var task_time = this.convertMS(millis);
      task[0].task_time = task_time;
      task[0].NEXT_STATUS = 4;
      task[0].task_comments = "completed";
    } else if (type == "close") {
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

  convertMS( milliseconds ) {
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

  SearchTaskDetail() {

    let search_value = this.searchData.search_value;
    if (search_value != '') {
      this.taskListdetails = this.taskdetails.assignedtaskList.filter(item => (item.SEQ_TEXT ? item.SEQ_TEXT.includes(search_value) : '') || (item.ASSIGNED_TO ? item.ASSIGNED_TO.includes(search_value) : '') || (item.TITLE ? item.TITLE.includes(search_value) : ''));

      this.tasksearchdetails.assignedtaskList = this.taskListdetails;
    } else {
      this.tasksearchdetails = this.taskdetails;
    }

  }

}