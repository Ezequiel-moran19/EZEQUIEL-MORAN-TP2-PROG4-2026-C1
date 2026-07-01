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
  console.log('--- AUTH GUARD ---');

  console.log('logueado signal:', auth.logueado());

  const usuarioLocal = auth.obtenerUsuarioLogueado();
  console.log('usuario local:', usuarioLocal);
  if (usuarioLocal) {
     console.log('hay usuario, llamo autorizar');
    return auth.autorizar().pipe(
      map(usuario => {
        auth.guardarUsuario(usuario);
        auth.logueado.set(true);
        return true;
      }),
      catchError(() => {
        auth.logout();
        auth.logueado.set(false);
        router.navigate(['/login']);
        return of(false);
      })
    );
  }
  auth.logueado.set(false);
  router.navigate(['/login']);
  return of(false);
};