import React, { useEffect, useState } from 'react';

import './player-standings-page.css';
import { seasonWeeksReverse } from "../../../constants/football";
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
import IconScoreCell from '../../reusable/IconScoreCell/icon-score-cell';
import PlayerScoreList from '../../reusable/PlayerScoreList/player-score-list';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';
import classNames from 'classnames/bind';
import { processYearScores } from '../../../middle/response';

const FOLD = 4;

PlayerStandingsPageBase.propTypes = {
  firebase: PropTypes.object.isRequired,
  year: PropTypes.string.isRequired,
  league: PropTypes.string.isRequired,
};

function PlayerStandingsPageBase(props) {
  let [playerTable, setPlayerTable] = useState([]);
  let [sortScores, setSortScores] = useState(true);

  function sortClickedCallback() {
    setSortScores(!sortScores);
  }

  useEffect(() => {
    return props.firebase.getScoresStartsUsersThen(props.league, props.year,
      ({ dbScores, dbScores247, dbStarts, dbUsers }) => {
        let val = processYearScores(
            dbScores, dbScores247, dbStarts, dbUsers, seasonWeeksReverse(props.year));
        let playerList = Object.keys(val).map(key => ({
          ...val[key],
          uid: key,
        }));
        if (sortScores) {
          playerList = playerList.sort((team, team2) => team2.total - team.total);
        }
        setPlayerTable(playerList);
      });
  }, [props.firebase, props.league, props.year, sortScores]);

  return (
    <React.Fragment>
      <div style={{ textAlign: "center" }}>
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
  );
}

PlayerYearCard.propTypes = {
  player: PropTypes.object.isRequired,
};

function PlayerYearCard(props) {
  const [expanded, setExpanded] = React.useState(false);

  const scoreEntries247 = props.player.teams.map((team) => {
    return {team: team.name, score: team.score247};
  });

  const startedWeeks = new Map(Object.entries(props.player.start_rows));
  const weeks = seasonWeeksReverse(props.year)
      .filter((weekId) => startedWeeks.has(weekId))
      .map((weekId) => {
        const startRow = startedWeeks.get(weekId);
        const entries = [
          {team: startRow.team_1.team_name, score: startRow.team_1.score},
          {team: startRow.team_2.team_name, score: startRow.team_2.score},
        ];
        return (
          <PlayerScoreList key={weekId} label={'Week ' + weekId} entries={entries} />
        );
      });

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
        <PlayerScoreList label="24/7" entries={scoreEntries247} />
        {weeks.slice(0, FOLD)}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {weeks.slice(FOLD)}
        </Collapse>
      </CardContent>
      <CardActions disableSpacing>
        {weeks.length > FOLD &&
         <IconButton className={classNames({ expanded: expanded })}
                     onClick={handleExpandClick}
                     aria-expanded={expanded}
                     aria-label="Show more" >
           <ExpandMoreIcon />
         </IconButton>}
      </CardActions>
    </Card>
  );
}

PlayerScores247.propTypes = {
  player: PropTypes.object.isRequired,
};

function PlayerScores247(props) {
  return (
    <div className="score-row">
      <div className="week-cell">24/7 points</div>
      <div className="score-cells">
        {props.player.teams.map((team) => (
          <div key={team.name} className="score-cell">
            <IconScoreCell team={team.name} score={team.score247} />
          </div>
        ))}
      </div>
    </div>
  );
}

const PlayerStandingsPage = compose(
  withRouter,
  withFirebase,
)(PlayerStandingsPageBase);

export default PlayerStandingsPage;
