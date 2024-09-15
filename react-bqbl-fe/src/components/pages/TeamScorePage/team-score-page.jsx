import Switch from "@mui/material/Switch";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useWeek, useYear } from "../../AppState";
import TeamScoreCard from "../../reusable/TeamScoreCard/team-score-card";

function TeamScorePage(props) {
  let [isLoaded, setIsLoaded] = useState(false);
  let [scoresList, setScoresList] = useState([]);
  let [sortScores, setSortScores] = useState(true);
  let [useProjections, setUseProjections] = useState(true);

  const scores = useSelector((state) => state.scores);

  let year = useYear();
  let week = useWeek();

  function sortClickedCallback() {
    setSortScores(!sortScores);
  }

  function setUseProjectionsCallback() {
    setUseProjections(!useProjections);
  }

  useEffect(() => {
    if (!scores[week]) return;
    let scoresWeek = Object.entries(scores[week]).map(
      (entry, idx) => { return {...entry[1], teamName: entry[0]}}
    )
    if (sortScores) {
      if (useProjections) {
        scoresWeek.sort(
          (team, team2) => team2.projection.total - team.projection.total
        );
      } else {
        scoresWeek.sort((team, team2) => team2.total - team.total);
      }
    } else {
      scoresWeek.sort((team, team2) => team < team2)
    }
    setScoresList(scoresWeek);
    setIsLoaded(true);
  }, [scores, week, sortScores, useProjections]);

  return (
    <div style={{ textAlign: "center" }}>
      <div>
        Sort Scores
        <Switch
          checked={sortScores}
          onChange={sortClickedCallback}
          value="sort"
          color="primary"
          data-testid="sort-toggle"
        />
        Use Projections
        <Switch
          checked={useProjections}
          onChange={setUseProjectionsCallback}
          value="sort"
          color="primary"
          disabled={!sortScores}
        />
      </div>
      {scoresList.map((score) => (
        <TeamScoreCard
          data-testid="team-score-card"
          score={score}
          key={score.teamName}
          boxScoreLink={boxScoreLink(year, props.week, score.gameInfo.id)}
        />
      ))}
      {isLoaded && !scoresList.length && (
        <div>No scores found for week {props.week}</div>
      )}
    </div>
  );
}

function boxScoreLink(year, week, gameId, gameIdType = '') {
  if (gameIdType == 'nfl') {
    return `https://www.nfl.com/games/${gameId}?active-tab=stats`;
  }
  return `https://www.espn.com/nfl/game/_/gameId/${gameId}`;
}

export default TeamScorePage;
