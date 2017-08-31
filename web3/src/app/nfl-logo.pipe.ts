import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'nflLogo'})
export class NflLogoPipe implements PipeTransform {
  transform(team: string): string {
    return `http://i.nflcdn.com/static/site/7.5/img/logos/svg/` +
        `teams-matte/${team}.svg`
  }
}
