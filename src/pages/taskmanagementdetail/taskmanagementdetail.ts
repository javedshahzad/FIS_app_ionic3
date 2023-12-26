import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { CreateTaskPage } from '../createtask/createtask';
 
@IonicPage()
@Component({
  selector: 'page-taskmanagementdetail',
  templateUrl: 'taskmanagementdetail.html',
})
export class TaskManagementDetailPage {
  modaltype = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  insertedValues: any;
  taskdetails: any;
  tasksearchdetails: any;
  task_list_display = 'block';
  task_search_display = 'none';
  pushnotificationValues: any;
  searchData = { "search_value": "" };
  markasreaddiv = 0;
  showassignedto = 0;
  today: any;
  hierachyList: any;
  show_hierachy = 0;
  expandlist: any;
  expandlistnxt: any;
  hierachytitle: any;

  openpage: any;

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
      this.loading.dismissAll();
      this.loading = null
    }
  };

  ionViewWillLoad() {
    console.log(this.modaltype);
    if (this.modaltype[1] == "Activity") {
      this.markasreaddiv = 1;
      this.openpage = this.modaltype[2];
    } else if (this.modaltype[1] == "ResourceManagerCompletedtask") {
      this.markasreaddiv = 1;
      this.openpage = this.modaltype[2];
    } else {
      this.markasreaddiv = 0;
      this.openpage = '';
    }

    if (this.modaltype[1] == "ActiveOverdue" || this.modaltype[1] == "ActiveAll") {
      this.showassignedto = 1;
    } else {
      this.showassignedto = 0;
    }

    if (this.modaltype[1] == "Search") {
      this.taskdetails = this.modaltype[0];
      this.tasksearchdetails = this.modaltype[0];
      for (var i = 0; i < this.tasksearchdetails.length; i++) {
        this.tasksearchdetails[i].COMMENTS = this.createTextLinks(this.tasksearchdetails[i].COMMENTS);
      }

      this.showBtn = 1;
      let expand = this.tasksearchdetails;
      for (var j = 0; j < expand.length; j++) {
        if (expand[j].SEQ_TEXT == this.modaltype[2]) {
          this.showBtn = j;
        }
      }

    } else if (this.modaltype[1] == "CALL_LOG") {
      this.taskdetails = this.modaltype[0];
      this.tasksearchdetails = this.modaltype[0];
      for (var k = 0; k < this.tasksearchdetails.length; k++) {
        this.tasksearchdetails[k].COMMENTS = this.createTextLinks(this.tasksearchdetails[k].COMMENTS);
      }
    } else {
      this.gettask(0, 0);
    }
    //this.tasksearchdetails = this.modaltype[0];
  }

  createtask() {
    this.navCtrl.push(CreateTaskPage, {}, { animate: false });
  }


  gettask(index, id) {
    this.presentLoadingDefault(true);
    let params = {} as any;
    params.UserInfoId = this.user.UserInfoId;
    params.label_type = this.modaltype[1];
    params.label_user_id = this.modaltype[0];


    this.authService.postData(params, 'task/TaskManagementList').then((result) => {
      this.taskdetails = result;
      this.tasksearchdetails = result;
      console.log(this.tasksearchdetails);
      if (this.openpage == 'ResourceManager') {
        this.tasksearchdetails = this.tasksearchdetails.filter(x => x.STATUS != 4)
      }

      if (this.openpage == 'ResourceManagerCompleted') {
        this.tasksearchdetails = this.tasksearchdetails.filter(x => x.STATUS == 4)
      }

      for (var j = 0; j < this.tasksearchdetails.length; j++) {
        this.tasksearchdetails[j].COMMENTS = this.createTextLinks(this.tasksearchdetails[j].COMMENTS);
        //console.log(this.tasksearchdetails[j].COMMENTS);
      }

      //console.log('task group -->',this.tasksearchdetails); 
      this.presentLoadingDefault(false);

      if (index == 1) {
        let expand = this.tasksearchdetails;
        for (var i = 0; i < expand.length; i++) {
          if (expand[i].TASK_ID == id) {
            this.showBtn = i;
          }
        }
      }

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
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
    if (this.show_hierachy == 1) {
      this.show_hierachy = 0;
    } else if (this.show_hierachy == 0) {
      this.view.dismiss();
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

  openModalTaskReminder(TASK_ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: TASK_ID,
      task_data_val: this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID)
    }];

    let myModal: Modal = this.modal.create('TaskReminderPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {

    });

    myModal.onWillDismiss((data) => {
    });
  }

  openModal(TASK_ID: any, index: any) {
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
      if (this.modaltype[1] == "Search") {
        this.getsearchlist();
        let expand = this.tasksearchdetails;
        for (var i = 0; i < expand.length; i++) {
          if (expand[i].TASK_ID == TASK_ID) {
            this.showBtn = i;
          }
        }
      } else if (this.modaltype[1] == "CALL_LOG") {
        let expand = this.tasksearchdetails;
        for (var j = 0; j < expand.length; j++) {
          if (expand[j].TASK_ID == TASK_ID) {
            this.showBtn = j;
          }
        }
      } else {
        this.gettask(1, TASK_ID);
      }
    });

    myModal.onWillDismiss((data) => {
    });
  }

  openModalUpdateTask(TASK_ID: any, index: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: TASK_ID,
      task_data_val: this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID)
    }];

    let myModal: Modal = this.modal.create('UpdateTaskPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      this.showBtn = index;
      if (this.modaltype[1] == "Search") {
        this.getsearchlist();
      } else if (this.modaltype[1] == "CALL_LOG") {
        this.closeModal();
      } else {
        this.gettask(0, 0);
      }
    });

    myModal.onWillDismiss((data) => {
    });

  }


  update_task(TASK_ID: any, type: any) {


    if (this.openpage == 'ResourceManager' && type == 'complete') {
      this.openupdatefeedback(TASK_ID);
    } else {

      let task = this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID);
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

      }else if (type == "resume") {

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

  }

  update_task_break(TASK_ID: any, type: any) {

    let task = this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID);

    let params = {
      task_id: TASK_ID,
      created_by: this.user.UserInfoId,
      schedule_name: type
    }
    this.presentLoadingDefault(true);
    this.authService.postData(params, 'task/getInsertTaskSchedule').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Task Schedule successfully Inserted");
      this.insertedValues = result;
    });

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

  markasreadall() {
    console.log("data");
    console.log('read all -->', this.tasksearchdetails);
    var taskdata = [];
    for (var i = 0; i < this.tasksearchdetails.length; i++) {
      taskdata.push(this.tasksearchdetails[i].TASK_ID);
    }
    console.log('read all -->', taskdata);

    let TASK_DATA = {
      task_id: taskdata,
      user_info_id: this.user.UserInfoId,
      modified_by: this.user.UserInfoId
    }
    this.presentLoadingDefault(true);
    this.authService.postData(TASK_DATA, 'task/MarkAsReadallTask').then((result) => {
      this.presentLoadingDefault(false);
      this.insertedValues = result;
      this.ionViewWillLoad();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
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

  getsearchlist() {
    let data = {
      SearchData: this.modaltype[2],
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
    if (search_value != '') {
      this.tasksearchdetails = this.tasksearchdetails.filter(item => (item.SEQ_TEXT ? item.SEQ_TEXT.includes(search_value) : '') || (item.ASSIGNED_TO ? item.ASSIGNED_TO.includes(search_value) : '') || (item.TITLE ? item.TITLE.includes(search_value) : ''));

      console.log('Search...', this.tasksearchdetails);
    } else {
      this.tasksearchdetails = this.taskdetails;
      console.log('No Search...', this.tasksearchdetails);
    }

  }
  subtaskcreate(TASK_ID: any, TITLE: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    let myModalData = [{
      TASK_ID: TASK_ID,
      TITLE: TITLE
    }]
    let myModal: Modal = this.modal.create(CreateTaskPage, { data: myModalData }, myModalOptions);
    myModal.present();
    myModal.onDidDismiss((data) => {
      if (this.modaltype[1] == "Search") {
        this.getsearchlist();
      } else if (this.modaltype[1] == "CALL_LOG") {
        this.closeModal();
      } else {
        this.gettask(0, 0);
      }
    });
    myModal.onWillDismiss((data) => {
    });
  }

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

  showBtn = -1;
  isOpen = false;
  oldBtn = -1;

  showUndoBtn(index) { 
    debugger;
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

}