import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ChangeGuard } from './change.guard';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { HomeComponent } from './home/home.component';
import { LoginGuard } from './login.guard';
import { LoginComponent } from './login/login.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { RegisterComponent } from './register/register.component';
import { ResetComponent } from './reset/reset.component';
import { UpdateemailComponent } from './updateemail/updateemail.component';
import { UpdatepasswordComponent } from './updatepassword/updatepassword.component';
import { UpdateprofileComponent } from './updateprofile/updateprofile.component';
import { UserComponent } from './user/user.component';
import { VerifyComponent } from './verify/verify.component';

const routes: Routes = [
  {path:"" , redirectTo:"home" , pathMatch:"full"},
  {path:"home", canActivate:[AuthGuard] , component:HomeComponent},
  {path:"user", canActivate:[AuthGuard] , component:UserComponent},
  {path:"login", canActivate:[LoginGuard] , component:LoginComponent},
  {path:"forgetpassword", canActivate:[LoginGuard] , component:ForgetpasswordComponent},
  {path:"changepassword" , canActivate:[ChangeGuard] , component:ChangepasswordComponent},
  {path:"updateemail" , canActivate:[AuthGuard], component:UpdateemailComponent},
  {path:"updatepassword" , canActivate:[AuthGuard], component:UpdatepasswordComponent},
  {path:"updateprofile" , canActivate:[AuthGuard], component:UpdateprofileComponent},
  {path:"register", canActivate:[LoginGuard] , component:RegisterComponent},
  {path:"verify/:token", canActivate:[LoginGuard] , component:VerifyComponent},
  {path:"reset/:token", canActivate:[LoginGuard] , component:ResetComponent},
  {path:"**" , component:NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
