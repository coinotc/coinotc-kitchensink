import { Component, ViewChild, ElementRef } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Content,
  Events,
  Platform,
  LoadingController,
  ModalController,
  ViewController
} from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import * as firebase from 'firebase';
import { ComplainInformationPage } from '../complain-information/complain-information';
import { OrderServiceProvider } from '../../providers/order-service/order-service';
import { ProfilePage } from '../profile/profile';
import { WalletPage } from '../wallet/wallet';
import { Notification } from '../../models/notification';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { OrderListPage } from '../order-list/order-list';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { ImageViewerController } from 'ionic-img-viewer';

/**
 * Generated class for the RoomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({template:`
<ion-header>
  <ion-toolbar>
    <ion-title>
      Description
    </ion-title>
    <ion-buttons start>
      <button ion-button (tap)="dismiss()">
        <span ion-text color="primary">Cancel</span>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content *ngIf="orderInfo">


<ion-list>

  <ion-item>
    <span text-capitalize>{{orderInfo.crypto | lowercase}}</span>
    <span style="float:right">{{("orderStatus." + orderInfo.finished)| translate}}</span>
  </ion-item>

  <ion-item>
    {{'OrderID' | translate}}:
    <span style="float:right">{{orderInfo._id}}</span>
    <br> {{'Amount' | translate}}
    <span style="float:right">{{orderInfo.fiat}} {{orderInfo.amount}}</span>
    <br> {{'Quantity' | translate}}
    <span style="float:right">{{orderInfo.quantity}} {{orderInfo.crypto}}</span>
    <br> {{'Price' | translate}}
    <span style="float:right">{{orderInfo.price | number : '1.2-2'}} {{orderInfo.fiat}}/{{orderInfo.crypto}}</span>
    <span *ngIf="orderInfo.owner == user.username">
      <br>{{'Fee' | translate}}</span>
    <span *ngIf="orderInfo.owner == user.username" style="float:right">{{0.07 * orderInfo.quantity}} {{orderInfo.crypto}}</span>
    <br> {{'Buyer' | translate}}:{{orderInfo.buyer}}
    <span style="float:right">{{'Seller' | translate}}:{{orderInfo.seller}}</span>
    <br> {{'Message' | translate}}:
    <span style="float:right">{{orderInfo.message}}</span>

    <div align=center>
      <div *ngIf="orderInfo.finished == 1 || orderInfo.finished ==2">
        <button ion-button large round *ngIf="user.username == orderInfo.seller" [disabled]="orderInfo.finished !== 2" (tap)="onFinished()">{{'Approve' | translate}}</button>
        <button ion-button large round *ngIf="user.username == orderInfo.buyer" (tap)="onInformed()">{{'Inform' | translate}}</button>
      </div>
      <div *ngIf="orderInfo.finished == 3 && (this.user.username == this.orderInfo.buyer && this.orderInfo.buyerRating == null || this.user.username == this.orderInfo.seller && this.orderInfo.sellerRating == null)">
        <rating [(ngModel)]="rate" readOnly="false" max="5" emptyStarIconName="star-outline" halfStarIconName="star-half" starIconName="star"
          nullable="false" (ngModelChange)="onComment()">
        </rating>
        <button ion-button round (tap)="onRating()">Confirm Rating</button>
      </div>
    </div>
  </ion-item>

</ion-list>

<div align=center>
  <button ion-button round (tap)="onProfile(trader)">{{'Trader' | translate}}</button>
  <button ion-button round (tap)="onWallet()">{{'Wallet' | translate}}</button>
</div>

</ion-content>`})
export class ModalContentPage {
  orderInfo;
  trader;
  user;
  rateStatus;
  notification = new Notification('', null);
  average;
  rate;
  
  constructor(
    public userService: UserServiceProvider,
    private orderServiceProvider: OrderServiceProvider,
    private profileServiceProvider: ProfileServiceProvider,
    private alertServiceProvider: AlertServiceProvider,
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    private events: Events
  ) {
    this.orderInfo = this.params.data.orderInfo;
    this.trader = this.params.data.trader;
    this.user = userService.getCurrentUser();
    
   console.log(this.orderInfo)
  }

  onRefresh() {
    this.orderServiceProvider
      .getSpecificOrder(this.orderInfo._id)
      .subscribe(result => {
        this.orderInfo = result;
        if (
          this.user.username == this.orderInfo.buyer &&
          this.orderInfo.buyerRating == null
        ) {
          this.rateStatus = false;
        } else if (
          this.user.username == this.orderInfo.seller &&
          this.orderInfo.sellerRating == null
        ) {
          this.rateStatus = false;
        }
      });
  }

  onInformed() {
    this.orderInfo.finished = 2;
    this.orderServiceProvider.updateOrder(this.orderInfo).subscribe(result => {
      this.orderServiceProvider
        .getSpecificOrder(this.orderInfo._id)
        .subscribe(result => {
          this.orderInfo = result;
        });
    });
    //Send push notification to trader
    this.alertServiceProvider
      .onNotification(this.notification)
      .subscribe(result => {
        console.log(JSON.stringify(result));
      });
  }

  onFinished() {
    this.orderInfo.finished = 3;
    this.orderServiceProvider.updateOrder(this.orderInfo).subscribe(result => {
      this.orderServiceProvider
        .getSpecificOrder(this.orderInfo._id)
        .subscribe(result => {
          this.orderInfo = result;
        });
    });
    //Send push notification to trader
    this.alertServiceProvider
      .onNotification(this.notification)
      .subscribe(result => {
        console.log(JSON.stringify(result));
      });
    //Send push notification to above alerts
    this.orderServiceProvider
      .getAlertInformation(this.orderInfo.fiat, this.orderInfo.crypto)
      .subscribe(result => {
        this.average = result;
        this.alertServiceProvider
          .getAbove(
            true,
            true,
            this.orderInfo.fiat,
            this.orderInfo.crypto,
            this.average
          )
          .subscribe(result => {
            console.log(result);
            for (let i = 0; i < result.length; i++) {
              let triggerAlert = new Notification('', null);
              this.profileServiceProvider
                .getProfile(result[i].username)
                .subscribe(result => {
                  triggerAlert.to = result[0].deviceToken;
                  triggerAlert.notification = {
                    title: `You may be willing to SELL ${
                      this.orderInfo.crypto
                    } in ${this.orderInfo.fiat} now !`,
                    body: `The average price from recent trades is ${
                      this.average
                    } ${this.orderInfo.fiat}`,
                    sound: 'default',
                    click_action: 'FCM_PLUGIN_ACTIVITY',
                    icon: 'fcm_push_icon'
                  };
                  console.log(triggerAlert);
                  this.alertServiceProvider
                    .onNotification(triggerAlert)
                    .subscribe(result => {
                      console.log(result);
                    });
                });
              result[i].status = false;
              this.alertServiceProvider
                .updateAlert(result[i])
                .subscribe(result => {
                  console.log(result);
                });
            }
          });
      });
    //Send push notification to below alerts
    this.orderServiceProvider
      .getAlertInformation(this.orderInfo.fiat, this.orderInfo.crypto)
      .subscribe(result => {
        this.average = result;
        this.alertServiceProvider
          .getBelow(
            false,
            true,
            this.orderInfo.fiat,
            this.orderInfo.crypto,
            this.average
          )
          .subscribe(result => {
            console.log(result);
            for (let i = 0; i < result.length; i++) {
              let triggerAlert = new Notification('', null);
              this.profileServiceProvider
                .getProfile(result[i].username)
                .subscribe(result => {
                  triggerAlert.to = result[0].deviceToken;
                  triggerAlert.notification = {
                    title: `You may be willing to BUY ${
                      this.orderInfo.crypto
                    } in ${this.orderInfo.fiat} now !`,
                    body: `The average price from recent trades is ${
                      this.average
                    } ${this.orderInfo.fiat}`,
                    sound: 'default',
                    click_action: 'FCM_PLUGIN_ACTIVITY',
                    icon: 'fcm_push_icon'
                  };
                  console.log(triggerAlert);
                  this.alertServiceProvider
                    .onNotification(triggerAlert)
                    .subscribe(result => {
                      console.log(result);
                    });
                });
              result[i].status = false;
              this.alertServiceProvider
                .updateAlert(result[i])
                .subscribe(result => {
                  console.log(result);
                });
            }
          });
      });
  }

  onRating() {
    this.orderServiceProvider
      .getSpecificOrder(this.orderInfo._id)
      .subscribe(result => {
        this.orderInfo = result;
        if (this.user.username == this.orderInfo.buyer) {
          this.orderInfo.buyerRating = this.rate;
          if (this.orderInfo.sellerRating !== null) {
            this.orderInfo.finished = 0;
          }
        } else if (this.user.username == this.orderInfo.seller) {
          this.orderInfo.sellerRating = this.rate;
          if (this.orderInfo.buyerRating !== null) {
            this.orderInfo.finished = 0;
          }
        }
        this.orderServiceProvider
          .updateOrder(this.orderInfo)
          .subscribe(result => {
            this.events.publish('reloadList');
            this.navCtrl.pop();
          });
      });
    this.profileServiceProvider.getProfile(this.trader).subscribe(result => {
      let ratings = result[0].ratings;
      ratings.push(this.rate);
      this.profileServiceProvider.sendRating(this.trader, ratings).subscribe();
    });
  }
  onWallet() {
    this.navCtrl.push(WalletPage);
  }

  ionViewDidLeave() {
    this.events.unsubscribe('reloadList');
  }

  onProfile(trader) {
    console.log(trader);
    this.navCtrl.push(ProfilePage, trader);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
@IonicPage()
@Component({
  selector: 'page-room',
  templateUrl: 'room.html'
})

export class RoomPage {
  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  private orderInfo;
  private user;
  data = { type: '', name: '', message: '', roomname: '' };
  ref = firebase.database().ref('chatrooms/');
  
  chats = [];
  roomkey: any;
  nickname: string;
  offStatus: boolean = false;
  switched = false;
  trader;
  average;
  notification = new Notification('', null);
  type;
  finished;
  base64Image: string;
  rate;
  rateStatus;
  itemPerPage: number = 10;
  chatsObservable$: any;
  private _imageViewerCtrl: ImageViewerController;

  constructor(
    
    public navParams: NavParams,
    private userService: UserServiceProvider,
    private orderServiceProvider: OrderServiceProvider,
    private profileServiceProvider: ProfileServiceProvider,
    private alertServiceProvider: AlertServiceProvider,
    public navCtrl: NavController,
    private events: Events,
    public camera: Camera,
    public platform: Platform,
    private storage: AngularFireStorage,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private imageViewerCtrl: ImageViewerController
  ) {
    this.events.unsubscribe('reloadtrade');
    this._imageViewerCtrl = imageViewerCtrl;
    this.user = userService.getCurrentUser();
    this.data.name = this.user.username;
    this.nickname = this.user.username;
    this.type = navParams.data.type;
    this.data.type = 'message';
    if (this.type == 'order') {
      this.trader = navParams.data.trader;
      console.log(this.trader);
      this.orderInfo = navParams.data.order;
      this.finished = this.orderInfo.finished;
      this.data.roomname = navParams.data.order._id;
      this.profileServiceProvider.getProfile(this.trader).subscribe(result => {
        this.notification.to = result[0].deviceToken;
        this.notification.notification = {
          title: `Your Order with ${this.trader} has progress !`,
          body: `Order ID : ${this.orderInfo._id}`,
          icon: 'fcm_push_icon',
          sound: 'default',
          click_action: 'FCM_PLUGIN_ACTIVITY'
        };
      });
      if (navParams.data.roomkey == null) {
        this.roomkey = navParams.data.order.roomkey;
      } else {
        this.roomkey = navParams.data.roomkey;
      }
    } else {
      this.data.roomname = navParams.data.complain;
      this.finished = true;
      if (navParams.data.complain.roomkey == null) {
        this.roomkey = navParams.data.complain.roomkey;
      } else {
        this.roomkey = navParams.data.roomkey;
      }
    }
    this.data.message = '';
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'loading...',
      duration: 3500
    });
    loading.present();
    var start = new Date().getTime();
    firebase
      .database()
      .ref('chatrooms/' + this.roomkey + '/chats').limitToLast(this.itemPerPage)
      .on('value', resp => {
        this.chats = [];
        this.chats = snapshotToArray(resp);
        this.chatsObservable$ = Observable.of(this.chats);
        setTimeout(() => {
          if (this.offStatus === false) {
            loading.dismiss();
            this.content.scrollToBottom(300);
          }
        }, 500);
        var end = new Date().getTime();
        console.log(end - start);
      });
  }

  doRefresh(refresher?) {
    var start = new Date().getTime();
    this.itemPerPage = this.itemPerPage + 10;
    firebase
    .database()
    .ref('chatrooms/' + this.roomkey + '/chats').limitToLast(this.itemPerPage)
    .on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);
      
      setTimeout(() => {
        if (this.offStatus === false) {
          this.content.scrollToTop(300);
          if (refresher) {
            refresher.complete();
          }
        }
      }, 500);
      var end = new Date().getTime();
      console.log(end - start);
    });
  }

  sendMessage() {
    if(this.data.message.trim() != ''){
        let newData = firebase
        .database()
        .ref('chatrooms/' + this.roomkey + '/chats')
        .push();
      newData.set({
        type: this.data.type,
        user: this.data.name,
        message: this.data.message,
        sendDate: Date()
      });
      this.data.message = '';
      //this.scrollToBottom();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400);
  }

  complain() {
    console.log(this.orderInfo)
    this.navCtrl.push(ComplainInformationPage, this.orderInfo);
  }

  attachImage() {
    console.log('attached image ....');
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    if (this.platform.is('cordova')) {
      this.camera.getPicture(options).then(
        imageData => {
          let loading = this.loadingCtrl.create({
            spinner: 'circles',
            content: 'Uploading...',
            duration: 3500
          });
          loading.present();
          // imageData is either a base64 encoded string or a file URI
          // If it's base64:
          const filename = Math.floor(Date.now() / 1000);
          const filenameStr = `chat/${this.roomkey}_${filename}.jpeg`;
          console.log(filenameStr);
          this.base64Image = 'data:image/jpeg;base64,' + imageData;
          this.storage.ref(filenameStr).putString(this.base64Image, 'data_url').then((snapshot)=>{
            console.log("SNAPSHOT ---> ");
            
            loading
              .dismiss()
              .then(() => {
                let newData = firebase
                  .database()
                  .ref('chatrooms/' + this.roomkey + '/chats')
                  .push();
                newData.set({
                  type: this.data.type,
                  user: this.data.name,
                  message: null,
                  isImage: true,
                  //base64Image: this.base64Image,
                  sendDate: Date(),
                  downloadURL: snapshot.downloadURL
                }).catch((e)=> console.log(e));
            });
            
          });
        },
        err => {
          console.log('Error taking photo', JSON.stringify(err));
        }
      );
    }
  }

  viewAttachedImage(chatImage) {
    // we need to store to the fire storage then keep the url.
    console.log("Preview image > " + chatImage);
    const imageViewer = this._imageViewerCtrl.create(chatImage);
    imageViewer.present();
  }

  takePhoto() {
    console.log('take photo ....');
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA
    };

    if (this.platform.is('cordova')) {
      this.camera.getPicture(options).then(
        imageData => {
          let loading = this.loadingCtrl.create({
            spinner: 'circles',
            content: 'Uploading...',
            duration: 3500
          });
          loading.present();
          // imageData is either a base64 encoded string or a file URI
          // If it's base64:
          const filename = Math.floor(Date.now() / 1000);
          const filenameStr = `chat/${this.roomkey}_${filename}.jpeg`;
          this.base64Image = 'data:image/jpeg;base64,' + imageData;
          this.storage.ref(filenameStr).putString(this.base64Image, 'data_url').then((snapshot)=>{
            console.log("SNAPSHOT " + snapshot);
            
            loading
              .dismiss()
              .then(() => {
                let newData = firebase
                  .database()
                  .ref('chatrooms/' + this.roomkey + '/chats')
                  .push();
                newData.set({
                  type: this.data.type,
                  user: this.data.name,
                  message: null,
                  isImage: true,
                  //base64Image: this.base64Image,
                  sendDate: Date(),
                  downloadURL: snapshot.downloadURL
                });
              });
            
          }).catch((e)=> console.log(e));
        },
        err => {
          console.log('Error taking photo', JSON.stringify(err));
        }
      );
    }
  }

  onFocus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  onComment() {
    this.profileServiceProvider.getProfile(this.trader).subscribe(result => {
      let ratings = result[0].ratings;
      ratings.push(this.rate);
      console.log(ratings);
    });
    // this.orderInfo.finished = 0;
    // this.userService.update(this.user).subscribe();
    // this.profileServiceProvider.getProfile(this.trader).subscribe(result => {
    //   let goodCount = result[0].goodCount;
    //   goodCount++;
    //   this.profileServiceProvider
    //     .sendComment(this.trader, goodCount)
    //     .subscribe();
    // });
    // this.events.publish('reloadList');
    // this.navCtrl.pop();
  }

 


 
  ionViewDidLeave() {
    this.events.unsubscribe('reloadList');
  }

  openModal() {
    console.log("HELLOOOOOOOBITCHHHHHHHHHH"+ this.navParams.data.order + this.navParams.data.trader)
    let modal = this.modalCtrl.create(ModalContentPage, {
      orderInfo: this.navParams.data.order,
      trader: this.navParams.data.trader,
      type: 'order'
    });
    modal.present();
  }
}

export const snapshotToArray = snapshot => {
  let returnArr = [];
  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};
export const getRoomKey = ref => {
  let roomkey;
  ref.limitToLast(1).on('child_added', function(prevChildKey) {
    console.log('===>>>>' + prevChildKey.key);
    roomkey = prevChildKey.key;
  }); //获取roomkey
  return roomkey;
};
