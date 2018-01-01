import { Observable } from 'rxjs/Observable';

import { ScoreService, LeagueScore, PlayerScore } from './score.service';
import { TeamScore } from './team-score';

export class MockScoreService {
  leagues: LeagueScore[];

  setLeagues(leagues: LeagueScore[]) {
    this.leagues = leagues;
  }

  getLeagues() {
    return Observable.of(this.leagues);
  }
}

const HOU_TEAM_SCORE = {name: "HOU", score: 15};
const NYJ_TEAM_SCORE = {name: "NYJ", score: 117};
const HJ_PLAYER_SCORE = new PlayerScore("Harvey", [HOU_TEAM_SCORE, NYJ_TEAM_SCORE]);
const AR_PLAYER_SCORE = new PlayerScore("Aerion", [HOU_TEAM_SCORE, NYJ_TEAM_SCORE]);

export const NBQBL_LEAGUE_SCORE = <LeagueScore> {
  name: "NBQBL", 
  players: Observable.of([HJ_PLAYER_SCORE])
}
export const ABQBL_LEAGUE_SCORE = <LeagueScore> {
  name: "ABQBL", 
  players: Observable.of([AR_PLAYER_SCORE])
}