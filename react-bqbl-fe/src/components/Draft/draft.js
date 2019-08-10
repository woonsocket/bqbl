import React, { Component, useState } from 'react';

//TODO: Every stylesheet in the source directory appears to be getting included.
import './draft.css'
import { withFirebase } from '../Firebase';
import * as FOOTBALL from '../../constants/football';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';

class DraftPageBase extends Component {
  constructor(props) {
    super(props);
    this.leagueid = this.props.match.params.league || "nbqbl";
    this.state = {
      inLeague: false,
    };
  }

  componentDidMount() {
    this.props.firebase.league_spec(this.leagueid).once('value').then(data => {
      let lsr = new LeagueSpecReader();
      let uid = this.props.firebase.getCurrentUser() ? this.props.firebase.getCurrentUser().uid : null;
      let isInLeague = lsr.isInLeague(uid, data.val());
      this.setState({ inLeague: isInLeague });
    });
  }

  addUser() {
    // TODO: Race conditions ahoy!
    this.props.firebase.league_spec(this.leagueid).once('value').then(data => {
      let leagueData = data.val();
      let lsr = new LeagueSpecReader();
      let uid = this.props.firebase.getCurrentUser() ? this.props.firebase.getCurrentUser().uid : null;
      let newData = lsr.addUser(uid, leagueData);
      this.props.firebase.league_spec(this.leagueid).update(newData);
    });

  }

  render() {
    // TODO: Redirect away from this page entirely for signed-out users.
    return this.state.inLeague ?
      <DraftSelectionGrid /> : <NotInLeagueUI adduser={this.addUser.bind(this)}/>
  }
}

function DraftSelectionGrid({ taken = ["ARI", "CLE"] }) {
  const [selected, setSelected] = useState("DEN");

  return (
    <React.Fragment>
      {FOOTBALL.ALL_TEAMS.map(team =>
        <div className={["team", selected == team ? "team-selected" : "", taken.includes(team) ? "taken" : ""].join(' ')} key={team}>
          <img
            src={
              'http://i.nflcdn.com/static/site/7.5/img/logos/svg/' +
              'teams-matte/' + team + '.svg'}
            width='80px'
            alt="" /><br />
          <div className="cell">
            {team}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

function NotInLeagueUI(props) {
  return (
    <div>
      <Button onClick={props.adduser}>Join</Button>
    </div>
  );

}

class LeagueSpecReader {
  isInLeague(uid, leagueData) {
    for (let i = 0; i < leagueData.users.length; i++) {
      if (leagueData.users[i].uid == uid) {
        return true;
      }
    }
    return false;
  }

  addUser(uid, leagueData) {
    leagueData.users.push({name: "Foo", uid: uid, teams: []});
    return leagueData;
  }
}

const DraftPage = compose(
  withRouter,
  withFirebase,
)(DraftPageBase);

export default DraftPage;
