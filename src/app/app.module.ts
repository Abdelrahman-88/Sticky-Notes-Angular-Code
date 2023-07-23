import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { UserComponent } from './user/user.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { ParticlesModule } from 'ngx-particle';
import { SearchPipe } from './search.pipe';
import { VerifyComponent } from './verify/verify.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ResetComponent } from './reset/reset.component';
import { UpdatepasswordComponent } from './updatepassword/updatepassword.component';
import { UpdateprofileComponent } from './updateprofile/updateprofile.component';
import { UpdateemailComponent } from './updateemail/updateemail.component';
import { PayComponent } from './pay/pay.component';
import { HistoryComponent } from './history/history.component';
import { DatePipe } from './date.pipe';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

// import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login@1.2.3';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NotfoundComponent,
    NavbarComponent,
    UserComponent,
    SearchPipe,
    VerifyComponent,
    ForgetpasswordComponent,
    ChangepasswordComponent,
    ResetComponent,
    UpdatepasswordComponent,
    UpdateprofileComponent,
    UpdateemailComponent,
    PayComponent,
    HistoryComponent,
    DatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    CommonModule,
    ToastrModule.forRoot(),
    ParticlesModule,
    SocialLoginModule
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            '399326150368-ho7revtu3kamve9rjdfidi5brvmesa57.apps.googleusercontent.com'
          )
        }
      ],
      onError: (err) => {
        console.error(err);
      }
    } as SocialAuthServiceConfig,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
