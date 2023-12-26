import { Component } from '@angular/core';
import { IonicPage, Platform,NavController, NavParams,ToastController,LoadingController,Modal, ModalController, ModalOptions,ViewController} from 'ionic-angular';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { RestProvider } from '../../providers/rest/rest';
import Swal from 'sweetalert2'
//import { PpmscheduleoptionModule } from '../ppm_schedule_option/ppm_schedule_option';
import {Constant} from '../../providers/constant/constant';

/**
 * Generated class for the PpmAdvanceSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ppm-advance-search',
  templateUrl: 'ppm-advance-search.html',
})
export class PpmAdvanceSearchPage {
  Scheduledata = this.navParams.get('data');
  BULDING_NAME:any;
  ppmsaveForm:FormGroup;
  editppmstyle ='none';
  ppmDivHt =0;
  JobScheduleCheckList:any;
  ASSET_DETAILS_PM_ID_data:any;
  Schedule1janmarchlist:any;
  isChecked = false;
  user_filter=[] as any;
  file_name:any;
  size:any;
  formData:any;
  imageURI:any;
  imagelist:any;
  fileppmstyle ='none';
  downloadUrl:any;
  fileSaveData:any;
  downloadimageUrl:any;
  ASSET_DETAILS_PM_IDdata:any;
  ScheduleList:any;
  searchScheduleList:any;
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
  user : any = localStorage.getItem('userData');
    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
     public authService:RestProvider, public toastCtrl:ToastController,public loadingCtrl: LoadingController,private modal: ModalController,
     public view: ViewController,public constant: Constant,public platform: Platform ,private file: File,private fileOpener: FileOpener) {
            this.user = this.user ? JSON.parse(this.user) : {};       

            this.ppmsaveForm = this.formBuilder.group({
              checkbox: ['', Validators.compose([Validators.required])],
              ASSET_DETAILS_PM_ID: ['', Validators.compose([Validators.required])],
              ITEM_ID: ['', Validators.compose([Validators.required])],
              TASK_ID: ['', Validators.compose([Validators.required])]
            });
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
        duration: 2000,
        position:'middle'
      });
      toast.present();
    }

    ngOnInit() {
      //console.log('ppm scedule',this.Scheduledata);
      this.BULDING_NAME = this.Scheduledata.BUILDING_NAME;
      this.ScheduleList = this.Scheduledata.PPMScheduleList;
      this.searchScheduleList = this.ScheduleList;
    }
   
 
    closeModal() {
      this.view.dismiss();
    }
    onCloseHandled(){
      this.editppmstyle ='none';
    }
    onCloseHandledfile(){
      this.fileppmstyle ='none';
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
  
  confirmupdate(ASSET_DETAILS_PM_ID:any){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to Confirmated Data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
       
        this.presentLoadingDefault(true);
        this.authService.getData({},'ppm/Status_Change/'+ASSET_DETAILS_PM_ID+'').then((result) => {
          this.presentLoadingDefault(false); Swal.fire(
            'Updated',
            'Your data is Confirmated.',
            'success'
          )
          //console.log(result);
         // console.log('List ',this.insertedValues);
        }, (err) => {
          this.presentLoadingDefault(false);
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your data is not Confirmated)',
          'error'
        )
      }
    });
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

  getPpmJobScheduleCheckList(JOBSCHEDULE:any){
    // let context ={
    //   ASSET_DETAIL_ID:JOBSCHEDULE.ASSET_DETAIL_ID,
    //   SCHEDULE_ID:JOBSCHEDULE.ASSET_SCHEDULE_DAILY_ID,
    //   ASSET_DETAILS_PM_ID:JOBSCHEDULE.ASSET_DETAILS_PM_ID,
    //   PERIOD:this.Scheduledata.ScheduleNo
    // }
    this.JOBSCHEDULE_DATA = JOBSCHEDULE;
    this.Scheduledata.JobSchedule =JOBSCHEDULE;
    this.Scheduledata.PageType ='CHECK_LIST';
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    const myModal: Modal = this.modal.create('PpmImageListPage', {data :this.Scheduledata}, myModalOptions);
    myModal.present();
    myModal.onDidDismiss(() => {
    // console.log("I have dismissed.");
    });
    myModal.onWillDismiss(() => {
      this.GetScheduleList(this.Scheduledata.ScheduleNo);
    //  console.log("I'm about to dismiss");
    });
  }

  GetScheduleList(ScheduleNo){
    let url;
    let BUILDING_ID = this.Scheduledata.BUILDING_ID;
    if(ScheduleNo == 1){
      url = 'ppm/Schedule1janmarch/'+BUILDING_ID;
    }else if(ScheduleNo == 2){
      url = 'ppm/SCHEDULE_JUN/'+BUILDING_ID;
    }else if(ScheduleNo == 3){
      url = 'ppm/SCHEDULE_SEP/'+BUILDING_ID;
    }else if(ScheduleNo == 4){
      url = 'ppm/SCHEDULE_DEC/'+BUILDING_ID;
    }
    this.presentLoadingDefault(true);
    this.authService.getData({},url).then((result) => {
      this.ScheduleList = result;
      this.Scheduledata.PPMScheduleList =  this.ScheduleList;
      this.searchScheduleList = this.ScheduleList;
      this.presentLoadingDefault(false);
      if(this.searchData.search_value){
        this.Search();
      }
      
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }
  
  fileppm(JOBSCHEDULE:any,REF_TYPE:any){

    this.Scheduledata.JobSchedule =JOBSCHEDULE;
    this.Scheduledata.ImgType =REF_TYPE;
    this.Scheduledata.PageType ='IMAGE';
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    const myModal: Modal = this.modal.create('PpmImageListPage', {data :this.Scheduledata}, myModalOptions);
  myModal.present();
  myModal.onDidDismiss(() => {
   // console.log("I have dismissed.");
  });
  myModal.onWillDismiss(() => {
   
  this.GetScheduleList(this.Scheduledata.ScheduleNo);
  //  console.log("I'm about to dismiss");
  });
    // this.fileppmstyle ='block';

    // this.ASSET_DETAILS_PM_IDdata = ASSET_DETAILS_PM_ID;
    // let context ={
    //   ASSET_DETAIL_ID:ASSET_DETAIL_ID,
    //   SCHEDULE_ID:SCHEDULE_ID,
    //   REF_TYPE:REF_TYPE
    // }
    //     this.fileSaveData =context;
    // this.presentLoadingDefault(true);
    // this.authService.postData(context,'ppm/GetSchedulefileList').then((result) => {
    //   this.presentLoadingDefault(false);
    //   this.imagelist = result;
    //   this.isImageCount =  this.imagelist? this.imagelist.length :0;
    //   var element = document.getElementById("accordionExample");
    //   console.log(element.scrollHeight);
    //   // I can't remember why I added a short timeout, 
    //   // but you might be able to use ngzone instead.
    //   // the below works great though. 
    //   setTimeout(()=>{element.scrollIntoView(true)},10); 
    //   //console.log(result);
    // }, (err) => {
    //   this.presentLoadingDefault(false);
    // });
  }
  
  showcheckbox(data:any){
   if(data._value == true){
    this.isChecked = true;
   }else{
    this.isChecked = false;
   }
  }
  
  statusFreqUpdate(STATUS:any,ASSET_MAINT_POLICY_ID:any){
    let _data = this.ppmsaveForm.value;
    _data.modified_by= this.user.UserInfoId;
    _data.STATUS = STATUS;
    _data.ASSET_MAINT_POLICY_ID = ASSET_MAINT_POLICY_ID;
    this.presentLoadingDefault(true);
    this.authService.postData(_data,'ppm/status_Update').then((result) => {      
      this.presentLoadingDefault(false);
      this.getPpmJobScheduleCheckList(this.JOBSCHEDULE_DATA);  
      this.editppmstyle ='none';    
      //console.log(result);
     // console.log('List ',this.insertedValues);
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
     let reader = new FileReader();
     reader.readAsDataURL(file);
     //console.log(reader.result);
     reader.onloadend = (e) => {
       this.imageURI = reader.result;
       //console.log(reader.result);
     };
     reader.onerror = function (error) {
       console.log('Error: ', error);
     };
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
      this.editppmstyle ='none';
      this.presentLoadingDefault(false);
      this.closeModal();
      this.presentToast('Closed all check list successfully')
      //  this.JobScheduleCheckList = result;
      // console.log(result);
      // console.log('List ',this.insertedValues);
    }, (err) => {
      this.presentLoadingDefault(false);
    });
  }
  
  getfile(row_no,item:any){
    let objFile = this.imagelist.find(o => o.ROW_NO === row_no);
    let bytes = objFile.FILE_CONTENT.data;
   // let file_type = objFile.FILE_TYPE;
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];
    this.downloadUrl = new Blob([new Uint8Array(bytes)]);
    let content_type = this.constant.fileTypes.filter(ext => ext.name == extn.toUpperCase())
    this.saveAndOpenPdf(this.downloadUrl,file_name,content_type[0]);
  }

  getImagelist(row_no,item:any){

    let objFile = this.imagelist.find(o => o.ROW_NO === row_no);
    let bytes = objFile.FILE_CONTENT.data;
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];
    extn = extn ? extn.toLowerCase():'';
    
    if(this.imagelist.length > 0){
      if (extn == "gif" || extn =="jpeg" || extn =="png") {
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
       //   this.loading.dismiss();
          this.fileOpener.open(writeDirectory + filename, content_type.type)
              .catch(() => {
            //      console.log('Error opening pdf file');
                  this.loading.dismiss();
              });
      })
      .catch(() => {
        //  console.error('Error writing pdf file');
          this.loading.dismiss();
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

  savefile(ASSET_DETAILS_PM_IDdata:any){
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
        this.fileppmstyle ='none';
        this.imageURI = '';
        this.presentLoadingDefault(false);
        this.presentToast('Image file is added successfully')
        this.closeModal();
      // console.log(result);
      // console.log('List ',this.insertedValues);
      }, (err) => {
        this.presentLoadingDefault(false);
      });
    }else{
      this.presentToast('Please select a image')
    }
  }

  ppmLabourList(JOBSCHEDULE:any){
    this.Scheduledata.JobSchedule =JOBSCHEDULE;
    this.Scheduledata.ImgType =0;
    this.Scheduledata.PageType ='LABOUR';
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    const myModal: Modal = this.modal.create('PpmImageListPage', {data :this.Scheduledata}, myModalOptions);
  myModal.present();
  myModal.onDidDismiss(() => {
   // console.log("I have dismissed.");
  });
  myModal.onWillDismiss(() => {
   
  this.GetScheduleList(this.Scheduledata.ScheduleNo);
  //  console.log("I'm about to dismiss");
  });
  }

  Search(){
    let value = this.searchData.search_value;
    if(value!=''){
      this.ScheduleList = this.searchScheduleList.filter(item => this.filter(item));
      // value = value.toLocaleUpperCase();
      // let schedule_asset_name = this.searchScheduleList.filter((item) =>{
      //   let _val = item['DESCRIPTION'] ? item['DESCRIPTION'].toLocaleUpperCase() :'';
      //   return _val.includes(value);
      //  });
      //  this.ScheduleList = [...ScheduleList,...schedule_asset_name];
    }else{
      this.ScheduleList = this.searchScheduleList;
    }
  }

  filter(item){
    let _val = this.searchData.search_value;
    let _SCHEDULE_val = item['ASSET_SCHEDULE_DAILY_ID'] ? item['ASSET_SCHEDULE_DAILY_ID'].toString() :'';
    let _CODE_val = item['CODE'] ? item['CODE'].toString().toUpperCase() :'';
    let _UNIT_val = item['UNIT'] ? item['UNIT'].toString().toUpperCase() :'';
    let _DEC_val = item['DESCRIPTION'] ? item['DESCRIPTION'].toLocaleUpperCase() :'';
    _UNIT_val = `${_DEC_val} * ${_UNIT_val}`;
    return (_SCHEDULE_val.includes(_val) || _CODE_val.includes(_val.toUpperCase())|| _UNIT_val.includes(_val.toUpperCase()));
  }
}
