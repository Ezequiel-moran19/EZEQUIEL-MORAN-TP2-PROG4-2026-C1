import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  let token = null;

  if(isPlatformBrowser(platformId)){
    token = localStorage.getItem('token');
  }

  const nueva = req.clone({
    withCredentials:true,
    setHeaders: token ? {
      Authorization:`Bearer ${token}`
    } : {}

  });

  return next(nueva).pipe(
    catchError(error=>{
    if(error.status === 401 && req.url.includes('/auth/')){

      auth.logout();
      router.navigate(['/login']);

    }
      return throwError(()=>error);
    })
  );

};
