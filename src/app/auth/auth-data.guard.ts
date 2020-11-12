import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthDataService } from "./auth-data.service";
@Injectable()
export class AuthDataGuard implements CanActivate {
  constructor(private authDataService:AuthDataService,private router:Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isLoggedIn =this.authDataService.getLoggedInStatus();
    if(!isLoggedIn){
    this.router.navigate(['/auth/login']);
    }
    return isLoggedIn;
  }

}
