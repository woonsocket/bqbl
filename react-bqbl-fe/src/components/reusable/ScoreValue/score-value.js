import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';

ScoreValue.propTypes = {
  score: PropTypes.number,
};

const useStyles = makeStyles({
  negative: {
    color: '#D32F2F',  // Material Red 700
  },
});

function toString(num) {
  if (num === undefined || num === null) {
    return '';
  }
  // Use a minus sign instead of a hyphen, to satisfy the typography nerds.
  return num.toString().replace('-', '−');
}

function ScoreValue(props) {
  const classes = useStyles();
  return (
    <span className={props.score < 0 ? classes.negative : ''}>
      {toString(props.score)}
    </span>
  );
}
export default ScoreValue;
