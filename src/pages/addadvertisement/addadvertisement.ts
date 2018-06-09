import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController, Events, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdvertisementServiceProvider } from '../../providers/advertisement-service/advertisement-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { advertisement } from '../../models/advertisement';
/*
 * Generated class for the AddadvertisementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addadvertisement',
  templateUrl: 'addadvertisement.html'
})
export class AddadvertisementPage {
  adform: FormGroup;
  belowmax = true;
  notgetprice = true;
  type: String = 'Buy';
  title: String = 'Public Advertisement';
  loading;
  crypto = {
    BITCOIN: true,
    ETHEREUM: true,
    RIPPLE: true,
    MONERO: true,
    STELLAR: true,
    CARDANO: true,
    ZILLIQA: true
  };
  model = new advertisement(
    '',
    true,
    null,
    null,
    null,
    null,
    null,
    null,
    [],
    null,
    '',
    null
  );
  //information = new adinformation('', true, 'ETHEREUM', 'singapore', 'SGD', null, null, null, '', null, '');
  cryptoprice: number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private toastCtrl: ToastController,
    private adservice: AdvertisementServiceProvider,
    private userservice: UserServiceProvider,
    public loadingCtrl: LoadingController,
    private fb: FormBuilder
  ) {
    this.model.crypto = navParams.data.crypto;
    this.model.fiat = navParams.data.fiat;
    if (navParams.data.country == "global") {
      this.model.country = "singapore";
    } else {
      this.model.country = navParams.data.country;
    }
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 5000
    });
    this.changetype();
  }
  changetype() {
    if (this.type == 'Buy') {
      this.adform = this.fb.group({
        crypto: [this.model.crypto, Validators.required],
        country: [this.model.country, Validators.required],
        fiat: [this.model.fiat, Validators.required],
        // cryptoprice: [null, Validators.required],
        price: [this.cryptoprice, [Validators.min(0)]],
        min_price: [null, [Validators.min(0), Validators.required]],
        max_price: [null, [Validators.min(0), Validators.required]],
        payment: ['', Validators.required],
        limit: [
          null,
          [Validators.min(15), Validators.max(60), Validators.required]
        ],
        message: ['', Validators.required]
      });
    } else {
      this.adform = this.fb.group({
        crypto: [this.model.crypto, Validators.required],
        country: [this.model.country, Validators.required],
        fiat: [this.model.fiat, Validators.required],
        // cryptoprice: [null, Validators.required],
        price: [this.cryptoprice, [Validators.min(0)]],
        min_price: [null, [Validators.min(0), Validators.required]],
        max_price: [null, [Validators.min(0), Validators.required]],
        payment: ['', Validators.required],
        limit: [null, [Validators.min(15), Validators.max(60)]],
        message: ['', Validators.required]
      });
    }
    this.fiatchange();
  }
  notbelowmax() {
    if (this.model.max_price && this.model.min_price) {
      if (Number(this.model.min_price) > Number(this.model.max_price)) {
        this.belowmax = true;
      } else {
        this.belowmax = false;
      }
    } else {
      this.belowmax = true;
    }
  }
  checkcrypto(crypto) {
    switch (crypto) {
      case 'BITCOIN':
        this.crypto.BITCOIN = false; break;
      case 'ETHEREUM':
        this.crypto.ETHEREUM = false; break;
      case 'RIPPLE':
        this.crypto.RIPPLE = false; break;
      case 'MONERO':
        this.crypto.MONERO = false; break;
      case 'STELLAR':
        this.crypto.STELLAR = false; break;
      case 'CARDANO':
        this.crypto.CARDANO = false; break;
      case 'ZILLIQA':
        this.crypto.ZILLIQA = false; break;
    }
  };

  fiatchange() {
    this.crypto = {
      BITCOIN: true,
      ETHEREUM: true,
      RIPPLE: true,
      MONERO: true,
      STELLAR: true,
      CARDANO: true,
      ZILLIQA: true
    };
    if (this.type == "Buy") {
      this.adservice.getfiatdata(1, this.model.fiat).subscribe(result => {
        console.log(result);
        if (result.length) {
          for (let i = 0; i < result.length; i++) {
            this.checkcrypto(result[i].crypto);
          }
        }
      })
    } else {
      this.adservice.getfiatdata(0, this.model.fiat).subscribe(result => {
        console.log(result);
        if (result.length) {
          for (let i = 0; i < result.length; i++) {
            this.checkcrypto(result[i].crypto);
          }
        }
      });
      this.getcryptoprice();
    }
  }
  getcryptoprice() {
    switch (this.model.fiat) {
      case 'SGD':
        this.adservice.getprice(this.model.crypto, this.model.fiat).subscribe(
          result => {
            this.cryptoprice = Number(Number(result[0].price_sgd).toFixed(2));
            this.changerange();
          },
          error => this.changerange(error)
        );
        break;
      case 'CNY':
        this.adservice.getprice(this.model.crypto, this.model.fiat).subscribe(
          result => {
            this.cryptoprice = Number(Number(result[0].price_cny).toFixed(2));
            this.changerange();
          },
          error => this.changerange(error)
        );
        break;
      case 'USD':
        this.adservice.getprice(this.model.crypto, this.model.fiat).subscribe(
          result => {
            this.cryptoprice = Number(Number(result[0].price_usd).toFixed(2));
            this.changerange();
          },
          error => this.changerange(error)
        );
        break;
      case 'KRW':
        this.adservice.getprice(this.model.crypto, this.model.fiat).subscribe(
          result => {
            this.cryptoprice = Number(Number(result[0].price_krw).toFixed(2));
            this.changerange();
          },
          error => this.changerange(error)
        );
        break;
      case 'MYR':
        this.adservice.getprice(this.model.crypto, this.model.fiat).subscribe(
          result => {
            this.cryptoprice = Number(Number(result[0].price_myr).toFixed(2));
            this.changerange();
          },
          error => this.changerange(error)
        );
        break;
      case 'THB':
        this.adservice.getprice(this.model.crypto, this.model.fiat).subscribe(
          result => {
            this.cryptoprice = Number(Number(result[0].price_thb).toFixed(2));
            this.changerange();
          },
          error => this.changerange(error)
        );
        break;
    }
  }
  changerange(error?) {
    if (error) {
      this.notgetprice = true;
    } else {
      this.notgetprice = false;
      this.model.price = this.cryptoprice;
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddadvertisementPage');
  }
  addbuyad() {
    this.loading.present();
    this.model.type = 1;
    this.model.owner = this.userservice.getCurrentUser().username;
    this.adservice.addadvertisement(this.model).subscribe(result => {
      if (result) {
        console.log(result);
        this.loading.dismiss();
        this.events.publish('reloadtrade');
        this.navCtrl.pop();
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
    }, error => {
      let toast = this.toastCtrl.create({
        message: error,
        duration: 3000
      });
      toast.onDidDismiss(() => {
        this.navCtrl.pop();
        this.loading.dismiss();
        this.events.publish('reloadtrade');
      })
      toast.present();
    });
  }
  addsellad() {
    this.loading.present();
    this.model.type = 0;
    this.model.owner = this.userservice.getCurrentUser().username;
    this.adservice.addadvertisement(this.model).subscribe(result => {
      if (result) {
        console.log(result);
        this.loading.dismiss();
        this.events.publish('reloadtrade');
        this.navCtrl.pop();
      } else {
        let toast = this.toastCtrl.create({
          message: `server error`,
          duration: 3000
        });
        toast.onDidDismiss(() => {
          this.navCtrl.pop();
          this.loading.dismiss();
          this.events.publish('reloadtrade');
        });
        toast.present();
      }
    }, error => {
      let toast = this.toastCtrl.create({
        message: error,
        duration: 3000
      });
      toast.onDidDismiss(() => {
        this.navCtrl.pop();
        this.loading.dismiss();
        this.events.publish('reloadtrade');
      })
      toast.present();
    });
  }
}
