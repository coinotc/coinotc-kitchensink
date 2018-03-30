import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { User } from '../../models/user.model';
import { TabsPage } from '../../pages/tabs/tabs';
import { FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms';
/**
 * Generated class for the PaymentPrdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-prd',
  templateUrl: 'payment-prd.html',
})
export class PaymentPrdPage {
  private user;
  trade :FormGroup;
  model = new User("","","","","",0,0,"","",null,null,[],[], "",null,null);
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private userService:UserServiceProvider,private fb: FormBuilder) {
      this.user = this.userService.getCurrentUser();
      this.trade = this.fb.group({
        PaymentPassword: ['', Validators.required],
        confirmPassword: ['',[this.matchValidator]]
      });
      this.model.email = this.user.email;
      this.model.email = this.user.username;
      console.log(this.model.tradePrd)
  }
  matchValidator = (control: FormControl): { [s: string]: boolean } => {
    
        if(!control.value){
          return { required: true}
        }else if(this.trade.controls.PaymentPassword.value === control.value){
          return  { }
        }else{
           return { required: true}
        }
      }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPrdPage');
  }
  submit(){
    console.log(this.model.tradePrd)
    this.user.tradePrd = this.model.tradePrd;
    console.log(this.user)
    this.userService.update(this.user).subscribe(user=>{
      this.navCtrl.setRoot(TabsPage);
      
    });

  }
}
