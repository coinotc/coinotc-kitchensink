import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,App} from 'ionic-angular';
import { AdvertisementServiceProvider } from '../../providers/advertisement-service/advertisement-service';  
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { advertisement} from '../../models/advertisement';
import { AdinformationPage } from '../adinformation/adinformation';
import { EditAdvertisementPage } from '../edit-advertisement/edit-advertisement';
/**
 * Generated class for the AdvertisementsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
)
@Component({
  selector: 'page-advertisements',
  templateUrl: 'advertisements.html',
})
export class AdvertisementsPage {
  private activeAdvertisement:advertisement[];
  private disableAdvertisement:advertisement[];
  value = "Active";
  private user;
  constructor(public navCtrl: NavController,
    private advertisementService : AdvertisementServiceProvider,
    private appCtrl: App,
    private userServiceProvider: UserServiceProvider) {
      this.user = this.userServiceProvider.getCurrentUser();
      this.doRefresh();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AdvertisementsPage');
  }
  onTabSelect(tab: { index: number; id: string; }) {
    console.log(`Selected tab: `, tab);
  }
  onSegment() {
    this.doRefresh();
  }
  doRefresh(refresher?) {
    switch (this.value) {
      case 'Active':
        this.advertisementService.getMyadvertisement(this.user.username,true).subscribe((result) => {
          this.activeAdvertisement = result;
          if (refresher) {
            refresher.complete();
          }
        }); break;
      case 'Disabled':
        this.advertisementService.getMyadvertisement(this.user.username, false).subscribe(result => {
          this.disableAdvertisement = result;
          if (refresher) {
            refresher.complete();
          }
        }); break;
    }
  }
  read(information){
    console.log(information)
      if (information.type == 1) {
        this.appCtrl.getRootNav().push(AdinformationPage, { information: information, tradetype: { type: 'Buy', crypto: information.crypto } })
      } else {
        this.appCtrl.getRootNav().push(AdinformationPage, { information: information, tradetype: { type: 'Sell', crypto: information.crypto } })
      }
    }
    setVisible(information){
    this.advertisementService.changeVisible(information._id,information.visible).subscribe(result=>{
      this.doRefresh();
    })
  }
    delete(information){
    this.advertisementService.deleteSatatus(information._id).subscribe(
      result=>{
        this.doRefresh();
      });
    }
    edit(information){
      console.log(information.crypto +"edit")
      this.appCtrl.getRootNav().push(EditAdvertisementPage, { information: information , type:"edit"})
    }
}
