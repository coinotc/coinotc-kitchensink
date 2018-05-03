import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ToastController,
  LoadingController,
  App
} from 'ionic-angular';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { AuthPage } from '../auth/auth';

/**
 * Generated class for the SetNewPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-set-new-password',
  templateUrl: 'set-new-password.html',
})
export class SetNewPasswordPage {
  authForm: FormGroup;
  password = 'password';
  password_type = 'password';
  confirm_password_type = 'password';
  private PASSWORD_PATTERN = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{12,}$/;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private userService:UserServiceProvider,
    private toastCtrl: ToastController ) {
      let passwordControl = new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.PASSWORD_PATTERN)
        ])
      );
      let confirmPasswordControl = new FormControl(
        '',
        Validators.compose([Validators.required, this.equalTo(passwordControl)])
      );
      this.authForm = this.fb.group({
        password: passwordControl,
        confirmPassword: confirmPasswordControl
      });
  }
  equalTo(equalControl: AbstractControl): ValidatorFn {
    let subscribe = false;
    return (control: AbstractControl): ValidationErrors | null => {
      if (!subscribe) {
        subscribe = true;
        equalControl.valueChanges.subscribe(() => {
          control.updateValueAndValidity();
        });
      }
      let input = control.value;
      console.log(input);
      console.log('equalControl.value' + equalControl.value);
      let isValid = equalControl.value == input;
      console.log('isValid> ' + isValid);
      if (!isValid) {
        console.log('>>>>');
        return { isValid: true, required: false };
      } else {
        return null;
      }
    };
  }
  togglePasswordMode() {
    console.log('toggle >>>> password ');
    this.password_type = this.password_type === 'text' ? 'password' : 'text';
  }
  toggleConfirmPasswordMode() {
    console.log('toggle >>>> confirm password');
    this.confirm_password_type = this.confirm_password_type === 'text' ? 'password' : 'text';
  }
  submitForm(){
    const credentials = this.authForm.value;
    this.userService.setNewPassword(credentials,this.navParams.data.email).subscribe(result=>{
      this.toastCtrl
            .create({
              message: "success",
              duration: 4500
            })
            .present();
    })
    this.navCtrl.setRoot(AuthPage)
  }
  cancel(){
    this.navCtrl.setRoot(AuthPage)
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SetNewPasswordPage');
  }

}
