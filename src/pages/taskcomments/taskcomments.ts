import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, ToastController, LoadingController, ModalOptions, Modal, ModalController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { Constant } from '../../providers/constant/constant';
import { CallNumber } from '@ionic-native/call-number';
//import * as moment from 'moment';

import { StreamingMedia, StreamingVideoOptions, StreamingAudioOptions } from '@ionic-native/streaming-media';

@IonicPage()
@Component({
  selector: 'page-taskcomments',
  templateUrl: 'taskcomments.html',
})
export class TaskCommentPage {


  AvailabilityTab: string = "comments";
  taskcommentsdetails: any;
  taskcommentsSearch: any
  taskcommentsForm: FormGroup
  insertedValues: any;
  today: any;
  terms: any;
  pushnotificationValues: any;
  commentcount: any;
  taskuploadsdetails: any
  userdetails: any;
  taskcommentsresult: any;

  file_name = [] as any;
  size = [] as any;
  imageURI = [] as any;
  downloadUrl: any;

  smschecked: boolean = false;
  emailchecked: boolean = false;
  emailboxshow = 0;
  emailiconshow = 0;
  taskdata = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  taskaudioList: any;
  tab_name: any;
  login_user_id: any;

  filePath: string;

  constructor(public platform: Platform, private callNumber: CallNumber, public navCtrl: NavController,
    public navParams: NavParams, private formBuilder: FormBuilder, public authService: RestProvider,
    private modal: ModalController, public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public view: ViewController, public constant: Constant, private file: File, private fileOpener: FileOpener,
    private streamingMedia: StreamingMedia
  ) {
    this.AvailabilityTab = "comments";
    this.user = this.user ? JSON.parse(this.user) : {};
    this.today = Date.now();
    this.taskcommentsForm = this.formBuilder.group({
      TASK_ID: ['', Validators.compose([Validators.required])],
      COMMENTS: ['', Validators.compose([Validators.required])],
      PREV_COMMENTS: ['', Validators.compose([Validators.required])],
      assigned_user_id: ['', Validators.compose([Validators.required])],
      created_user_id: ['', Validators.compose([Validators.required])],
      SMS: [],
      EMAIL: [],
      EMAILTEXTBOX: []
    });
  }

  get TaskComments(): any { return this.taskcommentsForm.get('COMMENTS'); }

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

  SendSms(): void {
    this.smschecked = !this.smschecked;
  }

  SendEmail(): void {
    this.emailchecked = !this.emailchecked;
    if (this.emailiconshow == 1) {
      this.emailiconshow = 0;
    } else {
      this.emailiconshow = 1;
    }
  }

  SendMultipleEmail(): void {
    if (this.emailboxshow == 1) {
      this.emailboxshow = 0;
    } else {
      this.emailboxshow = 1;
    }
  }

  callmobileNumber(mobileno: any) {
    console.log('Call Number', mobileno);
    this.callNumber.callNumber(mobileno, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  inserttaskComments() {

    const Data = this.navParams.get('data');
    let TASK_ID = Data[0].TASK_ID;
    var today = new Date();
    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    const mobilenoarr = [];
    const emailarr = [];

    if (this.taskdata[0].task_data_val[0].ASSIGNED_USER_INFO_ID != 0) {
      const assignee_mobileno = this.userdetails.find(item => item.USER_INFO_ID == this.taskdata[0].task_data_val[0].ASSIGNED_USER_INFO_ID);
      mobilenoarr.push(assignee_mobileno.USER_MOBILE);
      emailarr.push(assignee_mobileno.USER_EMAIL);
    }

    if (this.taskdata[0].task_data_val[0].REFERAL_USERINFOID != null) {

      const user_id = new String(this.taskdata[0].task_data_val[0].REFERAL_USERINFOID);
      const referal_user_infoid = user_id.split(",");
      for (var i = 0; i < referal_user_infoid.length; i++) {
        const referal_mobileno = this.userdetails.find(item => item.USER_INFO_ID == referal_user_infoid[i]);
        mobilenoarr.push(referal_mobileno.USER_MOBILE);
        emailarr.push(referal_mobileno.USER_EMAIL);
      }
    }

    if (this.taskcommentsForm.value.EMAILTEXTBOX != null) {
      const multiple_email = this.taskcommentsForm.value.EMAILTEXTBOX.split(",");
      for (var j = 0; j < multiple_email.length; j++) {
        var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        var email = regexp.test(multiple_email[j]);
        if (email == true) {
          emailarr.push(multiple_email[j]);
        } else {
          this.presentToast("Invaild email is entered");
          return;
        }
      }
    }

    var org_comments = this.taskcommentsForm.value.COMMENTS;
    var strCmt = org_comments.replace(/&nbsp;/gi, '').replace(/^\s+|\s+$|\s+(?=\s)/g, "").replace(/^\s*[\r\n]/gm, '');
    strCmt = strCmt.replace('<div><br></div>', '').replace('<div><br></div>', '');
    console.log('Entered Cmt--', strCmt);

    if (strCmt != '') {

      let taskcommentsData = this.taskcommentsForm.value;
      taskcommentsData.created_by = this.user.UserInfoId;
      taskcommentsData.modified_by = this.user.UserInfoId;
      taskcommentsData.field_name = "Comments";
      taskcommentsData.COMMENTS = org_comments;

      taskcommentsData.name = this.file_name;
      taskcommentsData.size_data = this.size;
      taskcommentsData.imageURI_data = this.imageURI;

      taskcommentsData.smschecked = this.smschecked;
      taskcommentsData.emailchecked = this.emailchecked;
      taskcommentsData.mobilenoarr = mobilenoarr;
      taskcommentsData.emailarr = emailarr;
      taskcommentsData.message = 'Task No: ' + this.taskdata[0].task_data_val[0].SEQ_TEXT + '\n Title: ' + this.taskdata[0].task_data_val[0].TITLE + '\n Comments: ' + org_comments + "\n Updated by " + this.user.Surname + " on " + dateTime;
      taskcommentsData.emailmessage = 'Task No: ' + this.taskdata[0].task_data_val[0].SEQ_TEXT + '<br> Title: ' + this.taskdata[0].task_data_val[0].TITLE + '<br> Comments: ' + org_comments + "<br> Updated by " + this.user.Surname + " on " + dateTime;

      this.presentLoadingDefault(true);
      this.authService.postData(taskcommentsData, 'task/Taskcommentsinsert').then((result) => {
        this.presentLoadingDefault(false);
        this.insertedValues = result;
        if (this.commentcount == 0) {
          this.update_task(TASK_ID, 'start');
        } else {
          this.ionViewWillLoad();
        }

        var app_platform: string = '';
        if (this.platform.is('ios')) {
          app_platform = 'ios';
        }

        if (this.platform.is('android')) {
          app_platform = 'android';
        }

        let push_message = {} as any;
        push_message.title = this.user.Surname
        push_message.message = 'Task No: ' + this.taskdata[0].task_data_val[0].SEQ_TEXT + '\n Title: ' + this.taskdata[0].task_data_val[0].TITLE + '\n Comments: ' + org_comments;
        push_message.app_platform = app_platform;
        push_message.task_assignee_id = this.taskdata[0].task_data_val[0].ASSIGNED_USER_INFO_ID;
        push_message.task_created_by = this.taskdata[0].task_data_val[0].CREATED_BY;
        push_message.loggedin_user_id = this.user.UserInfoId;
        push_message.task_id = Data[0].TASK_ID;
        push_message.trans_type = 'TMS';
        push_message.seq_text = this.taskdata[0].task_data_val[0].SEQ_TEXT;

        this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
          this.pushnotificationValues = result;
        }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast(err);
        });

        this.TaskComments.reset();

      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    } else {
      this.TaskComments.reset();
      this.presentLoadingDefault(false);
      this.presentToast("Please enter valid Comments");
    }
  }

  getuser() {
    let myTitle = 'User Info';
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/UserList/').then((result) => {
      this.userdetails = result;
      this.presentLoadingDefault(false);
      if (this.userdetails.length > 0) {
        this.presentLoadingDefault(false);
      } else {
        this.presentLoadingDefault(false);
        this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  getFileList() {
    this.presentLoadingDefault(true);
    const Data = this.navParams.get('data');
    let TASK_ID = Data[0].TASK_ID;
    this.authService.getData({}, 'task/TaskUploadedFileList/' + TASK_ID).then((result) => {
      this.taskuploadsdetails = result;
      console.log(this.taskuploadsdetails);
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  getDate(d) {
    var dates = [];
    var string = d.split(" ");
    for (var j = 0; j < string.length; j++) {
      var day, month, year, result, dateSplitted, aux, finaldate, futuredate;
      result = string[j].match("[0-9]{2}([\-/ \.])[0-9]{2}[\-/ \.][0-9]{4}");
      if (result != null) {
        if (null != result) {
          dateSplitted = result[0].split(result[1]);
          day = dateSplitted[0];
          month = dateSplitted[1];
          year = dateSplitted[2];
        }
        result = string[j].match("[0-9]{4}([\-/ \.])[0-9]{2}[\-/ \.][0-9]{2}");
        if (null != result) {
          dateSplitted = result[0].split(result[1]);
          day = dateSplitted[2];
          month = dateSplitted[1];
          year = dateSplitted[0];
        }

        if (month > 12) {
          aux = day;
          day = month;
          month = aux;
        }
        if (year != undefined && month != undefined && day != undefined) {
          finaldate = year + "/" + month + "/" + day;
          futuredate = day + "/" + month + "/" + year;
          dates.push({ "text": string[j], "finaldate": finaldate, "futuredate": futuredate, "textdate": 1 });
        }
      } else {
        dates.push({ "text": string[j], "finaldate": "0", "futuredate": "0", "textdate": 0 })
      }
    }
    return dates;
  }

  ionViewWillLoad() {

    this.login_user_id = this.user.UserInfoId;
    const Data = this.navParams.get('data');
    console.log(Data);
    this.getuser();
    let TASK_ID = Data[0].TASK_ID;
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/TaskCommentsList/' + TASK_ID).then((result) => {
      this.taskcommentsresult = result;
      this.taskcommentsSearch = result;
      this.presentLoadingDefault(false);
      if (this.taskcommentsresult.length > 0) {
        for (var j = 0; j < this.taskcommentsresult.length; j++) {
          var fdate = 0;
          var test = this.taskcommentsresult[j].MESSAGE;
          if (test != " ") {
            var date = this.getDate(test);
            var commenttext = [];
            if (date.length > 0) {
              for (var k = 0; k < date.length; k++) {
                if (date[k].textdate != 0) {
                  var d1 = new Date();
                  var date2 = new Date(date[k].finaldate);
                  if (d1 < date2) {
                    fdate = 1;
                    commenttext.push({ "text": date[k].text, "linkid": 1, "linktext": date[k].futuredate });
                  } else {
                    commenttext.push({ "text": date[k].text, "linkid": -1, "linktext": "" });
                  }
                } else {
                  commenttext.push({ "text": date[k].text, "linkid": -1, "linktext": "" });
                }
              }
            } else {
              commenttext.push({ "text": test, "linkid": -1, "linktext": "" });
            }
            this.taskcommentsresult[j].newmessage = commenttext;
            this.taskcommentsresult[j].futuredate = fdate;
          }
        }
      }
      this.taskcommentsdetails = this.taskcommentsresult;
      if (this.taskcommentsSearch.length > 0) {
        this.presentLoadingDefault(false);
        this.commentcount = this.taskcommentsSearch.length;

        for (var i = 0; i < this.commentcount; i++) {
          this.taskcommentsdetails[i].MESSAGE = this.createTextLinks(this.taskcommentsdetails[i].MESSAGE);
          //console.log(this.taskcommentsdetails[i].MESSAGE);
        }
        //console.log(this.taskcommentsdetails);

      } else {
        this.presentLoadingDefault(false);
        this.commentcount = 0;
      }

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  opentaskremainder(TASK_ID) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: TASK_ID,
      // task_data_val: this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID)
    }];

    let myModal: Modal = this.modal.create('TaskReminderPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {

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


  bytesToSize(bytes) {
    return (bytes / 1048576).toFixed(3) + " MB";
  }


  getfile(row_no, item: any) {

    let objFile = this.taskuploadsdetails.find(o => o.ROW_NO === row_no);
    console.log(objFile);
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];
    this.downloadUrl = new Blob([new Uint8Array(item.FILE_CONTENT.data)]);
    let content_type = this.constant.fileTypes.filter(ext => ext.name == extn.toUpperCase())
    this.saveAndOpenPdf(this.downloadUrl, file_name, content_type[0]);

    console.log('DataURL:', this.downloadUrl);

  }

  saveAndOpenPdf(pdf: any, filename: any, content_type: any) {
    const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
    this.file.writeFile(writeDirectory, filename, pdf, { replace: true })
      .then(() => {

        this.fileOpener.open(writeDirectory + filename, content_type.type)
          .catch(() => {
            console.log('Error opening pdf file');

          });
      })
      .catch(() => {
        console.error('Error writing pdf file');
      });
  }


  update_task(TASK_ID: any, type: any) {

    let task = this.taskdata[0].task_data_val[0];
    if (type == "start") {
      task.NEXT_STATUS = 3;
      task.task_comments = "In Progress";
    }

    task.modified_by = this.user.UserInfoId;
    this.presentLoadingDefault(true);
    this.authService.postData(task, 'task/UpdateTask').then((result) => {
      this.presentLoadingDefault(false);
      //this.presentToast("Data successfully Updated");
      this.insertedValues = result;
      this.closeModal();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  resetForm() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
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


  showBtn = -1;
  isOpen = false;
  oldBtn = -1;
  showUndoBtn(index) {
    if (this.isOpen == false) {
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


  uploadAudio(i: number, data: any) {

    console.log(i, data);
    const Data = this.navParams.get('data');
    let TASK_ID = Data[0].TASK_ID;

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    debugger;
    let myModalData = [{
      user_info_id: this.user.UserInfoId,
      comments_id: TASK_ID,
      comments_child_id: data.COMMENTS_ID,
      module_type: 'TASK COMMENT',
      comment_created_by: data.CREATED_BY
    }]


    let modelpage = '';
    modelpage = 'AudioCommentsPage';
    debugger;

    let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });

  }



  uploadAudioNewComment() {

    const Data = this.navParams.get('data');
    let TASK_ID = Data[0].TASK_ID;

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let commentsData = {
      created_by: this.user.UserInfoId,
      modified_by: this.user.UserInfoId,
      field_name: "Comments",
      COMMENTS: 'Recording',
      TASK_ID: TASK_ID
    }

    debugger;
    this.presentLoadingDefault(true);

    this.authService.postData(commentsData, 'task/getTaskCommentsInsertWhileAudioRecording').then((result) => {
      this.presentLoadingDefault(false);
      console.log(result);

      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let myModalData = [{
        user_info_id: this.user.UserInfoId,
        comments_id: TASK_ID,
        comments_child_id: result,
        module_type: 'TASK COMMENT',
        comment_created_by: this.taskdata[0].task_data_val[0].CREATED_BY
      }]


      let modelpage = '';
      modelpage = 'AudioCommentsPage';
      debugger;
      let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

      myModal.present();
      myModal.onDidDismiss((data) => {
        this.ionViewWillLoad();
      });
      myModal.onWillDismiss((data) => {
        this.ionViewWillLoad();
      });


    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  getLpoAudioList() {

    const Data = this.navParams.get('data');
    let TASK_ID = Data[0].TASK_ID;

    let client_name = '';
    let unit_no = '';

    let commentsData = {

      user_info_id: this.user.UserInfoId,
      comments_id: TASK_ID,
      comments_child_id: null,
      module_name: 'TASK COMMENT',
      unit_no: unit_no,
      client_name: client_name
    }

    this.presentLoadingDefault(true);
    this.authService.postData(commentsData, 'task/getRoiAndCommentsAudioListByType').then((result) => {
      this.taskaudioList = result;
      console.log('Task Audio List', this.taskaudioList);
      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });


  }

  segmentChanged(event) {
    console.log(event.value);
    let tabValue = event.value;
    this.tab_name = event.value;
    if (tabValue == 'Comments') {
      this.ionViewWillLoad();
    } else if (tabValue == 'enemies') {
      this.getFileList();
    }
    else if (tabValue == 'Recording') {
      this.getLpoAudioList();
    }
  }

  presentLoadingCustom(show) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img width = 50 height= 50 src="assets/imgs/logo.jpeg" />`,
      duration: 5000
    });

    if (show) {
      loading.present();
    } else {
      loading.dismissAll();
      loading = null
    }
  }


  playAudio(file: any, file_path: any, idx: any) {

    let options: StreamingAudioOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      initFullscreen: false
    };

    if(this.platform.is('ios')) {
      this.filePath = file_path;
      this.streamingMedia.playAudio(this.filePath, options);
    }else if (this.platform.is('android')) {
      this.filePath = file_path;
      this.streamingMedia.playAudio(this.filePath, options);
    }

  }


  deleteAudio(id: any, comments_id: any, comments_child_id: any) {

    this.presentLoadingDefault(true);
    let task_insert_data = {
      id: id,
      comments_id: comments_id,
      comments_child_id: comments_child_id,
      user_info_id: this.user.UserInfoId
    }

    this.authService.postData(task_insert_data, 'task/getDeleteRoiAudio').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Audio is deleted Successfully.");
      this.ionViewWillLoad();
    }, err => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  uploadReplyAudio(i: number, data: any, reply_id: any) {

    console.log(i, data);

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      user_info_id: this.user.UserInfoId,
      comments_id: data.REFERENCE_ID,
      comments_child_id: data.COMMENT_ID,
      module_type: 'TASK COMMENT',
      comment_created_by: data.MODIFIED_BY,
      replied_from_id: reply_id,
      payment_details: JSON.stringify(this.taskdata[0].task_data_val)
    }]


    let modelpage = '';
    modelpage = 'AudioCommentsPage';

    let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });

  }


  uploadRecordingTabReplyAudio(i: number, data: any, reply_id: any) {

    console.log(i, data);

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      user_info_id: this.user.UserInfoId,
      comments_id: data.COMMENTS_ID,
      comments_child_id: data.COMMENTS_CHILD_ID,
      module_type: 'TASK COMMENT',
      comment_created_by: data.CREATED_BY,
      replied_from_id: reply_id,
      payment_details: JSON.stringify(this.taskdata[0].task_data_val)
    }]
    debugger;
    let modelpage = '';
    modelpage = 'AudioCommentsPage';

    let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });

  }

}