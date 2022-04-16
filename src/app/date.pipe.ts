import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(payment: any, terms: string): any {
    if (terms=='date') {
      let d = new Date(payment);
      return d.toLocaleDateString();

    } else {
      let t = new Date(payment);
      return t.toLocaleString().split(',')[1];

    }
  }

}
