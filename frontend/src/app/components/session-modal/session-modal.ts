import { Component, inject } from '@angular/core';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-session-modal',
  standalone: true,
  imports: [],
  templateUrl: './session-modal.html',
  styleUrl: './session-modal.css',
})
export class SessionModal {
  session = inject(SessionService);
}
