import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-crud-display',
  templateUrl: './crud-display.component.html',
  styleUrls: ['./crud-display.component.css'],
})
export class CrudDisplayComponent {
  @Input() label = '';
  @Input() items: any[] = [];
  @Input() control!: FormControl;
  @Input() readOnly = false;

  @Input() displayField = 'descricao';
  @Input() valueField = 'id';

  // Se true → usa modal de pesquisa
  @Input() useSearch = false;

  constructor() {}

  get displayValue(): string {
    if (!this.control) return '';

    const value = this.control.value; // ex: '3'

    const item = this.items?.find((i) => i[this.valueField] == value);
    // this.valueField = 'sigla' → i['sigla'] == '3'

    return item ? item[this.displayField] : '';
    // this.displayField = 'descricao' → 'Ativa'
  }

  getErrorMessage(): string {
    if (!this.control?.errors) return '';

    if (this.control.errors['required']) return 'Campo obrigatório';
    if (this.control.errors['minlength']) return 'Valor muito curto';
    if (this.control.errors['maxlength']) return 'Valor muito longo';

    return 'Valor inválido';
  }

  NoValidtouchedOrDirty(): boolean {
    if (!this.control.valid && (this.control.touched || this.control.dirty)) {
      return true;
    }
    return false;
  }

  getMensafield(): string {
    return 'Deu erro';
    //turn this.control.errors?.['message'] || '';
  }

  openSearchDialog() {
    /*    const dialogRef = this.dialog.open(ClientePesquisaDialogComponent, {
      width: '80vw',
      height: '80vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.control.setValue(result[this.valueField]);
      }
    });
   */
  }
}
