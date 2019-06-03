import React from 'react';
import ScoreLine from '../NflScoreCard/nfl-score-card';

const Scores = ({ scores }) => (
  <React.Fragment>

    {scores.map(score => (
      <ScoreLine
        score={score}
      />
    ))}
  </React.Fragment>
);

export default Scores;