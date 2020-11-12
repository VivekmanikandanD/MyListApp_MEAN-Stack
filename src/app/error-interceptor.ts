import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorDialogComponent } from "./error/error-dialog.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(public dialog: MatDialog) {

  }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        let errorMsg = "An unknown error occured";
        if (error.error.message) {
          errorMsg = error.error.message;
        }
        this.dialog.open(ErrorDialogComponent, { data: { message: errorMsg } });
        return throwError(error);
      }
      )
    );
  }
}
