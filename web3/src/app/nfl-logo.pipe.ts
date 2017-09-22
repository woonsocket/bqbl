import { Pipe, PipeTransform } from '@angular/core';

import { ConstantsService } from './constants.service';

// Taken from https://stackoverflow.com/questions/6018611/smallest-data-uri-image-possible-for-a-transparent-image
const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

@Pipe({name: 'nflLogo'})
export class NflLogoPipe implements PipeTransform {
  constructor(private constants: ConstantsService) {}

  transform(team: string): string {
    if (this.constants.getAllTeams().has(team)) {
      return `http://i.nflcdn.com/static/site/7.5/img/logos/svg/` +
        `teams-matte/${team}.svg`;
    } else {
      return BLANK;
    }
  }
}

@Pipe({name: 'nflIcon'})
export class NflIconPipe implements PipeTransform {
  constructor(private constants: ConstantsService) {}

  transform(team: string): string {
    if (this.constants.getAllTeams().has(team)) {
      return `https://static.nfl.com/static/site/img/logos/svg/teams/${team}.svg`;
    } else {
      return BLANK;
    }
  }
}
