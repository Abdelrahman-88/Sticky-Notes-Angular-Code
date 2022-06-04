import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-updateemail',
  templateUrl: './updateemail.component.html',
  styleUrls: ['./updateemail.component.scss']
})
export class UpdateemailComponent implements OnInit {

  myStyle: object = {};
	myParams: any = {};
	width: number = 100;
	height: number = 100;
  error: string = "";
  userData:any

  updateEmailForm: FormGroup = new FormGroup({
    "email": new FormControl(null, [Validators.email, Validators.required])
  })

  constructor(private _AuthService: AuthService, private _Router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    
    this.userData = this._AuthService.userData.value;
    this.updateEmailForm.controls.email.setValue(this.userData.email)
    
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

  submitUpdateEmailForm(updateEmailForm: FormGroup) {    
    let{_id}:any= this._AuthService.userData.value;
    let token:any = localStorage.getItem("userToken")
    this.spinner.show();
    if (updateEmailForm.valid) {
      
      this._AuthService.updateEmail(_id,token,updateEmailForm.value).subscribe((response) => {
        
        if (response.message == "done") {
          localStorage.removeItem("userToken");
          this._AuthService.userData.next(null)
          this.spinner.hide();
          this.toastr.success('Email updated successfully please verify your email and login', "",{positionClass:'toast-bottom-right',timeOut: 5000});
          this._Router.navigate(["/login"]);
        }
        else {
          this.spinner.hide();
          this.error = response.message;
          this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }
      },
      (error:any)=>{     
        this.spinner.hide();
        this.error = 'Faild to update email'
        this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
      })
    }else{
      this.spinner.hide();
        this.error = "Invalid inputs";
        this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
    }
  }

  cancle(){
    this._Router.navigate(["/user"]);
  }

}
