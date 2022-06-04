import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private _AuthService: AuthService, private _Router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }
  isLogin: boolean = false;
  error: string = "";

  ngOnInit(): void {
    this._AuthService.userData.subscribe(() => {
      if (this._AuthService.userData.getValue() != null) {
        this.isLogin = true;
      }
      else {
        this.isLogin = false;
      }
    })
  }

  logOut() {
    this.spinner.show();
    let{_id}:any= this._AuthService.userData.value;
    let token:any = localStorage.getItem("userToken")
    this._AuthService.logOut(_id,token).subscribe((response) => {
      if (response.message == "done") {
        localStorage.removeItem("userToken");
        this._AuthService.userData.next(null)
        this.spinner.hide();
        this.toastr.success('Logedout successfully', "", { positionClass: 'toast-bottom-right', timeOut: 1000 });
        this._Router.navigate(["/login"]);
      }
      else {
        this.error = response.message;
        this.spinner.hide();
        this.toastr.error(`${this.error}!`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
      }
    },
    (error:any)=>{     
      this.spinner.hide();
      this.error = 'Faild to logout'
      this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
    
    })
  }

}
