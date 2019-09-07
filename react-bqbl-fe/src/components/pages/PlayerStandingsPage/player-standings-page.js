import React, { useState, useEffect } from 'react';

import './player-standings-page.css';
import { withFirebase } from '../../Firebase';
import IconScoreCell from '../../reusable/IconScoreCell/icon-score-cell'
import classNames from 'classnames/bind';
import { allWeeksReverse } from "../../../constants/football";
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';

const FOLD = 4;


function PlayerStandingsPageBase(props) {
  let [playerTable, setPlayerTable] = useState({})
  useEffect(() => {
    props.firebase.getScores(
      props.league, props.year, allWeeksReverse(props.year), setPlayerTable);
  }, [props.firebase, props.league, props.year]);

  return Object.entries(playerTable).map(([playerId, player]) => (
    <PlayerYearCard player={player} name={playerId} key={playerId} year={props.year} />
  ))
}

PlayerYearCard.propTypes = {
  player: PropTypes.object.isRequired,
}

function PlayerYearCard(props) {
  const [expanded, setExpanded] = React.useState(false);
  function handleExpandClick() {
    setExpanded(!expanded);
  }

  return (
    <Card className="player-card">
      <CardHeader
        avatar={
          <Avatar aria-label="">
            {props.player.name}
          </Avatar>
        }
        title={props.player.name}
        subheader={"Total: " + props.player.total}
      />
      <CardContent>
        {allWeeksReverse(props.year).slice(0, FOLD)
          .filter(weekId => Object.keys(props.player.start_rows).includes(weekId))
          .map(weekId => (
            <div key={weekId}>
              <div className="week-cell">
                {"Week " + weekId}
              </div>
              <div className="score-cell"><IconScoreCell team={props.player.start_rows[weekId].team_1.team_name} score={props.player.start_rows[weekId].team_1.score} /> </div>
              <div className="score-cell"><IconScoreCell team={props.player.start_rows[weekId].team_2.team_name} score={props.player.start_rows[weekId].team_2.score} /> </div>
            </div>
          ))}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {allWeeksReverse(props.year).slice(FOLD)
            .filter(weekId => Object.keys(props.player.start_rows).includes(weekId))
            .map(weekId => (
              <div key={weekId}>
                <div className="week-cell">
                  {"Week " + weekId}
                </div>
                <div className="score-cell"><IconScoreCell team={props.player.start_rows[weekId].team_1.team_name} score={props.player.start_rows[weekId].team_1.score} /> </div>
                <div className="score-cell"><IconScoreCell team={props.player.start_rows[weekId].team_2.team_name} score={props.player.start_rows[weekId].team_2.score} /> </div>
              </div>))}
        </Collapse>

      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          className={classNames({ expanded: expanded })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="Show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
    </Card>

  )
}

const PlayerStandingsPage = compose(
  withRouter,
  withFirebase,
)(PlayerStandingsPageBase);

export default PlayerStandingsPage;