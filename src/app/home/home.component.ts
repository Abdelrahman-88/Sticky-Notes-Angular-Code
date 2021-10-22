import { NotesService } from './../notes.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  change: string = "add";
  data: Object = {};
  deleteInfo: Object = {};
  updateInfo: Object = {};
  id: any;
  token: any;
  title: any;
  desc: any;
  noteID: any;
  notes: any[] = [];
  constructor(private _AuthService: AuthService, private _NotesService: NotesService, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.id = this._AuthService.userData.value;
    this.token = localStorage.getItem("userToken");
    this.spinner.show();
    this.getData();
  }

  sendData() {
    this.toastr.success('Success!', "",{positionClass:'toast-bottom-right',timeOut: 1000});
    this.spinner.show();
    this.data = {
      "title": this.title,
      "desc": this.desc,
      "userID": this.id._id,
      "token": this.token
    }

    this._NotesService.addNote(this.data).subscribe((response) => {
      console.log(response)
      if (response.message == "success") {
        this.getData();
      }
    })
  }

  getData() {
    this.spinner.show();
    this._NotesService.getNote(this.id._id, this.token).subscribe((response) => {
      if(response.message == 'success'){
        this.notes = response.Notes;
        this.spinner.hide();
      }
      else{
        this.spinner.hide();
      }
    })
  }

  getNoteID(noteId: any) {
    this.noteID = noteId
    this.change = "delete"
  }

  changeToAdd() {
    this.change = "add";
    this.title = "";
    this.desc = "";
  }

  deleteData() {
    this.toastr.error('Deleted!', "",{positionClass:'toast-bottom-right',timeOut: 1000});
    this.spinner.show();
    this.deleteInfo = {
      "NoteID": this.noteID,
      "token": this.token
    }
    this._NotesService.deleteNote(this.deleteInfo).subscribe((response) => {
      if (response.message == 'deleted') {
        this.getData();
      }
    })
  }

  getUpdateData(e: any) {
    this.change = "update";
    this.title = e.title;
    this.desc = e.desc;
    this.noteID = e._id
  }

  updateData() {
    this.toastr.info('Updated!', "",{positionClass:'toast-bottom-right',timeOut: 1000});
    this.spinner.show();
    this.updateInfo = {
      "title": this.title,
      "desc": this.desc,
      "NoteID": this.noteID,
      "token": this.token
    }
    this._NotesService.updateNote(this.updateInfo).subscribe((response) => {
      if (response.message == "updated") {
        this.getData();
      }
    })
  }
}
