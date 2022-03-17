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
  error: string = "";
  terms: string = "";
  change: string = "add";
  data: Object = {};
  id: any;
  token: any;
  title: any;
  content: any;
  noteID: any;
  notes: any[] = [];
  totalPages: number = 1;
  visablePages: any[] = [];
  currentPage: number = 1;
  lastPageLength:number = 0;
  spin:boolean = false

  addForm: FormGroup = new FormGroup({
    "title": new FormControl(null, [Validators.required, Validators.pattern(/^[0-9a-zA-Z ]+$/)]),
    "content": new FormControl(null, [Validators.required, Validators.pattern(/^[0-9a-zA-Z\s\r\n]+$/)])
  })

  updateForm: FormGroup = new FormGroup({
    "title": new FormControl(null, [Validators.required, Validators.pattern(/^[0-9a-zA-Z ]+$/)]),
    "content": new FormControl(null, [Validators.required, Validators.pattern(/^[0-9a-zA-Z\s\r\n]+$/)])
  })

  searchForm: FormGroup = new FormGroup({
    "term": new FormControl(null, [Validators.pattern(/^[0-9a-zA-Z ]+$/)])
  })


  constructor(private _AuthService: AuthService, private _NotesService: NotesService, private spinner: NgxSpinnerService, private toastr: ToastrService, private _Router: Router) { }

  ngOnInit(): void {

    this.id = this._AuthService.userData.value;
    this.token = localStorage.getItem("userToken");
    this.spinner.show();
    // if(sessionStorage.getItem("currentPage")!=null){
    //   this.currentPage=Number(sessionStorage.getItem("currentPage"));
    // }
    this.getData(this.currentPage);
  }

  search(searchForm: FormGroup) {
    if (searchForm.valid) {
      this.spin = true
      this.terms = searchForm.controls.term.value;
      this.getData(1)
    }
    else {
      this.toastr.error(`Error invalid input!`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
    }

  }

  sendData(addForm: FormGroup) {
    if (addForm.valid) {
      this.spinner.show();

      this._NotesService.addNote(addForm.value,this.id._id,this.token).subscribe((response) => {
        if (response.message == "done") {
          this.getData(this.currentPage)
          this.toastr.success('Success!', "", { positionClass: 'toast-bottom-right', timeOut: 1000 });
        }
      },
      (error:any)=>{
        this.spinner.hide();
        this.error = error.error.message;
        this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
      })
    }
    else if (addForm.get('title')?.errors?.pattern || addForm.get('content')?.errors?.pattern) {
      this.toastr.error(`Error invalid input!`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
    }
    else {
      this.toastr.error(`All inputs required!`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
    }
  }

  getData(page:number) {
    this.currentPage = page;
    // this.spinner.show();
    this._NotesService.getNote(this.id._id, this.token,this.terms,page).subscribe((response) => {
      if (response.message == 'done') {
        this.notes = response.data;
        this.totalPages = response.totalPages;        
        this.lastPageLength = response.total % response.limit
        this.setPages();
        this.spin = false
        this.spinner.hide();
      }
      else if (response.message == 'No notes found') {
        this.notes = [];
        this.spin = false
        this.spinner.hide();
      }
      else {
        this.spinner.hide();
        this.spin = false
        localStorage.removeItem("userToken");
        this._Router.navigate(["/login"]);
      }
    },
    (error:any)=>{
      if (error.error.message == 'No notes found') {
        this.notes = [];
      }
      this.spinner.hide();
      this.spin = false
      this.error = error.error.message;
      this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});})
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
    this.spinner.show();
    this._NotesService.deleteNote(this.noteID,this.token).subscribe((response) => {
      if (response.message == 'done') {
        if (this.lastPageLength == 1 && this.totalPages > 1) {
          this.currentPage--
        }
        this.getData(this.currentPage);
        this.toastr.error('Deleted!', "", { positionClass: 'toast-bottom-right', timeOut: 1000 });
      }
    },
    (error:any)=>{
      this.spinner.hide();
      this.error = error.error.message;
      this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
    })
  }

  getUpdateData(note: any) {
    this.change = "update";
    this.updateForm.controls.title.setValue(note.title);
    this.updateForm.controls.content.setValue(note.content);
    this.noteID = note._id
  }

  updateData(updateForm: FormGroup) {
    if (updateForm.valid) {
      this.spinner.show();

      this._NotesService.updateNote(this.noteID,this.token,updateForm.value).subscribe((response) => {
        if (response.message == "done") {
          this.toastr.info('Updated!', "", { positionClass: 'toast-bottom-right', timeOut: 1000 });
          this.getData(this.currentPage);
        }
      },
      (error:any)=>{
        this.spinner.hide();
        this.error = error.error.message;
        this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});      })
    }
    else if (updateForm.get('title')?.errors?.pattern || updateForm.get('content')?.errors?.pattern) {
      this.toastr.error(`Error invalid input!`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
    }
    else {
      this.toastr.error(`All inputs required!`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
    }
  }


  
  setPages() {
    if (this.currentPage == 1) {
      if (this.totalPages == 1) {
        this.visablePages = [this.totalPages];
      }
      else if (this.totalPages == 2) {
        this.visablePages = [this.totalPages-1, this.totalPages];
      }
      else {
        this.visablePages = [1, 2, 3];
      }
    }else if(this.currentPage > 1 && this.currentPage <= this.totalPages-2){
      this.visablePages = [this.currentPage, this.currentPage+1, this.currentPage+2];
    }else if(this.currentPage > 1 && this.currentPage == this.totalPages-1){
      this.visablePages = [this.currentPage-1, this.currentPage, this.currentPage+1];
    }else if(this.currentPage > 2 && this.currentPage == this.totalPages){
      this.visablePages = [this.currentPage-2, this.currentPage-1, this.currentPage];
    }
  }

  changePage(term: any) {
    if (term == "next" && this.visablePages.includes(this.totalPages) == false) {
      this.visablePages.forEach((part, index) => { this.visablePages[index]++ });
      this.spinner.show();
      this.getData(this.currentPage + 1);
    }
    else if (term == "prev" && this.visablePages[0] > 1) {
      this.visablePages.forEach((part, index) => { this.visablePages[index]-- })
      this.spinner.show();
      this.getData(this.currentPage - 1);
    }
    else if (term == "prev" && this.currentPage > 1) {
      this.spinner.show();
      this.getData(this.currentPage - 1);
    }
    else if (term == "next" && this.currentPage < this.totalPages) {
      this.spinner.show();
      this.getData(this.currentPage + 1);
    }
    // sessionStorage.setItem("currentPage",JSON.stringify(this.currentPage));
  }

  getCurrentPage(page: number) {
    this.currentPage = page;
    this.spinner.show();
    this.getData(page);
    // sessionStorage.setItem("currentPage",JSON.stringify(this.currentPage));
  }

  getLastPage(term: string) {
    if (term == "last") {
      if (this.totalPages == 1) {
        this.visablePages = [1];
      }
      else if (this.totalPages == 2) {
        this.visablePages = [1, 2];
      }
      else {
        this.visablePages = [this.totalPages - 2, this.totalPages - 1, this.totalPages];
      }
      this.spinner.show();
      this.getData(this.totalPages);
    }
    else if (term == "first") {
      if (this.totalPages == 1) {
        this.visablePages = [1];
      }
      else if (this.totalPages == 2) {
        this.visablePages = [1, 2];
      }
      else {
        this.visablePages = [1, 2, 3];
      }
      this.spinner.show();
      this.getData(1);
    }
    // sessionStorage.setItem("currentPage",JSON.stringify(this.currentPage));
  }

}
