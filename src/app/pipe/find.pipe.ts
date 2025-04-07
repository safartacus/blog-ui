import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'find'
})
export class FindPipe implements PipeTransform {
  transform(array: any[], value: any, key: string, returnKey: string): any {
    if (!array || !value) return null;
    const item = array.find(item => item[key] === value);
    return item ? item[returnKey] : null;
  }
}