import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login-desktop',
  templateUrl: './login-desktop.component.html',
  styleUrl: './login-desktop.component.css',
})
export class LoginDesktopComponent {
  @Input() formulario!: FormGroup;

  @Output() validar = new EventEmitter();
  @Output() cancelar = new EventEmitter();
  @Output() sair = new EventEmitter();
  @Output() esqueceu = new EventEmitter();
}
