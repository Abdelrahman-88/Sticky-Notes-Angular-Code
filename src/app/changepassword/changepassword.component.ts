import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  myStyle: object = {};
	myParams: any = {};
	width: number = 100;
	height: number = 100;
  error: string = "";

  changePasswordForm: FormGroup = new FormGroup({
    "newPassword": new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]),
    "cNewPassword":new FormControl(null, [Validators.required])
  })

  constructor(private _AuthService: AuthService, private _Router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
 
    this.myStyle = {
      'position': 'fixed',
      'width': '100%',
      'height': '100%',
      'z-index': -1,
      'top': 0,
      'left': 0,
      'right': 0,
      'bottom': 0,
    };

    this.myParams = {
      "particles": {
        "number": {
          "value": 80,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ffdf4a"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          },
          "image": {
            "src": "img/github.svg",
            "width": 100,
            "height": 100
          }
        },
        "opacity": {
          "value": 0.5,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ffdf4a",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 6,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "repulse"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 400,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    }

  }

  submitChangePasswordForm(changePasswordForm: FormGroup) {    
    let{_id}:any= this._AuthService.changeData.value;
    let token:any = localStorage.getItem("changeToken")
    this.spinner.show();
    if (changePasswordForm.valid && changePasswordForm.get('cNewPassword')?.value===changePasswordForm.get('newPassword')?.value) {
      this._AuthService.changePassword(_id,token,changePasswordForm.value).subscribe((response) => {
        
        if (response.message == "done") {
          this.spinner.hide();
          this.toastr.success('Password changed successfully', "",{positionClass:'toast-bottom-right',timeOut: 5000});
          this.cancle()
        }
        else {
          this.spinner.hide();
          this.error = response.message;
          this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
          this.cancle()
        }
      },
      (error:any)=>{     
        this.spinner.hide();
        this.error = 'Faild to change password'
        this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        this.cancle()
      })
    }else{
      this.spinner.hide();
        this.error = "Invalid inputs";
        this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        this.cancle()
    }
  }

  cancle(){
    localStorage.removeItem("changeToken");
    this._AuthService.changeData.next(null)
    this._Router.navigate(["/login"]);
  }

}
