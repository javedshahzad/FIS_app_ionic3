import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicSelectableModule  } from 'ionic-selectable';
import { CalendarModalOptions } from "ion2-calendar";


@IonicPage()
@Component({
  selector: 'page-updatetask',
  templateUrl: 'updatetask.html',
})
export class UpdateTaskPage {
  
  duedate = 'none';
  assign = 'none';
  titlestyle = 'block';
  userdetails: any;
  insertedValues: any;
  pushnotificationValues: any;
  createtaskForm: FormGroup;
  taskdata = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  duedatevalue: any;
  startdatevalue: any;
  nextactiondatevalue: any;
  createddatevalue: any;
  statusdatevalue: any;

  
  localDate: any;
  DueDate_change: any;
  type: 'string'; 
  options: CalendarModalOptions = {
    title: 'BASIC',
  };
  calendarshow = 0;
  
  userarry = [] as any;  
  showuseraccess="block";
  startdatedisable = true as boolean;
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
              private formBuilder: FormBuilder, public authService: RestProvider,
              public toastCtrl: ToastController, public loadingCtrl: LoadingController,
              public view: ViewController
  ){

    this.user = this.user ? JSON.parse(this.user) : {};
    this.DueDate_change = this.taskdata[0].task_data_val[0].DUE_DATE;
    this.startdatevalue = this.taskdata[0].task_data_val[0].START_DATE;
    this.nextactiondatevalue = this.taskdata[0].task_data_val[0].NEXT_ACTION_DATE;
    this.statusdatevalue = this.taskdata[0].task_data_val[0].STATUS_DATE;
    this.createddatevalue = this.taskdata[0].task_data_val[0].CREATED_ON;
    this.createtaskForm = this.formBuilder.group({
      seq_number:['', Validators.compose([Validators.required])],
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      start_date: ['', Validators.compose([Validators.required])],
      due_date: ['', Validators.compose([Validators.required])],      
      next_action_date: ['', Validators.compose([Validators.required])],
      assigned_user: ['', Validators.compose([Validators.required])],
      STATUS_NAME: ['', Validators.compose([Validators.required])], 
      add_user_access: ['', Validators.compose([Validators.required])],  
      COMMENTS: ['', Validators.compose([Validators.required])]
    });

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

  onChange(event){
    var today =  new Date(event._d);
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = dayname[today.getDay()] +'  '+today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    this.localDate = date;
    this.DueDate_change = today.getDate()+'-'+monthname[(today.getMonth())]+'-'+today.getFullYear();
    if(this.calendarshow == 1){
      this.calendarshow = 0;
    }else{
      this.calendarshow = 1;
    }
   }

   opencalendar(){
    if(this.calendarshow == 1){
      this.calendarshow = 0;
    }else{
      this.calendarshow = 1;
    }
   }


  ionViewDidLoad() {
    
    var today =  new Date(this.taskdata[0].task_data_val[0].DUE_DATE);
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var date = dayname[today.getDay()] +'  '+today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    this.localDate = date;
    this.getuser();
    this.getuseraccess(this.taskdata[0].TASK_ID);
  }

  getuseraccess(task_id){
    let data ={
      task_id : task_id,
      user_info_id : this.user.UserInfoId
    }
    console.log(data);
    this.presentLoadingDefault(true);
    this.authService.postData(data, 'task/GetUserAccess').then((result) => {
      console.log(result);
      this.userarry = result;
      for (var i in this.userarry) {
        this.userarry[i].INSERT_TYPE = "Inserted";        
      }
      this.presentLoadingDefault(false);
      if (this.userarry.length > 0) {
        this.presentLoadingDefault(false);
        //this.presentToast(`Data found in ${myTitle}`);
      } else {
        this.presentLoadingDefault(false);
        this.presentToast(`No data found`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  getuser() {
    let myTitle = 'User Info';
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/UserList/').then((result) => {
      this.userdetails = result;
      this.presentLoadingDefault(false);
      if (this.userdetails.length > 0) {
        this.presentLoadingDefault(false);
        //this.presentToast(`Data found in ${myTitle}`);
      } else {
        this.presentLoadingDefault(false);
        this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  clearvalues() {
    //this.createtaskForm.reset();
    this.view.dismiss();
    return false;
  }

  nextduedate() {
    this.duedate = 'block';
    this.titlestyle = 'none';
  }
  titleshow() {
    this.titlestyle = 'block';
    this.duedate = 'none';
  }
  usershow() {
    this.assign = 'block';
    this.duedate = 'none';
  }
  dueshow() {
    this.assign = 'none';
    this.duedate = 'block';
  }

  closeModal() {
    this.view.dismiss();
  }

  userChanged(event: { component: IonicSelectableModule, value: any }) {
    console.log('event', event);

  }

  onClose() {
    let toast = this.toastCtrl.create({
      message: 'Thank You',
      duration: 2000
    })
    toast.present();
  }

  addUserAccess(event: { component: IonicSelectableModule , value: any }) {
    console.log(event.value);
    console.log(this.userarry);
    let arr =this.userarry;
    for(var i=0;i<event.value.length;i++){
      var userDetailsFilter = this.userdetails.find(item => item.USER_INFO_ID == event.value[i]);
      console.log(this.createtaskForm.value);
      userDetailsFilter.ACCESS_TYPE = 'V';
      userDetailsFilter.INSERT_TYPE = 'New Insert';
      arr.push(userDetailsFilter)
    }
    this.userarry= arr;
  }

  changeAccessControl(event: { component: IonicSelectableModule , value: any }, USER_INFO_ID: any) {
    console.log('event', event);
    console.log(USER_INFO_ID);
    console.log(this.userarry);
    
    for (var i in this.userarry) {
      if(this.userarry[i].USER_INFO_ID == USER_INFO_ID) {
        this.userarry[i].ACCESS_TYPE = event;
        break;
      }    
    }
    console.log(this.userarry);

  }

  showusercontrol(){
    if(this.showuseraccess=="block"){
      this.showuseraccess="none";
    }else{
      this.showuseraccess="block";
    }
  }

  DeleteUser(index: any, USER_INFO_ID: any) {
    console.log(this.userarry);
    var index = this.userarry.findIndex(item => item.USER_INFO_ID == USER_INFO_ID);
    console.log(index);
    for (var i in this.userarry) {
      if(this.userarry[i].USER_INFO_ID == USER_INFO_ID) {
        this.userarry[i].INSERT_TYPE = "Deleted";
        break;
      }    
    }
    // if (index > -1) {
    //   this.userarry.splice(index, 1);
    // }
    // array = [2, 9]
    console.log(this.userarry);

  }


  updatetask(){
      let task_details = {} as any;
      //var task_details = this.taskdata[0].task_data_val[0];
      //let task_update_data = this.createtaskForm.value;
      task_details.TASK_ID    = this.taskdata[0].TASK_ID;
      task_details.DUE_DATE    = this.DueDate_change;
      task_details.COMMENTS    = this.createtaskForm.value.COMMENTS;
      task_details.useraccesslist = JSON.stringify(this.userarry);
      task_details.modified_by = this.user.UserInfoId;
      task_details.current_value = this.createtaskForm.value.COMMENTS;
      task_details.prev_value = this.taskdata[0].task_data_val[0].COMMENTS;
      task_details.CREATED_BY =  this.user.UserInfoId;
      task_details.ASSIGNED_USER_INFO_ID = this.taskdata[0].task_data_val[0].ASSIGNED_USER_INFO_ID;


      console.log('Updated Task data..',this.taskdata[0]);

      this.authService.postData(task_details, 'task/updatetaskduedate').then((result) => {
        this.presentLoadingDefault(false);
        //this.presentToast("Task successfully saved");
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
        push_message.message = 'Task No: '+this.taskdata[0].task_data_val[0].SEQ_TEXT+"\n"+'Title: '+this.taskdata[0].task_data_val[0].TITLE+"\n"+'Current Value '+this.createtaskForm.value.COMMENTS+'\n Previous Value: '+this.taskdata[0].task_data_val[0].COMMENTS;
        push_message.app_platform = app_platform;
        push_message.task_assignee_id = this.taskdata[0].task_data_val[0].ASSIGNED_USER_INFO_ID;
        push_message.task_created_by = this.taskdata[0].task_data_val[0].CREATED_BY;
        push_message.new_task = null;
        push_message.loggedin_user_id = this.user.UserInfoId;
        push_message.task_id    = this.taskdata[0].TASK_ID;
        push_message.trans_type = 'TMS';
  
        this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
          this.presentLoadingDefault(false);
          this.pushnotificationValues = result;
        }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast("Something went to wrong, please try again later");
        });
  
        this.closeModal();
      }, err => {
        this.presentLoadingDefault(false);
        this.presentToast("Something went to wrong, please try again later");
      });

  }

  inserttask() {
    this.presentLoadingDefault(true);
    let task_insert_data = this.createtaskForm.value;
    task_insert_data.created_by = this.user.UserInfoId
    if (this.createtaskForm.value.assigned_user != '') {
      task_insert_data.status = 2;
    } else {
      task_insert_data.status = 1;
    }
    this.authService.postData(task_insert_data, 'task/TaskInsert').then((result) => {
      this.presentLoadingDefault(false);
      //this.presentToast("Task successfully saved");
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
      push_message.message = 'New task is created.';
      push_message.app_platform = app_platform;
      push_message.task_assignee_id = this.createtaskForm.value.assigned_user;
      push_message.task_created_by = this.user.UserInfoId;
      push_message.new_task = 'NewTask';
      push_message.loggedin_user_id = this.user.UserInfoId;      
      push_message.trans_type = 'TMS';

      this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
        this.presentLoadingDefault(false);
        this.pushnotificationValues = result;
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast("Something went to wrong, please try again later");
      });

      this.closeModal();
    }, err => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

}
