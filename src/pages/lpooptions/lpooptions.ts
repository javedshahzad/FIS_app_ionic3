import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2'

@IonicPage()
@Component({
  selector: 'page-lpooptions',
  templateUrl: 'lpooptions.html',
})
export class lpooption {
  callManagementDetails: any;
  RejectForm: FormGroup;
  ApproveForm: FormGroup;
  CallinspectionList: any;
  WORK_NOT_STARTED: any;
  WORK_IN_PROGRESS: any;
  PARTIALLY_ASSIGNED: any;
  Lpomanament_data: any;
  ResourseList: any;
  type: any;
  ImageList: any;
  reject_cmt = 'none';
  approve_cmt = 'none';
  iSmaterial = 'none';
  imagelistdata: any;
  downloadUrl: any;
  LPOno: any;
  callcomplientsdetails: any;
  rejectbtn_approvebtn_show = 'none';
  WORK_WAITING_FOR_CLIENT_APPROVAL: any;
  searchData = { "search_value": "" };
  searchLpoList: any;
  LpoItemsList: any;
  searchLpoItemsList: any;
  title_btn: any = 'Close';
  title_page: any = 'LPO'
  btnTxt: any = 'Save'
  Lpomanament = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  resourse: any = JSON.parse(localStorage.getItem('resourseData'));
  itemsToDisplay = [];
  Lpomanament_dataAll: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.RejectForm = this.formBuilder.group({
      LPOno: ['', Validators.compose([Validators.required])],
      comments: ['', Validators.compose([Validators.required])]
    });
    this.ApproveForm = this.formBuilder.group({
      LPOno: ['', Validators.compose([Validators.required])],
      comments: ['', Validators.compose([Validators.required])]
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


  onCloseHand(mode) {
    if (mode == 'reject') {
      this.reject_cmt = 'none';
    } else if (mode == 'approve') {
      this.approve_cmt = 'none';
    } else if (mode == 'material') {
      this.iSmaterial = 'none';
    }
  }

  ngOnInit() {
    
    this.Lpomanament_data = this.Lpomanament[0].Lpomanament;
    this.type = this.Lpomanament[0].type;
    this.getLpoData();
    this.setPageTitle(this.type);
    this.GetAllresourse_list(); 
  }

  setPageTitle(uType) {
    if (uType == 'Manager') {
      this.title_page = 'LPO (Waiting Manager Verification)';
    }
    else if (uType == 'Finance-MGR') {
      this.title_page = 'LPO (Waiting Finance Conform)';
    }
    else if (uType == 'General Manager') {
      this.title_page = 'LPO (Waiting General Manager Approval)';
    }
    else if (uType == 'COO') {
      this.title_page = 'LPO (Waiting COO Approval)';
    }
    else if (uType == 'CEO') {
      this.title_page = 'LPO (Waiting CEO Approval)';
    }
    else if (uType == 'Rejected') {
      this.title_page = 'LPO Reject List';
    }
    else if (uType == 'CEO_App') {
      this.title_page = 'LPO (CEO Approved)';
    }
  }

  // getLpoData() {
  //   let uType = this.type;
  //   var _utype = '';
  //   if (uType == 'Manager')
  //     _utype = 'WMV';
  //   else if (uType == 'Finance-MGR')
  //     _utype = 'WFC';
  //   else if (uType == 'General Manager')
  //     _utype = 'WGMA';
  //   else if (uType == 'COO')
  //     _utype = 'WCOOA';
  //   else if (uType == 'CEO')
  //     _utype = 'WCEOA';
  //   else if (uType == 'Rejected')
  //     _utype = 'REJ';
  //   else if (uType == 'CEO_App')
  //     _utype = 'CEOA';

  //   this.presentLoadingDefault(true);

  //   if (this.searchData.search_value == null || this.searchData.search_value == '' || this.searchData.search_value == undefined) {
  //     if (this.Lpomanament[0].search_value != '' && this.Lpomanament[0].search_value != undefined && this.Lpomanament[0].search_value != null) {
  //       this.searchData.search_value = this.Lpomanament[0].search_value;
  //     } else {
  //       this.searchData.search_value = null;
  //     }
  //   }

  //   let context = { LBL_TYPE: _utype };
  //   debugger;
  //   let time_bf = new Date();
  //   this.authService.postData(context, 'Lpo/GetNewLpoList').then((result) => {
  //     this.Lpomanament_data = result;
  //     this.Lpomanament_dataAll = result;
  //     this.searchLpoList = result;

  //     this.itemsToDisplay = [];
  //     let total_count = 10;
  //     let array_len = 0;
  //     if (total_count < this.Lpomanament_data.length) {
  //       array_len = total_count;
  //     } else {
  //       array_len = this.Lpomanament_data.length;
  //     }

  //     for (let i = 0; i < array_len; i++) {
  //       this.itemsToDisplay.push(this.Lpomanament_data[i]);
  //     }

  //     this.presentLoadingDefault(false);

  //     let time_af = new Date();
  //     let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
  //     console.log('Seconds:', seconds);

  //     // if (this.Lpomanament[0].search_value) {
  //     //   this.searchData.search_value = this.Lpomanament[0].search_value;
  //     //   this.SearchManagement();
  //     // }

  //     if (this.searchData.search_value != '' && this.searchData.search_value != undefined && this.searchData.search_value != null) {
  //       this.SearchManagement();
  //     }

  //   }, (err) => {
  //     this.presentLoadingDefault(false);
  //     this.presentToast(err);
  //   });
  // }

  getLpoData() {

    let uType = this.type;

    var _utype = '';
    if (uType == 'Manager')
      _utype = 'WMV';
    else if (uType == 'Finance-MGR')
      _utype = 'WFC';
    else if (uType == 'General Manager')
      _utype = 'WGMA';
    else if (uType == 'COO')
      _utype = 'WCOOA';
    else if (uType == 'CEO')
      _utype = 'WCEOA';
    else if (uType == 'Rejected')
      _utype = 'REJ';
    else if (uType == 'CEO_App')
      _utype = 'CEOA';
    else if (uType == 'Escalation to COO/CEO')
      _utype = 'ESCALATION';
    else if (uType == 'USER_BASED')
      _utype = 'USER_BASED';
    else if (uType == 'CEO APPROVAL WITH OTHER MANAGERS')
      _utype = 'WCAOMV';

    this.ResourseList = this.resourse;

    let params = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId,
      resourceTypeId: this.ResourseList.TYPE_ID,
      resourceTypeUser: this.ResourseList.TYPE_USER,
      isteppan: this.ResourseList.ISTEPPAN,
      isfm: this.ResourseList.ISFM,
      isalllpo: this.ResourseList.ISALLLPO,
      LBL_TYPE: _utype,
      USER_ID: this.user.UserInfoId
    }

    if (this.searchData.search_value == null || this.searchData.search_value == '' || this.searchData.search_value == undefined) {
      if (this.Lpomanament[0].search_value != '' && this.Lpomanament[0].search_value != undefined && this.Lpomanament[0].search_value != null) {
        this.searchData.search_value = this.Lpomanament[0].search_value;
      } else {
        this.searchData.search_value = null;
      }
    }

    this.presentLoadingDefault(true);
    let time_bf = new Date();
    this.authService.postData(params, 'Lpo/GetLpoListByUser').then((result) => {
      this.Lpomanament_data = result;
      this.Lpomanament_dataAll = result;
      this.searchLpoList = result;

      this.itemsToDisplay = [];
      let total_count = 10;
      let array_len = 0;
      if (total_count < this.Lpomanament_data.length) {
        array_len = total_count;
      } else {
        array_len = this.Lpomanament_data.length;
      }

      for (let i = 0; i < array_len; i++) {
        this.itemsToDisplay.push(this.Lpomanament_data[i]);
      }

      
      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log('Seconds:', seconds);

      this.presentLoadingDefault(false);

      if (this.searchData.search_value != '' && this.searchData.search_value != undefined && this.searchData.search_value != null) {
        this.SearchManagement();
      }

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  GetAllresourse_list() {
    this.ResourseList = this.resourse;
    //console.log('ResourseList ',this.ResourseList);

    if (this.type === "All" || this.type === "CEO_App" || this.type === "Rejected" || this.type === "Pending") {
      this.rejectbtn_approvebtn_show = 'none';
    } else if (this.type === "Manager" && this.ResourseList.TYPE_USER === "Manager" || this.ResourseList.TYPE_USER === "CEO") {
      this.rejectbtn_approvebtn_show = 'block';
    } else if (this.type === "Finance-MGR" && this.ResourseList.TYPE_USER === "Finance-MGR" || this.ResourseList.TYPE_USER === "CEO") {
      this.rejectbtn_approvebtn_show = 'block';
    } else if (this.type === "General Manager" && this.ResourseList.TYPE_USER === "General Manager" || this.ResourseList.TYPE_USER === "CEO") {
      this.rejectbtn_approvebtn_show = 'block';
    } else if (this.type === "General Manager" && this.ResourseList.TYPE_USER === "General Manager" || this.ResourseList.TYPE_USER === "CEO") {
      this.rejectbtn_approvebtn_show = 'block';
    } else if (this.type === "COO" && this.ResourseList.TYPE_USER === "COO" || this.ResourseList.TYPE_USER === "CEO") {
      this.rejectbtn_approvebtn_show = 'block';
    } else if (this.type === "CEO" && this.ResourseList.TYPE_USER === "CEO") {
      this.rejectbtn_approvebtn_show = 'block';
    } else {
      this.rejectbtn_approvebtn_show = 'none';
    }
  }

  getcallCompliantdetails(LPO_ID) {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'Lpo/CallCompliantdetails/' + LPO_ID + '').then((result) => {
      this.presentLoadingDefault(false);
      this.callcomplientsdetails = result;
      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      const myModalData = [{
        callcomplientsdetails: this.callcomplientsdetails
      }];

      const myModal: Modal = this.modal.create('LpocalldetailsPage', { data: myModalData }, myModalOptions);

      myModal.present();

      myModal.onDidDismiss((data) => {
        console.log("I have dismissed.");
        console.log(data);
      });

      myModal.onWillDismiss((data) => {
        console.log("I'm about to dismiss");
        console.log(data);
      });
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(`Something Went Wrong`);
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

  goBack() {
    this.view.dismiss();
  }

  resetForm() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  closeModal() {
    if (this.title_btn == 'Close') {
      this.view.dismiss();
    } else {
      this.setPageTitle(this.type);
      this.title_btn = 'Close';
    }
  }

  openModal(LPO_ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = [{
      LPO_ID: LPO_ID
    }];

    const myModal: Modal = this.modal.create('Lpomodelcomments', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      console.log("I have dismissed.");
      console.log(data);
    });

    myModal.onWillDismiss((data) => {
      console.log("I'm about to dismiss");
      console.log(data);
    });

  }


  itemListbtn(LPO_ID: any) {
    this.LPOno = LPO_ID;
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'Lpo/GetLpoItemsList/' + LPO_ID).then((result) => {
      this.presentLoadingDefault(false);
      this.LpoItemsList = result;
      if (this.LpoItemsList.length > 0) {
        this.title_btn = 'Back';
        this.title_page = 'LPO ' + LPO_ID + ' Material Item List';
        this.searchLpoItemsList = result;
      } else {
        this.presentToast('Material item not found this LPO ' + LPO_ID);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  Rejectbtn(LPO_ID: any) {
    this.LPOno = LPO_ID;
    this.reject_cmt = 'block';
  }

  Approvebtn(LPO_ID: any) {
    this.LPOno = LPO_ID;
    this.approve_cmt = 'block';
  }

  Reject_con() {
    let rejectdata = this.RejectForm.value;
    rejectdata.created_by = this.user.UserInfoId;
    rejectdata.modified_by = this.user.UserInfoId;
    rejectdata.usertype = this.ResourseList.TYPE_USER ? this.ResourseList.TYPE_USER : '';
    this.presentLoadingDefault(true);
    this.btnTxt = 'In Progress...'
    this.authService.postData(rejectdata, 'Lpo/Rejectdatainsert').then((result) => {
      this.presentLoadingDefault(false);
      this.btnTxt = 'Save'
      this.getLpoData();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.btnTxt = 'Save'
      this.presentToast(err);
    });
  }

  Approve_con() {
    let approvedata = this.ApproveForm.value;
    approvedata.usertype = this.ResourseList.TYPE_USER;
    approvedata.created_by = this.user.UserInfoId;
    approvedata.modified_by = this.user.UserInfoId;
    approvedata.usertype = this.ResourseList.TYPE_USER ? this.ResourseList.TYPE_USER : '';
    this.presentLoadingDefault(true);
    this.btnTxt = 'In Progress...'
    this.authService.postData(approvedata, 'Lpo/Approvedatainsert').then((result) => {
      this.presentLoadingDefault(false);
      this.btnTxt = 'Save'
      this.getLpoData();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.btnTxt = 'Save'
      this.presentToast(err);
    });
  }

  SearchManagement() {
    let _id = parseInt(this.searchData.search_value);
    let item = this.searchData.search_value;
    if (this.title_btn == 'Close') {
      let case_val = this.searchData.search_value;
      if (case_val != '') {
        let filterData = this.Lpomanament_dataAll.filter(item => this.filter(item));
        this.Lpomanament_data = filterData;
        this.itemsToDisplay = [];
        for (let i = 0; i < this.Lpomanament_data.length; i++) {
          this.itemsToDisplay.push(this.Lpomanament_data[i]);
        }

      } else {
        this.Lpomanament_data = this.Lpomanament_dataAll;
        this.itemsToDisplay = [];
        for (let i = 0; i < 10; i++) {
          this.itemsToDisplay.push(this.Lpomanament_data[i]);
        }
      }
    } else {
      if (item != '') {
        if (isNaN(_id)) {
          this.LpoItemsList = this.searchLpoItemsList.filter(x => x.MATERIAL_NAME.includes(item));
        } else if (!isNaN(_id)) {
          this.LpoItemsList = this.searchLpoItemsList.filter(x => x.ASSET_ID == _id);
        }
      } else {
        this.LpoItemsList = this.searchLpoItemsList;
      }
    }
  }

  filter(item) {
    let _val = this.searchData.search_value;
    let _case_val = item['LPO_ID'] ? item['LPO_ID'].toString().toUpperCase() : '';
    let _lease_val = item['SUPPLIER_NAME'] ? item['SUPPLIER_NAME'].toString().toUpperCase() : '';
    return (_case_val.includes(_val.toUpperCase()) || _lease_val.includes(_val.toUpperCase()));
  }

  Getallimagelist(LPO_ID: any, count: any) {
    if (count > 0) {
      this.presentLoadingDefault(true);
      this.authService.getData({}, 'Lpo/Getallimagelist/' + LPO_ID + '').then((result) => {
        this.presentLoadingDefault(false);
        this.ImageList = result;
        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };
        const myModalData = [{
          ImageList: this.ImageList,
          page_name: 'LPO'
        }];
        const myModal: Modal = this.modal.create('lpoimagelist', { data: myModalData }, myModalOptions);
        myModal.present();
        myModal.onDidDismiss((data) => {
        });
        myModal.onWillDismiss((data) => {
        });
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    } else {
      this.presentToast('No Image Found');
    }
  }

  upload(LPO_ID: any, count: any) {
    if (count > 0) {
      this.presentLoadingDefault(true);
      this.authService.getData({}, 'Lpo/Getallcommantattach/' + LPO_ID + '').then((result) => {
        this.presentLoadingDefault(false);
        this.ImageList = result;
        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };
        const myModalData = [{
          LPO_ID: LPO_ID,
          ImageList: this.ImageList
        }];
        const myModal: Modal = this.modal.create('lpoattachement', { data: myModalData }, myModalOptions);
        myModal.present();
        myModal.onDidDismiss((data) => {
        });

        myModal.onWillDismiss((data) => {
        });
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    } else {
      this.presentToast('No Attachment Found');
    }
  }

  showBtn = -1;
  isOpen = false;
  oldBtn = -1;

  showUndoBtn(index, LPO_ID: any) {
    if (this.isOpen = false) {
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

  getImagelist(row_no, item: any) {

    let objFile = this.imagelistdata.find(o => o.ROW_NO === row_no);
    let bytes = objFile.FILE_CONTENT.data;
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];

    if (extn == "gif" || extn == "jpeg" || extn == "png") {
      if (this.imagelistdata.length > 0) {
        return `data:image/${extn};base64,${this.encode(bytes)}`;
      } else {
        return `./assets/imgs/no-found-photo.png`
      }
    }
  }

  getfile(row_no, item: any) {

    let objFile = this.imagelistdata.find(o => o.ROW_NO === row_no);
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
    if (file_type == 'IMAGE') {
      return `data:image/${extn};base64,${this.encode(bytes)}`;
    } else {
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

  Pending_for_lpo_cancellation(LPO_ID: any) {
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
        /* console.log(this.CallInspectionData);*/
        let data = {
          LPO_ID: LPO_ID,
          UserInfoId: this.user.UserInfoId,
          usertype: this.ResourseList.TYPE_USER
        }
        this.presentLoadingDefault(true);
        this.authService.postData(data, 'Lpo/Update_pending_cancellation_Status_Change').then((result) => {
          this.presentLoadingDefault(false);
          /* console.log(result);*/
          this.presentToast("Updated successfully");
          // console.log('List ',this.insertedValues);
        }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast(err);
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

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    let len = this.itemsToDisplay.length;

    setTimeout(() => {

      let total_count = len + 10;
      let array_len = 0;
      if (total_count < this.Lpomanament_data.length) {
        array_len = total_count;
      } else {
        array_len = this.Lpomanament_data.length;
      }

      for (let i = len; i < array_len; i++) {
        this.itemsToDisplay.push(this.Lpomanament_data[i]);
      }
      console.log(this.itemsToDisplay);
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

}
