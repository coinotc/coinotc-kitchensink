import { Component, ViewChild, ElementRef } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Content,
  Events,
  Platform
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
import { PhotoViewer } from '@ionic-native/photo-viewer';

/**
 * Generated class for the RoomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserServiceProvider,
    private orderServiceProvider: OrderServiceProvider,
    private profileServiceProvider: ProfileServiceProvider,
    private alertServiceProvider: AlertServiceProvider,
    private events: Events,
    public camera: Camera,
    public platform: Platform,
    private photoViewer: PhotoViewer
  ) {
    this.events.unsubscribe('reloadtrade');
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
    firebase
      .database()
      .ref('chatrooms/' + this.roomkey + '/chats')
      .on('value', resp => {
        this.chats = [];
        this.chats = snapshotToArray(resp);
        setTimeout(() => {
          if (this.offStatus === false) {
            //this.content.scrollToBottom(300);
          }
        }, 450);
      });
  }

  sendMessage() {
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
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400);
  }

  complain() {
    this.navCtrl.push(ComplainInformationPage, this.orderInfo);
  }

  onSwitch() {
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
    this.switched = !this.switched;
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
          // imageData is either a base64 encoded string or a file URI
          // If it's base64:
          this.base64Image = 'data:image/jpeg;base64,' + imageData;
          let newData = firebase
            .database()
            .ref('chatrooms/' + this.roomkey + '/chats')
            .push();
          newData.set({
            type: this.data.type,
            user: this.data.name,
            message: null,
            isImage: true,
            base64Image: this.base64Image,
            sendDate: Date()
          });
        },
        err => {
          console.log('Error taking photo', JSON.stringify(err));
        }
      );
    }
  }

  viewAttachedImage(image) {
    // we need to store to the fire storage then keep the url.
    this.photoViewer.show(
      'https://tribzap2it.files.wordpress.com/2016/05/the-flash-thecw.jpg'
    );
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
          // imageData is either a base64 encoded string or a file URI
          // If it's base64:
          this.base64Image = 'data:image/jpeg;base64,' + imageData;
          let newData = firebase
            .database()
            .ref('chatrooms/' + this.roomkey + '/chats')
            .push();
          newData.set({
            type: this.data.type,
            user: this.data.name,
            message: null,
            isImage: true,
            base64Image: this.base64Image,
            sendDate: Date()
          });
        },
        err => {
          console.log('Error taking photo', JSON.stringify(err));
        }
      );
    }
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

  onFocus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  onComment() {
    console.log(this.rate);
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
  }

  onProfile(trader) {
    console.log(trader);
    this.navCtrl.push(ProfilePage, trader);
  }

  onWallet() {
    this.navCtrl.push(WalletPage);
  }

  onExit() {
    this.user.orderCount = this.user.orderCount + 1;
    this.userService.update(this.user).subscribe();
    this.events.publish('reloadList');
    this.navCtrl.pop();
  }

  ionViewDidLeave() {
    this.events.unsubscribe('reloadList');
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
