import { GlobalService } from './../services/global.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AppSnackbar } from '../shared/classes/app-snackbar';

@Injectable({
  providedIn: 'root',
})
export class SecureGuard implements CanActivate, CanActivateChild {
  constructor(
    private globalService: GlobalService,
    private router: Router,
    private Snackbar: AppSnackbar,
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    /* if (!this.globalService.getLogado()) {
      this.Snackbar.openFailureSnackBar('Nenhum Usuário Logado!', 'OK');
      this.router.navigate(['/login']);
      return false;
    } */
    return true;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    console.log('Estou na Child');
    return false;
  }
}
