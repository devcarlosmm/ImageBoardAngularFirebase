import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortContent'
})
export class ShortContentPipe implements PipeTransform {
  transform(text: string, maxChars:number): string {
    return text.trim().substr(0, maxChars) + ( (text.length > maxChars) ? "...":"");
  }

}
