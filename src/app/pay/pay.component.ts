import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { PaymentService } from './../payment.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit {
  paymentHandler: any = null;
  publishablekey='pk_test_51Kmc0VCPi0L7F9JFZ1XZEIMG6wpWIZM17aW7djh6Ku3YDOt7xbafphoDB7opfAWB1mF7VAOHnqn2F7WJGRaey8wL00t8mrJ9kt'

  constructor(private _AuthService: AuthService,private _PaymentService:PaymentService,private _Router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.invokeStripe();
  }

  makePayment() {
    let amount = 15;
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: this.publishablekey,
      locale: 'auto',
      token: function (stripeToken: any) {
        paymentstripe(stripeToken);
      },
    });

    const paymentstripe = (stripeToken: any) => {
      this.spinner.show();
      let{_id}:any= this._AuthService.userData.value;
      let token:any = localStorage.getItem("userToken")
      let body = {token:stripeToken}
      this._PaymentService.cardPayment(body,_id,token).subscribe((data: any) => {
        if (data.message === "done") {
          localStorage.setItem("userToken", data.token);
          this._AuthService.saveUserData();
          this.spinner.hide();
          this.toastr.success('Your Payment is complete successfully', "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
          this._Router.navigate(["/user"]);
        }
        else {
          this.spinner.hide();
          this.toastr.error(`Some Error is taken place inside the payment!`, "", { positionClass: 'toast-bottom-right', timeOut: 5000 });
        }
      },
      (error:any)=>{     
        this.spinner.hide();        
        this.toastr.error(`Some Error is taken place inside the payment!`, "",{positionClass:'toast-bottom-right',timeOut: 5000});
      });
    };
    paymentHandler.open({
      name: 'Test payment',
      description: 'Test card 4242 4242 4242 4242',
      amount: amount * 100,
    });
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: this.publishablekey,
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
          },
        });
      };

      window.document.body.appendChild(script);
    }
  }
}
