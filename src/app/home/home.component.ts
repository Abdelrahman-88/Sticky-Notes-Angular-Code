import { NotesService } from './../notes.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  terms: string = "";
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

  addForm: FormGroup = new FormGroup({
    "title": new FormControl(null, [Validators.required, Validators.pattern(/^((?!(<|>)).)+$/)]),
    "desc": new FormControl(null, [Validators.required, Validators.pattern(/^((?!(<|>)).)+$/)])
  })

  updateForm: FormGroup = new FormGroup({
    "title": new FormControl(null, [Validators.required, Validators.pattern(/^((?!(<|>)).)+$/)]),
    "desc": new FormControl(null, [Validators.required, Validators.pattern(/^((?!(<|>)).)+$/)])
  })

  searchForm: FormGroup = new FormGroup({
    "term": new FormControl(null, [Validators.pattern(/^((?!(<|>)).)+$/)])
  })


  constructor(private _AuthService: AuthService, private _NotesService: NotesService, private spinner: NgxSpinnerService, private toastr: ToastrService, private _Router: Router) { }

  ngOnInit(): void {

    this.id = this._AuthService.userData.value;
    this.token = localStorage.getItem("userToken");
    this.spinner.show();
    this.getData();
  }

  search(searchForm: FormGroup) {
    if (searchForm.valid) {
      this.terms = searchForm.controls.term.value;
    }
    else {
      this.toastr.error(`Error invalid input(<>)!`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
    }

  }

  sendData(addForm: FormGroup) {
    if (addForm.valid) {
      this.toastr.success('Success!', "", { positionClass: 'toast-bottom-right', timeOut: 1000 });
      this.spinner.show();
      this.data = {
        "title": addForm.controls.title.value,
        "desc": addForm.controls.desc.value,
        "userID": this.id._id,
        "token": this.token
      }

      this._NotesService.addNote(this.data).subscribe((response) => {
        if (response.message == "success") {
          this.getData();
        }
      },
      (error:any)=>{
        this.spinner.hide();
      })
    }
    else if (addForm.get('title')?.errors?.pattern || addForm.get('desc')?.errors?.pattern) {
      this.toastr.error(`Error invalid input(<>)!`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
    }
    else {
      this.toastr.error(`All inputs required!`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
    }
  }

  getData() {
    this.spinner.show();
    this._NotesService.getNote(this.id._id, this.token).subscribe((response) => {
      if (response.message == 'success') {
        this.notes = response.Notes;
        this.spinner.hide();
      }
      else if (response.message == 'no notes found') {
        this.notes = [];
        this.spinner.hide();
      }
      else {
        this.spinner.hide();
        localStorage.removeItem("userToken");
        this._Router.navigate(["/login"]);
      }
    },
    (error:any)=>{
      this.spinner.hide();
    })
  }

  getNoteID(noteId: any) {
    this.noteID = noteId
    this.change = "delete"
  }

  changeToAdd() {
    this.change = "add";
    this.addForm.reset();
  }

  deleteData() {
    this.toastr.error('Deleted!', "", { positionClass: 'toast-bottom-right', timeOut: 1000 });
    this.spinner.show();
    this.deleteInfo = {
      "NoteID": this.noteID,
      "token": this.token
    }
    this._NotesService.deleteNote(this.deleteInfo).subscribe((response) => {
      if (response.message == 'deleted') {
        this.getData();
      }
    },
    (error:any)=>{
      this.spinner.hide();
    })
  }

  getUpdateData(e: any) {
    this.change = "update";
    this.updateForm.controls.title.setValue(e.title);
    this.updateForm.controls.desc.setValue(e.desc);
    this.noteID = e._id
  }

  updateData(updateForm: FormGroup) {
    if (updateForm.valid) {
      this.toastr.info('Updated!', "", { positionClass: 'toast-bottom-right', timeOut: 1000 });
      this.spinner.show();
      this.updateInfo = {
        "title": updateForm.controls.title.value,
        "desc": updateForm.controls.desc.value,
        "NoteID": this.noteID,
        "token": this.token
      }
      this._NotesService.updateNote(this.updateInfo).subscribe((response) => {
        if (response.message == "updated") {
          this.getData();
        }
      },
      (error:any)=>{
        this.spinner.hide();
      })
    }
    else if (updateForm.get('title')?.errors?.pattern || updateForm.get('desc')?.errors?.pattern) {
      this.toastr.error(`Error invalid input(<>)!`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
    }
    else {
      this.toastr.error(`All inputs required!`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
    }
  }
}
