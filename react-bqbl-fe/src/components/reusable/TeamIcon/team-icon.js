import React from 'react';
import PropTypes from 'prop-types';

TeamIcon.propTypes = {
  team: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired
}

function TeamIcon(props) {
  return (
    props.team && props.team !== 'none' &&
     <img src={
        'http://i.nflcdn.com/static/site/7.5/img/logos/svg/' +
        'teams-matte/' + props.team + '.svg'}
      width={props.width}
      alt={props.team} />
  )
}
export default TeamIcon;
