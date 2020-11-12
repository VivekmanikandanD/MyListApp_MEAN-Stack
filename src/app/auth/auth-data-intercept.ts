import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthDataService } from "./auth-data.service";

@Injectable()

export class AuthDataInterceptor implements HttpInterceptor {
  constructor(private authDataService: AuthDataService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authDataService.getToken();
    const transFormedRequest = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + authToken)
    });
    return next.handle(transFormedRequest);
  }
}
