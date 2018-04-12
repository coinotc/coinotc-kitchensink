import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiServiceProvider } from '../api-service/api-service';
import { Observable } from 'rxjs/Rx';
import { OrderInformation } from '../../models/orderInformation';
import { environment } from '../../../environments/environment';

/*
  Generated class for the OrderServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class OrderServiceProvider {
  private orderURL = '/order';

  constructor(public apiService: ApiServiceProvider) {
    console.log('Hello OrderServiceProvider Provider');
  }

  public getAlertInformation(fiat, crypto) {
    let getURL = `${this.orderURL}/alert?fiat=${fiat}&crypto=${crypto}`;
    console.log(getURL);
    return this.apiService.get(getURL);
  }

  public getOrders(username, finished) {
    let getURL = `${
      this.orderURL
    }/filter?username=${username}&finished=${finished}`;
    return this.apiService.get(getURL);
  }
  public getMyTrade(currentUser){
    let getURL = `${
      this.orderURL
    }/myTrade?currentUser=${currentUser}`;
    return this.apiService.get(getURL);
  }
  public getTradeWithHim(currentUser,profileUser){
    let getURL = `${
      this.orderURL
    }/tradeWithHim?currentUser=${currentUser}&profileUser=${profileUser}`;
    return this.apiService.get(getURL);
  }
  public getBuyerOrders(username, finished) : Observable<OrderInformation[]> {
    let getURL = `${
      this.orderURL
    }/buyer?username=${username}&finished=${finished}`;
    return this.apiService.get(getURL);
  }

  public getSellerOrders(username, finished) : Observable<OrderInformation[]>{
    let getURL = `${
      this.orderURL
    }/seller?username=${username}&finished=${finished}`;
    return this.apiService.get(getURL);
  }

  public getSpecificOrder(id) : Observable<OrderInformation>{
    let getURL = `${this.orderURL}/getone?_id=${id}`;
    return this.apiService.get(getURL);
  }

  public addRoomKey(roomkey, orderId) {
    let URL = `${this.orderURL}/roomkey?orderId=${orderId}`;
    return this.apiService.patch(URL, { roomkey: roomkey });
  }

  public updateOrder(order) {
    return this.apiService.put(this.orderURL, order);
  }

  public postorder(order) {
    return this.apiService.post(this.orderURL, order);
  }
}
