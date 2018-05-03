import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerSupportPage } from './customer-support';

@NgModule({
  declarations: [
    CustomerSupportPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerSupportPage),
  ],
})
export class CustomerSupportPageModule {}
