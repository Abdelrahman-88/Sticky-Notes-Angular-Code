import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData = new BehaviorSubject(null);

  constructor(private _HttpClient:HttpClient,private _Router:Router) { 
    if(localStorage.getItem("userToken") != null){
      this.saveUserData();
    }
  }

  register(formData:object):Observable<any>{
    return this._HttpClient.post("https://route-egypt-api.herokuapp.com/signup",formData)
  }

  login(formData:object):Observable<any>{
    return this._HttpClient.post("https://route-egypt-api.herokuapp.com/signin",formData)
  }

  saveUserData(){
    let codedUserData = JSON.stringify(localStorage.getItem("userToken"));
    this.userData.next(jwtDecode(codedUserData));
  }

  logOut(){
    localStorage.removeItem("userToken");
    this.userData.next(null);
    this._Router.navigate(["/login"]);
  }
}
