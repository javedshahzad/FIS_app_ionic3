import { Component } from '@angular/core';
import { IonicPage, Platform,NavController, NavParams,ToastController,LoadingController,ViewController} from 'ionic-angular';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { RestProvider } from '../../providers/rest/rest';
import { IonicSelectableComponent } from 'ionic-selectable';
//import Swal from 'sweetalert2'
import {Constant} from '../../providers/constant/constant';


@IonicPage()
@Component({
  selector: 'page-ppm-image-list',
  templateUrl: 'ppm-image-list.html',
})
export class PpmImageListPage {
  page_title:any='';
  Scheduledata = this.navParams.get('data');
  BUILDING_NAME:any;
  ppmsaveForm:FormGroup;
  addLabourForm:FormGroup;
  selected_empId:any;
  JobScheduleCheckList:any;
  ResourceList:any;
  start_date:any;
  end_date:any;
  start_time:any;
  end_time:any;
  isChecked = false;
  user_filter=[] as any;
  file_name:any;
  size:any;
  formData:any;
  imageURI:any;
  imagelist:any;
  labourList:any;
  downloadUrl:any;
  fileSaveData:any;
  downloadimageUrl:any;
  ASSET_DETAILS_PM_IDdata:any;
  ScheduleList:any;
  isImageCount:any=0;
  JOBSCHEDULE_DATA :any={MAKE_AND_MODEL: null,
    LABOURCOUNT: 0,
    DESCRIPTION: "",
    CODE: "",
    LOCATION_ID: 0,
    CATEGORY_NAME: "",
    ASSET_DETAIL_ID: 0,
    ASSET_SCHEDULE_DAILY_ID: 0,
    IMAGECOUNT: 0,
    FIMAGECOUNT: 0,
    QUANTITY: 0,
    BUILDING_NAME: "",
    AREA_CODE: " ",
    UNIT: "",
    SCHEDULEDATE: "",
    FREQUENCY: "",
    ASSETDETAIL_NAME: "",
    ASSET_DETAILS_PM_ID: 0,
    BUILDING_ID: 0,
    FLOOR_ID: 0,
    SPECIFIC_AREA_ID: 0,
    STATUS: 0,
    PERIOD: 0};
  searchData = {"search_value": ""};
  REF_TYPE:any
  user : any = localStorage.getItem('userData');
  PageType :any;
  message:any='Loading...'
  upload_src:any='./assets/imgs/upload-picture.png';
  fileTransfer: FileTransferObject;
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public authService:RestProvider, public toastCtrl:ToastController,public loadingCtrl: LoadingController,private transfer: FileTransfer,
    public view: ViewController,public constant: Constant,public platform: Platform ,private file: File,private fileOpener: FileOpener) {
           this.user = this.user ? JSON.parse(this.user) : {};    
           this.fileTransfer = this.transfer.create();  
           this.ppmsaveForm = this.formBuilder.group({
             checkbox: ['', Validators.compose([Validators.required])]
           });
           this.addLabourForm = this.formBuilder.group({
            IS_DELETE: [''],
            APPLICATIONUSER: ['', Validators.compose([Validators.required])],
            START_TIME: ['', Validators.compose([Validators.required])],
            END_TIME: ['', Validators.compose([Validators.required])],
            START_DATE: ['', Validators.compose([Validators.required])],
            END_DATE: ['', Validators.compose([Validators.required])]
          });
   }

   ionViewDidLoad() {
 //   console.log('ionViewDidLoad PpmImageListPage');
    this.PageType = this.Scheduledata.PageType;
    this.BUILDING_NAME = this.Scheduledata.BUILDING_NAME;
    if(this.Scheduledata.PageType =='IMAGE'){
      this.REF_TYPE =  this.Scheduledata.ImgType;
      let tit = this.REF_TYPE == 0 ? 'Old' : "New";
      this.page_title = "Job Schedule Id "+this.Scheduledata.JobSchedule.ASSET_SCHEDULE_DAILY_ID+" "+ tit + " Image List"
      this.getPPMFile(this.Scheduledata.JobSchedule);
    }else  if(this.Scheduledata.PageType =='LABOUR'){
      this.getResourceList();
      this.page_title = "Job Schedule Id "+this.Scheduledata.JobSchedule.ASSET_SCHEDULE_DAILY_ID+" Labour List"
      this.ppmLabourList(this.Scheduledata.JobSchedule);
    }else{
      this.page_title = "Job Schedule Id "+this.Scheduledata.JobSchedule.ASSET_SCHEDULE_DAILY_ID+" Check List";
      this.getPpmJobScheduleCheckList(this.Scheduledata.JobSchedule);
    }
  }
   loading = this.loadingCtrl.create(); 
   presentLoadingDefault(show) { 
     if(!this.loading){
       this.loading = this.loadingCtrl.create(); 
     }  
     if(show){
       this.loading.present();
     }
     else{
       this.loading.dismissAll();
       this.loading =null
     }
   };
   presentToast(msg) {
     let toast = this.toastCtrl.create({
       message: msg,
       duration: 1000,
       position:'middle'
     });
     toast.present();
   }

   resourseChange(event: { component: IonicSelectableComponent,value: any }) {
     this.selected_empId = event.value;
  //  console.log('port:', event.value);
  }

  closeModal() {
    this.view.dismiss();
  }

  showBtn=-1;
  isOpen=false;
  oldBtn=-1;

showUndoBtn(index){
  if(this.isOpen=false){
    this.isOpen=true;
    this.oldBtn=index;
    this.showBtn=index;
  }else {
    if(this.oldBtn == index){
      this.isOpen=false;    
      this.showBtn=-1;
      this.oldBtn=-1;
    } else {
      this.showBtn=index;
      this.oldBtn=index;
    }
  }
}
  
getStatus(status){
  var val = 'OPEN';
  if(status == 0){
    val = 'OPEN'
  }else if(status == 1){
    val = 'CLOSE'
  }else{
    val = 'PROCESS'
  }
  return val;
}

getMaintanceStatus(status){
  var val = "Job Not Closed";
  if(status == 0){
    val = "Job Not Closed";
  }else{
    val = "Job Finished";
  }
  return val;
}

getBackgroundColor(item:any){
  var val='#A9A9A9 !important';
  if(item.MAINT_STATUS==1){
    val='#228B22 !important';
  }else if(item.CHECKLIST_STATUS==1){
    val='#BDB76B !important';
  }else if(item.CHECKLIST_STATUS==2){
    val='#228B22 !important';
  }
  return val;
}

  getPPMFile(JOBSCHEDULE:any){
    this.ASSET_DETAILS_PM_IDdata = JOBSCHEDULE.ASSET_DETAILS_PM_ID;
    let context ={
      ASSET_DETAIL_ID:JOBSCHEDULE.ASSET_DETAIL_ID,
      SCHEDULE_ID:JOBSCHEDULE.ASSET_SCHEDULE_DAILY_ID,
      REF_TYPE:this.REF_TYPE,
    }
    this.fileSaveData =context;
    this.presentLoadingDefault(true);
    this.message ='Loading...'
    this.authService.postData(context,'ppm/GetSchedulefileList').then((result) => {
      this.presentLoadingDefault(false);
      this.imagelist = result;
      this.isImageCount =  this.imagelist? this.imagelist.length :0;    
      if(this.isImageCount==0) {
        this.message ='No image'
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    });
  }

  getPpmJobScheduleCheckList(JOBSCHEDULE:any){
    let context ={
      ASSET_DETAIL_ID:JOBSCHEDULE.ASSET_DETAIL_ID,
      SCHEDULE_ID:JOBSCHEDULE.ASSET_SCHEDULE_DAILY_ID,
      ASSET_DETAILS_PM_ID:JOBSCHEDULE.ASSET_DETAILS_PM_ID,
      PERIOD:this.Scheduledata.ScheduleNo
    }
    this.JOBSCHEDULE_DATA = JOBSCHEDULE;
    this.presentLoadingDefault(true);
    this.authService.postData(context,'ppm/GetJobAssetsCheckStatusList').then((result) => {
      this.presentLoadingDefault(false);      
      this.JobScheduleCheckList = result;
    }, (err) => {
      this.presentLoadingDefault(false);
    });
  }
    
ppmLabourList(JOBSCHEDULE:any){
  this.ASSET_DETAILS_PM_IDdata = JOBSCHEDULE.ASSET_DETAILS_PM_ID;
  this.JOBSCHEDULE_DATA = JOBSCHEDULE;
  this.presentLoadingDefault(true);
  this.message ='Loading...'
  this.authService.getData({},'ppm/GetResourceByPPMSheduleId/'+JOBSCHEDULE.ASSET_SCHEDULE_DAILY_ID).then((result) => {
    this.presentLoadingDefault(false);
    this.labourList = result;
   
  }, (err) => {
    this.presentLoadingDefault(false);
  });
}


getResourceList(){
  this.presentLoadingDefault(true);
  this.authService.getData({},'account/GetResourcelist').then((result) => {
    this.presentLoadingDefault(false);
    this.ResourceList = result;
  }, (err) => {
    this.presentLoadingDefault(false);
  });
}

  showcheckbox(data:any){
    if(data._value == true){
     this.isChecked = true;
    }else{
     this.isChecked = false;
    }
   }
   
   statusFreqUpdate(STATUS:any,ASSET_MAINT_POLICY_ID:any,Comments:any){
     let _data = this.ppmsaveForm.value;
     _data.modified_by= this.user.UserInfoId;
     _data.STATUS = STATUS;
     _data.ASSET_MAINT_POLICY_ID = ASSET_MAINT_POLICY_ID;
   //  this.presentToast('Comments '+Comments+' '+ASSET_MAINT_POLICY_ID);
    this.presentLoadingDefault(true);
    this.authService.postData(_data,'ppm/status_Update').then((result) => {      
      this.presentLoadingDefault(false);
      this.getPpmJobScheduleCheckList(this.JOBSCHEDULE_DATA);  
     //  console.log(result);
    //  console.log('List ',this.insertedValues);
     }, (err) => {
       this.presentLoadingDefault(false);
     });
   }
   
   choose_type(ASSET_MAINT_POLICY_ID:any,event:any) {
     let index;
     if (event._value === true) {
         this.user_filter.push(ASSET_MAINT_POLICY_ID);
     }else{
   
         index = this.user_filter.indexOf(ASSET_MAINT_POLICY_ID);
         this.user_filter.splice(index, 1);
     }
   }
   
   onSelectFile(event){
     let file = event.target.files[0];
     this.file_name = file.name;
     this.size = file.size;
     let nameSplit = this.file_name.split('.');
     let extn = nameSplit[nameSplit.length - 1];
     extn = extn ? extn.toLowerCase():'';     
     if (extn == "gif" || extn =="jpeg" || extn =="png" || extn =='jpg' || extn == 'bmp') {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      //console.log(reader.result);
      reader.onloadend = (e) => {
        this.imageURI = reader.result;
        this.upload_src = this.imageURI;
        //console.log(reader.result);
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    }else{
      this.presentToast('please upload only image file');
      event.target.files =null;
      this.imageURI = '';
      this.file_name =''; 
      this.size ='';
    }
   }
   
   insertppm(){
    //y let checkbox_data =[];
     // for(let i=0;i<this.user_filter.length;i++){
     //   let filter_data = this.JobScheduleCheckList.filter(call => call.ASSET_MAINT_POLICY_ID === this.user_filter[i])
     //   checkbox_data.push(filter_data[0]);
     // }
    // var obj1 = [...checkbox_data];
     var _data:any={};    
     _data.PERIOD = this.Scheduledata.ScheduleNo;
     _data.STATUS = 1;
     _data.created_by= this.user.UserInfoId;
     _data.modified_by= this.user.UserInfoId;
     _data.maintables= JSON.stringify(this.JOBSCHEDULE_DATA);
     _data.editppm_data= JSON.stringify(this.JobScheduleCheckList);
   
     this.presentLoadingDefault(true);
     this.authService.postData(_data,'ppm/saveppm').then((result) => {
       this.presentLoadingDefault(false);
       this.closeModal();
       this.presentToast('Closed all check list successfully')
     }, (err) => {
       this.presentLoadingDefault(false);
     });
   }
   
   getfile(row_no,item:any){
    let objFile = this.imagelist.find(o => o.ROW_NO === row_no);
     let bytes = objFile.FILE_CONTENT.data;
     let file_name = item.FILE_NAME;
      let nameSplit = file_name.split('.');
      let extn = nameSplit[nameSplit.length - 1];
      let content_type = this.constant.fileTypes.filter(ext => ext.name == extn.toUpperCase())
     let downloadUrl = new Blob([new Uint8Array(bytes)]);
     this.saveAndOpenPdf(downloadUrl,file_name,content_type[0]);
   }
 
   getImagelist(row_no,item:any){
 
     let objFile = this.imagelist.find(o => o.ROW_NO === row_no);
     let bytes = objFile.FILE_CONTENT.data;
     let file_name = objFile.FILE_NAME;
     let nameSplit = file_name.split('.');
     let extn = nameSplit[nameSplit.length - 1];
     extn = extn ? extn.toLowerCase():'';
     
     if(this.imagelist.length > 0){
       if (extn == "gif" || extn =="jpeg" || extn =="png" || extn =='jpg' || extn == 'bmp') {
         return `data:image/${extn};base64,${this.encode(bytes)}`;
       }else if(extn == "xlsx" || extn == "xls"){
         return `./assets/imgs/excel-thumbnail.png`
       }else if(extn == "doc" || extn == "docx"){
         return `./assets/imgs/word-thumbnail.jpg`
       }else if(extn == "ppt"){
         return `./assets/imgs/ppt-thumbnail.png`
       }else if(extn =='pdf'){
         return `./assets/imgs/PDF-thumbnail.png`
       }else if(extn =='mp4' || extn =='m4a' || extn =='m4v' || extn =='f4v' || extn =='f4a' || extn =='m4b'||extn =='m4r'||extn =='f4b'||extn =='mov'||extn =='3gp'||extn =='3gp2'||extn =='3g2'||extn =='3gpp'||extn =='3gpp2'||extn =='ogg'||extn =='oga'||extn =='ogv'||extn =='ogx'||extn =='wmv'||extn =='wma'||extn =='asf*'){
         return `./assets/imgs/video-thumbnail.jpg`
       }else{
         return `./assets/imgs/unknown.png`
       }
     } else{
       return `./assets/imgs/no-found-photo.png`
     }
   }
   
       
   saveAndOpenPdf(pdf: any, filename: any,content_type:any) {
     const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
     this.file.writeFile(writeDirectory, filename, pdf, {replace: true})
       .then(() => {
        this.presentToast('Image download');
           this.fileOpener.open(writeDirectory + filename, content_type.type)
               .catch((err) => {
                   console.log('Error opening file');
                 //  this.loading.dismiss();
               });
       })
       .catch((err) => {
           console.error('Error writing file');
          // this.loading.dismiss();
       });
   }
 
   encode (input) {
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
 
   savefile(){
     let _data = this.ppmsaveForm.value;
     _data.ASSET_DETAIL_ID = this.fileSaveData.ASSET_DETAIL_ID;
     _data.REF_ID = this.fileSaveData.SCHEDULE_ID;
     _data.REF_TYPE = this.fileSaveData.REF_TYPE;
     _data.created_by= this.user.UserInfoId;
     _data.modified_by= this.user.UserInfoId;
     _data.imageURI_data = this.imageURI;
     _data.size_data = this.size;
     _data.name = this.file_name;
     if(this.imageURI){
       this.presentLoadingDefault(true);
       this.authService.postData(_data,'ppm/savefileppm').then((result) => {
         this.imageURI = '';
         this.upload_src='./assets/imgs/upload-picture.png';
         this.presentLoadingDefault(false);
         this.presentToast('Image file is added successfully')
         this.getPPMFile(this.Scheduledata.JobSchedule);
      }, (err) => {
        this.presentLoadingDefault(false);
      });
     }else{
       this.presentToast('Please select a image')
     }
   }

   addLabour(){
    let _data = this.addLabourForm.value;
    _data.START_DATETIME = _data.START_DATE+'T'+_data.START_TIME+':00.000Z';    
    _data.END_DATETIME = _data.END_DATE+'T'+_data.END_TIME+':00.000Z'; 
    const diffInMs = Date.parse( _data.END_DATETIME) - Date.parse(_data.START_DATETIME);
    const diffInHours = diffInMs / 1000 / 60 / 60;
    _data.SCHEDULE_ID =this.JOBSCHEDULE_DATA.ASSET_SCHEDULE_DAILY_ID ;
    _data.SCHEDULE_DATE =this.JOBSCHEDULE_DATA.SCHEDULEDATE;
    _data.APP_USER =_data.APPLICATIONUSER.APPUSERRESOURCEMASTER;
    _data.CREATED_BY =this.user.UserInfoId;;
    _data.CALL_LOG_ID =0;
    _data.SCHEDULED_HR =diffInHours.toFixed(2).toString();
    _data.FINISHED_HR =diffInHours.toFixed(2).toString();
    
   // console.log(diffInHours);
  //  console.log(_data);

    if(diffInHours > 0){
      this.presentLoadingDefault(true);
      this.authService.postData(_data,'ppm/saveLabourPPMShedule').then((result) => {
        this.presentLoadingDefault(false);
        this.presentToast('Labour is added successfully')
        this.ppmLabourList(this.Scheduledata.JobSchedule);
        this.addLabourForm.reset();
     }, (err) => {
       this.presentLoadingDefault(false);
     });
    }else{
      this.presentToast('Please select a End date time is greater than start date time')
    }
   }

   
deleteLabour(RESOURCE_MANAGEMENT_ID:any){
  let _data ={
  RESOURCE_MANAGEMENT_ID : RESOURCE_MANAGEMENT_ID};
    this.presentLoadingDefault(true);
    this.authService.postData(_data,'ppm/deleteLabourPPMShedule').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast('Labour is Delete successfully')
      this.ppmLabourList(this.Scheduledata.JobSchedule);
      this.addLabourForm.reset();
   }, (err) => {
     this.presentLoadingDefault(false);
   });
 }

}


