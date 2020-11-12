import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { AppRoutingModule } from './app-routing.module';
import { AuthDataInterceptor } from "./auth/auth-data-intercept";
import { ErrorInterceptor } from "./error-interceptor";
import { ErrorDialogComponent } from "./error/error-dialog.component";
import { AngularMaterialModule } from "./angular-material.module";
import { PostsModule } from "./posts/post.module";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularMaterialModule,
    PostsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthDataInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorDialogComponent]

})
export class AppModule { }
