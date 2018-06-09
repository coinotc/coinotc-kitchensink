import {
  Component,
  ViewChild,
  ElementRef,
  Renderer,
  Pipe,
  PipeTransform,
  Injectable
} from '@angular/core';
import { NavController, NavParams, App, ViewController } from 'ionic-angular';
import { AddadvertisementPage } from '../addadvertisement/addadvertisement';
import { Content } from 'ionic-angular';
import { AdvertisementServiceProvider } from '../../providers/advertisement-service/advertisement-service';
import { advertisement } from '../../models/advertisement';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AdinformationPage } from '../adinformation/adinformation';
import { PopoverController, Events } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { BannerControlProvider } from '../../providers/banner-control/banner-control';
import { banner } from '../../models/banner-control';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the TradePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  template: `
<ion-list mode="ios" style="margin: 0px 16px 0px;" inset no-lines ion-row>
  <ion-list radio-group [(ngModel)]="fiatcopy" col-6>
    <ion-item-divider>
      {{'Currency' | translate}}
    </ion-item-divider>
    <ion-item>
      <ion-label>{{'fiat.SGD' | translate}}</ion-label>
      <ion-radio value="SGD" (click)="leave()"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>{{'fiat.CNY' | translate}}</ion-label>
      <ion-radio value="CNY" (click)="leave()"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>{{'fiat.USD' | translate}}</ion-label>
      <ion-radio value="USD" (click)="leave()"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>{{'fiat.THB' | translate}}</ion-label>
      <ion-radio value="THB" (click)="leave()"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>{{'fiat.MYR' | translate}}</ion-label>
      <ion-radio value="MYR" (click)="leave()"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>{{'fiat.KRW' | translate}}</ion-label>
      <ion-radio value="KRW" (click)="leave()"></ion-radio>
    </ion-item>
  </ion-list>
  <ion-list style="margin-bottom: 0px;" radio-group [(ngModel)]="crypto" col-6>
    <ion-item-divider>
      {{'Crypto' | translate}}
    </ion-item-divider>
    <ion-item>
      <ion-label>BITCOIN</ion-label>
      <ion-radio value="BITCOIN" (click)="leave()"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>ETHEREUM</ion-label>
      <ion-radio value="ETHEREUM" (click)="leave()"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>RIPPLE</ion-label>
      <ion-radio value="RIPPLE" (click)="leave()"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>MONERO</ion-label>
      <ion-radio value="MONERO" (click)="leave()"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>STELLAR</ion-label>
      <ion-radio value="STELLAR" (click)="leave()"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>CARDANO</ion-label>
      <ion-radio value="CARDANO" (click)="leave()"></ion-radio>
    </ion-item>
    <ion-item>
      <ion-label>ZILLIQA</ion-label>
      <ion-radio value="ZILLIQA" (click)="leave()"></ion-radio>
    </ion-item>
  </ion-list>
  </ion-list>`
})
export class fiatPopoverPage {
  fiatcopy: string;
  crypto: string;
  isClear: boolean = true;
  isSolid: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public events: Events
  ) {
    this.fiatcopy = this.navParams.data.fiat;
    this.crypto = this.navParams.data.crypto;
  }
  leave() {
    this.viewCtrl.dismiss({ crypto: this.crypto, fiat: this.fiatcopy });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
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
  headercontent: any;
  buynsell: string = 'buy';
  crypto: string = 'ETHEREUM';
  country;
  fiat: string = 'USD';
  currentuser;
  banners;
  query;
  public list: advertisement[];
  constructor(
    public popoverCtrl: PopoverController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public appCtrl: App,
    public adservice: AdvertisementServiceProvider,
    public events: Events,
    public userservice: UserServiceProvider,
    private storage: Storage,
    public renderer: Renderer,
    public myElement: ElementRef,
    public bannerControl: BannerControlProvider,
    public ProfileService: ProfileServiceProvider
  ) {
    // this.showheader = false;
    // this.hideheader = true;
    this.bannerControl.getBanner().subscribe(result => {
      this.banners = result;
      console.log(this.banners);
    });
  }
  ionViewWillEnter() {
  }
  ionViewDidEnter() {
    this.storage.ready().then(() => {
      this.storage.get('nativeRegion').then(value => {
        if (value) {
          this.country = value.region;
        } else {
          this.country = 'singapore';
        }
      }).then(() => this.doRefresh());
    })
  }
  doRefresh(refresher?) {
    this.currentuser = this.userservice.getCurrentUser().username;
    if (this.buynsell === 'buy') {
      this.adservice
        .getadvertisement(this.crypto, this.country, this.fiat, 1)
        .subscribe(result => {
          this.list = result;
          console.log(this.list);
          if (refresher) {
            refresher.complete();
          }
        });
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
    });
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
  // gettrade(owner) {
  //   // return this.ProfileService.getProfile(owner);
  //   console.log(owner);
  // }
  profile(owner) {
    if (owner != this.currentuser) {
      this.appCtrl.getRootNav().push(ProfilePage, owner);
    }
  }
  addad() {
    this.events.subscribe('reloadtrade', () => {
      this.doRefresh();
      this.events.unsubscribe('reloadtrade');
    });
    this.appCtrl.getRootNav().push(AddadvertisementPage, {
      crypto: this.crypto,
      fiat: this.fiat,
      country: this.country
    });
  }
  presentfilterPopover(myEvent) {
    let popover = this.popoverCtrl.create(
      fiatPopoverPage,
      { fiat: this.fiat, crypto: this.crypto },
      { cssClass: 'contact-popover' }
    );
    popover.present({ ev: myEvent });
    popover.onDidDismiss(data => {
      if (data) {
        this.crypto = data.crypto;
        this.fiat = data.fiat;
        this.doRefresh();
      }
    });
  }

  ngOnInit() { }
}

@Pipe({
  name: 'searchPipe'
})
export class SearchPipe implements PipeTransform {
  public transform(value, key: string, term: string) {
    if (!term) return value;
    return value.filter(item => {
      if (item.hasOwnProperty(key)) {
        if (term) {
          let regExp = new RegExp('\\b' + term, 'gi');
          return regExp.test(item[key]);
        } else {
          return true;
        }
      } else {
        return false;
      }
    });
  }
}
