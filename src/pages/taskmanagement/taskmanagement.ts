import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { CreateTaskPage } from '../createtask/createtask';

@IonicPage()

@Component({
  selector: 'page-taskmanagement',
  templateUrl: 'taskmanagement.html',
})

export class TaskManagementPage {
  userdetails: any;
  taskdetails = {
    assignedtaskList: [] as any,
    tasklistcount: [] as any,
    current_week :[] as any,
    next_week : [] as any
  } as any;
  taskdetailsall: any;
  taskdetailsearchall = {} as any;
  myModalData: any;
  tasknotication: any;
  insertedValues: any;
  task_List = 'block';
  task_show = 'none';
  searchData = { "search_value": "" };
  TYPE: any;
  USER_ID: any;
  USER_NAME: any;
  tasksearchlist: any;
  userCreatedTaskCount: number = 0;
  userCreatedTaskOverdueCount: number = 0;
  today:any;
  CREATED_ON:any;
  pagetype:any;
  weekcomments_count = {
    currentweek_count: [] as any,
    nexttweek_count: [] as any,
    priviousweek_count: [] as any
  } as any;
  user: any = localStorage.getItem('userData');

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) 
    {
        this.user = this.user ? JSON.parse(this.user) : {};
        this.today = Date.now();
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
    this.userCreatedTaskCount= 0;
    this.userCreatedTaskOverdueCount = 0;
    this.gettask();
    //this.getWeeklyCommentsCount();
    //this.getnotification();
  }

  gettask() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/TaskManagementSummary/' + this.user.UserInfoId).then((result) => {
      this.taskdetails = result;
      this.taskdetailsearchall = result;
      this.userCreatedTaskCount = this.taskdetails.tasklistcount.TASK_COUNT;
      this.userCreatedTaskOverdueCount = this.taskdetails.tasklistcount.USER_OVERDUE_TASK;

      console.log(this.userCreatedTaskCount,this.userCreatedTaskOverdueCount);
      // for (var j = 0; j < this.taskdetails.assignedtaskList.length; j++) {
      //   var taskcount = parseInt(this.taskdetails.assignedtaskList[j].TASK_COUNT);
      //   var taskOverduecount = parseInt(this.taskdetails.assignedtaskList[j].OVERDUE_TASK);
      //   this.userCreatedTaskCount += taskcount;
      //   this.userCreatedTaskOverdueCount += taskOverduecount;
        
      // }

      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });

  }

  createtask() {
    this.navCtrl.push(CreateTaskPage, {}, { animate: false });
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

      if (this.taskdetails.tasklistcount.ACTIVE_TASK == 0) {
        flag = 1;
      }

    } else if (type == "Overdue") {

      this.myModalData = [
        this.TYPE = type
      ]

      if (this.taskdetails.tasklistcount.OVERDUE_TASK == 0) {
        flag = 1;
      }

    } else if (type == "Referal") {

      this.myModalData = [
        this.TYPE = type
      ]

      if (this.taskdetails.tasklistcount.REFERAL_TASK == 0) {
        flag = 1;
      }

    } else if (type == "Completed") {

      this.myModalData = [
        this.TYPE = type
      ]

      if (this.taskdetails.tasklistcount.COMPLETED_TASK == 0) {
        flag = 1;
      }

    } else if (type == "Personal") {

      this.myModalData = [
        this.TYPE = type
      ]

      if (this.taskdetails.tasklistcount.PERSONAL_TASK == 0) {
        flag = 1;
      }

    } else if (type == "Important") {

      this.myModalData = [
        this.TYPE = type
      ]

      if (this.taskdetails.tasklistcount.IMPORTANT_TASK == 0) {
        flag = 1;
      }

    } else if (type == "Activity") {
      this.myModalData = [0,
        this.TYPE = "Activity",
        'Task'
      ]

      if (this.taskdetails.tasklistcount.ACTIVITY_TASK_COUNT == 0) {
        flag = 1;
      }else{
        flag = 2;
      }
     
    } else if (type == "ActiveAll") {
      this.myModalData = [
        0,
        this.TYPE = "ActiveAll"
      ]

      if (this.userCreatedTaskCount == 0) {
        flag = 1;
      }else{
        flag = 2;
      }

     
    }else if (type == "ActiveOverdue") {
      this.myModalData = [
        0,
        this.TYPE = "ActiveOverdue"
      ]

      if (this.userCreatedTaskOverdueCount == 0) {
        flag = 1;
      }else{
        flag = 2;
      }

     
    } else {

      this.myModalData = [
        this.TYPE = type
      ]


      if (this.taskdetails.tasklistcount.ALL_TASK == 0) {
        flag = 1;
      }

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

  openUserTaskModal(type: any, USER_ID: any, COUNT: any, USER_NAME: any) {

    let flag = 0;

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    this.myModalData = [
      this.TYPE = type,
      this.USER_ID = USER_ID,
      this.USER_NAME = USER_NAME,
      this.CREATED_ON = '',
      this.pagetype = 'task'
    ]
    if (COUNT == 0) {
      flag = 1;
    }

    if (flag == 0) {

      let myModal: Modal = this.modal.create('UserAssignedTaskPage', { data: this.myModalData }, myModalOptions);
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

  open_Modal(TASK_ID: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: TASK_ID,
      task_data_val: this.taskdetails.all.filter(item => item.TASK_ID === TASK_ID)
    }];

    let myModal: Modal = this.modal.create('TaskCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      // console.log("I have dismissed.");
      // console.log(data);
      this.gettask();
    });

    myModal.onWillDismiss((data) => {
      // console.log("I'm about to dismiss");
      // console.log(data);
    });
  }
  update_task(TASK_ID: any, type: any) {
    let task = this.taskdetails.all.filter(item => item.TASK_ID === TASK_ID);
    if (type == "start") {
      task[0].NEXT_STATUS = 3;
      task[0].task_comments = "In Progress";
    } else if (type == "complete") {
      task[0].NEXT_STATUS = 4;
      task[0].task_comments = "completed";
    } else if (type == "close") {
      task[0].NEXT_STATUS = 6;
      task[0].task_comments = "closed";
    }
    task[0].modified_by = this.user.UserInfoId;
    this.presentLoadingDefault(true);
    this.authService.postData(task[0], 'task/UpdateTask').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Data successfully Updated");
      this.insertedValues = result;
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
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

  SearchTaskDetail() {
    let task_val = this.searchData.search_value;
    if (task_val != '') {
      let data = {
        SearchData: task_val,
        UserInfoId: this.user.UserInfoId
      }
      this.presentLoadingDefault(true);
      this.authService.postData(data, 'task/TaskManagementSearch').then((result) => {
        this.tasksearchlist = result;
        this.presentLoadingDefault(false);
        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };

        this.myModalData = [
          this.tasksearchlist,
          'Search',
          task_val
        ];

        let myModal: Modal = this.modal.create('TaskManagementDetailPage', { data: this.myModalData }, myModalOptions);
        myModal.present();
        myModal.onDidDismiss((data) => {
          this.gettask();
        });
        myModal.onWillDismiss((data) => {
        });
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast("Something went to wrong, please try again later");
      });
    }

  }

  getImage(row_no, item: any) {

    let objFile = this.taskdetails.assignedtaskList.find(o => o.PROFILE_IMG_ID === row_no);
    if(objFile.FILE_CONTENT){
    let bytes = objFile.FILE_CONTENT.data;
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];

    if (extn == "jpg" || extn == "jpeg" || extn == "png") {
      if (objFile.MYPROFILECOUNT > 0) {
        return `data:image/${extn};base64,${this.encode(bytes)}`;
      } else {
        return `./assets/imgs/no-found-photo.png`
      }
    }
  }else{
    return `./assets/imgs/no-found-photo.png`

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
  
  openModalcomments(type: any){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    if(type == 'Current'){
      this.myModalData = [
        this.TYPE = type
      ]
      let myModal: Modal = this.modal.create('DailytaskcommentPage', { data: this.myModalData }, myModalOptions);
      myModal.present();
      myModal.onDidDismiss((data) => {
        this.gettask();
        this.getWeeklyCommentsCount();
      });
      myModal.onWillDismiss((data) => {
      });
    }else if(type == 'Next'){
      this.myModalData = [
        this.TYPE = type
      ]
      let myModal: Modal = this.modal.create('DailytaskcommentPage', { data: this.myModalData }, myModalOptions);
      myModal.present();
      myModal.onDidDismiss((data) => {
        this.gettask();
        this.getWeeklyCommentsCount();
      });
      myModal.onWillDismiss((data) => {
      });
    }else{
      this.myModalData = [
        this.TYPE = type
      ]
      let myModal: Modal = this.modal.create('DailytaskcommentPage', { data: this.myModalData }, myModalOptions);
      myModal.present();
      myModal.onDidDismiss((data) => {
        this.gettask();
        this.getWeeklyCommentsCount();
      });
      myModal.onWillDismiss((data) => {
      });
    }
  }

  getWeeklyCommentsCount(){
      this.authService.getData({}, 'task/weeklycommentsCount').then((result) => {
        this.weekcomments_count = result;
        //console.log(this.weekcomments_count);
      }, (err) => {
        //this.presentLoadingDefault(false);
        //this.presentToast("Something went to wrong, please try again later");
      });
  }
}
