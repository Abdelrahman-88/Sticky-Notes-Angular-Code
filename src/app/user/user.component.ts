import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userData:any;
  constructor(private _AuthService:AuthService) { }

  ngOnInit(): void {
    this.userData = this._AuthService.userData.value;
  }

}
