import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React from 'react';

import ScoreValue from '../ScoreValue/score-value';
import TeamIcon from '../TeamIcon/team-icon';

IconScoreCell.propTypes = {
  team: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired
}

IconScoreCell.defaultProps = {
  team: '',
  score: 0
};

const useStyles = makeStyles({
  outer: {
    alignItems: 'center',
    display: 'flex',
    marginLeft: '5px',
    minWidth: '50px',
  },
  cell: {
    fontSize: '14px',
    minWidth: '35px',
    textAlign: 'right',
  },
});

function IconScoreCell(props) {
  const classes = useStyles();

  return (
    <div className={classes.outer}>
      <TeamIcon team={props.team} width='30px' />
      <span className={classes.cell}>
        <ScoreValue score={props.score} />
      </span>
    </div>
  );
}
export default IconScoreCell;
