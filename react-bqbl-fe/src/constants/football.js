// TODO: good lord...
export const ALL_TEAMS_2020 = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET",
  "GB", "HOU", "IND", "JAX", "KC", "LA", "LAC", "MIA", "MIN", "NE", "NO", "NYG", "NYJ",
  "OAK", "PHI", "PIT", "SEA", "SF", "TB", "TEN", "WAS"];

export const ALL_TEAMS_2019 = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET",
  "GB", "HOU", "IND", "JAX", "KC", "LA", "LAC", "MIA", "MIN", "NE", "NO", "NYG", "NYJ",
  "OAK", "PHI", "PIT", "SEA", "SF", "TB", "TEN", "WAS"];

export const ALL_TEAMS = ALL_TEAMS_2020;

// Weeks that are part of the NFL season.
export const WEEK_IDS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17"];

// Weeks that are part of the BQBL regular season.
const REGULAR_SEASON_WEEK_IDS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];

export const CURRENT_YEAR = '2020';

export function seasonWeeksReverse(year) {
  if (year === CURRENT_YEAR) {
    return REGULAR_SEASON_WEEK_IDS.slice(0, footballWeek()).reverse();
  }
  return REGULAR_SEASON_WEEK_IDS.slice().reverse();
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
  if (new Date().getFullYear() > CURRENT_YEAR) {
    return 17;
  }
  const day = dayOfYear();
  // This 254 is hard-coded for the first day of the season in 2020...
  let week = Math.ceil((day - 254) / 7);
  if (week < 1) {
    week = 1;
  }
  return week;
}

