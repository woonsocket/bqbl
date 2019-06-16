import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';

const WEEK_IDS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17",]

class TeamStandingsPageBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allScores: [],
    };
  }

  componentDidMount() {
    this.props.firebase.scores_year('2018').on('value', snapshot => {
      let weekMap = {};
      for(let [weekId, weekVal] of Object.entries(snapshot.val())) {
        for(let [teamId, teamVal] of Object.entries(weekVal)) {
          weekMap[teamId] = weekMap[teamId] || {}; 
          weekMap[teamId][weekId] = teamVal.total
        }
      }
      this.setState({ allScores: weekMap })
    })
  }

  render() {
    return (
      <React.Fragment>
        {Object.entries(this.state.allScores).map((v, k) => 
          <div><span>{v[0]}</span>
          {WEEK_IDS.map(id => 
          (<span>{JSON.stringify(v[1][id])}</span>))}
          </div>
          )}
      </React.Fragment>
    );
  }
}

const TeamStandingsPage = compose(
  withRouter,
  withFirebase,
)(TeamStandingsPageBase);

export default TeamStandingsPage;
