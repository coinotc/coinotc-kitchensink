import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiServiceProvider } from '../api-service/api-service'
import { Observable} from 'rxjs/Rx';
import { banner } from '../../models/banner-control';
/*
  Generated class for the BannerControlProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BannerControlProvider {
  
  constructor(public http: HttpClient,
  public apiService:ApiServiceProvider
  ) {
    console.log('Hello BannerControlProvider Provider');
  }
  public getBanner():Observable<banner>{
    let url = '/banner';
    return this.apiService.get(url);
  }
}
