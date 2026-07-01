import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {

  const auth = inject(AuthService);
  const router = inject(Router);


  if (auth.logueado()) {
    return true;
  }


  return auth.autorizar().pipe(

    map(usuario => {

      auth.guardarUsuario(usuario);
      auth.logueado.set(true);

      return true;

    }),

    catchError(() => {

      auth.logueado.set(false);
      router.navigate(['/login']);

      return of(false);

    })

  );

};