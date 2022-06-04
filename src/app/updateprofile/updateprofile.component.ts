import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.component.html',
  styleUrls: ['./updateprofile.component.scss']
})
export class UpdateprofileComponent implements OnInit {

  myStyle: object = {};
	myParams: any = {};
	width: number = 100;
	height: number = 100;
  error: string = "";
  userData:any
  updateProfileForm: FormGroup = new FormGroup({
    "name": new FormControl(null, [Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^[a-z A-Z]+$/)]),
    "location": new FormControl(null, [Validators.pattern(/^[a-zA-Z]+$/)]),
    "phone": new FormControl(null, [Validators.pattern(/^(010|011|012|015)[0-9]{8}$/)])
  })

  constructor(private _AuthService: AuthService, private _Router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    
    this._AuthService.userData.subscribe((res:any)=>{ this.userData=res});   
    this.updateProfileForm.controls.name.setValue(this.userData.name)
    this.updateProfileForm.controls.phone.setValue(this.userData.phone)
    this.updateProfileForm.controls.location.setValue(this.userData.location)
    
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

  submitUpdateProfileForm(updateProfileForm: FormGroup) {    
    let{_id}:any= this._AuthService.userData.value;
    let token:any = localStorage.getItem("userToken")
    this.spinner.show();
    if (updateProfileForm.valid) {
      
      this._AuthService.updateProfile(_id,token,updateProfileForm.value).subscribe((response) => {
        
        if (response.message == "done") {
          localStorage.setItem("userToken", response.token);
          this._AuthService.saveUserData();
          this.spinner.hide();
          this.toastr.success('Profile updated successfully', "",{positionClass:'toast-bottom-right',timeOut: 5000});
          this._Router.navigate(["/user"]);
        }
        else {
          this.spinner.hide();
          this.error = response.message;
          this.toastr.error(`${this.error}!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
        }
      },
      (error:any)=>{     
        this.spinner.hide();
        this.error = 'Faild to update profile'
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
