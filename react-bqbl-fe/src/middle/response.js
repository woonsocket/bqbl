
export class LeagueSpecDataProxy {
  constructor(props) {
  }

  isInLeague(uid, leagueData, year) {
    const uids = Object.keys(leagueData.users[year]);
    return uids.indexOf(uid) !== -1;
  }

  addUser(uid, leagueData, year) {
    if (!leagueData.users) {
      leagueData.users = {};
      leagueData.users[year] = [];
    }

    let users = leagueData.users[year];
    users.push({ name: "Foo", uid: uid, teams: [] });
    return leagueData;
  }

  getTakenTeams(leagueData, year) {
    if (!leagueData || !leagueData.draft || !leagueData.draft[year]) {
      return;
    }
    return leagueData.draft[year].map(draftItem => draftItem.team );
  }

  getDraftList(leagueData, year) {
    return (leagueData.draft && leagueData.draft[year]) || [];
  }

  hasDh(leagueData, year) {
    return leagueData['settings'][year].dh;
  }

}
