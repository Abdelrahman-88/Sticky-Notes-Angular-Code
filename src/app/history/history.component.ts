import { Component, OnInit } from '@angular/core';
import { PaymentService } from './../payment.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  error: string = "";
  payments: any[] = [];
  totalPages: number = 1;
  visablePages: any[] = [];
  currentPage: number = 1;
  lastPageLength:number = 0;

  constructor(private _AuthService: AuthService,private _PaymentService:PaymentService,private _Router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getPayment(this.currentPage);
  }

  getPayment(page:number){
    this.currentPage = page;
    this.spinner.show();
    let{_id}:any= this._AuthService.userData.value;
    let token:any = localStorage.getItem("userToken")
    this._PaymentService.userPayment(_id,token,page).subscribe((response)=>{
      if (response.message == "done") {
        this.payments = response.data;
        this.totalPages = response.totalPages;        
        this.lastPageLength = response.total % response.limit
        this.setPages();
        this.spinner.hide();
      }
      else {
        this.error = response.message;
        this.spinner.hide();
        this.toastr.error(`${this.error}!`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
      }
    },
    (error:any)=>{           
      this.spinner.hide();
      this.error = 'Faild to get payment'
      this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
    })
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
    console.log(this.currentPage);

    if (term == "next" && this.visablePages.includes(this.totalPages) == false) {
      this.visablePages.forEach((part, index) => { this.visablePages[index]++ });
      this.spinner.show();
      this.getPayment(this.currentPage + 1);
    }
    else if (term == "prev" && this.visablePages[0] > 1) {
      this.visablePages.forEach((part, index) => { this.visablePages[index]-- })
      this.spinner.show();
      this.getPayment(this.currentPage - 1);
    }
    else if (term == "prev" && this.currentPage > 1) {
      
      this.spinner.show();
      this.getPayment(this.currentPage - 1);
    }
    else if (term == "next" && this.currentPage < this.totalPages) {
      this.spinner.show();
      this.getPayment(this.currentPage + 1);
    }
  }

  getCurrentPage(page: number) {
    this.currentPage = page;
    this.spinner.show();
    this.getPayment(page);
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
      this.getPayment(this.totalPages);
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
      this.getPayment(1);
    }
  }
}
