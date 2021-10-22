import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private _HttpClient:HttpClient) { }

  addNote(addData:Object):Observable<any>{
    return this._HttpClient.post("https://route-egypt-api.herokuapp.com/addNote",addData)
  }

  getNote(id:any,token:any):Observable<any>{
    let headerData = new HttpHeaders({
        "Token":token,
        "userID":id
      });
    
    return this._HttpClient.get("https://route-egypt-api.herokuapp.com/getUserNotes",{headers:headerData})
  }

  deleteNote(deleteData:any):Observable<any>{
    let options = {
      body:{
        NoteID:deleteData.NoteID,
        token:deleteData.token
      }
    }
    return this._HttpClient.delete("https://route-egypt-api.herokuapp.com/deleteNote",options)
  }

  updateNote(updateData:Object):Observable<any>{
    return this._HttpClient.put("https://route-egypt-api.herokuapp.com/updateNote",updateData)
    
  }
}
