import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Publicaciones } from './pages/publicaciones/publicaciones';
import { Register } from './pages/register/register';
import { MiPerfil } from './pages/mi-perfil/mi-perfil';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    children: [
      { path: '', component: Login },
      { path: 'register', component: Register },
      { path: 'publicaciones', component: Publicaciones },
      { path: 'perfil', component: MiPerfil }
    ]
  },

  { path: '**', redirectTo: '' }
];