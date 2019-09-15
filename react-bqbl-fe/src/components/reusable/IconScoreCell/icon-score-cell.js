import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';

import TeamIcon from '../TeamIcon/team-icon'

IconScoreCell.propTypes = {
  team: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired
}

const useStyles = makeStyles({
  outer: {
    display: 'inline-block',
    marginLeft: '5px',
    minWidth: '50px',
  },
  cell: {
    display: 'inline-block',
    fontSize: '14px',
    minWidth: '35px',
    textAlign: 'right',
    verticalAlign: 'super',
  }
})

function IconScoreCell(props) {
  const classes = useStyles();

  return (
    <div className={classes.outer}>
      <TeamIcon team={props.team} width='30px' />
      <span className={classes.cell}>
        {props.score}
      </span>
    </div>
  )
}
export default IconScoreCell;
