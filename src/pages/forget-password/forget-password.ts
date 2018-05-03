import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, App } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ForgetVerifySixPinPage } from '../forget-verify-six-pin/forget-verify-six-pin'
/**
 * Generated class for the ForgetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html',
})
export class ForgetPasswordPage {
  forgetPasswordForm: FormGroup;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private userService: UserServiceProvider,
    private toastCtrl: ToastController
  ) {
    this.forgetPasswordForm = this.fb.group({
      email: [
        '',
        Validators.compose([Validators.required, this.emailValidator])
      ]
    })
  }
  emailValidator = (control: FormControl): { [s: string]: boolean } => {
    const EMAIL_REGEXP = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    if (!control.value) {
      return { required: true };
    } else if (!EMAIL_REGEXP.test(control.value)) {
      return { email: true, required: false };
    }
  };
  submitForm() {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'loading...',
      duration: 3000
    });
    loading.present();
    const credentials = this.forgetPasswordForm.value;
    console.log(credentials)
    this.userService.forgetPassword(credentials).subscribe(result => {
      if (result == null) {
        this.toastCtrl
          .create({
            message: `Your account is not exsit`,
            duration: 4500
          })
          .present();
      } else {
        this.toastCtrl
          .create({
            message: `Please check your email`,
            duration: 4500
          })
          .present();
        this.navCtrl.setRoot(ForgetVerifySixPinPage, credentials)
      }
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPasswordPage');
  }

}
