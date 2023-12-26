import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { CreateTaskPage } from '../createtask/createtask';

@IonicPage()
@Component({
  selector: 'page-userresorcelist',
  templateUrl: 'userresorcelist.html',
})

export class userresorcelistPage {
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
  USER_ID: any;
  USER_NAME: any;
  today: any;
  CREATED_ON:any;
  pagetype:any;
  TASK_TYPE: any;
  open_task_count : any;
  productivity_percent: any;
  searchData = { "search_value": "" };
  
  pet: string = "bydate";
  tab_name: any;

  pendingtasksearchdetails:any;
  pendingtaskdetails:any;
  completed_task_count = 0;

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

  getUserTaskList_Old() {
    let myTitle = 'Task List';
    this.presentLoadingDefault(true);
    let paramdata = {
      type: this.modaltype[0],
      AssignedUserId: this.modaltype[1],
      TaskType: this.modaltype[3],
    };

    this.authService.postData(paramdata, 'task/resource-managerid/assign-task').then((result) => {
      this.tasksearchdetails = result;
      this.taskdetails = result;
      // for (var i = 0; i < this.tasksearchdetails.assignedtaskList.length; i++) {
      //   this.tasksearchdetails.assignedtaskList[i].COMMENTS = this.createTextLinks(this.tasksearchdetails.assignedtaskList[i].COMMENTS);
      // }
      var p_percent = [];
      var data = this.tasksearchdetails.assignedtaskList;
      for (var k = 0; k < this.tasksearchdetails.assignedtaskListbydate.length; k++) {
        this.tasksearchdetails.assignedtaskList = data;
        this.tasksearchdetails.assignedtaskList = this.tasksearchdetails.assignedtaskList.filter(m=> m.START_DATE  == this.tasksearchdetails.assignedtaskListbydate[k].START_DATE);
        var taskcount = this.tasksearchdetails.assignedtaskList.filter(v =>v.STATUS == 4);
        var taskpendingcount = this.tasksearchdetails.assignedtaskList.filter(v =>v.STATUS < 4);
        this.open_task_count = taskcount.length;
        var percent = [];
        var product_date = {};
        var productivity_percentage = 0;

        console.log(this.tasksearchdetails.assignedtaskList);
        
        for (var j = 0; j < this.tasksearchdetails.assignedtaskList.length; j++) {
          
          this.tasksearchdetails.assignedtaskList[j].COMMENTS = this.createTextLinks(this.tasksearchdetails.assignedtaskList[j].COMMENTS);
          
          if(this.tasksearchdetails.assignedtaskList[j].TOTAL_TASK_SECONDS > 0){
           
            let time_bf = new Date(this.tasksearchdetails.assignedtaskList[j].TASK_START_TIME);
            let time_af = new Date(this.tasksearchdetails.assignedtaskList[j].TASK_END_TIME);
            let seconds =  this.tasksearchdetails.assignedtaskList[j].TOTAL_TASK_SECONDS; ///Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
            
            percent.push(seconds);
          }

        }
        
        if(percent.length>0){

          var totalpercent = 0;
          for(var x=0; x<percent.length;x++){
            var t_time = 0;
            if(percent[x] > 32400){
                t_time = 100;
            }else{
                t_time = Math.round((100 * (percent[x]/ 32400)));
            }
            console.log('Percentage--',t_time);
            totalpercent += t_time;

          };
          productivity_percentage = Math.round(totalpercent/percent.length);
        }else{
          productivity_percentage = 0;
        }
        product_date['start_date'] = this.tasksearchdetails.assignedtaskListbydate[k].START_DATE;
        product_date['productivity_percentage'] = productivity_percentage;
        product_date['task_count'] = taskcount.length;
        product_date['pending_task_count'] = taskpendingcount.length;
        p_percent.push(product_date);
      }
      this.productivity_percent = p_percent;

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

  getUserTaskList() {
    let myTitle = 'Task List';
    this.presentLoadingDefault(true);
    let paramdata = {
      type: this.modaltype[0],
      AssignedUserId: this.modaltype[1],
      TaskType: this.modaltype[3],
    };

    this.authService.postData(paramdata, 'task/getUserTaskByDateWise').then((result) => {
      this.tasksearchdetails = result;
      this.taskdetails = result;   
      console.log(this.tasksearchdetails);   
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

  getPendingUserTaskList() {
    let myTitle = 'Task List';
    this.presentLoadingDefault(true);
    let paramdata = {
      type: this.modaltype[0],
      AssignedUserId: this.modaltype[1],
      TaskType: this.modaltype[3],
    };

    this.authService.postData(paramdata, 'task/getPendinAassigntask').then((result) => {
      this.pendingtasksearchdetails = result;
      this.pendingtaskdetails = result;
      console.log(this.pendingtaskdetails);
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
    var parts = time.split(':');
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  usertask(CREATED_ON:any){

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    this.myModalData = [
      this.TYPE = this.modaltype[0],
      this.USER_ID =  this.modaltype[1],
      this.USER_NAME =  this.modaltype[2],
      this.CREATED_ON = CREATED_ON,
      this.pagetype = "date",
      this.TASK_TYPE = this.modaltype[3]
    ]

    console.log(this.myModalData);

    let myModal: Modal = this.modal.create('ResourseUserTaskListPage', { data: this.myModalData }, myModalOptions);
    myModal.present();
    myModal.onDidDismiss((data) => {
      this.getUserTaskList();
    });
    myModal.onWillDismiss((data) => {
    });

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


  segmentChanged(event) {
    let tabValue = event.value;

    this.tab_name = event.value;

    if (tabValue == 'pending') {
        this.getPendingUserTaskList();
    } else if (tabValue == 'bydate') {
      this.getUserTaskList();
    }
  }


}