import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , App ,ToastController} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { CurrenciesServiceProvider } from '../../providers/currencies/currencies-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ModifyPasswordPage } from '../modify-password/modify-password';
import { RealNameVerifiedPage } from '../real-name-verified/real-name-verified'
import { ModifyTradepasswordPage } from '../modify-tradepassword/modify-tradepassword'
import { ForgetTradePasswordTextPage } from '../forget-trade-password-text/forget-trade-password-text';
import { AuthPage } from '../auth/auth';
import { Errors } from '../../models/errors.model';
import { JwtServiceProvider } from '../../providers/jwt-service/jwt-service';
/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  currencies: any[];
  language: any;
  languages = [{ label: 'English', value: 'en' }, { label: '中文', value: 'cn' }];
  baseCurrency: any;
  isSubmitting = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public translate: TranslateService,
    public currencyService: CurrenciesServiceProvider,
    public jwtService: JwtServiceProvider,
    public appCtrl: App,
    public toastCtrl: ToastController,
    public userService: UserServiceProvider) {
    this.initializeCurrencies();
  }
  
  initializeCurrencies(){
    this.currencyService.getCurrencies().subscribe(currencies=>{
      console.log("currencies ==> " + currencies);
      let currenciesCode = _.keys(currencies);
      let currenciesDesc = _.values(currencies);
      let currenciesArr = [];

      for (let currencyIndex in currenciesCode) {
        let currencyObj = {
          currenciesCode: currenciesCode[currencyIndex],
          currenciesDesc: currenciesDesc[currencyIndex]
        }
        currenciesArr.push(currencyObj);
      }
      this.currencies = currenciesArr;
    });
  }
  switchLanguage() {
    this.translate.use(this.language);
  }

  realNameTapped() {
    this.navCtrl.push(RealNameVerifiedPage);
  }
  forgetTradePassword() {
    this.navCtrl.push(ForgetTradePasswordTextPage);
  }
  paymentPrdTapped() {
    this.navCtrl.setRoot(ModifyTradepasswordPage);
  }

  passwordTapped() {
    this.navCtrl.push(ModifyPasswordPage);
  }
  logout() {
    //this.tabRef.select(3);
    this.isSubmitting = true;
    //console.log(this.userService.logout());
    this.userService.logout().subscribe(
      user => {
        console.log('log out !!!!!');
        this.jwtService.destroyToken();
        let tabs = document.querySelectorAll('.tabbar.show-tabbar');
        if (tabs !== null) {
          Object.keys(tabs).map(key => {
            tabs[key].style.display = 'none';
          });
        }
        //let nav = this.appCtrl.getActiveNavs();
        //nav[0].setRoot(AuthPage); // end if
        this.navCtrl.setRoot(AuthPage);
      },
      (errors: Errors) => {
        for (let field in errors.errors) {
          this.toastCtrl
            .create({
              message: `${field} ${errors.errors[field]}`,
              duration: 3000
            })
            .present();
        }
        this.isSubmitting = false;
      }
    );
  }
  setBaseCurrency() {
    console.log(this.baseCurrency);
    console.log("set base currency! " + this.baseCurrency);
    let nativeCurry = {
      currency: this.baseCurrency
    }
    this.userService.updateBaseCurrency(nativeCurry).subscribe(result => {
      console.log(result);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

};
