import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class CommonInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next
      .handle(
        req.clone({
          withCredentials: true,
        })
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): never {
    throw error.error;
  }
}
