import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const adminGuard: CanActivateFn = () => {

  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.autorizar().pipe(

    map(usuario => {

      if (usuario.perfil === 'administrador') {
        return true;
      }
      router.navigate(['/publicaciones']);
      return false;
    }),

    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })

  );

};

// import { CanActivateFn, Router } from '@angular/router';
// import { inject } from '@angular/core';
// import { AuthService } from '../services/auth.service';

// export const adminGuard: CanActivateFn = (route, state) => {
//   const auth = inject(AuthService);
//   const router = inject(Router);
//   const usuario = auth.obtenerUsuarioLogueado();

//   if(usuario?.perfil === 'administrador'){
//     return true;
//   }

//   router.navigate(['/publicaciones']);

//   return false;

// };
