import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  App,
  Events
} from 'ionic-angular';
import { OrderServiceProvider } from '../../providers/order-service/order-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { RoomPage } from '../room/room';
/**
 * Generated class for the OrderListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-list',
  templateUrl: 'order-list.html'
})
export class OrderListPage {
  private activeOrders;
  private finishedOrders;
  // private buyerActiveOrders: OrderInformation[];
  // private sellerActiveOrders: OrderInformation[];
  // private buyerFinishedOrders: OrderInformation[];
  // private sellerFinishedOrders: OrderInformation[];
  private user;
  segments = 'Active';
  placeholderPicture = 'http://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515005723652&di=a1ebb7c0a1b6bfede1ff5ebc057ed073&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dshijue1%252C0%252C0%252C294%252C40%2Fsign%3D822b27e7b8fb43160e12723948cd2c56%2F6c224f4a20a44623b6b1e24e9222720e0cf3d7a7.jpg';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private orderServiceProvider: OrderServiceProvider,
    private userServiceProvider: UserServiceProvider,
    private appCtrl: App,
    private events: Events
  ) {
    this.doRefresh();
  }

  onDetail(order, trader) {
    this.appCtrl.getRootNav().push(RoomPage, {
      order: order,
      trader: trader,
      type: 'order'
    });

    this.events.subscribe('reloadList', () => {
      this.doRefresh();
    });
  }

  onSegment() {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.user = this.userServiceProvider.getCurrentUser();
    switch (this.segments) {
      case 'Active':
        this.orderServiceProvider
          .getOrders(this.user.username, false)
          .subscribe(result => {
            this.activeOrders = result;
            if (refresher) {
              refresher.complete();
            }
          });
        break;
      case 'Finished':
        this.orderServiceProvider
          .getOrders(this.user.username, true)
          .subscribe(result => {
            this.finishedOrders = result;
            if (refresher) {
              refresher.complete();
            }
          });
        break;
    }
    // switch (this.segments) {
    //   case 'ActiveBuy':
    //     this.orderServiceProvider
    //       .getBuyerOrders(this.user.username, false)
    //       .subscribe(result => {
    //         this.buyerActiveOrders = result;
    //         if (refresher) {
    //           refresher.complete();
    //         }
    //       });
    //     break;
    //   case 'FinishedBuy':
    //     this.orderServiceProvider
    //       .getBuyerOrders(this.user.username, true)
    //       .subscribe(result => {
    //         this.buyerFinishedOrders = result;
    //         if (refresher) {
    //           refresher.complete();
    //         }
    //       });
    //     break;
    //   case 'ActiveSell':
    //     this.orderServiceProvider
    //       .getSellerOrders(this.user.username, false)
    //       .subscribe(result => {
    //         this.sellerActiveOrders = result;
    //         if (refresher) {
    //           refresher.complete();
    //         }
    //       });
    //     break;
    //   case 'FinishedSell':
    //     this.orderServiceProvider
    //       .getSellerOrders(this.user.username, true)
    //       .subscribe(result => {
    //         this.sellerFinishedOrders = result;
    //         if (refresher) {
    //           refresher.complete();
    //         }
    //       });
    //     break;
    // }
  }

  ionViewWillEnter() {
    this.doRefresh();
  }
}
