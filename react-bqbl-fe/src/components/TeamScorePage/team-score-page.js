import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import ScoreLine from '../TeamScoreCard/team-score-card';

class TeamScorePageBase extends Component {
  static propTypes = {
    firebase: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      valsList: [],
    };
  }

  componentDidMount() {
    this.props.firebase.scores_week(this.props.match.params.year, this.props.match.params.week).on('value', snapshot => {
      const vals = snapshot.val();
      const valsList = Object.keys(vals).map(key => ({
        ...vals[key],
        uid: key,
      }));
      this.setState({ valsList: valsList })
    })
  }

  render() {
    return (
      <React.Fragment>
        {this.state.valsList ? (
            this.state.valsList.map(score => (
              <ScoreLine
                score={score} key={score.uid}
              />
            ))
        ) : (
            <div>There are no messages ...</div>
          )}
      </React.Fragment>
    );
  }
}

const TeamScorePage = compose(
  withRouter,
  withFirebase,
)(TeamScorePageBase);

export default TeamScorePage;
