import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  Url ='https://sticky-notes-project.herokuapp.com/'
  userData = new BehaviorSubject(null);
  changeData = new BehaviorSubject(null);

  constructor(private _HttpClient:HttpClient,private _Router:Router) { 
    if(localStorage.getItem("userToken") != null){      
      this.saveUserData();
    }
  }

  register(body:object):Observable<any>{
    return this._HttpClient.post(`${this.Url}signUp`,body)
  }

  verify(token:any):Observable<any>{
    return this._HttpClient.get(`${this.Url}userActivate/${token}`)
  }

  reset(token:any):Observable<any>{
    return this._HttpClient.get(`${this.Url}resetEmail/${token}`)
  }

  changePassword(id:any,token:any,body:object):Observable<any>{
    const headers = { 'Authorization': `Bearer ${token}` };
    return this._HttpClient.patch(`${this.Url}resetPassword/${id}`,body,{headers})
  }

  updateEmail(id:any,token:any,body:object):Observable<any>{
    const headers = { 'Authorization': `Bearer ${token}` };
    return this._HttpClient.patch(`${this.Url}updateEmail/${id}`,body,{headers})
  }

  updatePassword(id:any,token:any,body:object):Observable<any>{
    const headers = { 'Authorization': `Bearer ${token}` };
    return this._HttpClient.patch(`${this.Url}updatePassword/${id}`,body,{headers})
  }

  updateProfile(id:any,token:any,body:object):Observable<any>{
    const headers = { 'Authorization': `Bearer ${token}` };
    return this._HttpClient.put(`${this.Url}updateProfile/${id}`,body,{headers})
  }

  login(body:object):Observable<any>{
    return this._HttpClient.post(`${this.Url}signIn`,body)
  }

  googleLogin(body:object):Observable<any>{
    return this._HttpClient.post(`${this.Url}googleLogin`,body)
  }

  forgetPassword(body:object):Observable<any>{
    return this._HttpClient.post(`${this.Url}forgetPassword`,body)
  }

  deactivateProfile(id:any,token:any):Observable<any>{
    const headers = { 'Authorization': `Bearer ${token}` };
    return this._HttpClient.patch(`${this.Url}deactivateUser/${id}`,"",{headers})
  }

  saveUserData(){
    let codedUserData = JSON.stringify(localStorage.getItem("userToken"));
    try {
      this.userData.next(jwtDecode(codedUserData));
    } catch (error) {      
      localStorage.removeItem("userToken");
      this._Router.navigate(["/login"]);
    }
  }

  saveChangeData(){
    let codedChangeData = JSON.stringify(localStorage.getItem("changeToken"));
    try {
      this.changeData.next(jwtDecode(codedChangeData));
    } catch (error) {      
      localStorage.removeItem("changeToken");
      this._Router.navigate(["/login"]);
    }
  }

  logOut(id:any,token:any):Observable<any>{
    const headers = { 'Authorization': `Bearer ${token}` };
    return this._HttpClient.patch(`${this.Url}logOut/${id}`,"",{headers})  }
}
