import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
token:string='';
error: string = "";


  constructor(private _AuthService: AuthService, private _Router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService, private _ActivatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.spinner.show();
    this.token = this._ActivatedRoute.snapshot.params.token;
    this.verifyEmail()
  }
  verifyEmail(){
    this._AuthService.verify(this.token).subscribe((response)=>{
      
    if (response.message == "Email verified successfully") {
      this.spinner.hide();
      this.toastr.success('Email verified successfully', "",{positionClass:'toast-bottom-right',timeOut: 5000});
      this._Router.navigate(["/login"]);
    }
    else {
      this.spinner.hide();
      this.error = response.message;
      this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
      this._Router.navigate(["/login"]);
    }
  },
  (error:any)=>{     
    this.spinner.hide();
    this.error = 'Faild to verify email'
    this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
    this._Router.navigate(["/login"]);
  })
  }
}
