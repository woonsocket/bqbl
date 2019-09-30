import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';

import TeamIcon from '../TeamIcon/team-icon';

IconAndName.propTypes = {
  team: PropTypes.string.isRequired,
  width: PropTypes.string,
}

IconAndName.defaultProps = {
  width: '30px',
};

const useStyles = makeStyles({
  outer: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 5px',
    minWidth: '50px',
  },
  cell: {
    fontSize: '14px',
    margin: '0 5px',
    minWidth: '35px',
  },
});

function IconAndName(props) {
  const classes = useStyles();

  return (
    <div className={classes.outer}>
      <TeamIcon team={props.team} width={props.width} />
      <div className={classes.cell}>{props.team}</div>
    </div>
  );
}
export default IconAndName;
