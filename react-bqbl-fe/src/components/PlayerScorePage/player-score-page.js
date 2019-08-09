import React, { Component } from 'react';

import './player-score-page.css';
import { withFirebase } from '../Firebase';
import ScoreJoiner from '../ScoreJoiner/score-joiner';
import PlayerScorePageUI from './player-score-page-ui';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class PlayerScorePageBase extends Component {
  static propTypes = {
    firebase: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    let league = this.props.match.params.league || "-KtC8hcGgvbh2W2Tq79n";
    let year = this.props.match.params.year || "2018";
    let week = this.props.match.params.week || "2";
    this.scoreJoiner = new ScoreJoiner(this.props.firebase, league, year, week)
    this.state = {
      playerList: {},
    };
  }

  componentDidMount() {
    this.scoreJoiner.joinScores(this.setState.bind(this))
  }

  render() {
    return <PlayerScorePageUI playerList={this.state.playerList}/>
  }
}


const PlayerScorePage = compose(
  withRouter,
  withFirebase,
)(PlayerScorePageBase);

export default PlayerScorePage;
