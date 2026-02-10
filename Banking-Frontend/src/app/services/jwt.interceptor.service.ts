import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class JwtInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    
    console.log('JwtInterceptor: Token exists?', !!token);
    console.log('JwtInterceptor: Request URL:', req.url);

    if (token) {
      console.log('JwtInterceptor: Adding Authorization header');
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }

    console.warn('JwtInterceptor: No token found! User may not be authenticated.');
    return next.handle(req);
  }
}
