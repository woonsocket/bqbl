import React from 'react';
import PropTypes from 'prop-types';

import IconScoreCell from '../IconScoreCell/icon-score-cell'
import './week-team-row.css';

WeekTeamRow.propTypes = {
  week: PropTypes.object.isRequired,
  weekId: PropTypes.string.isRequired,
};

function WeekTeamRow(props) {
  if (!props.week || !props.week.starts) {
    return null;
  }
  let starts = props.week.starts;
  return (
    <div className="week-team-row">
      {props.weekId && "Week " + props.weekId}
      {starts.map((start, idx) => (<IconScoreCell team={start.name} score={start.total} key={"start"+idx} />))}
    </div>
  );
}

export default WeekTeamRow;
