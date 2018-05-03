import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { complain } from '../../models/complain';
import { ApiServiceProvider } from '../api-service/api-service';
import { Observable} from 'rxjs/Rx';
/*
  Generated class for the ComplainServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class ComplainServiceProvider {
  private complainURL = '/complain';
  constructor(public apiService: ApiServiceProvider) {
    console.log('Hello ComplainServiceProvider Provider');
  }
  public sendComplain(complain){
    let URL = `${this.complainURL}/sendComplain`
    return this.apiService.post(URL, complain);
  }
  public getComplains(username) : Observable<complain[]>{
    let url = `${this.complainURL}?username=${username}`;
    return this.apiService.get(url);
  }
  public addRoomKey(roomkey,complainId){
    let URL = `${this.complainURL}/roomkey?complainId=${complainId}`;
    return this.apiService.patch(URL, {roomkey:roomkey});
  }
}
