import React from 'react';

function WeekTeamRow(props) {
  if(!props.week||!props.week.starts) {
    return null;
  }
  let starts = props.week.starts;
  return (
    <div>
      {starts.map(start => (<WeekTeamCell start={start}/>))}
    </div>
  );
}

function WeekTeamCell(props) {
  return (
    <React.Fragment>
    <span>{props.start.name}</span> <span>{props.start.total}</span>
    </React.Fragment>
  );

}

export default WeekTeamRow;
