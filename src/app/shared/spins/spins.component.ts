import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
@Component({
  selector: 'app-spins',
  templateUrl: './spins.component.html',
  styleUrls: ['./spins.component.css'],
})
export class SpinsComponent implements OnInit {
  showSpin: boolean = false;

  constructor(private globalService: GlobalService) {
    this.globalService.showSpin$.subscribe((show) => {
      this.showSpin = show;
    });
  }
  ngOnInit() {}
}
