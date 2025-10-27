import { Component } from '@angular/core';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private globalService:GlobalService) { }

  ngOnInit(): void {
   this.globalService.setMobile(false);
  }

}
