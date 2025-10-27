
import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {

  shomMenuEmitter = new EventEmitter<boolean>();
  showSpinEmitter = new EventEmitter<boolean>();
  isMobileEmitter = new EventEmitter<boolean>();


  constructor(
    private router: Router) {
  }

   setMobile(value: boolean) {
    this.isMobileEmitter.emit(value);
  }

}
