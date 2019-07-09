import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './icon-score-cell.css';

class IconScoreCell extends Component {
  static propTypes = {
    team: PropTypes.string.isRequired,
    score: PropTypes.int.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      team: props.team,
      score: props.score
    };
  }

  render() {
    return (
        <div className="outer">
          <img
            src={
              'http://i.nflcdn.com/static/site/7.5/img/logos/svg/' +
                'teams-matte/' + this.state.team + '.svg'}
                width='20px'
                alt=""/>
           <span className="cell">
              {this.state.score}
              </span>
        </div>
    )
  }
}
export default IconScoreCell;
