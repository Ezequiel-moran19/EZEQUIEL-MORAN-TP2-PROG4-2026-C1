import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const usuario = auth.obtenerUsuarioLogueado();

  if(usuario?.perfil === 'administrador'){
    return true;
  }

  router.navigate(['/publicaciones']);

  return false;

};
