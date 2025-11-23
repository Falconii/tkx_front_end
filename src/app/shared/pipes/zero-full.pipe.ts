import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zeroFill'
})
export class ZeroFillPipe implements PipeTransform {
  transform(value: number | string, maxLength: number = 6): string {
    if (value == null) return '';
    const strValue = value.toString();
    return strValue.padStart(maxLength, '0');
  }
}
