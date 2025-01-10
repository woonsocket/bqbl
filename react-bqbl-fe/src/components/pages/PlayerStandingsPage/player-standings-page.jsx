import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import classNames from "classnames/bind";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { seasonWeeksReverse } from "../../../constants/football";
import { joinScoresToStarts } from "../../../redux/join";
import { useYear } from "../../AppState";
import IconScoreCell from "../../reusable/IconScoreCell/icon-score-cell";
import PlayerScoreList from "../../reusable/PlayerScoreList/player-score-list";
import RequireLeague from "../../reusable/RequireLeague";
import styles from "./PlayerStandingsPage.module.css";


function PlayerStandingsPage() {
  return (
    <RequireLeague>
      <PlayerStandings />
    </RequireLeague>
  );
}

function PlayerStandings() {
  let [playerTable, setPlayerTable] = useState([]);
  let [sortScores, setSortScores] = useState(true);
  let year = useYear();
  const joined = useSelector(joinScoresToStarts);

  function sortClickedCallback() {
    setSortScores(!sortScores);
  }
 
  useEffect(() => {
    let newJoined = sortScores
      ? Object.values(joined).sort((team, team2) => team2.total - team.total)
      : joined;
    setPlayerTable(newJoined);
  }, [joined]);

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
        <PlayerYearCard
          player={player}
          teams={player.teams}
          startRows={player.start_rows}
          name={playerId}
          key={playerId}
          year={year}
        />
      ))}
    </React.Fragment>
  );
}

function PlayerYearCard({player, year, teams, startRows}) {
  const [expanded, setExpanded] = React.useState(false);

  const scoreEntries247 = teams.map((team) => {
    return { team: team.name, score: team.score247 };
  });

  const startedWeeks = new Map(Object.entries(startRows));
  const weeks = seasonWeeksReverse(year)
    .filter((weekId) => startedWeeks.has(weekId))
    .map((weekId) => {
      const startRow = startedWeeks.get(weekId);
      const entries = [
        { team: startRow.team_1.team_name, score: startRow.team_1.score },
        { team: startRow.team_2.team_name, score: startRow.team_2.score },
      ];
      return (
        <PlayerScoreList
          key={weekId}
          label={"Week " + weekId}
          entries={entries}
        />
      );
    });

  function handleExpandClick() {
    setExpanded(!expanded);
  }

  const FOLD = 4;
  return (
    <Card className={styles.playerCard} data-testid="player-card">
      <CardHeader
        avatar={<Avatar aria-label="">{player.name[0]}</Avatar>}
        title={player.name}
        subheader={`Total: ${player.total}`}
      />
      <CardContent>
        <PlayerScoreList label="24/7" entries={scoreEntries247} />
        {weeks.slice(0, FOLD)}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {weeks.slice(FOLD)}
        </Collapse>
      </CardContent>
      <CardActions disableSpacing>
        {weeks.length > FOLD && (
          <IconButton
            className={classNames({ [styles.expanded]: expanded })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="Show more"
            size="large"
          >
            <ExpandMoreIcon />
          </IconButton>
        )}
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

export default PlayerStandingsPage;
