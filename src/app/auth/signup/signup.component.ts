import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthDataService } from '../auth-data.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading = false;
  authStatusSub:Subscription;
  constructor(private authDataService:AuthDataService) { }

  ngOnInit() {
    this.authStatusSub = this.authDataService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = authStatus;
    });
  }

  onSignup(loginForm: NgForm){
    this.authDataService.createUser(loginForm.value.email,loginForm.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
