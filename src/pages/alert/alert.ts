import { Component } from '@angular/core';
import { Alert } from '../../models/alert';
import { Observable } from 'rxjs/Observable';
import { Notification } from '../../models/notification';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { OrderServiceProvider } from '../../providers/order-service/order-service';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  ModalController,
  ViewController
} from 'ionic-angular';

/**
 * Generated class for the AlertPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alert',
  templateUrl: 'alert.html'
})
export class AlertPage {
  public crypto: string = 'ETHEREUM';
  public averagePrice;
  private alerts: Observable<any>;
  private user;
  private deviceToken;
  notification = new Notification('', null);
  cryptosFAB: Object[] = [
    {
      value: 'ETHEREUM',
      icon: 'eth'
    },
    {
      value: 'RIPPLE',
      icon: 'ripple'
    },
    {
      value: 'MONERO',
      icon: 'monero'
    },
    {
      value: 'STELLAR',
      icon: 'stellar'
    },
    {
      value: 'CARDANO',
      icon: 'cardano'
    }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private alertServiceProvider: AlertServiceProvider,
    private userServiceProvider: UserServiceProvider,
    private orderServiceProvider: OrderServiceProvider,
    private profileServiceProvider: ProfileServiceProvider
  ) {
    this.user = this.userServiceProvider.getCurrentUser().username;
    this.doRefresh();
    this.orderServiceProvider
      .getAlertInformation('USD', this.crypto)
      .subscribe(result => {
        if (!result) {
          this.averagePrice = 0;
        } else {
          this.averagePrice = result;
        }
      });
    this.profileServiceProvider.getProfile(this.user).subscribe(result => {
      this.deviceToken = result[0].deviceToken;
      this.notification.to = this.deviceToken;
      console.log(result[0]);
    });
  }

  // onDelete(alert) {
  //   this.alertServiceProvider.deleteAlert(alert).subscribe(result => {
  //     this.doRefresh();
  //   });
  // }

  onStatus(alert) {
    this.alertServiceProvider.updateAlert(alert).subscribe(result => {
      this.doRefresh();
    });
  }

  changeCrypto(cryptoValue) {
    this.crypto = cryptoValue;
    this.doRefresh();
    this.orderServiceProvider
      .getAlertInformation('USD', this.crypto)
      .subscribe(result => {
        if (!result) {
          this.averagePrice = 0;
        } else {
          this.averagePrice = result;
        }
      });
  }

  addNewAlert() {
    let modal = this.modalCtrl.create(AddAlertPage, {
      crypto: this.crypto,
      user: this.user
    });
    modal.onDidDismiss(() => {
      this.doRefresh();
    });
    modal.present();
  }

  doRefresh(refresher?) {
    this.alerts = this.alertServiceProvider.getAlerts(this.user, this.crypto);
    if (refresher) {
      refresher.complete();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlertPage');
  }
}

@Component({
  selector: 'page-addalert',
  templateUrl: 'add-alert.html'
})
export class AddAlertPage {
  public price: any;
  public crypto: string;
  public user: string;
  public fiat: string = 'USD';
  newAlertForm: FormGroup;
  model = new Alert('', null, '', '', true, false, null);

  constructor(
    public platform: Platform,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private orderServiceProvider: OrderServiceProvider,
    private alertServiceProvider: AlertServiceProvider,
    private fb: FormBuilder
  ) {
    this.user = this.navParams.get('user');
    this.crypto = this.navParams.get('crypto');
    this.orderServiceProvider
      .getAlertInformation(this.fiat, this.crypto)
      .subscribe(result => {
        this.price = result.toFixed(2);
      });
    this.newAlertForm = this.fb.group({
      newPrice: [null, [this.priceValidator]]
    });
  }

  onFiat(fiat) {
    this.orderServiceProvider
      .getAlertInformation(fiat, this.crypto)
      .subscribe(result => {
        this.price = result;
      });
    console.log(this.model.above);
  }

  onCreate() {
    this.model.username = this.user;
    this.model.price = this.price;
    this.model.fiat = this.fiat;
    this.model.crypto = this.crypto;
    console.log(this.model.above);
    this.alertServiceProvider.postAlert(this.model).subscribe(result => {
      console.log(result);
      this.viewCtrl.dismiss();
    });
  }

  priceValidator = (control: FormControl): { [s: string]: boolean } => {
    const PRICE_REGEXP = /^([1-9]\d*|0)(\.\d{1,2})?$/;
    if (!control.value) {
      return { required: true };
    } else if (!PRICE_REGEXP.test(control.value)) {
      return { error: true, email: true };
    }
  };

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
