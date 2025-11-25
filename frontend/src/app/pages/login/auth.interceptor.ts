import { Injectable } from "@angular/core";
import { LoginService } from "./login.service";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: LoginService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } 
        if (err.status === 403) {
          debugger
          this.router.navigate(['/notfound']);
        }
        return throwError(err);
      })
    );
  }
}