import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-dailytaskcomment',
  templateUrl: 'dailytaskcomment.html',
})
export class DailytaskcommentPage {
  today: any;
  taskcommentsForm: FormGroup;
  taskcommentseditForm:FormGroup;
  taskUploadsForm:FormGroup;
  form:FormGroup;
  taskcomments: any;
  show_comment_list: any;
  CommentsList: any;
  taskweekcomments: any;
  comment_data: any;
  date: any;
  label_title:any;
  editcomment:any;
  COMMENTS_ID:any;
  file_name: any;
  size: any;
  imageURI: any;
  downloadUrl: any;
  taskuploadsdetails:any;
  read_more_value:any;
  type_string:any;
  taskcommentscount = {
    Result: [] as any,
    Object: [] as any,
    Ideas :[] as any
  } as any;
  removefeild = [] as any;

  comments_type = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  constructor(public platform: Platform, public navCtrl: NavController,
    public navParams: NavParams, private formBuilder: FormBuilder, public authService: RestProvider,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, public view: ViewController) {

    this.user = this.user ? JSON.parse(this.user) : {};
    this.today = Date.now();

    this.taskcommentsForm = this.formBuilder.group({
      COMMENTS: ['', Validators.compose([Validators.required])]
    });
    this.taskcommentseditForm = this.formBuilder.group({
      comments     : this.formBuilder.array([]),
      COMMENTS_ID  : []
    });
    this.taskUploadsForm = this.formBuilder.group({
      COMMENTS_ID: ['', Validators.compose([Validators.required])],
    });

    this.form = this.formBuilder.group({
      comments     : this.formBuilder.array([
         this.initTechnologyFields()
      ])
   });
  }

  initTechnologyFields() : FormGroup
{
  return this.formBuilder.group({
    name : ['', Validators.required]
 });
}

initTechnologyeditFields() : FormGroup{
  return this.formBuilder.group({
    name : ['', Validators.required],
    child_id :['', Validators.required]
 });
}

addNewInputField() : void
{
   const control:any = this.form.controls.comments;
   control.push(this.initTechnologyFields());
}

removeInputField(i : number) : void
{
   const control:any = this.form.controls.comments;
   control.removeAt(i);
}

removeeditField(i : number,data:any) : void
{
  // var removedata = {};
  // removedata['remove'] = data.value;
   const control:any = this.taskcommentseditForm.controls.comments;
   control.removeAt(i);
   this.removefeild.push(data.value);
}


addNeweditField() : void
{
   const control:any = this.taskcommentseditForm.controls.comments;
   control.push(this.initTechnologyeditFields());
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad DailytaskcommentPage');
    if (this.comments_type[0] == "Next" || this.comments_type[0] == "Current") {
      this.label_title = this.comments_type[0]+' '+'Week';
      this.show_comment_list = -1;
      this.gettypecount(this.comments_type[0]);
    } else {
      this.show_comment_list = 0;
      this.label_title = 'Weekly';
      this.getpriviousweekList();
    }

    for(var i=0;i < 9 ;i++){
      const control:any = this.form.controls.comments;
      control.push(this.initTechnologyFields());
    }

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
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  closeModal() {
    if(this.show_comment_list == 2){
      const control:any = this.taskcommentseditForm.controls.comments;
      for(let i = control.length-1; i >= 0; i--) {
        control.removeAt(i)
      }
      this.show_comment_list = -1;
    }else if(this.show_comment_list == 3){
      this.show_comment_list = 1;
    }else if(this.show_comment_list == 4){
      this.show_comment_list = 1;
    }else if(this.show_comment_list == 1){
      this.show_comment_list = -1;
    }else{
      this.view.dismiss();
    }
  }
  gettypecount(type : any){
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/dailycommentscount/'+type).then((result) => {
      this.taskcommentscount = result;
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }
  openModal(type_string : any){
    this.type_string = type_string;
    if(this.taskcommentscount.Result.length > 0 && this.type_string == "R"){
      this.editcomments(this.taskcommentscount.Result[0]);
    }else if(this.taskcommentscount.Object.length > 0 && this.type_string == "O"){
      this.editcomments(this.taskcommentscount.Object[0]);
    }else if(this.taskcommentscount.Ideas.length > 0 && this.type_string == "I"){
      this.editcomments(this.taskcommentscount.Ideas[0]);
    }else{
      this.getCommentsList();
      this.show_comment_list = 1;
    }
    
  }
  inserttaskComments() {
    let COMMENTS_txt = this.form.value.comments;
    let commentsData = {
    created_by : this.user.UserInfoId,
    modified_by : this.user.UserInfoId,
    insert_type : this.comments_type[0],
    COMMENTS : JSON.stringify(COMMENTS_txt),
    comments_type : this.type_string
    }
    this.presentLoadingDefault(true);
    this.authService.postData(commentsData, 'task/dailycommentsinsert').then((result) => {
      this.presentLoadingDefault(false);
      this.show_comment_list = -1;
      this.gettypecount(this.comments_type[0]);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  getCommentsList() {
    let data ={
      comments_type : this.comments_type[0],
      modal_type : this.type_string
    }
    this.presentLoadingDefault(true);
    this.authService.postData(data, 'task/dailycommentsList').then((result) => {
      this.taskcomments = result;
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  getpriviousweekList() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/WeekcommentsList').then((result) => {
      this.taskweekcomments = result;
      this.comment_data = this.taskweekcomments.comment_data;
      this.date = this.taskweekcomments.date;
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
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


  showCallMgntCmtBtn = -1;
  isCallMgntCmtOpen = false;
  oldCallMgntCmtBtn = -1;
  showcallCommentUndoBtn(index, startweek: any, endweek: any) {

    this.Getcommentdatewise(startweek, endweek);

    if (this.isCallMgntCmtOpen == false) {
      this.isCallMgntCmtOpen = true;
      this.oldCallMgntCmtBtn = index;
      this.showCallMgntCmtBtn = index;
    } else {
      if (this.oldCallMgntCmtBtn == index) {
        this.isCallMgntCmtOpen = false;
        this.showCallMgntCmtBtn = -1;
        this.oldCallMgntCmtBtn = -1;
      } else {
        this.showCallMgntCmtBtn = index;
        this.oldCallMgntCmtBtn = index;
      }
    }
  }

  Getcommentdatewise(startweek, endweek) {
    let data = {
      startweek: startweek,
      endweek: endweek
    }
    this.presentLoadingDefault(true);
    this.authService.postData(data, 'task/Weekcommentsdate').then((result) => {
      this.CommentsList = result;
      for (var i = 0; i < this.CommentsList.length; i++) {
        this.CommentsList[i].COMMENTS = this.createTextLinks(this.CommentsList[i].COMMENTS);
      }
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  editcomments(item){
    this.COMMENTS_ID = item.COMMENTS_ID;
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/getcommentsList_by_id/' + item.COMMENTS_ID).then((result) => {
    this.editcomment = result;
    this.show_comment_list = 2
    this.presentLoadingDefault(false);
    if (this.editcomment.length > 0){
      for(var i=0;i < this.editcomment.length ;i++){
        const control:any = this.taskcommentseditForm.controls.comments;
        control.push(this.formBuilder.group({
                      name : [this.editcomment[i].COMMENTS, Validators.required],
                      child_id : [this.editcomment[i].COMMENTS_CHILD_ID, Validators.required],
                  }));
      }
      this.presentLoadingDefault(false);
    } else {
      this.presentLoadingDefault(false);
      this.presentToast(`No data found `);
    }
  }, (err) => {
    this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
  });   
  }

  deletecomments(item){
    let data ={
      COMMENTS_ID : item.COMMENTS_ID,
      modified_by : this.user.UserInfoId,
    }
    this.presentLoadingDefault(true);
    this.authService.postData(data, 'task/dailycommentsdelete').then((result) => {
      this.presentLoadingDefault(false);
      this.show_comment_list = 1;
      this.getCommentsList();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  attachcomments(item){
    this.show_comment_list = 3;
    this.COMMENTS_ID = item.COMMENTS_ID;
    this.Getfilelist(item.COMMENTS_ID);
  }

  onSelectFile(event) {
    let file = event.target.files[0];
    this.file_name = file.name;
    this.size = file.size;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    console.log(reader.result);
    reader.onloadend = (e) => {
      this.imageURI = reader.result;
      console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  edittaskComments(){
    let COMMENTS_txt = this.taskcommentseditForm.value.comments;
    let commentsData = this.taskcommentseditForm.value;
    commentsData.COMMENTS = JSON.stringify(COMMENTS_txt);
    commentsData.modified_by = this.user.UserInfoId;
    commentsData.removefeild = JSON.stringify(this.removefeild);
    this.presentLoadingDefault(true);
    this.authService.postData(commentsData, 'task/dailycommentsupdate').then((result) => {
      this.presentLoadingDefault(false);
      this.removefeild = [];
      const control:any = this.taskcommentseditForm.controls.comments;
      for(let i = control.length-1; i >= 0; i--) {
        control.removeAt(i)
      }
      this.show_comment_list = -1;
      this.getCommentsList();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  insertTaskFileUpload(){
    let taskuploadsData = this.taskUploadsForm.value;
    taskuploadsData.created_by = this.user.UserInfoId;
    taskuploadsData.modified_by = this.user.UserInfoId;
    taskuploadsData.imageURI_data = this.imageURI;
    taskuploadsData.name = this.file_name;
    taskuploadsData.size_data = this.size;
    this.presentLoadingDefault(true);
    this.authService.postData(taskuploadsData, 'task/dailycommentsInsertFile').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("File upload is successfully saved");
      this.show_comment_list = 1;
      this.getCommentsList();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  Getfilelist(COMMENTS_ID){
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/weeklyUploadedFileList/' + COMMENTS_ID).then((result) => {
      this.taskuploadsdetails = result;
      this.presentLoadingDefault(false);
      if (this.taskuploadsdetails.length > 0) {
        this.presentLoadingDefault(false);
      } else {
        this.presentLoadingDefault(false);
        this.presentToast(`No data found `);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  bytesToSize(bytes) {
    return(bytes / 1048576).toFixed(3) + " MB";
 }

 openmodelcomments(item:any){
  // this.read_more_value = item.COMMENTS;
  this.presentLoadingDefault(true);
  this.authService.getData({}, 'task/getcommentsList_by_id/' + item.COMMENTS_ID).then((result) => {
    this.read_more_value = result;
    this.show_comment_list = 4
    this.presentLoadingDefault(false);
    if (this.read_more_value.length > 0) {
      this.presentLoadingDefault(false);
    } else {
      this.presentLoadingDefault(false);
      this.presentToast(`No data found `);
    }
  }, (err) => {
    this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
  });   
 }
}
