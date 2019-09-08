
export class LeagueSpecDataProxy {
  constructor(props) {
    this.year = props.year;
  }

  isInLeague(uid, leagueData) {
    const users = (leagueData.users && leagueData.users[this.year]) || [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].uid === uid) {
        return true;
      }
    }
    return false;
  }

  addUser(uid, leagueData) {
    if (!leagueData.users) {
      leagueData.users = {};
      leagueData.users[this.year] = [];
    }

    let users = leagueData.users[this.year];
    users.push({ name: "Foo", uid: uid, teams: [] });
    return leagueData;
  }

  getTakenTeams(leagueData) {
    return (leagueData.draft && leagueData.draft[this.year].map(draftItem => { return draftItem.team })) || [];
  }

  getDraftList(leagueData) {
    return (leagueData.draft && leagueData.draft[this.year]) || [];
  }

  hasDh(leagueData, year) {
    return leagueData['settings'][year].dh;
  }

}
