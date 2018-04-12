import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { advertisement } from '../../models/advertisement';
import { ApiServiceProvider } from '../api-service/api-service';
import { Observable } from 'rxjs/Rx';
import { observableToBeFn } from 'rxjs/testing/TestScheduler';

/*
  Generated class for the AdvertisementServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class AdvertisementServiceProvider {
  private advertisement = '/advertisement';
  constructor(public apiService: ApiServiceProvider) {
    console.log('Hello AdvertisementServiceProvider Provider');
  }

  public getadvertisement(crypto, country, fiat, type): Observable<advertisement[]> {
    let url = `${this.advertisement}?crypto=${crypto}&type=${type}&country=${country}&fiat=${fiat}`;
    return this.apiService.get(url);
  }

  public getadvertisementvisible(id) {
    let url = `${this.advertisement}/${id}`
    return this.apiService.get(url);
  }

  public addadvertisement(information) {
    return this.apiService.post(this.advertisement, information);
  }

  public getMyadvertisement(username, type): Observable<advertisement[]> {
    let URL =
      this.advertisement + `/myadvertisement?owner=${username}&visible=${type}`;
    return this.apiService.get(URL);
  }

  public getMyEditAdvertisement(id): Observable<advertisement[]> {
    let URL =
      this.advertisement + `/editAdvertisement?id=${id}`;
    return this.apiService.get(URL);
  }

  public changeVisible(id, visible) {
    let URL =
      this.advertisement + `?_id=${id}`;
    return this.apiService.patch(URL, { visible: visible });
  }

  public deleteSatatus(id) {
    let URL =
      this.advertisement + `/deleteStatuts/`;
    return this.apiService.patch(URL, { _id: id });
  }

  public editAdvertisement(info) {
    let URL =
      this.advertisement + `/editAdvertisement/`;
    return this.apiService.put(URL, info);
  }

  public getprice(type, fiat) {
    let url = `/advertisement/getprice?type=${type}&fiat=${fiat}`;
    return this.apiService.get(url);
  }
}
