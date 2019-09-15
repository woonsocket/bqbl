import PropTypes from 'prop-types';
import React from 'react';

import './icon-score-cell.css';
import TeamIcon from '../TeamIcon/team-icon'

IconScoreCell.propTypes = {
  team: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired
}

function IconScoreCell(props) {
  return (
    <div className="outer">
      <TeamIcon team={props.team} width='30px' />
      <span className="cell">
        {props.score}
      </span>
    </div>
  )
}
export default IconScoreCell;
