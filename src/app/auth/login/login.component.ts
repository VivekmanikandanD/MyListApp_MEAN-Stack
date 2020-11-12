import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthDataService } from '../auth-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {

  isLoading = false;
  authStatusSub:Subscription;
  constructor(public authDataService:AuthDataService) { }

  ngOnInit() {
    this.authStatusSub = this.authDataService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = authStatus;
    });
  }

  onLogin(loginForm: NgForm){
    if(loginForm.invalid) {
      return;
    }
    this.authDataService.login(loginForm.value.email,loginForm.value.password);
  }

   ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
