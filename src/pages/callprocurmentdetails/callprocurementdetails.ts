import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,ViewController} from 'ionic-angular';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import {Constant} from '../../providers/constant/constant';
import {procurementoption} from '../procurementoption/procurementoption';
import Swal from 'sweetalert2';

/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-callprocurementdetails',
  templateUrl: 'callprocurementdetails.html',
})
export class callprocurementdetails {
  callinventoryininsert:FormGroup;
  calinspectioncommentsForm:FormGroup;
Callprocurementworklist:any;
Callprocurementworklistdetails:any;
materialoutlistdetails:any;
deleveryinlistdetails:any;
deleveryoutlistdetails:any;
procurementitemprice:any;
procurementinventoryrequired:any;
materialavaillist:any;
insertedValuesinventory:any;
commentlist:any;
ITEM_IDdata:any;
totalquantity:any;
itemiddata:any;
departmentdata:any;
commondata=[] as any;
commondata_department=[] as any;
itemiddatainventory:any;
INVENTORY_OUT:any;
delevery_OUT:any;
itemprice:any;
materialinlistdetails:any;
INVENTORY_IN:any;
imagelist:any;
imagelist_dout:any;
downloadUrl:any;
downloadimageUrl:any;
details='none';
WorkOrder1 = 'none';
comment = 'none';
image_liststyle ='none';
confrimpendingwaitting:any;
MATERIAL_REQ_NO:any;
INSPECTION_NO:any;
Storelist:any;
callcomplientsdetails:any;
call_create_details:any;
callprocurementdetails = this.navParams.get('data');
user : any = localStorage.getItem('userData');

    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
        public authService:RestProvider, public toastCtrl:ToastController,
        public loadingCtrl: LoadingController, public view: ViewController,public constant: Constant) {
            this.user = this.user ? JSON.parse(this.user) : {};

            this.callinventoryininsert = this.formBuilder.group({
              ITEM_ID: ['', Validators.compose([Validators.required])],
              Supplier_name: ['', Validators.compose([Validators.required])],
              Mobile_no: ['', Validators.compose([Validators.required])],
              LPO_Number: ['', Validators.compose([Validators.required])],
              store: ['', Validators.compose([Validators.required])],
              Description: ['', Validators.compose([Validators.required])],
              QUANITY: ['', Validators.compose([Validators.required])],
              RATE: ['', Validators.compose([Validators.required])],
              total: ['', Validators.compose([Validators.required])]
            }); 

            this.calinspectioncommentsForm = this.formBuilder.group({
              comments_show: ['', Validators.compose([Validators.required])],
              comments: ['', Validators.compose([Validators.required])],
              ITEM_ID: ['', Validators.compose([Validators.required])],
              REF: ['', Validators.compose([Validators.required])]
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
  onCloseHandledmaterial(){
    this.details='none'; 
  }
  onCloseHandle(){
    this.WorkOrder1='none'; 
  }
  onCloseHandledcomment(){
    this.comment='none'; 
  }
  onCloseimage_list(){
    this.image_liststyle ='none';
  }

  ionViewWillLoad() {
    this.Callprocurementwork();
    this.call_create_details = this.callprocurementdetails[0].Inspectiondata[0];
   this.getcallCompliantdetails(this.callprocurementdetails[0].call_log_id_data);
  }
  getcallCompliantdetails(CALL_LOG_ID){
    this.presentLoadingDefault(true);
    this.authService.getData({},'Call_inspection/CallCompliantdetails/'+CALL_LOG_ID+'').then((result) => {
      this.presentLoadingDefault(false);
      this.callcomplientsdetails = result;
        this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(`Something Went Wrong`);
    });
  }
 
  Callprocurementwork(){
    this.presentLoadingDefault(true);
    this.authService.getData({},'Call_inspection/procurementworklist/'+this.callprocurementdetails[0].call_log_id_data+'').then((result) => {
      this.Callprocurementworklist = result;
      this.presentLoadingDefault(false);
      this.getstorelist();
      if(this.Callprocurementworklist.length > 0){
      }else{
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }

  getstorelist(){
    this.presentLoadingDefault(true);
    this.authService.getData({},'Call_inspection/getstorelist').then((result) => {
      this.Storelist = result;
      this.presentLoadingDefault(false);
      if(this.Storelist.length > 0){
      }else{
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }
  complenetdetails(MATERIAL_REQ_NO:any){
    this.details='block'; 
    let inventoryinsertata = this.callinventoryininsert.value;
    inventoryinsertata.CALL_INSPECTION_ID= this.callprocurementdetails[0].CALL_INSPECTION_ID_data;
    inventoryinsertata.MATERIAL_REQ_NO= MATERIAL_REQ_NO;
    this.authService.postData(inventoryinsertata,'Call_inspection/procurementworklistdetails/').then((result) => {
      this.Callprocurementworklistdetails = result;
      if(this.Callprocurementworklistdetails.length > 0){
      }else{
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }

  materialoutdetails(){
    this.authService.getData({},'Call_inspection/procurementmaterialout/').then((result) => {
      this.materialoutlistdetails = result;
      if(this.materialoutlistdetails.length > 0){
      }else{
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }

  deliveryindetails(){
    this.authService.getData({},'Call_inspection/procurementdeleveryin/').then((result) => {
        this.deleveryinlistdetails = result;
        if(this.deleveryinlistdetails.length > 0){
        }else{
          this.presentLoadingDefault(false);
        }
      }, (err) => {
        this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
      });
  }

  deliviryoutdetails(){
    this.authService.getData({},'Call_inspection/procurementdeleveryout/').then((result) => {
        this.deleveryoutlistdetails = result;
        if(this.deleveryoutlistdetails.length > 0){
        }else{
          this.presentLoadingDefault(false);
        }
      }, (err) => {
        this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
      });
  }

  itempricedetails(){
    this.authService.getData({},'Call_inspection/procurementitemprice/').then((result) => {
        this.procurementitemprice = result;
        this.presentLoadingDefault(false);
        if(this.procurementitemprice.length > 0){
          this.presentLoadingDefault(false);
        }else{
          this.presentLoadingDefault(false);
        }
      }, (err) => {
        this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
      });
  }

  inventoryrequired(){
    this.authService.getData({},'Call_inspection/procurementinventoryrequired/').then((result) => {
      this.procurementinventoryrequired = result;
      if(this.procurementinventoryrequired.length > 0){
      }else{
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast("Something went to wrong, please try again later");
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position:'middle'
    });
    toast.present();
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

showBtn1=-1;
isOpen1=false;
oldBtn1=-1;
showUndoBtn1(index){
if(this.isOpen1=false){
  this.isOpen1=true;
  this.oldBtn1=index;
  this.showBtn1=index;
}else {
  if(this.oldBtn1 == index){
    this.isOpen1=false;    
    this.showBtn1=-1;
    this.oldBtn1=-1;
  } else {
    this.showBtn1=index;
    this.oldBtn1=index;
  }
}
}

showBtn2=-1;
isOpen2=false;
oldBtn2=-1;
showUndoBtn2(index){
if(this.isOpen2=false){
  this.isOpen2=true;
  this.oldBtn2=index;
  this.showBtn2=index;
}else {
  if(this.oldBtn2 == index){
    this.isOpen2=false;    
    this.showBtn2=-1;
    this.oldBtn2=-1;
  } else {
    this.showBtn2=index;
    this.oldBtn2=index;
  }
}
}

showBtn3=-1;
isOpen3=false;
oldBtn3=-1;
showUndoBtn3(index){
if(this.isOpen3=false){
  this.isOpen3=true;
  this.oldBtn3=index;
  this.showBtn3=index;
}else {
  if(this.oldBtn3 == index){
    this.isOpen3=false;    
    this.showBtn3=-1;
    this.oldBtn3=-1;
  } else {
    this.showBtn3=index;
    this.oldBtn3=index;
  }
}
}

showBtn4=-1;
isOpen4=false;
oldBtn4=-1;
showUndoBtn4(index){
if(this.isOpen4=false){
  this.isOpen4=true;
  this.oldBtn4=index;
  this.showBtn4=index;
}else {
  if(this.oldBtn4 == index){
    this.isOpen4=false;    
    this.showBtn4=-1;
    this.oldBtn4=-1;
  } else {
    this.showBtn4=index;
    this.oldBtn4=index;
  }
}
}

showBtn5=-1;
isOpen5=false;
oldBtn5=-1;
showUndoBtn5(index){
if(this.isOpen5=false){
  this.isOpen5=true;
  this.oldBtn5=index;
  this.showBtn5=index;
}else {
  if(this.oldBtn5 == index){
    this.isOpen5=false;    
    this.showBtn5=-1;
    this.oldBtn5=-1;
  } else {
    this.showBtn5=index;
    this.oldBtn5=index;
  }
}
}

showBtn6=-1;
isOpen6=false;
oldBtn6=-1;
showUndoBtn6(index){
if(this.isOpen6=false){
  this.isOpen6=true;
  this.oldBtn6=index;
  this.showBtn6=index;
}else {
  if(this.oldBtn6 == index){
    this.isOpen6=false;    
    this.showBtn6=-1;
    this.oldBtn6=-1;
  } else {
    this.showBtn6=index;
    this.oldBtn6=index;
  }
}
}

Invetoryinsert(MATERIAL_REQ_NO:any,INSPECTION_NO:any){
  this.MATERIAL_REQ_NO = MATERIAL_REQ_NO;
  this.INSPECTION_NO = INSPECTION_NO;
  this.WorkOrder1 ='block';
}
insertinventory(){

  let inventoryinsertata = this.callinventoryininsert.value;
  inventoryinsertata.CALL_LOG_ID = this.callprocurementdetails[0].call_log_id_data;
  inventoryinsertata.MATERIAL_REQ_NO= this.MATERIAL_REQ_NO;
  inventoryinsertata.INSPECTION_NO= this.INSPECTION_NO;
  inventoryinsertata.created_by= this.user.UserInfoId;
  inventoryinsertata.modified_by= this.user.UserInfoId;
    this.presentLoadingDefault(true);
    this.authService.postData(inventoryinsertata,'Call_inspection/Callinventoryinsertdata').then((result) => {
      this.presentLoadingDefault(false);

      this.presentToast("Material successfully created");
      this.insertedValuesinventory = result;
     this.WorkOrder1 ='none';
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
 
}
commentsget(ITEM_ID:any){
  this.authService.getData({},'Call_inspection/procurementcommentlist/'+ITEM_ID+'').then((result) => {
    this.commentlist = result;
    this.ITEM_IDdata = ITEM_ID;
    if(this.commentlist.length > 0){
    }else{
      this.presentLoadingDefault(false);
    }
  }, (err) => {
    this.presentLoadingDefault(false);
  this.presentToast("Something went to wrong, please try again later");
  });
this.comment ='block';
}

insertcomments(){
  let commentsForm = this.calinspectioncommentsForm.value;
  commentsForm.created_by= this.user.UserInfoId;
  commentsForm.modified_by= this.user.UserInfoId;
    this.presentLoadingDefault(true);
    this.authService.postData(commentsForm,'Call_inspection/Callinventorycommentsinsertdata').then((result) => {
      this.presentLoadingDefault(false);

      this.presentToast("Comments successfully created");
      this.insertedValuesinventory = result;
     this.comment ='none';
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
}

getimagedataprocurement(MATERIAL_REQ_NO:any){
  this.authService.getData({},'Call_inspection/procurementimagelist/'+MATERIAL_REQ_NO+'').then((result) => {
    this.imagelist = result;
    if(this.imagelist.length > 0){
    }else{
      this.presentLoadingDefault(false);
    }
  }, (err) => {
    this.presentLoadingDefault(false);
  this.presentToast("Something went to wrong, please try again later");
  });
this.image_liststyle ='block';
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
getfile(row_no,item:any){
      
  let objFile = this.imagelist.find(o => o.ROW_NO === row_no);
  let bytes = objFile.FILE_CONTENT.data;
  let file_type = objFile.FILE_TYPE;
  let file_name = objFile.FILE_NAME;
  let nameSplit = file_name.split('.');
  let extn = nameSplit[nameSplit.length - 1];
  this.downloadUrl = window.URL.createObjectURL(new Blob([new Uint8Array(item.FILE_CONTENT.data)]));

  const a = document.createElement('a');
  a.setAttribute('style', 'display:none;');
  document.body.appendChild(a);

  a.href = this.downloadUrl;
  a.download = file_name;
  a.click();
  if(file_type == 'IMAGE'){
    return `data:image/${extn};base64,${this.encode(bytes)}`;
  }else{
    return `./assets/imgs/no-found-photo.png`
  }
}

getImage(row_no){
    
  let objFile = this.imagelist_dout.find(o => o.ROW_NO === row_no);
  let bytes = objFile.FILE_CONTENT.data;
  let file_type = objFile.FILE_TYPE;
  let file_name = objFile.FILE_NAME;
  let nameSplit = file_name.split('.');
  let extn = nameSplit[nameSplit.length - 1];

  if(file_type == 'IMAGE'){
    return `data:image/${extn};base64,${this.encode(bytes)}`;
  }else{
    return `./assets/imgs/no-found-photo.png`
  }
}
downloadimage(item:any){
  this.downloadimageUrl = window.URL.createObjectURL(new Blob([new Uint8Array(item.FILE_CONTENT.data)]));

  const a = document.createElement('a');
  a.setAttribute('style', 'display:none;');
  document.body.appendChild(a);

  a.href = this.downloadimageUrl;
  a.download = item.FILE_NAME;
  a.click();
}

confrimpendingwaittingmaterial(MATERIAL_REQ_NO:any){
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to Confirmated Data!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, confirm!',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.value) {
      Swal.fire(
        'Updated',
        'Your data is Confirmated.',
        'success'
      )
  let data={
    CALL_INSPECTION_ID:this.callprocurementdetails[0].CALL_INSPECTION_ID_data,
    CALL_LOG_ID : this.callprocurementdetails[0].call_log_id_data,
    MATERIAL_REQ_NO : MATERIAL_REQ_NO,
    created_by : this.user.UserInfoId,
    modified_by :this.user.UserInfoId
  }
  this.presentLoadingDefault(true);
  this.authService.postData(data,'Call_inspection/confrimpendingwaitting').then((result) => {
    this.confrimpendingwaitting = result;
    this.navCtrl.setRoot(procurementoption);
    if(this.confrimpendingwaitting.length > 0){
    }else{
      this.presentLoadingDefault(false);
    }
  }, (err) => {
    this.presentLoadingDefault(false);
  this.presentToast("Something went to wrong, please try again later");
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
}