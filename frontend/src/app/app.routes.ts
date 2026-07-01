import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Publicaciones } from './pages/publicaciones/publicaciones';
import { Register } from './pages/register/register';
import { MiPerfil } from './pages/mi-perfil/mi-perfil';
import { PublicacionDetalle } from './pages/publicacion-detalle/publicacion-detalle';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    children: [
      {
        path: '',
        redirectTo: 'publicaciones',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: Login
      },
      {
        path: 'register',
        component: Register
      },
      {
        path: 'publicaciones',
        component: Publicaciones,
        canActivate: [authGuard]
      },
      {
        path: 'publicaciones/:id',
        component: PublicacionDetalle,
        canActivate: [authGuard]
      },
      {
        path: 'perfil',
        component: MiPerfil,
        canActivate: [authGuard]
      },
      {
      path:'dashboard/usuarios',
      canActivate:[authGuard, adminGuard],
      loadComponent:()=>import('./pages/dashboard/usuarios/usuarios')
      .then(m=>m.Usuarios)
      },
      {
        path:'dashboard/usuarios/crear',
        canActivate:[authGuard, adminGuard],
        loadComponent:()=>import('./pages/dashboard/usuarios/crear-usuario/crear-usuario')
        .then(m=>m.CrearUsuario)
      },
      {
      path:'dashboard/estadisticas',
      canActivate:[authGuard, adminGuard],
      loadComponent:()=>import('./pages/dashboard/estadisticas/estadisticas')
      .then(m=>m.Estadisticas)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];