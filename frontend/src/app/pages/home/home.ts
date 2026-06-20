import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Bienvenida } from '../../components/bienvenida/bienvenida';
import { Navbar } from '../../components/navbar/navbar';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, Bienvenida, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  
  authService = inject(Auth);
  
}