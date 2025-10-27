import { Component } from '@angular/core';
import { GlobalService } from './services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tkx_frontend';
  showMenu: boolean = true;
  isMobile: boolean = false;
  constructor(private globalService: GlobalService, private router: Router) {}

   ngOnInit(
   ): void {

    this.globalService.isMobileEmitter.subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  onLogin() {
    this.router.navigate(['/home']);
  }

}
