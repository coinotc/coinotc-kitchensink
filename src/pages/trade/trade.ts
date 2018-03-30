import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, App, ViewController } from 'ionic-angular';
import { AddadvertisementPage } from '../addadvertisement/addadvertisement'
import { Content } from 'ionic-angular';
import { AdvertisementServiceProvider } from '../../providers/advertisement-service/advertisement-service';
import { advertisement } from '../../models/advertisement';
import { UserServiceProvider } from '../../providers/user-service/user-service'
import { AdinformationPage } from '../adinformation/adinformation';
import { PopoverController, Events } from 'ionic-angular';
/**
 * Generated class for the TradePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  template: `
<ion-list inset>
  <ion-list-header>
    Country
  </ion-list-header>
  <ion-list radio-group [(ngModel)]="countrycopy" (click)="change()" >
    <ion-item>
      <ion-label>Singapore</ion-label>
      <ion-radio value="singapore" checked></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>China</ion-label>
      <ion-radio value="china"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>USA</ion-label>
      <ion-radio value="usa"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>Korea</ion-label>
      <ion-radio value="korea"></ion-radio>
    </ion-item>
  </ion-list>
  <ion-list-header>
    Currency
  </ion-list-header>

  <ion-list radio-group [(ngModel)]="fiatcopy" (click)="change()">
    <ion-item>
      <ion-label>SGD</ion-label>
      <ion-radio value="SGD" checked></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>CNY</ion-label>
      <ion-radio value="CNY"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>USD</ion-label>
      <ion-radio value="USD"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>KRW</ion-label>
      <ion-radio value="KRW"></ion-radio>
    </ion-item>
  </ion-list>
</ion-list>`,
})
export class PopoverPage {
  countrycopy: string; fiatcopy: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public events: Events) {
    this.countrycopy = this.navParams.data.country;
    this.fiatcopy = this.navParams.data.fiat;
  }
  ngOnInit() {
    if (this.navParams.data) {
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }
  ionViewDidLeave() {
    // this.viewCtrl.dismiss({ country: this.countrycopy, fiat: this.fiatcopy })
    this.events.publish('popoverDidLeave', { country: this.countrycopy, fiat: this.fiatcopy })
  }

}

@Component({
  selector: 'page-trade',
  templateUrl: 'trade.html',
})
export class TradePage {
  @ViewChild(Content) content: Content;
  buynsell: string = "buy"; crypto: string = "ETHEREUM"; country: string = "singapore"; fiat: string = "USD"; currentuser;
  private list: advertisement[];
  constructor(public popoverCtrl: PopoverController, public navCtrl: NavController, public navParams: NavParams, public appCtrl: App, public adservice: AdvertisementServiceProvider, public events: Events, public userservice: UserServiceProvider) {
    this.doRefresh();
    this.currentuser = this.userservice.getCurrentUser().username;
  }
  doRefresh(refresher?) {
    if (this.buynsell === "buy") {
      this.adservice.getadvertisement(this.crypto, this.country, this.fiat, 1).subscribe(result => {
        this.list = result;
        if (refresher) {
          refresher.complete();
        }
      })
    } else {
      this.adservice.getadvertisement(this.crypto, this.country, this.fiat, 0).subscribe(result => {
        this.list = result;
        if (refresher) {
          refresher.complete();
        }
      })
    }
  }
  adinformation(information, ismine) {
    if (ismine) {
      this.appCtrl.getRootNav().push(AdinformationPage, { information: information, tradetype: { type: 'My', crypto: 'Advertisement', ismine: ismine } })
    } else {
      if (information.type == 1) {
        this.appCtrl.getRootNav().push(AdinformationPage, { information: information, tradetype: { type: 'Buy', crypto: information.crypto, ismine: ismine } })
      } else {
        this.appCtrl.getRootNav().push(AdinformationPage, { information: information, tradetype: { type: 'Sell', crypto: information.crypto, ismine: ismine } })
      }
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TradePage');
    this.content.resize();
  }
  addbuyad() {
    this.appCtrl.getRootNav().push(AddadvertisementPage, { type: 'Buy', title: 'publishBuy', crypto: this.crypto, fiat: this.fiat, country: this.country })
  }
  addsellad() {
    this.appCtrl.getRootNav().push(AddadvertisementPage, { type: 'Sell', title: 'publishSell', crypto: this.crypto, fiat: this.fiat, country: this.country })
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage, {
      country: this.country, fiat: this.fiat
    });
    popover.present({
      ev: myEvent
    });
    popover.onWillDismiss(() => {
      this.events.subscribe('popoverDidLeave', (data) => {
        this.country = data.country;
        this.fiat = data.fiat;
        this.doRefresh();
      })
    })
    popover.onDidDismiss(() => {
      this.events.unsubscribe('popoverDidLeave')
    })
  }
}
