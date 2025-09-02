// TODO: good lord...
export const ALL_TEAMS_2024 = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET",
  "GB", "HOU", "IND", "JAX", "KC", "LA", "LAC", "LV", "MIA", "MIN", "NE", "NO", "NYG", "NYJ", "PHI", "PIT", "SEA", "SF", "TB", "TEN", "WAS"];

export const ALL_TEAMS_2023 = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET",
  "GB", "HOU", "IND", "JAX", "KC", "LA", "LAC", "LV", "MIA", "MIN", "NE", "NO", "NYG", "NYJ", "PHI", "PIT", "SEA", "SF", "TB", "TEN", "WAS"];

export const ALL_TEAMS_2022 = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET",
  "GB", "HOU", "IND", "JAX", "KC", "LA", "LAC", "LV", "MIA", "MIN", "NE", "NO", "NYG", "NYJ", "PHI", "PIT", "SEA", "SF", "TB", "TEN", "WAS"];

export const ALL_TEAMS_2021 = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET",
  "GB", "HOU", "IND", "JAX", "KC", "LA", "LAC", "LV", "MIA", "MIN", "NE", "NO", "NYG", "NYJ", "PHI", "PIT", "SEA", "SF", "TB", "TEN", "WAS"];

export const ALL_TEAMS_2020 = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET",
  "GB", "HOU", "IND", "JAX", "KC", "LA", "LAC", "MIA", "MIN", "NE", "NO", "NYG", "NYJ",
  "OAK", "PHI", "PIT", "SEA", "SF", "TB", "TEN", "WAS"];

export const ALL_TEAMS_2019 = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET",
  "GB", "HOU", "IND", "JAX", "KC", "LA", "LAC", "MIA", "MIN", "NE", "NO", "NYG", "NYJ",
  "OAK", "PHI", "PIT", "SEA", "SF", "TB", "TEN", "WAS"];

export const ALL_TEAMS = ALL_TEAMS_2024;

// Weeks that are part of the NFL season.
export const WEEK_IDS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"];

// Weeks that are part of the BQBL regular season.
export const REGULAR_SEASON_WEEK_IDS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17"];

// ANNUAL UPDATE
export const CURRENT_YEAR = '2025';

// TODO this dependence on the system clock makes tests hard.
export function seasonWeeksReverse(year) {
  if (year === CURRENT_YEAR) {
    return REGULAR_SEASON_WEEK_IDS.slice(0, footballWeek()).reverse();
  }
  return REGULAR_SEASON_WEEK_IDS.slice().reverse();
}


export function teamLogoImage(team) {
  if (team === 'WSH') team = 'WAS';
  if (team === 'LAR') team = 'LA';
  return `https://static.www.nfl.com/t_q-best/league/api/clubs/logos/${team}`;
}


// https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
function dayOfYear() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return day;
}

export function footballWeek() {
  const yearOffset = new Date().getFullYear() - CURRENT_YEAR;
  // This ignores leap years, but the NFL season always ends before Feb. 28.
  let day = dayOfYear() + 365 * yearOffset;
  if (day < 1) {
    day += 365;
  }
  // ANNUAL UPDATE
  // Day 247 is Thursday, September 4, 2025
  let week = Math.ceil((day - 247) / 7);
  if (week < 1) {
    week = 1;
  }
  if (week > 18) {
    week = 18;  // TODO: Reference the maximum week number better.
  }
  return week;
}

