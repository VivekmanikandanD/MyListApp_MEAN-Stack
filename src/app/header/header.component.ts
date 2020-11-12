import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthDataService } from "../auth/auth-data.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  authSub:Subscription;
  constructor(private authDataService: AuthDataService) { }
  ngOnInit() {
    this.authSub=this.authDataService.getAuthStatusListener().subscribe(result => {
      this.isLoggedIn = result;
    });
    this.isLoggedIn = this.authDataService.getLoggedInStatus();
  }

  onLogout() {
    this.authDataService.logout();
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

}
