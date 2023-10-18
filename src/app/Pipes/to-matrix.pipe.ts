import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toMatrix'
})
export class ToMatrixPipe implements PipeTransform {

  transform(arr: any[], n: number): number[][] {

    if (!arr)
    {
      return null;
    }
    const rows = Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => i);
    var s =  rows.map(idx => arr.slice(idx * n, idx * n + n));

    return s;
  }

}
  
