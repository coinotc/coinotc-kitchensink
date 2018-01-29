import { Component } from '@angular/core';
import { IonicPage, NavController, App } from 'ionic-angular';
import { AdvertisementServiceProvider } from '../../providers/advertisement-service/advertisement-service';
import { adinformation } from '../../models/adinformation';
import { AdinformationPage } from '../adinformation/adinformation';

/**
 * Generated class for the TradeBuyStellarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-trade-buy-stellar',
  templateUrl: 'trade-buy-stellar.html',
})
export class TradeBuyStellarPage {
  private list: adinformation[];
  constructor(public navCtrl: NavController, public adservice: AdvertisementServiceProvider, public appCtrl: App) {
    this.doRefresh();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TradeBuyStellarPage');
  }
  doRefresh(refresher?) {
    // this.list = this.adservice.getadbuy("ETH");
    this.adservice.getadvertisement("STELLAR",1).subscribe(result => {
      this.list = result;
      if (refresher) {
        refresher.complete();
      }
    })
  }
  adinformation(information) {
    this.appCtrl.getRootNav().push(AdinformationPage, { information: information, tradetype: { type: 'Buy', crypto: 'STELLAR' } })
  }

}
