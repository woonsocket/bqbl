import PropTypes from 'prop-types';
import React from 'react';

import { teamLogoImage } from '../../../constants/football';

TeamIcon.propTypes = {
  team: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired
}

function TeamIcon(props) {
  if (props.team && props.team !== 'none') {
    return (
      <img src={teamLogoImage(props.team)}
        width={props.width}
        alt={props.team} />
    )
  }
  return "none";
}
export default TeamIcon;
