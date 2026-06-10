import { AbstractControl } from '@angular/forms';

export class FormStateTracker<T = any> {
  private initialValue!: T;

  constructor(
    private control: AbstractControl,
    private delay = 30, // tempo em ms (ajustável)
  ) {
    setTimeout(() => this.captureInitialState(), this.delay);
  }

  captureInitialState() {
    this.initialValue = this.clone(this.control.getRawValue());
  }

  hasChanged(): boolean {
    const current = this.control.getRawValue();
    return JSON.stringify(this.initialValue) !== JSON.stringify(current);
  }

  commit() {
    this.captureInitialState();
  }

  private clone(value: any): T {
    return JSON.parse(JSON.stringify(value));
  }
}
