import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { IonicSelectableModule } from 'ionic-selectable';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { HTTP } from '@ionic-native/http';
import { Network } from '@ionic-native/network';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ceoportal } from './app.component';
import { LoginPage } from '../pages/login/login';
import { AssetpreventivemaintancePage } from '../pages/assetpreventivemaintance/assetpreventivemaintance';
import { HomePage } from '../pages/home/home';
import { SearchPage } from '../pages/search/search';
import { InventoryPage } from '../pages/inventory/inventory';
import { InventoryItemPage } from '../pages/inventoryItem/inventoryItem';
import { ItemlistModelPage } from '../pages/itemlist-model/itemlist-model';
import { ReceiptPage } from '../pages/receipt/receipt';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { CallmanagementPage } from '../pages/callmanagement/callmanagement';
import { ListPage } from '../pages/list/list';
import { lpoPageModule } from '../pages/lpo/lpo';
import { PpmPageModule } from '../pages/PPM/ppm';
import { NotificationPage } from '../pages/notification/notification';
import { CallnotificationPage } from '../pages/callnotification/callnotification';
import { LponotificationPage } from '../pages/lponotification/lponotification';
import { MyprofilePage } from '../pages/myprofile/myprofile';
import { MgresclatedPage } from '../pages/mgresclated/mgresclated';
import { CeoesclatedPage } from '../pages/ceoesclated/ceoesclated';
import { EscalationPage } from '../pages/escalation/escalation';
import { CommentsToCommentsPage } from '../pages/commentstocomments/commentstocomments';
import { CommentsLabelsPage } from '../pages/commentslabels/commentslabels';
import { TaskManagementPage } from '../pages/taskmanagement/taskmanagement';
import { CreateTaskPage } from '../pages/createtask/createtask';
import { resourcemanagerPage } from '../pages/resourcemanager/resourcemanager';
import { InventorylistPage } from '../pages/inventorylist/inventorylist';
import { HotoPage } from '../pages/hoto/hoto';
// import { MapPage } from '../pages/map/map';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestProvider } from '../providers/rest/rest';
import { Constant } from '../providers/constant/constant';
import { TextImage } from '../directives/text-img/text-img';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { FCM } from '@ionic-native/fcm';
import { Camera } from '@ionic-native/camera';
import { CallNumber } from '@ionic-native/call-number';
import { CalendarModule } from "ion2-calendar";
import { OpenWebsitePage } from '../pages/openwebsite/openwebsite';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ParkingPage } from '../pages/parking/parking';
import { SignaturePadModule } from 'angular2-signaturepad';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { PopoverTaskPage } from '../pages/popover-task/popover-task';

import { Media } from '@ionic-native/media';
import { Base64 } from "@ionic-native/base64";
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { ResManagerUserlistPage } from '../pages/res-manager-userlist/res-manager-userlist';
import { userresorcelistPage } from '../pages/userresorcelist/userresorcelist';

import { AngularCropperjsModule } from 'angular-cropperjs';
import { GlobalProvider } from '../providers/global/global';

@NgModule({
  declarations: [
    ceoportal,
    TextImage,
    LoginPage,
    AssetpreventivemaintancePage,
    HomePage,
    SearchPage,
    InventoryPage,
    InventoryItemPage,
    ItemlistModelPage,
    ListPage,
    ReceiptPage,
    DashboardPage,
    CallmanagementPage,
    lpoPageModule,
    PpmPageModule,
    NotificationPage,
    CallnotificationPage,
    LponotificationPage,
    MyprofilePage,
    MgresclatedPage,
    CeoesclatedPage,
    EscalationPage,
    CommentsToCommentsPage,
    CommentsLabelsPage,
    TaskManagementPage,
    CreateTaskPage,
    resourcemanagerPage,
    InventorylistPage,
    HotoPage,
    OpenWebsitePage,
    ParkingPage,
    PopoverTaskPage,
    ResManagerUserlistPage,
    userresorcelistPage,
    
    // MapPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(ceoportal),
    FormsModule, 
    BrowserAnimationsModule,
    IonicSelectableModule,
    CalendarModule,
    SignaturePadModule,
    AngularCropperjsModule,
    

  ],
  exports:[TextImage],
  bootstrap: [IonicApp],
  entryComponents: [
    ceoportal,
    HomePage,
    LoginPage,
    AssetpreventivemaintancePage,
    SearchPage,
    InventoryPage,
    InventoryItemPage,
    ItemlistModelPage,
    ListPage,
    ReceiptPage,
    DashboardPage,
    CallmanagementPage,
    lpoPageModule,
    PpmPageModule,
    NotificationPage,
    CallnotificationPage,
    LponotificationPage,
    MyprofilePage,
    MgresclatedPage,
    CeoesclatedPage,
    EscalationPage,
    CommentsToCommentsPage,
    CommentsLabelsPage,
    TaskManagementPage,
    CreateTaskPage,
    resourcemanagerPage,
    InventorylistPage,
    HotoPage,
    OpenWebsitePage,
    ParkingPage,
    PopoverTaskPage,
    ResManagerUserlistPage,
    userresorcelistPage
    // MapPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HTTP,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FileTransfer,
    FileTransferObject,
    File,
    FileOpener,
    SplashScreen,
    RestProvider,
    GlobalProvider,
    Constant,
    FCM,
    Camera,
    CallNumber,
    InAppBrowser,
    Geolocation,
    NativeGeocoder,
    BarcodeScanner,
    Media,
    Base64,
    StreamingMedia,
  ]
})
export class AppModule {
  user = {} as any;
}