import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';
// import * as moment from 'moment'


/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-taskreminder',
  templateUrl: 'taskreminder.html',
})
export class TaskReminderPage {
  @ViewChild('myselect') selectComponent: SelectSearchableComponent;
  duedate = 'none';
  assign = 'none';
  titlestyle = 'block';
  userdetails: any;
  user_access_list: any;
  useraccess: any;
  insertedValues: any;
  pushnotificationValues: any;
  createtaskForm: FormGroup;
  showuseraccess = 'none';
  reminderarry = [] as any;
  taskReminderList: any;
  taskReminderListSearch:any;
  taskmodal = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, public authService: RestProvider,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public view: ViewController
  ) {
  
    this.user = this.user ? JSON.parse(this.user) : {};
    this.createtaskForm = this.formBuilder.group({
      reminder_date: ['', Validators.compose([Validators.required])],
      reminder_hr: ['', Validators.compose([Validators.required])],
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

  ionViewDidLoad() {
    this.showuseraccess = 'none';
    this.getuser();
    this.GetReminderListAll();
  }

  getuser() {
    let myTitle = 'User Info';
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/UserList/').then((result) => {
      this.userdetails = result;
      this.user_access_list = result;
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

  GetReminderListAll() {    
    this.presentLoadingDefault(true);
    let params = {} as any;
    params.task_id = this.taskmodal[0].TASK_ID;
    params.user_info_id = this.user.UserInfoId;

    this.authService.postData(params, 'task/GetReminderListAll').then((result) => {
      //this.taskReminderList = result;
      //this.taskReminderListSearch = result;
      this.reminderarry = result;
      for (var i in this.reminderarry) {
        this.reminderarry[i].INSERT_TYPE = "Inserted";        
      }
      this.showuseraccess ='block';
      console.log('REminder list all',this.taskReminderList );
      this.presentLoadingDefault(false);    

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });

  }



  clearvalues() {
    this.createtaskForm.reset();
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
 
  openFromCode() {
    this.selectComponent.open();
  }
 
  addreminder(){
    
    if(this.createtaskForm.value.reminder_date == '' || this.createtaskForm.value.reminder_date == null){
      this.presentToast("Please enter reminder date.");
      return;
    }
    if(this.createtaskForm.value.reminder_hr == '' || this.createtaskForm.value.reminder_hr == null){
      this.presentToast("Please enter time.");
      return;
    }

    if(this.createtaskForm.value.COMMENTS == '' || this.createtaskForm.value.COMMENTS == null){
      this.presentToast("Please enter comments.");
      return;
    }

    let ampm = "";
    let hrval = 0;
    var time = new Date(this.createtaskForm.value.reminder_date);
    console.log('local',
        time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    );

    let task_insert_data = this.createtaskForm.value;
    var time_val = task_insert_data.reminder_hr.split(":", 2); 

    let arr2 = {TASK_ID:"",REMINDER_DATE:"",HOURS:"",MINUTES:"",COMMENTS:"",REMINDER_HR:"",AMPM:"",HRVAL:0,INSERT_TYPE:""};

    console.log(this.taskmodal[0].task_data_val);
    console.log('Add',task_insert_data);
    console.log('Add',time_val);
    console.log('Add',time_val[0],time_val[1]);

    if(time_val[0] < 12){
      ampm = 'AM';
      hrval = time_val[0];
    }else{
      ampm = 'PM';
      hrval = parseInt(time_val[0]) - 12;
    }
    console.log('ADDDDD',hrval,ampm);
    arr2.TASK_ID = this.taskmodal[0].TASK_ID;
    arr2.REMINDER_DATE = this.createtaskForm.value.reminder_date;
    arr2.HOURS   = time_val[0];
    arr2.MINUTES  = time_val[1];
    arr2.COMMENTS  = this.createtaskForm.value.COMMENTS;
    arr2.REMINDER_HR  = this.createtaskForm.value.reminder_hr;
    arr2.AMPM  = ampm;
    arr2.HRVAL = hrval;
    arr2.INSERT_TYPE = 'New Insert';

    this.reminderarry.push(arr2);
    console.log('array--',this.reminderarry);
    this.showuseraccess='block';
    this.createtaskForm.reset();

  }

  DeleteUser(index: any, TASK_ID: any,REMINDER_DATE:any,REMINDER_HR:any,TASK_REMINDER_ID:any) {
   // var index = this.reminderarry.findIndex(item => (item.TASK_ID == TASK_ID)&&(item.REMINDER_DATE == REMINDER_DATE)&&(item.REMINDER_HR == REMINDER_HR));
    for (var i in this.reminderarry) {
      if(this.reminderarry[i].TASK_REMINDER_ID == TASK_REMINDER_ID) {
        this.reminderarry[i].INSERT_TYPE = "Deleted";
        break;
      }    
    }   
    console.log(this.reminderarry);
  }

  inserttaskreminder() {
      if(this.reminderarry.length > 0){
          console.log('Reminder Insert start..');
          this.presentLoadingDefault(true);
          let task_insert_data = this.createtaskForm.value;
          task_insert_data.created_by = this.user.UserInfoId;
          task_insert_data.user_reminder = JSON.stringify(this.reminderarry);
          task_insert_data.TASK_ID = this.taskmodal[0].TASK_ID;
          task_insert_data.user_info_id = this.user.UserInfoId;
  
          this.authService.postData(task_insert_data, 'task/InsertTaskReminder').then((result) => {
              this.presentLoadingDefault(false);
              this.closeModal();
          }, err => {
              this.presentLoadingDefault(false);
              this.presentToast("Something went to wrong, please try again later");
          });
      }else{
        this.presentToast("Please enter reminder details.");
        return;
      }    
  }

  showusercontrol(){
    if(this.showuseraccess=="block"){
      this.showuseraccess="none";
    }else{
      this.showuseraccess="block";
    }
  }

}
