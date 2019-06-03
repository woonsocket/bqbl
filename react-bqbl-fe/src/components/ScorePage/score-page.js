import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Scores from '../Scores/scores';

import { withFirebase } from '../Firebase';

class ScorePageBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      valsList: [],
    };
  }

  componentDidMount() {
    this.props.firebase.scores_week('2018', '2').on('value', snapshot => {
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
          <Scores scores={this.state.valsList} />
        ) : (
            <div>There are no messages ...</div>
          )}
      </React.Fragment>
    );
  }
}

const ScorePage = compose(
  withRouter,
  withFirebase,
)(ScorePageBase);

export default ScorePage;
