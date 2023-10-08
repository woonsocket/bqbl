import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import React from 'react';

ScoreValue.propTypes = {
  score: PropTypes.number,
};

const negativeClass = css`
color: '#D32F2F',  // Material Red 700
`;


function toString(num) {
  if (num === undefined || num === null) {
    return '';
  }
  // Use a minus sign instead of a hyphen, to satisfy the typography nerds.
  return num.toString().replace('-', '−');
}

function ScoreValue(props) {
  return (
    <span css={props.score < 0 ? negativeClass : ''}>
      {toString(props.score)}
    </span>
  );
}
export default ScoreValue;
