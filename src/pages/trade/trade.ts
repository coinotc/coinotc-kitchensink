import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { NavController, NavParams, App, ViewController } from 'ionic-angular';
import { AddadvertisementPage } from '../addadvertisement/addadvertisement';
import { Content } from 'ionic-angular';
import { AdvertisementServiceProvider } from '../../providers/advertisement-service/advertisement-service';
import { advertisement } from '../../models/advertisement';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AdinformationPage } from '../adinformation/adinformation';
import { PopoverController, Events } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
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
  <ion-list radio-group [(ngModel)]="countrycopy">
    <ion-item>
      <ion-label>Global</ion-label>
      <ion-radio value="global" (click)="leave()"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>Singapore</ion-label>
      <ion-radio value="singapore" (click)="leave()"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>China</ion-label>
      <ion-radio value="china" (click)="leave()"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>USA</ion-label>
      <ion-radio value="usa" (click)="leave()"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>Korea</ion-label>
      <ion-radio value="korea" (click)="leave()"></ion-radio>
    </ion-item>
  </ion-list>
</ion-list>`
})
export class countryPopoverPage {
  countrycopy: string;
  isClear: boolean = true;
  isSolid: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public events: Events
  ) {
    this.countrycopy = this.navParams.data.country;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }
  leave() {
    this.viewCtrl.dismiss({ country: this.countrycopy });
  }
}
@Component({
  template: `
<ion-list inset>
  <ion-list-header>
    Currency
  </ion-list-header>

  <ion-list radio-group [(ngModel)]="fiatcopy">
    <ion-item>
      <ion-label>SGD</ion-label>
      <ion-radio value="SGD" (click)="leave()"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>CNY</ion-label>
      <ion-radio value="CNY" (click)="leave()"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>USD</ion-label>
      <ion-radio value="USD" (click)="leave()"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>KRW</ion-label>
      <ion-radio value="KRW" (click)="leave()"></ion-radio>
    </ion-item>
  </ion-list>
</ion-list>`
})
export class fiatPopoverPage {
  fiatcopy: string;
  isClear: boolean = true;
  isSolid: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public events: Events
  ) {
    this.fiatcopy = this.navParams.data.fiat;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }
  leave() {
    this.viewCtrl.dismiss({ fiat: this.fiatcopy });
  }
}

@Component({
  selector: 'page-trade',
  templateUrl: 'trade.html'
})
export class TradePage {
  @ViewChild(Content) content: Content;
  start = 0;
  threshold = 100;
  slideHeaderPrevious = 0;
  ionScroll: any;
  showheader: boolean;
  hideheader: boolean;
  headercontent: any;
  buynsell: string = 'buy';
  crypto: string = 'ETHEREUM';
  country: string = 'singapore';
  fiat: string = 'USD';
  currentuser;
  public list: advertisement[];
  constructor(
    public popoverCtrl: PopoverController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public appCtrl: App,
    public adservice: AdvertisementServiceProvider,
    public events: Events,
    public userservice: UserServiceProvider,
    public renderer: Renderer,
    public myElement: ElementRef) {
    this.showheader = false;
    this.hideheader = true;
  }
  ionViewDidEnter() {
    this.currentuser = this.userservice.getCurrentUser().username;
    this.doRefresh();
  }
  doRefresh(refresher?) {
    if (this.buynsell === "buy") {
      this.adservice.getadvertisement(this.crypto, this.country, this.fiat, 1).subscribe(result => {
        console.log(result);
        this.list = result;
        if (refresher) {
          refresher.complete();
        }
      })
    } else {
      this.adservice
        .getadvertisement(this.crypto, this.country, this.fiat, 0)
        .subscribe(result => {
          this.list = result;
          if (refresher) {
            refresher.complete();
          }
        });
    }
  }
  adinformation(information, ismine) {
    this.events.subscribe('reloadtrade', () => {
      this.doRefresh();
      this.events.unsubscribe('reloadtrade');
    })
    if (ismine) {
      this.appCtrl.getRootNav().push(AdinformationPage, {
        information: information,
        tradetype: { type: 'My', crypto: 'Advertisement', ismine: ismine }
      });
    } else {
      if (information.type == 1) {
        this.appCtrl.getRootNav().push(AdinformationPage, {
          information: information,
          tradetype: {
            type: 'Buy',
            crypto: information.crypto,
            ismine: ismine
          }
        });
      } else {
        this.appCtrl.getRootNav().push(AdinformationPage, {
          information: information,
          tradetype: {
            type: 'Sell',
            crypto: information.crypto,
            ismine: ismine
          }
        });
      }
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TradePage');
    this.content.resize();
  }
  profile(owner) {
    if (owner != this.currentuser)
      this.appCtrl.getRootNav().push(ProfilePage, owner);
  }
  addbuyad() {
    this.appCtrl.getRootNav().push(AddadvertisementPage, {
      type: 'Buy',
      title: 'publishBuy',
      crypto: this.crypto,
      fiat: this.fiat,
      country: this.country
    });
  }
  addsellad() {
    this.appCtrl.getRootNav().push(AddadvertisementPage, {
      type: 'Sell',
      title: 'publishSell',
      crypto: this.crypto,
      fiat: this.fiat,
      country: this.country
    });
  }
  presentcountryPopover(myEvent) {
    let popover = this.popoverCtrl.create(countryPopoverPage, { country: this.country });
    popover.present({ ev: myEvent });
    popover.onDidDismiss(data => {
      if (data) {
        this.country = data.country;
        this.doRefresh();
      }
    });
  }
  presentfiatPopover(myEvent) {
    let popover = this.popoverCtrl.create(fiatPopoverPage, { fiat: this.fiat });
    popover.present({ ev: myEvent });
    popover.onDidDismiss(data => {
      if (data) {
        this.fiat = data.fiat;
        this.doRefresh();
      }
    })
  }
  ngOnInit() {
    // Ionic scroll element
    this.ionScroll = this.myElement.nativeElement.getElementsByClassName('scroll-content')[0];
    // On scroll function
    this.ionScroll.addEventListener("scroll", () => {
      if (this.ionScroll.scrollTop - this.start > this.threshold) {
        this.showheader = true;
        this.hideheader = false;
      } else {
        this.showheader = false;
        this.hideheader = true;
      }
      if (this.slideHeaderPrevious >= this.ionScroll.scrollTop - this.start) {
        this.showheader = false;
        this.hideheader = true;
      }
      this.slideHeaderPrevious = this.ionScroll.scrollTop - this.start;
    });
  }
}
