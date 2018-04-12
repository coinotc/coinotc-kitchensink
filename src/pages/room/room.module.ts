import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoomPage } from './room';
import { TranslateModule } from '@ngx-translate/core';
import { MePageModule } from '../me/me.module';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [RoomPage],
  imports: [
    IonicPageModule.forChild(RoomPage),
    TranslateModule.forChild(),
    MePageModule,
    Ionic2RatingModule
  ]
})
export class RoomPageModule {}
