import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private _AuthService: AuthService, private _Router: Router, private spinner: NgxSpinnerService) { }
  isLogin: boolean = false;
  token: object = {};
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
    this.token = {
      "token": localStorage.getItem("usertoken")
    }
    this._AuthService.logOut(this.token).subscribe((response) => {
      this._Router.navigate(["/login"]);
      localStorage.removeItem("userToken");
      this.spinner.hide();
    })
  }

}
