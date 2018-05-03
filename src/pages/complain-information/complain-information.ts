import { Component } from '@angular/core';
import { IonicPage,NavController,NavParams,ViewController,ToastController,LoadingController,App} from 'ionic-angular';
import { FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { complain } from '../../models/complain';
import { ComplainServiceProvider } from '../../providers/complain-service/complain-service';
import * as firebase from 'firebase';
import { RoomPage } from '../room/room';
import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the ComplainInformationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complain-information',
  templateUrl: 'complain-information.html',
})
export class ComplainInformationPage {
  //data = { type:'', name:'', message:'',roomname:'' };
  //ref = firebase.database().ref('chatrooms/');
  //roomkey:any;
  complainForm:FormGroup;
  orderInformation;
  username;
  // complainUser;
  // Complainant;
  model = new complain('','','','Order','',0,null,'',null);
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private userService:UserServiceProvider,
  private fb: FormBuilder,
  private loadingCtrl: LoadingController,
  private complainService:ComplainServiceProvider,
  private toastCtrl: ToastController
  ) {
    this.username = this.userService.getCurrentUser().username;
    this.orderInformation = this.navParams.data;
    // if(this.orderInformation.buyer == this.userService.getCurrentUser().username){
    //   this.Complainant = "Buyer";
    // }else{
    //   this.Complainant = "Seller";
    // }
    // console.log(this.Complainant)
    // this.complainUser = this.userService.getCurrentUser().username == this.orderInformation.seller ? this.orderInformation.buyer : this.orderInformation.seller; 
    //console.log(this.compainUser)
    this.complainForm = this.fb.group({
      title:['',Validators.required],
      content:['',Validators.required]
    })
  }

  submitForm(){
    this.model.username = this.username;
    this.model.orderId = this.orderInformation._id;
    // this.model.pleader = this.complainUser;
    // this.model.complainant = this.userService.getCurrentUser().username;
    // this.model.orderId = this.orderInformation._id;
    // this.model.crypto = this.orderInformation.crypto;
    // this.model.fiat = this.orderInformation.fiat;
    // this.model.role = this.Complainant;
    // this.model.country = this.orderInformation.country;
    console.log(this.model);
    this.complainService.sendComplain(this.model).subscribe(result => {
      //console.log(result)
      if(result != null)
       this.navCtrl.setRoot(TabsPage);
       else{
        this.toastCtrl
        .create({
          message: `This order has been complained.Please waitting support to solve`,
          duration: 4500
        })
        .present();
       }
     });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplainInformationPage');
  }

}
