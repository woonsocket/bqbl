import React from 'react';
import IconScoreCell from '../IconScoreCell/icon-score-cell'
import './week-team-row.css';

function WeekTeamRow(props) {
  if(!props.week||!props.week.starts) {
    return null;
  }
  let starts = props.week.starts;
  return (
    <div class="week-team-row">
      Week {props.weekId}
      {starts.map(start => (<IconScoreCell team={start.name} score={start.total}/>))}
    </div>
  );
}

export default WeekTeamRow;
