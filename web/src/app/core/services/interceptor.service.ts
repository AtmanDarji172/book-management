import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { AuthService } from './auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private _authService: AuthService,
    private _loader: NgxUiLoaderService,
    private _toastrService: ToastrService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let newReq = req.clone();
    let token = sessionStorage.getItem('token');

    this._loader.start();

    if (token) {
      newReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    }
    return next.handle(newReq)
      .pipe(
        catchError((error) => {
          // Catch "401 Unauthorized" responses
          if (error instanceof HttpErrorResponse && error.status === 401) {
            // Sign out
            this._toastrService.info('Please sign-in again.');
            this._authService.logout();
          }

          return throwError(() => error);
        }),
        finalize(() => {
          this._loader.stop();
        })
      );

  }
}
