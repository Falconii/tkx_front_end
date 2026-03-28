import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-login-mobile',
  templateUrl: './login-mobile.component.html',
  styleUrl: './login-mobile.component.css',
})
export class LoginMobileComponent {
  @Input() formulario!: FormGroup;
  @Output() validar = new EventEmitter();
  @Output() cancelar = new EventEmitter();
  @Output() sair = new EventEmitter();
  @Output() esqueceu = new EventEmitter();

  hide: boolean = true;

  onSubmit: boolean = false;

  constructor(private globalService: GlobalService) {
    this.globalService.onSubmit.subscribe((onSubmit) => {
      this.onSubmit = onSubmit;
    });
  }
}
