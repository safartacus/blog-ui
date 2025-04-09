import { Pipe, PipeTransform } from '@angular/core';
import * as timeago from 'timeago.js';

// Türkçe dil desteği için
import tr from 'timeago.js/lib/lang/tr';
timeago.register('tr', tr);

@Pipe({
  name: 'timeago'
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    // Tarihi timeago.js ile formatla
    return timeago.format(value, 'tr');
  }
}