import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  return auth.autorizar().pipe(

    map(() => {
      auth.logueado.set(true);
      auth.cargandoSesion.set(false);
      return true;
    }),
    catchError(() => {
      auth.logueado.set(false);
      auth.cargandoSesion.set(false);

      router.navigate(['/login']);

      return of(false);
    })
  );
};

// import { CanActivateFn, Router } from '@angular/router';
// import { inject } from '@angular/core';
// import { AuthService } from '../services/auth.service';
// import { map, catchError, of } from 'rxjs';

// export const authGuard: CanActivateFn = () => {
//   const auth = inject(AuthService);
//   const router = inject(Router);
  
//   if (auth.logueado()) {
//     return true;
//   }

//   const usuarioLocal = auth.obtenerUsuarioLogueado();
//   if (usuarioLocal) {

//     return auth.autorizar().pipe(
//       map(usuario => {
//         auth.guardarUsuario(usuario);
//         auth.logueado.set(true);
//         return true;
//       }),
//       catchError(() => {
//         auth.logout();
//         auth.logueado.set(false);
//         router.navigate(['/login']);
//         return of(false);
//       })
//     );
//   }
//   auth.logueado.set(false);
//   router.navigate(['/login']);
//   return of(false);
// };