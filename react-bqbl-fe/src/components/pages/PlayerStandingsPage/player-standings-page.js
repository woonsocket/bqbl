import React, { useEffect, useState } from 'react';

import './player-standings-page.css';
import { allWeeksReverse } from "../../../constants/football";
import { compose } from 'recompose';
import { withFirebase } from '../../Firebase';
import { withRouter } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import IconScoreCell from '../../reusable/IconScoreCell/icon-score-cell'
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import classNames from 'classnames/bind';
import {processYearScores} from '../../../middle/response'

const FOLD = 4;

PlayerStandingsPageBase.propTypes = {
  firebase: PropTypes.object.isRequired,
  year: PropTypes.string.isRequired,
  league: PropTypes.string.isRequired,
}

function PlayerStandingsPageBase(props) {
  let [playerTable, setPlayerTable] = useState([]);
  let [sortScores, setSortScores] = useState(true);

  function sortClickedCallback() {
    setSortScores(!sortScores);
  }

  useEffect(() => {
    props.firebase.scoresStartsUsersPromise(props.league, props.year).then(
      ({ dbScores, dbStarts, dbUsers }) =>
        processYearScores(dbScores, dbStarts, dbUsers, allWeeksReverse(props.year))
    ).then(val => {
      let playerList = Object.keys(val).map(key => ({
        ...val[key],
        uid: key,
      }));
      if (sortScores) {
        playerList = playerList.sort((team, team2) => team2.total - team.total);
      }
      setPlayerTable(playerList)
    });
  }, [props.firebase, props.league, props.year, sortScores]);

  return (
    <React.Fragment>
      <div style={{textAlign: "center"}}>
        Sort Scores
        <Switch
          checked={sortScores}
          onChange={sortClickedCallback}
          value="sort"
          color="primary"
        />
      </div>

      {Object.entries(playerTable).map(([playerId, player]) => (
        <PlayerYearCard player={player} name={playerId} key={playerId} year={props.year} />
      ))}
    </React.Fragment>
  )
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
            {props.player.name[0]}
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