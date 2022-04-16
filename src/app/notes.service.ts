import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  Url ='https://sticky-notes-project.herokuapp.com/'
  // Url ='http://localhost:3000/'


  constructor(private _HttpClient:HttpClient) { }

  addNote(body:Object,userId:any,token:any):Observable<any>{
    const headers = { 'Authorization': `Bearer ${token}` };
    return this._HttpClient.post(`${this.Url}addNote/${userId}`,body,{headers})
  }

  getNote(userId:any,token:any,search:any,page:any):Observable<any>{
    const headers = { 'Authorization': `Bearer ${token}` };
    return this._HttpClient.get(`${this.Url}getUserNotes/${userId}?search=${search}&page=${page}`,{headers})
  }

  deleteNote(noteId:any,token:any):Observable<any>{
    const headers = { 'Authorization': `Bearer ${token}` };
    return this._HttpClient.delete(`${this.Url}deleteNote/${noteId}`,{headers})
  }

  updateNote(noteId:any,token:any,body:object):Observable<any>{
    const headers = { 'Authorization': `Bearer ${token}` };
    return this._HttpClient.put(`${this.Url}updateNote/${noteId}`,body,{headers})    
  }
}
