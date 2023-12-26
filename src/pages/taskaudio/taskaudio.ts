import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, ViewController, LoadingController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Base64 } from "@ionic-native/base64";

import { Timer } from '../../app/timer';
import { State } from '../../app/state';

import { StreamingMedia, StreamingVideoOptions, StreamingAudioOptions } from '@ionic-native/streaming-media';

@IonicPage()
@Component({
  selector: 'page-taskaudio',
  templateUrl: 'taskaudio.html',
})

export class TaskAudioPage {

  @ViewChild('myvideo') myVideo: any;

  isAndroid: boolean = false;
  today: any;
  user: any = localStorage.getItem('userData');
  userdata: any = JSON.parse(this.user);
  taskmodal = this.navParams.get('data');
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
  pet: string = "pending";
  tab_name: any;
  audio_playing = 0;
  showfooter = 0;
  private btnPlay: string = 'START';

  private timer: Timer = new Timer();
  private state: State = new State();
  twoDigit = '00';
  mediaFiles = [];
  message: string = '';
  audio_duration: any;
  recordedAudio: any;

  constructor(public platform: Platform, public navCtrl: NavController,
    private file: File, public view: ViewController, public toastCtrl: ToastController,
    public authService: RestProvider, private base64: Base64, public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private media: Media,
    private streamingMedia: StreamingMedia

  ) {
    this.isAndroid = platform.is('android');
    this.user = this.user ? JSON.parse(this.user) : {};
    this.today = Date.now();
  }



  ionViewWillEnter() {
    console.log(this.taskmodal);
    this.getAudioList();
  }

  closeModal() {
    this.view.dismiss();
  }

  getAudioList() {

    let client_name = '';
    let unit_no = '';

    if (this.taskmodal[0].unit_no != undefined) {
      unit_no = this.taskmodal[0].unit_no
    } else {
      unit_no = '';
    }

    if (this.taskmodal[0].client_name != undefined) {
      client_name = this.taskmodal[0].client_name
    } else {
      client_name = '';
    }

    let commentsData = {

      user_info_id: this.user.UserInfoId,
      comments_id: this.taskmodal[0].comments_id,
      comments_child_id: this.taskmodal[0].comments_child_id,
      module_name: this.taskmodal[0].module_type,
      unit_no: unit_no,
      client_name: client_name
    }
    console.log(commentsData);
    this.presentLoadingDefault(true);
    this.authService.postData(commentsData, 'task/getRoiAndCommentsAudioListByType').then((result) => {
      this.audioList = result;
      this.presentLoadingDefault(false);
      console.log('result', this.audioList);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });


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


  startRecord() {
    let _month = new Date().getMonth() + 1
    if (this.platform.is('ios')) {
      this.fileName = 'VoiceRecording_' + new Date().getDate() + _month + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.m4a';
      this.file.createFile(this.file.tempDirectory, this.fileName, true).then(() => {
        this.audio = this.media.create(this.file.tempDirectory.replace(/^file:\/\//, '') + this.fileName);
        this.audio.startRecord();
        this.status = 'Recording...';
        this.timer.start();
        this.state.setPlay();
        this.btnPlay = 'START';
        this.recording = true;
        this.audio.onError.subscribe(error => console.log('Error!', error));
      }).catch((error) => { console.log(error) });

    } else if (this.platform.is('android')) {
      this.fileName = 'VoiceRecording_' + new Date().getDate() + _month + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.wav';
      this.filePath = this.file.externalRootDirectory + this.fileName;
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
    this.status = 'Uploading...';
    this.timer.stop();
    this.state.setStop();
    this.timer.reset();
    let filePath: string = this.filePath;
    console.log(filePath);
    console.log('Before Base64');

    if (this.platform.is('ios')) {

      this.file.readAsDataURL(this.file.tempDirectory, this.fileName).then((base64File) => {

        console.log(base64File);
        this.recordedAudio = base64File;

        let client_name = '';
        let unit_no = '';
        let replied_from_id = null;

        if (this.taskmodal[0].unit_no != undefined) {
          unit_no = this.taskmodal[0].unit_no
        } else {
          unit_no = '';
        }

        if (this.taskmodal[0].client_name != undefined) {
          client_name = this.taskmodal[0].client_name
        } else {
          client_name = '';
        }

        if (this.taskmodal[0].replied_from_id != undefined) {
          replied_from_id = this.taskmodal[0].replied_from_id
        } else {
          replied_from_id = null;
        }


        let data = {
          size_data: 0,
          created_by: this.userdata.UserInfoId,
          modified_by: this.userdata.UserInfoId,
          imageURI_data: this.recordedAudio,
          name: this.fileName,
          userid: this.userdata.UserInfoId,
          ID: 0,
          comments_id: this.taskmodal[0].comments_id,
          comments_child_id: this.taskmodal[0].comments_child_id,
          file_name: this.fileName,
          module_name: this.taskmodal[0].module_type,
          client_name: client_name,
          unit_no: unit_no,
          replied_from_id: replied_from_id,
          duration: this.audio_duration
        }

        console.log('Param-->', data);
        this.authService.postData(data, 'task/uploadroiaudiofilev5').then((result: any) => {

          if (result) {
            this.presentToast("Audio Updated Successfully.");
            this.btnPlay = 'START';
            this.recording = false;
            this.status = 'Tab the button to start recording';

            var app_platform: string = '';
            let trans_type = '';

            if (this.platform.is('ios')) {
              app_platform = 'ios';
            }

            if (this.platform.is('android')) {
              app_platform = 'android';
            }

            if (this.taskmodal[0].module_type == 'TASK COMMENT') {

              this.message = 'Task Id: ' + this.taskmodal[0].comments_id + ' - New Recording by ' + this.user.Surname;
              trans_type = 'TASK AUDIO';
              debugger;

              if (this.user.UserInfoId != parseInt(this.taskmodal[0].comment_created_by)) {

                let push_message = {} as any;
                push_message.title = this.user.Surname,
                push_message.content = 'Audio';
                push_message.message = this.message;
                push_message.app_platform = app_platform;
                push_message.task_assignee_id = parseInt(this.taskmodal[0].comment_created_by);
                push_message.task_created_by = parseInt(this.taskmodal[0].comment_created_by);
                push_message.new_task = null;
                push_message.loggedin_user_id = this.user.UserInfoId;
                push_message.task_id = this.taskmodal[0].comments_id;
                push_message.trans_type = trans_type;

                console.log(this.taskmodal);
                console.log(push_message);

                this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
                  //this.presentLoadingDefault(false);
                  //this.pushnotificationValues = result;
                  console.log(result);
                }, (err) => {
                  this.presentLoadingDefault(false);
                  this.presentToast("Something went to wrong, please try again later");
                });


                // let push_message1 = {
                //   title: this.user.Surname,
                //   content: 'Audio',
                //   message: this.message,
                //   app_platform: app_platform,
                //   user_info_id: this.taskmodal[0].comment_created_by,
                //   loggedin_user_id: this.user.UserInfoId,
                //   trans_type: trans_type,
                //   roi_comments_id: this.taskmodal[0].comments_id,
                //   payment_details: this.taskmodal[0].payment_details
                // };

                // this.authService.postData(push_message, 'pushnotification/pushnotificationsinglechat').then((result) => {
                //   this.message = "";
                // }, (err) => {
                //   this.presentToast(err);
                // });                                 

              }
              
            }

            this.ionViewWillEnter();
          }

        }, (err) => {
          this.presentToast(err);
        });

      }).catch((error) => { console.log("file error", error) });

    } else if (this.platform.is('android')) {
      //debugger;
      this.file.readAsDataURL(this.file.externalRootDirectory, this.fileName).then((base64File) => {
        console.log(base64File);
        this.recordedAudio = base64File;

        let client_name = '';
        let unit_no = '';
        let replied_from_id = null;

        if (this.taskmodal[0].unit_no != undefined) {
          unit_no = this.taskmodal[0].unit_no
        } else {
          unit_no = '';
        }

        if (this.taskmodal[0].client_name != undefined) {
          client_name = this.taskmodal[0].client_name
        } else {
          client_name = '';
        }

        if (this.taskmodal[0].replied_from_id != undefined) {
          replied_from_id = this.taskmodal[0].replied_from_id
        } else {
          replied_from_id = null;
        }


        let data = {
          size_data: 0,
          created_by: this.userdata.UserInfoId,
          modified_by: this.userdata.UserInfoId,
          imageURI_data: this.recordedAudio,
          name: this.fileName,
          userid: this.userdata.UserInfoId,
          ID: 0,
          comments_id: this.taskmodal[0].comments_id,
          comments_child_id: this.taskmodal[0].comments_child_id,
          file_name: this.fileName,
          module_name: this.taskmodal[0].module_type,
          client_name: client_name,
          unit_no: unit_no,
          replied_from_id: replied_from_id,
          duration: this.audio_duration
        }

        console.log('Param-->', data);
        this.authService.postData(data, 'task/uploadroiaudiofilev5').then((result: any) => {

          if (result) {
            this.presentToast("Audio Updated Successfully.");
            this.btnPlay = 'START';
            this.recording = false;
            this.status = 'Tab the button to start recording';

            var app_platform: string = '';
            let trans_type = '';

            if (this.platform.is('ios')) {
              app_platform = 'ios';
            }

            if (this.platform.is('android')) {
              app_platform = 'android';
            }

            if (this.taskmodal[0].module_type == 'TASK COMMENT') {

              this.message = 'Task Id: ' + this.taskmodal[0].comments_id + ' - New Recording by ' + this.user.Surname;
              trans_type = 'TASK AUDIO';
              debugger;

              if (this.user.UserInfoId != parseInt(this.taskmodal[0].comment_created_by)) {

                let push_message = {} as any;
                push_message.title = this.user.Surname,
                push_message.content = 'Audio';
                push_message.message = this.message;
                push_message.app_platform = app_platform;
                push_message.task_assignee_id = parseInt(this.taskmodal[0].comment_created_by);
                push_message.task_created_by = parseInt(this.taskmodal[0].comment_created_by);
                push_message.new_task = null;
                push_message.loggedin_user_id = this.user.UserInfoId;
                push_message.task_id = this.taskmodal[0].comments_id;
                push_message.trans_type = trans_type;

                console.log(this.taskmodal);
                console.log(push_message);

                this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
                  //this.presentLoadingDefault(false);
                  //this.pushnotificationValues = result;
                  console.log(result);
                }, (err) => {
                  this.presentLoadingDefault(false);
                  this.presentToast("Something went to wrong, please try again later");
                });


                // let push_message1 = {
                //   title: this.user.Surname,
                //   content: 'Audio',
                //   message: this.message,
                //   app_platform: app_platform,
                //   user_info_id: this.taskmodal[0].comment_created_by,
                //   loggedin_user_id: this.user.UserInfoId,
                //   trans_type: trans_type,
                //   roi_comments_id: this.taskmodal[0].comments_id,
                //   payment_details: this.taskmodal[0].payment_details
                // };

                // this.authService.postData(push_message, 'pushnotification/pushnotificationsinglechat').then((result) => {
                //   this.message = "";
                // }, (err) => {
                //   this.presentToast(err);
                // });                                 

              }
            }

            this.ionViewWillEnter();
          }

        }, (err) => {
          this.presentToast(err);
        });

      }).catch((error) => { console.log("file error", error) })
    }
  }

  playAudio(file: any, file_path: any, idx: any) {

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

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  segmentChanged(event) {
    console.log(event.value);
    let tabValue = event.value;
    this.tab_name = event.value;
    if (tabValue == 'pending') {
      this.showfooter = 0;
    } else if (tabValue == 'confirm') {
      this.showfooter = 1;
      this.getAudioList();
    }
  }

  play() {
    this.timer.start();
    this.state.setPlay();
    this.btnPlay = 'CONTINUE';
  }

  stop() {
    this.timer.stop();
    this.state.setStop();
  }

  backward() {
    this.timer.reset();
    this.state.setBackward();
    this.btnPlay = 'START';
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
      this.ionViewWillEnter();
    }, err => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

}
