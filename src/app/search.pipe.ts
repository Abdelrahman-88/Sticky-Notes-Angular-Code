import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(notes: any[], terms: string): any[] {
    return notes.filter((note) => {
      if(note.title!=undefined){
        return note.title.toLowerCase().includes(terms.toLowerCase())
      }
    })
  }

}
