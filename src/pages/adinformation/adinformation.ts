import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  ToastController,
  NavParams,
  LoadingController,
  Events
} from 'ionic-angular';
import { advertisement } from '../../models/advertisement';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { OrderInformation } from '../../models/orderInformation';
import { OrderServiceProvider } from '../../providers/order-service/order-service';
import * as firebase from 'firebase';
import { RoomPage } from '../room/room';
import { ProfilePage } from '../profile/profile';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { AdvertisementServiceProvider } from '../../providers/advertisement-service/advertisement-service'
import { RESOURCE_CACHE_PROVIDER } from '@angular/platform-browser-dynamic';
/**
 * Generated class for the AdinformationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adinformation',
  templateUrl: 'adinformation.html'
})
export class AdinformationPage {
  data = { type: '', name: '', message: '', roomname: '' };
  ref = firebase.database().ref('chatrooms/');
  roomkey: any;
  disabled = true;
  information;
  title: string;
  tradetype: { type: String; crypto: String };
  user: { orderCount: number; goodCount: number };
  ismine;
  range;
  loading;
  orderinformation = new OrderInformation(
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    1,
    null
  );

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events:Events,
    private toastCtrl: ToastController,
    public userservice: UserServiceProvider,
    public loadingCtrl: LoadingController,
    public orderservice: OrderServiceProvider,
    public profileservice: ProfileServiceProvider,
    public adservice: AdvertisementServiceProvider
  ) {
    this.tradetype = navParams.data.tradetype;
    this.information = navParams.data.information;
    this.ismine = navParams.data.tradetype.ismine;
    console.log(navParams.data);
    this.profileservice.getProfile(this.information.owner).subscribe(result => {
      console.log(result);
      this.user = result[0];
      if (this.user.orderCount) {
        this.range = Math.trunc(
          this.user.goodCount / this.user.orderCount * 100
        );
      } else {
        this.range = 0;
      }
    });
    this.orderinformation.price = this.information.price;
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 5000
    });
  }
  profile() {
    if (this.information.owner != this.userservice.getCurrentUser().username)
      this.navCtrl.push(ProfilePage, this.information.owner);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AdinformationPage');
  }
  makeorder() {
    this.loading.present();
    this.adservice.getadvertisementvisible(this.information._id).subscribe(result => {
      if (result) {
        this.orderinformation.crypto = this.information.crypto;
        this.orderinformation.country = this.information.country;
        this.orderinformation.fiat = this.information.fiat;
        this.orderinformation.payment = this.information.payment;
        this.orderinformation.limit = this.information.limit;
        this.orderinformation.message = this.information.message;
        this.orderinformation.owner = this.information.owner;
        if (this.tradetype.type == 'Buy') {
          this.orderinformation.buyer = this.userservice.getCurrentUser().username;
          this.orderinformation.seller = this.information.owner;
        } else {
          this.orderinformation.seller = this.userservice.getCurrentUser().username;
          this.orderinformation.buyer = this.information.owner;
        }
        // console.log(this.orderinformation);
        this.orderservice.postorder(this.orderinformation).subscribe(result => {
          let owner = this.information.owner;
          this.loading.dismiss();
          this.data.name = this.userservice.getCurrentUser().username;
          //console.log(JSON.parse(JSON.stringify(result,null,4)));
          this.data.roomname = JSON.parse(JSON.stringify(result))._id;

          let newData = this.ref.push();
          newData.set({
            roomname: this.data.roomname
          }); //定义房间名 并创建房间

          this.roomkey = getRoomKey(this.ref);
          console.log(this.roomkey + "<<<<<<<<<<here is the roomkey")
          this.orderservice
            .addRoomKey(this.roomkey, this.data.roomname)
            .subscribe();
          this.navCtrl.push(RoomPage, {
            order: result,
            trader: owner,
            roomkey: this.roomkey,
            type: 'order'
          });
          //this.navCtrl.push(OrderWindowPage, { order: result, trader: owner });
        });
      } else {
        let toast = this.toastCtrl.create({
          message: `this advertisement is closed`,
          duration: 3000
        });
        toast.onDidDismiss(() => {
           this.navCtrl.pop();
           this.loading.dismiss();
           this.events.publish('reloadtrade');
          });
        toast.present();
      }
    })
  }
  amountchange() {
    this.orderinformation.quantity =
      this.orderinformation.amount / this.orderinformation.price;
    this.checkorder();
  }
  quantitychange() {
    this.orderinformation.amount =
      this.orderinformation.quantity * this.orderinformation.price;
    this.checkorder();
  }
  checkorder() {
    if (this.orderinformation.amount >= this.information.min_price) {
      if (this.orderinformation.amount <= this.information.max_price) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    } else {
      this.disabled = true;
    }
  }
}

export const getRoomKey = ref => {
  let roomkey;
  ref.limitToLast(1).on('child_added', function (prevChildKey) {
    //console.log("===>>>>" + prevChildKey.key)
    roomkey = prevChildKey.key;
  }); //获取roomkey
  return roomkey;
};
