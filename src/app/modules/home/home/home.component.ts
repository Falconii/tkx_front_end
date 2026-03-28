import { Component } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  isMobile: boolean = false;
  constructor(
    private globalService: GlobalService,
    private breakpoint: BreakpointObserver,

    private router: Router,
  ) {
    this.breakpoint.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
    });
  }

  ngOnInit(): void {
    if (this.isMobile) {
      this.router.navigate(['/mobile']);
    }
  }
}
