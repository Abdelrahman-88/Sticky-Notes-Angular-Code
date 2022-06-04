import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

token:string='';
error: string = "";


  constructor(private _AuthService: AuthService, private _Router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService, private _ActivatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.spinner.show();
    this.token = this._ActivatedRoute.snapshot.params.token;
    this.resetEmail()
  }
  resetEmail(){
    this._AuthService.reset(this.token).subscribe((response)=>{
      
    if (response.message == "Password reseted successfully") {
      localStorage.setItem("changeToken", response.token);
      this._AuthService.saveChangeData();
      this.spinner.hide();
      this.toastr.success('Password reseted successfully', "",{positionClass:'toast-bottom-right',timeOut: 5000});
      this._Router.navigate(["/changepassword"]);
    }
    else {
      this.spinner.hide();
      this.error = response.message;
      this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
      this._Router.navigate(["/forgetpassword"]);
    }
  },
  (error:any)=>{     
    this.spinner.hide();
    this.error = "Faild to reset password"
    this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
    this._Router.navigate(["/forgetpassword"]);
  })
  }

}
