import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthData } from './auth-data-model';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl +"/users/";

@Injectable({
  providedIn: 'root'
})
export class AuthDataService {
  private token: string;
  private clearTimer: any;
  private authStatusListener = new Subject<boolean>();
  private isLoggedIn = false;
  private userId: string;
  constructor(private http: HttpClient, private router: Router) { }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(BACKEND_URL +"/signup", authData).subscribe(response => {
      console.log(response);
      this.router.navigate(['/auth/login']);
    },
    error => {
      this.authStatusListener.next(false);
    });
  }

  login(email: string, password: string) {
    const loginData = { email: email, password: password };
    this.http.post<{ token: string, expiresIn: number,userId: string }>(BACKEND_URL+ "/login", loginData).subscribe(response => {
      const receivedToken = response.token;
      this.token = receivedToken;
      if (this.token) {
        this.isLoggedIn = true;
        this.userId = response.userId;
        const expiresInDuration = response.expiresIn;
        this.authTimer(expiresInDuration);
        const currentDate = new Date();
        const expirationDate = new Date(currentDate.getTime() + expiresInDuration * 1000);
        this.saveAuthData(this.token, expirationDate,this.userId);
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      }
    },
    error => {
      this.authStatusListener.next(false);
    });
  }

  logout() {
    this.deleteAuthData();
    this.token = null;
    this.isLoggedIn = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.clearTimer);
    this.router.navigate(['/']);
  }

  getUserId() {
    return this.userId;
  }

  getToken() {
    return this.token;
  }

  getLoggedInStatus(): boolean {
    return this.isLoggedIn;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  private authTimer(expiresInDuration) {
    console.log(expiresInDuration);
    console.log("auth Timer");
    this.clearTimer = setTimeout(() => {
      this.logout();
    }, expiresInDuration * 1000);
  }

  checkAuthData() {
    const authData = this.getAuthData();
    if (!authData) {
      return;
    }
    const currentDate = new Date();
    const checkExpirationTime = authData.expiresIn.getTime() - currentDate.getTime();
    console.log(checkExpirationTime);
    console.log("checkAuthData");
    if (checkExpirationTime > 0) {
      this.token = authData.token;
      this.isLoggedIn = true;
      this.userId = authData.userId;
      this.authStatusListener.next(true);
      this.authTimer((checkExpirationTime / 1000));
    } else {
      this.logout();
    }
  }

  private saveAuthData(token: string, expiresInDuration: Date,userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiresIn", expiresInDuration.toISOString());
    localStorage.setItem("userId", userId);

  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expiresIn = localStorage.getItem("expiresIn");
    const userId = localStorage.getItem("userId");
    if (!token || !expiresIn) {
      return;
    }
    return {
      token: token,
      expiresIn: new Date(expiresIn),
      userId: userId
    };
  }

  private deleteAuthData() {
    console.log("deleteAuthData");
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("userId");
  }

}
