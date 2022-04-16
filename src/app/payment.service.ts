import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  Url ='https://sticky-notes-project.herokuapp.com/'
  // Url ='http://localhost:3000/'
  userPayments = new BehaviorSubject(null);


  constructor(private _HttpClient:HttpClient) { }

  cardPayment(body:Object,userId:any,token:any):Observable<any>{    
    const headers = { 'Authorization': `Bearer ${token}` };
    return this._HttpClient.post(`${this.Url}cardPayment/${userId}`,body,{headers})
  }

  userPayment(userId:any,token:any,page:any):Observable<any>{    
    const headers = { 'Authorization': `Bearer ${token}` };
    return this._HttpClient.get(`${this.Url}userPayment/${userId}?page=${page}`,{headers})
  }
}
