import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userData:any;
  error: string = "";

  constructor(private _AuthService:AuthService, private _Router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
  this._AuthService.userData.subscribe((res:any)=>{ this.userData=res});   
  }

  updateEmail(){
    this._Router.navigate(["/updateemail"]);
  }

  updatePassword(){
    this._Router.navigate(["/updatepassword"]);
  }

  updateProfile(){
    this._Router.navigate(["/updateprofile"]);
  }

  subscribe(){
    this._Router.navigate(["/pay"]);
  }

  history(){
    this._Router.navigate(["/history"]);
  }

  deactivateProfile(){
    let{_id}:any= this._AuthService.userData.value;
    let token:any = localStorage.getItem("userToken")
    this.spinner.show();
    this._AuthService.deactivateProfile(_id,token).subscribe((response) => {

      if (response.message == "done") {
        localStorage.removeItem("userToken");
        this._AuthService.userData.next(null)
        this.spinner.hide();
        this.toastr.success('Profile deactivated successfully', "", { positionClass: 'toast-bottom-right', timeOut: 1000 });
        this._Router.navigate(["/register"]);

      }
      else {
        this.error = response.message;
        this.spinner.hide();
        this.toastr.error(`${this.error}!`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
      }
    },
    (error:any)=>{     
      this.spinner.hide();
      this.error = error.error.message;
      this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
    })
  }

}
