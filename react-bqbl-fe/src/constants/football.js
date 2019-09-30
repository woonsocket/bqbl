export const ALL_TEAMS = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET",
  "GB", "HOU", "IND", "JAX", "KC", "LA", "LAC", "MIA", "MIN", "NE", "NO", "NYG", "NYJ",
  "OAK", "PHI", "PIT", "SEA", "SF", "TB", "TEN", "WAS"];

export const WEEK_IDS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16",];

export const CURRENT_YEAR_WEEK_IDS = WEEK_IDS.slice(0, footballWeek());

export const CURRENT_YEAR = '2019';

export function allWeeksReverse(year) {
  if (year === CURRENT_YEAR) {
    return CURRENT_YEAR_WEEK_IDS.slice().reverse()
  }
  return WEEK_IDS.slice().reverse();
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
  const day = dayOfYear();
  let week = Math.ceil((day - 246) / 7);
  if (week < 1) {
    week = 1;
  }
  return week;
}

