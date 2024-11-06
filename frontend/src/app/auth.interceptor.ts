import { HttpErrorResponse, HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './services/auth/auth.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from './services/cookie/cookie.service';
import { environment } from '../environments/environment.development';
import { ToastService } from './services/toast/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const cookieService = inject(CookieService);
  const toastService = inject(ToastService);

  let authReq = req

  const token = cookieService.getCookie('access_token');  
  
  if (req.url.startsWith(environment.baseEndpoint)) {
    if(token){
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      })
    }
    
  }
  
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if(req.url.startsWith(environment.baseEndpoint)){
        if (error.status === 401) {
          authService.logout();
          if(req.url.startsWith(`${environment.baseEndpoint}/api/v1/token/`)){
            toastService.addToast(401, 'Usuário e/ou senha incorretos!')
          } else{
            toastService.addToast(401, 'Usuário não autenticado, faça login novamente!')
          }
          router.navigate(['/login'])
        }
        
        if(error.status === 0){
          toastService.addToast(401, 'Ocorreu um erro! Por favor, contate o adminstrador!')
        }
      }
      
      return throwError(() => error);
    })
  );
};
