import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { CalendarModalOptions } from "ion2-calendar";
import { IonicSelectableComponent } from 'ionic-selectable';

// import * as moment from 'moment';

import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Base64 } from "@ionic-native/base64";

import { Timer } from '../../app/timer';
import { State } from '../../app/state';

import { StreamingMedia, StreamingVideoOptions, StreamingAudioOptions } from '@ionic-native/streaming-media';

const MEDIA_FOLDER_NAME = 'my_media/';

@Component({
  selector: 'page-createtask',
  templateUrl: 'createtask.html'
})
export class CreateTaskPage {
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
  showuseraccess = "block";
  firstParam: any;
  secondParam: any;
  customDayShortNames: any;
  selected_userid: any;
  file_name = [] as any;
  size = [] as any;
  imageURI = [] as any;
  user_create_by: any;
  localDate: any;
  DueDate_change: any;
  parant_or_not: any;
  complaintList = [] as any;
  complaint = [] as any;

  complaintListsearch = [] as any;

  options: CalendarModalOptions = {
    title: 'BASIC',
  };
  calendarshow = 0;


  userdetailsAll: any;
  showComplaintList = 0;
  itemsToDisplay = [];
  unitToDisplay = [];
  taskmodal = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  searchData = { "search_value": "" };
  searchtext = '';
  partners = [] as any;
  arr = [] as any;
  unitarr = [] as any;
  unitsSelectedArray = [] as any;
  unitList: any;
  showAudioRecord = 0;
  
  pet: string = "pending";
  tab_name: any;
  audio_playing = 0;
  showfooter = 0;
  
  recording: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject;
  audioList: any;
  status: string = 'Tab the button to start recording';
  serverAudioFileLocation = '';
  _path: any;
  audio_base64: any;
  fileUri: any
  fileExtn: any;

  private btnPlay: string = 'START';
  private timer: Timer = new Timer();
  private state: State = new State();
  twoDigit = '00';
  mediaFiles = [];
  message: string = '';
  audio_duration: any;
  recordedAudio: any;
  audiofileName: any;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, public authService: RestProvider,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public view: ViewController,private file: File,
    private media: Media,private base64: Base64,
    private streamingMedia: StreamingMedia
  ) {
    this.customDayShortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.useraccess = [
      { id: 1, control_name: 'Full Control', control_value: 'F' },
      { id: 2, control_name: 'View Only', control_value: 'V' }
    ];

    this.user = this.user ? JSON.parse(this.user) : {};
    this.createtaskForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
      due_date: ['', Validators.compose([Validators.required])],
      assigned_user: ['', Validators.compose([Validators.required])],
      partner_user:  ['', Validators.compose([Validators.required])],
      complaint: ['', Validators.compose([Validators.required])],
      unit: ['', Validators.compose([Validators.required])],
      add_user_access: ['', Validators.compose([Validators.required])],
      user_access: ['', Validators.compose([Validators.required])]
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
    var today = new Date();
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.localDate = date;
    this.DueDate_change = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();
    console.log('firstParam', this.taskmodal);
    
    this.getuser();
    this.getComplaintList();
    this.getUnitList();
  }

  opencalendar() {
    if (this.calendarshow == 1) {
      this.calendarshow = 0;
    } else {
      this.calendarshow = 1;
    }
  }

  onChange(event) {
    var today = new Date(event._d);
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.localDate = date;
    this.DueDate_change = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();
    if (this.calendarshow == 1) {
      this.calendarshow = 0;
    } else {
      this.calendarshow = 1;
    }
  }

  getComplaintList() {
    let time_bf = new Date();
    this.authService.getData({}, 'call_management/ComplaintList').then((result) => {
      this.presentLoadingDefault(false);
      this.complaintList = result;
      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log('Complaint Seconds:', seconds);
      if (this.complaintList.length > 0) {
        this.itemsToDisplay = [];
        let total_count = 30;
        let array_len = 0;
        if (total_count < this.complaintList.length) {
          array_len = total_count;
        } else {
          array_len = this.complaintList.length;
        }

        for (let i = 0; i < array_len; i++) {
          this.itemsToDisplay.push(this.complaintList[i]);
        }

      } else {
        this.presentToast("No data found.");
      }
    }, (err) => {
      this.presentToast("Something went to wrong, please try again later");
    });
  }


  getUnitList() {
    let time_bf = new Date();
    let params ={
      user_info_id: this.user.UserInfoId
    }
    this.authService.postData(params, 'task/GetUnitListAll').then((result) => {
      this.presentLoadingDefault(false);
      this.unitList = result;
      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log('unit Seconds:', seconds);
      // if (this.unitList.length > 0) {
      //   this.unitToDisplay = [];
      //   let total_count = 30;
      //   let array_len = 0;
      //   if (total_count < this.unitList.length) {
      //     array_len = total_count;
      //   } else {
      //     array_len = this.unitList.length;
      //   }

      //   for (let i = 0; i < array_len; i++) {
      //     this.unitToDisplay.push(this.unitList[i]);
      //   }

      // } else {
      //   this.presentToast("No data found.");
      // }
    }, (err) => {
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  onSelectUnit(event: { component: SelectSearchableComponent, value: any }) {
    console.log('event', event.value);

    this.unitarr = [];
    for (var i = 0; i < event.value.length; i++) {
      var unitFilter = this.unitList.find(item => item.UNIT_ID == event.value[i].UNIT_ID);
      this.unitarr.push(unitFilter);
    }
    this.unitsSelectedArray = this.unitarr;
    console.log(this.unitsSelectedArray);


  }

  getuser() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/UserList/').then((result: any) => {

      this.userdetailsAll = result;
      let filterdata = result.filter(x => x.TYPE_USER == "Engineer" || x.TYPE_USER == "Supervisor" || x.TYPE_USER == "Call Center" || x.TYPE_USER == "Manager");
      this.userdetails = filterdata
      this.user_access_list = filterdata;
      this.user_create_by = result.filter(item => item.USER_INFO_ID == 6 || item.USER_INFO_ID == 1181);

      if (this.taskmodal != undefined) {
        console.log('firstParam --', this.taskmodal[0].assign_user_id);
        this.selected_userid = this.taskmodal[0].assign_user_id;
      } else {
        this.selected_userid = '';
      }

      if (this.taskmodal != undefined) {
        if (this.taskmodal[0].TASK_ID == 0) {
          this.parant_or_not = 0;
        } else if (this.taskmodal[0].TASK_ID == -1) {
          let data = this.taskmodal[0];
          this.createtaskForm = this.formBuilder.group({
            title: [data.CALL_LOG_ID + ',' + data.REQUESTOR_NAME + ',' + data.UNIT, Validators.compose([Validators.required])],
            due_date: ['', Validators.compose([Validators.required])],
            assigned_user: ['', Validators.compose([Validators.required])],
            add_user_access: ['', Validators.compose([Validators.required])],
            user_access: ['', Validators.compose([Validators.required])],
            complaint: ['', Validators.compose([Validators.required])]
          });
          this.parant_or_not = 0;
        } else {
          this.parant_or_not = 1;
        }
      }

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
    if(this.showAudioRecord == 0){
      this.view.dismiss();
    }else{
      this.showAudioRecord = 0;
    }
  }

  userAssignedTo(event: { component: SelectSearchableComponent, value: any }) {
    console.log('event', event);
  }

  onSelectPartner(event: { component: SelectSearchableComponent, value: any }) {
    console.log('event', event.value);

    this.arr = [];
    for (var i = 0; i < event.value.length; i++) {
      var userDetailsFilter = this.userdetails.find(item => item.USER_INFO_ID == event.value[i]);
      this.arr.push(userDetailsFilter);
    }
    this.partners = this.arr;
    console.log(this.partners);


  }

  complaintChange(event: {
    component: SelectSearchableComponent,
    value: any
  }) {
    //console.log(event.value);
    var complaintdata = event.value;
    for (let i = 0; i < complaintdata.length; i++) {
      this.complaint.push(complaintdata[i].COMPLAINT_ID);
    }
  }


  doInfinite(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    console.log('Begin async operation');
    let len = this.itemsToDisplay.length;

    //setTimeout(() => {

    let total_count = len + 30;
    let array_len = 0;
    if (total_count < this.complaintListsearch.length) {
      array_len = total_count;
    } else {
      array_len = this.complaintListsearch.length;
    }

    for (let i = len; i < array_len; i++) {
      this.itemsToDisplay.push(this.complaintListsearch[i]);
    }
    console.log(this.itemsToDisplay);
    console.log('Async operation has ended');
    //infiniteScroll.complete();
    event.component.endInfiniteScroll();
    //}, 1000);
  }



  onClose() {
    let toast = this.toastCtrl.create({
      message: 'Thank You',
      duration: 2000
    })
    toast.present();
  }


  searchPorts(event: any) {
    this.searchtext = event.text.trim().toLowerCase();
    event.component.startSearch();

    

    if (this.searchtext != '') {

      let filterData = this.complaintList.filter(item => this.filter(item));
      this.complaintListsearch = filterData;
      this.itemsToDisplay = [];

      setTimeout(() => { 
        for (let i = 0; i < this.complaintListsearch.length; i++) {
          this.itemsToDisplay.push(this.complaintListsearch[i]);
        }
      }, 500);

      
    } else {

      this.complaintListsearch = this.complaintList;
      this.itemsToDisplay = [];
      
      setTimeout(() => { 
        for (let i = 0; i < 30; i++) {
          this.itemsToDisplay.push(this.complaintListsearch[i]);
        }
      }, 500);
      
    }

    event.component.endSearch();

    console.log(this.complaintListsearch);

  }


  filter(item) {
    let _val = this.searchtext;
    let _case_val = item['COMPLAINT_DESCRIPTION'] ? item['COMPLAINT_DESCRIPTION'].toString().toUpperCase() : '';
    return (_case_val.includes(_val.toUpperCase()));
  }

  openFromCode() {
    this.selectComponent.open();
  }

  inserttask() {

    let task_insert_data = this.createtaskForm.value;
    task_insert_data.complaint = this.complaint;
    task_insert_data.due_date = this.DueDate_change;
    task_insert_data.created_by = this.user.UserInfoId;

    if (this.createtaskForm.value.assigned_user != '') {
      task_insert_data.status = 2;
    } else {
      task_insert_data.status = 1;
    }

    if (this.taskmodal != undefined) {
      if (this.taskmodal[0].TASK_ID == 0) {
        task_insert_data.parent_task_id = 0;
      } else if (this.taskmodal[0].TASK_ID == -1) {
        let data = this.taskmodal[0];
        task_insert_data.call_log_id = data.CALL_LOG_ID;
        task_insert_data.TransId = data.CALL_LOG_ID;
        task_insert_data.TransType = 'CALOG';
      } else {
        task_insert_data.parent_task_id = this.taskmodal[0].TASK_ID;
        task_insert_data.call_log_id = 0;
      }
    } else {
      task_insert_data.parent_task_id = 0;
    }

    if (this.createtaskForm.value.title == '' || this.createtaskForm.value.title == null) {
      this.presentToast("Please enter title.");
    } else {
      console.log(task_insert_data);
      debugger;
      this.presentLoadingDefault(true);
      this.authService.postData(task_insert_data, 'task/TaskInsertv1').then((result) => {
        this.presentLoadingDefault(false);
        this.insertedValues = result;
        let task_id = this.insertedValues.taskinsertdata.p_task_id;
        this.getInsertTaskPartners(task_id);
        this.getInsertTaskUnits(task_id);
        if(this.recordedAudio != '' && this.recordedAudio != null && this.recordedAudio != undefined){
          this.getInsertAudioFile(task_id);
        }
        

        if (this.file_name.length > 0) {
          
          task_insert_data.TASK_ID = task_id;
          task_insert_data.name = this.file_name;
          task_insert_data.size_data = this.size;
          task_insert_data.imageURI_data = this.imageURI;
          task_insert_data.modified_by = this.user.UserInfoId;

          this.authService.postData(task_insert_data, 'task/TaskInsertMultipleFile').then((result) => {
            console.log(result);
          }, (err) => {
            this.presentLoadingDefault(false);
            this.presentToast("Something went to wrong, please try again later");
          });
        }

        var app_platform: string = '';
        if (this.platform.is('ios')) {
          app_platform = 'ios';
        }

        if (this.platform.is('android')) {
          app_platform = 'android';
        }

        var taskcreator = this.userdetailsAll.filter(item => item.USER_INFO_ID == this.user.UserInfoId);
        let push_message = {} as any;
        push_message.title = taskcreator[0].USER_SURNAME
        push_message.message = 'Task No: ' + this.insertedValues.taskinsertdata.p_seq_text + '\n Title: ' + this.createtaskForm.value.title + '\n Comments: New task is Created.';
        push_message.app_platform = app_platform;
        push_message.task_assignee_id = this.createtaskForm.value.assigned_user;
        push_message.task_created_by = taskcreator[0].USER_INFO_ID;
        push_message.new_task = 'NewTask';
        push_message.loggedin_user_id = taskcreator[0].USER_INFO_ID;
        push_message.task_id = this.insertedValues.taskinsertdata.p_task_id;
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


  onSelectFile(event) {
    let file = event.target.files;
    for (var i = 0; i < file.length; i++) {
      this.file_name.push(file[i].name);
      this.size.push(file[i].size);
      let reader = new FileReader();
      reader.readAsDataURL(file[i]);
      reader.onloadend = (e) => {
        this.imageURI.push(reader.result);
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    }
  }

  getInsertTaskPartners(task_id: any) {


    for (let j = 0; j < this.partners.length; j++) {

      let partner_id = parseInt(this.partners[j].USER_INFO_ID);

      let commentsData = {
        task_id: task_id,
        assigned_to: 0,
        user_info_id: partner_id,
        user_name: this.partners[j].USER_SURNAME,
        created_by: this.user.UserInfoId
      }

      console.log('Insert Task Partnes', commentsData);
      this.authService.postData(commentsData, 'task/getInsertTaskPartner').then((result) => {
        console.log('result', result);

      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    }
  }

  getInsertTaskUnits(task_id: any) {


    for (let j = 0; j < this.unitsSelectedArray.length; j++) {

      let unit_id = parseInt(this.unitsSelectedArray[j].UNIT_ID);

      let commentsData = {
        task_id: task_id,
        unit_id: unit_id,
        unit_description: this.unitsSelectedArray[j].DESCRIPTION,
        created_by: this.user.UserInfoId
      }

      console.log('Insert Task units', commentsData);
      this.authService.postData(commentsData, 'task/getInsertTaskUnits').then((result) => {
        console.log('result', result);

      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    }
  }

  uploadAudioForTask(){
    console.log('Hiii...');
    this.showAudioRecord = 1;
  }

  getInsertAudioFile(task:any){
    debugger;
    let data = {
      size_data: 0,
      created_by: this.user.UserInfoId,
      modified_by: this.user.UserInfoId,
      imageURI_data: this.recordedAudio,
      name: this.audiofileName,
      userid: this.user.UserInfoId,
      ID: 0,
      comments_id: task,
      comments_child_id: 0,
      file_name: this.audiofileName,
      module_name: 'TASK COMMENT',
      client_name: null,
      unit_no: null,
      replied_from_id: null,
      duration: this.audio_duration
    }

    console.log('Param-->', data);
    this.authService.postData(data, 'task/uploadroiaudiofilev5').then((result: any) => {

      if (result) {
        this.presentToast("Audio Updated Successfully.");        
        // var app_platform: string = '';
        // let trans_type = '';

        // if (this.platform.is('ios')) {
        //   app_platform = 'ios';
        // }

        // if (this.platform.is('android')) {
        //   app_platform = 'android';
        // }

        // if (this.taskmodal[0].module_type == 'TASK COMMENT') {

        //   this.message = 'Task Id: ' + this.taskmodal[0].comments_id + ' - New Recording by ' + this.user.Surname;
        //   trans_type = 'TASK AUDIO';
        //   debugger;

        //   if (this.user.UserInfoId != parseInt(this.taskmodal[0].comment_created_by)) {

        //     let push_message = {} as any;
        //     push_message.title = this.user.Surname,
        //     push_message.content = 'Audio';
        //     push_message.message = this.message;
        //     push_message.app_platform = app_platform;
        //     push_message.task_assignee_id = parseInt(this.taskmodal[0].comment_created_by);
        //     push_message.task_created_by = parseInt(this.taskmodal[0].comment_created_by);
        //     push_message.new_task = null;
        //     push_message.loggedin_user_id = this.user.UserInfoId;
        //     push_message.task_id = task;
        //     push_message.trans_type = trans_type;

        //     console.log(this.taskmodal);
        //     console.log(push_message);

        //     this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
              
        //       console.log(result);
        //     }, (err) => {
        //       this.presentLoadingDefault(false);
        //       this.presentToast("Something went to wrong, please try again later");
        //     });

                         

        //   }
        // }

      }

    }, (err) => {
      this.presentToast(err);
    });

  }

  startRecord() {
    let _month = new Date().getMonth() + 1;

    if (this.platform.is('ios')) {

      this.audiofileName = 'VoiceRecording_' + new Date().getDate() + _month + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.wav';

      this.file.createFile(this.file.tempDirectory, this.audiofileName, true).then(() => {
        console.log('file is created...')
        this.filePath = this.file.tempDirectory.replace(/^file:\/\//, '') + MEDIA_FOLDER_NAME + this.audiofileName;
        this.audio = this.media.create(this.file.tempDirectory.replace(/^file:\/\//, '') + MEDIA_FOLDER_NAME + this.audiofileName);
        this.audio.startRecord();
        this.status = 'Recording...';
        this.timer.start();
        this.state.setPlay();
        this.btnPlay = 'START';
        this.recording = true;
        this.audio.onError.subscribe(error => console.log('Error!', error));
      }).catch((error) => { console.log(error) });
      
    } else if (this.platform.is('android')) {

        this.audiofileName = 'VoiceRecording_' + new Date().getDate() + _month + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.wav';
        this.filePath = this.file.externalRootDirectory + this.audiofileName;
        this.audio = this.media.create(this.filePath);
        this.audio.startRecord();
        this.status = 'Recording...';
        this.timer.start();
        this.state.setPlay();
        this.btnPlay = 'START';
        this.recording = true;
        this.audio.onError.subscribe(error => console.log('Error!', error));

    } else {
        return false;
    }

  }

  stopRecord() {
    let duration = [];
    duration.push(this.timer);
    console.log(duration[0].minutes + ':' + duration[0].secondes);
    this.audio_duration = duration[0].minutes + ':' + duration[0].secondes;
    console.log('Timer -->', this.timer);
    this.audio.stopRecord();
    this.timer.stop();
    this.state.setStop();
    this.timer.reset();

    console.log('Before Base64');

    if (this.platform.is('ios')) {

      this.file.readAsDataURL(this.file.tempDirectory + MEDIA_FOLDER_NAME, this.audiofileName).then((base64File) => {

        console.log(base64File);
        this.recordedAudio = base64File;    
        this.btnPlay = 'START';
        this.recording = false;
        this.status = 'Tab the button to start recording';    

      }).catch(function (err: TypeError) {
        console.log("readAsDataURL123: " + JSON.stringify(err));
      });

    } else if (this.platform.is('android')) {

      this.file.readAsDataURL(this.file.externalRootDirectory, this.audiofileName).then((base64File) => {
        console.log(base64File);
        this.recordedAudio = base64File;
        this.btnPlay = 'START';
        this.recording = false;
        this.status = 'Tab the button to start recording';
      
      }).catch((error) => { console.log("file error", error) })
      
    }
  }


  playAudio(file: any, file_path: any, idx: any) {
    console.log(file_path);
    let options: StreamingAudioOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      initFullscreen: false
    };

    if (this.platform.is('ios')) {
      this.filePath = file_path;
      //this.audio = this.media.create(this.filePath);
      this.streamingMedia.playAudio(this.filePath, options);
    } else if (this.platform.is('android')) {
      this.filePath = file_path;
      //this.audio = this.media.create(this.filePath);
      this.streamingMedia.playAudio(this.filePath, options);
    }

  }


  pauseAudio(file: any, file_path: any, idx: any) {
    this.audio.pause();
    this.audio_playing = 0;
  }

  segmentChanged(event) {
    console.log(event.value);
    let tabValue = event.value;
    this.tab_name = event.value;
    if (tabValue == 'pending') {
      this.showfooter = 0;
    } else if (tabValue == 'confirm') {
      this.showfooter = 1;
    }
  }

}
