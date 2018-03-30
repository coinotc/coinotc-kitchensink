import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
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
  rangepercent = 0;
  type: String;
  title: String;
  model = new advertisement(
    '',
    true,
    null,
    null,
    null,
    null,
    null,
    null,
    '',
    null,
    '',
    null
  );
  //information = new adinformation('', true, 'ETHEREUM', 'singapore', 'SGD', null, null, null, '', null, '');
  cryptoprice: number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private adservice: AdvertisementServiceProvider,
    private userservice: UserServiceProvider,
    private fb: FormBuilder
  ) {
    this.type = navParams.data.type;
    this.title = navParams.data.title;
    this.model.crypto = navParams.data.crypto;
    this.model.fiat = navParams.data.fiat;
    this.model.country = navParams.data.country;
    this.changerange();
    this.adservice.getprice(this.model.crypto, this.model.fiat).subscribe(result => {
      this.cryptoprice = Number(result[0].price_sgd);
      this.model.price = this.cryptoprice;
    });
    if (this.type == 'Buy') {
      this.adform = this.fb.group({
        crypto: [this.model.crypto, Validators.required],
        country: [this.model.country, Validators.required],
        fiat: [this.model.fiat, Validators.required],
        rangepercent: [null, Validators.required],
        price: [null, [Validators.min(0)]],
        min_price: [null, [Validators.min(0), Validators.required]],
        max_price: [null, [Validators.min(0), Validators.required]],
        payment: ['', Validators.required],
        limit: [null, [Validators.min(15), Validators.max(60), Validators.required]],
        message: ['', Validators.required]
      })
    }else{
      this.adform = this.fb.group({
        crypto: [this.model.crypto, Validators.required],
        country: [this.model.country, Validators.required],
        fiat: [this.model.fiat, Validators.required],
        rangepercent: [null, Validators.required],
        price: [null, [Validators.min(0)]],
        min_price: [null, [Validators.min(0), Validators.required]],
        max_price: [null, [Validators.min(0), Validators.required]],
        payment: ['', Validators.required],
        limit: [null, [Validators.min(15), Validators.max(60)]],
        message: ['', Validators.required]
      })
    }
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
  getcryptoprice() {
    switch (this.model.fiat) {
      case 'SGD':
        this.adservice.getprice(this.model.crypto, 'SGD').subscribe(result => {
          this.cryptoprice = Number(result[0].price_sgd);
          this.changerange();
        });
        break;
      case 'CNY':
        this.adservice.getprice(this.model.crypto, 'CNY').subscribe(result => {
          this.cryptoprice = Number(result[0].price_cny);
          this.changerange();
        });
        break;
      case 'USD':
        this.adservice.getprice(this.model.crypto, 'USD').subscribe(result => {
          this.cryptoprice = Number(result[0].price_usd);
          this.changerange();
        });
        break;
      case 'KRW':
        this.adservice.getprice(this.model.crypto, 'KRW').subscribe(result => {
          this.cryptoprice = Number(result[0].price_krw);
          this.changerange();
        });
        break;
    }
  }
  changerange() {
    this.model.price = Number(
      (this.cryptoprice * (100 + this.rangepercent) / 100).toFixed(4)
    );
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddadvertisementPage');
  }
  addbuyad() {
    console.log(this.model);
    this.model.type = 1;
    this.model.owner = this.userservice.getCurrentUser().username;
    this.adservice.addadvertisement(this.model).subscribe(result => {
      console.log(result);
      this.navCtrl.pop();
    });
  }
  addsellad() {
    this.model.type = 0;
    this.model.owner = this.userservice.getCurrentUser().username;
    this.adservice.addadvertisement(this.model).subscribe(result => {
      console.log(result);
      this.navCtrl.pop();
    });
  }
}
