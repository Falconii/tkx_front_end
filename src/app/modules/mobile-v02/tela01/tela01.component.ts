import { GlobalService } from './../../../services/global.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tela01',
  templateUrl: './tela01.component.html',
  styleUrl: './tela01.component.css',
})
export class Tela01Component {
  constructor(private globalService: GlobalService) {
    this.globalService.setMobile(true);
  }
}
