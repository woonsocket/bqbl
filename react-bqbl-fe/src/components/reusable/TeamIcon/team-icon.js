import PropTypes from 'prop-types';
import React from 'react';

TeamIcon.propTypes = {
  team: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired
}

function TeamIcon(props) {
  if (props.team && props.team !== 'none') {
    return (
      <img src={
        'http://i.nflcdn.com/static/site/7.5/img/logos/svg/' +
        'teams-matte/' + props.team + '.svg'}
        width={props.width}
        alt={props.team} />
    )
  }
  return "none";
}
export default TeamIcon;
