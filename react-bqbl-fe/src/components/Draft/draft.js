import React, { Component } from 'react';

import './draft.css'
import { withFirebase } from '../Firebase';
import * as FOOTBALL from '../../constants/football';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

class DraftPageBase extends Component {
  constructor(props) {
    super(props);
    this.leagueid = this.props.match.params.league || "nbqbl";
    this.leagueSpecReader = new LeagueSpecReader(this.leagueid, 'uid', this.props.firebase);
    this.state = {
      inLeague: false,
    };
  }

  componentDidMount() {
    this.props.firebase.league_spec(this.leagueid).once('value').then(data => {
      let lsr = new LeagueSpecReader();
      let isInLeague = lsr.isInLeague(this.props.firebase.getCurrentUser().uid, data.val());
      this.setState({ inLeague: isInLeague });
    });

  }

  render() {
    return this.state.inLeague ?
      <DraftSelectionGrid /> : <NotInLeagueUI/>
  }
}

function DraftSelectionGrid() {
  return (
    <React.Fragment>
      {FOOTBALL.ALL_TEAMS.map(team =>
        <div className="team" key={team}>
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

function NotInLeagueUI() {
  return (
    // TODO implement join flow.
    <div>
      Join the league!
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
}

const DraftPage = compose(
  withRouter,
  withFirebase,
)(DraftPageBase);

export default DraftPage;
