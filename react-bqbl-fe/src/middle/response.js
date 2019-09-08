
export class LeagueSpecDataProxy {
  constructor(leagueData, year) {
    this.leagueData = leagueData;
    this.year = year;
  }

  isInLeague(uid) {
    const uids = Object.keys(this.leagueData.users[this.year]);
    return uids.indexOf(uid) !== -1;
  }

  addUser(uid) {
    if (!this.leagueData.users) {
      this.leagueData.users = {};
      this.leagueData.users[this.year] = [];
    }

    let users = this.leagueData.users[this.year];
    users.push({ name: "Foo", uid: uid, teams: [] });
    return this.leagueData;
  }

  getTakenTeams() {
    if (!this.leagueData || !this.leagueData.draft || !this.leagueData.draft[this.year]) {
      return;
    }
    return this.leagueData.draft[this.year].map(draftItem => draftItem.team );
  }

  getDraftList() {
    return (this.leagueData.draft && this.leagueData.draft[this.year]) || [];
  }

  hasDh() {
    return this.leagueData['settings'][this.year].dh;
  }

}
