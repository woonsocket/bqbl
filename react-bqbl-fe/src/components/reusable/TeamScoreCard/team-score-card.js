import React from 'react';

import './team-score-card.css';

import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

TeamScoreCard.propTypes = {
  score: PropTypes.object.isRequired,
  boxScoreLink: PropTypes.string.isRequired,
}

function TeamScoreCard(props) {

  return (
    <Card className="team-score-card">
      <div>
        <div
          style={{
            'backgroundImage': 'url(http://i.nflcdn.com/static/site/7.5/img/logos/svg/' +
              'teams-matte/' + props.score.teamName + '.svg)'
          }}
          className="bg">
        </div>

        <Box className="header-text">
          <Typography variant="h5" component="h2">
            {props.score.teamName}
          </Typography>
          <Typography>
            {lineScore(props.score.breakdown)} <br />
            {props.score.gameInfo.clock}
          </Typography>
        </Box>
      </div>
      <CardActionArea>
        <CardContent>
          <List>{
            breakdownToComponents(props.score.breakdown).map(
              (line, index) => <LineItem line={line} key={"lineitem" + index} />
            )
          }
            <div className="comp"><b>
              <div className="comp-desc">Total</div>
              <div className="comp-score">{props.score.total}</div>
            </b></div>
            {props.score.total !== props.score.projection.total &&
            <div className="comp"><b>
              <div className="comp-desc">Projection</div>
              <div className="comp-score">{props.score.projection.total}</div>
            </b></div>
            }
          </List>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" href={props.boxScoreLink}>
          Box Score Link
          </Button>
      </CardActions>
    </Card>
  )
}

LineItem.propTypes = {
  line: PropTypes.object.isRequired,
}

function LineItem(props) {
  return (
    <div className="comp">
      <div className="comp-desc">{props.line.desc}</div>
      <div className="comp-score">{props.line.value}</div>
    </div>
  );
}

function breakdownToComponents(breakdown) {
  const components = [];
  // TODO(aerion): Individual turnover values aren't stored in the breakdown so
  // we have to recompute them here. Re-think this schema.
  components.push(simpleMultiple(
    25, breakdown.turnover.types.int6, 'INT returned for TD'));
  components.push(simpleMultiple(
    5, breakdown.turnover.types.int - breakdown.turnover.types.int6, 'INT'));
  components.push(simpleMultiple(
    25, breakdown.turnover.types.fum6, 'fumble lost for TD'));
  components.push(simpleMultiple(
    5, breakdown.turnover.types.fuml - breakdown.turnover.types.fum6,
    'fumble lost'));
  // An OT turnover-6 is worth 50 points total: 25 for the turnover itself, plus
  // 25 bonus points for being in OT. (But again, ideally this code wouldn't
  // have to make that distinction.)
  components.push(simpleMultiple(
    25, breakdown.turnover.types.ot6, 'turnover-TD in OT'));
  components.push(simpleMultiple(
    2, breakdown.fumbleKept.count, 'fumble kept'));
  components.push({
    desc: `${breakdown.turnover.count}-turnover bonus`,
    value: breakdown.turnover.bonusValue,
  });

  components.push({
    desc: `${breakdown.touchdown.count}-touchdown game`,
    value: breakdown.touchdown.value,
  });

  components.push({
    desc: rangeString(breakdown.passingYardage.range) + ' passing yards',
    value: breakdown.passingYardage.value,
  });
  components.push({
    desc: rangeString(breakdown.completion.range) + '% completion rate',
    value: breakdown.completion.value,
  });
  components.push({
    desc: 'longest pass ' + rangeString(breakdown.longPass.range) + ' yards',
    value: breakdown.longPass.value,
  });
  components.push({
    desc: rangeString(breakdown.rushingYardage.range) + ' rushing yards',
    value: breakdown.rushingYardage.value,
  });

  components.push({
    desc: breakdown.sack.count === 1 ? '1 sack' : `${breakdown.sack.count} sacks`,
    value: breakdown.sack.value,
  });

  components.push({
    desc: `${breakdown.safety.count}x QB at fault for safety`,
    value: breakdown.safety.value,
  });

  components.push({
    desc: `${breakdown.bench.count}x QB benched`,
    value: breakdown.bench.value,
  });

  for (let passer of breakdown.passerRating.passers || []) {
    components.push({
      desc: `${passer.rating.toFixed(1)} passer rating (${passer.name})`,
      value: passer.value,
    });
  }

  return components.filter(c => c.value !== 0);
}

/**
 * Creates a ScoreComponent representing a simple "X points per Y" value.
 * @param {number} pointsPer How many points each Y is worth ("X").
 * @param {number} quantity How many Ys there are.
 * @param {string} description A description of what Y is. Probably should be
 *     for the singular form of Y.
 * @return {!ScoreComponent} A ScoreComponent for the points described.
 */
function simpleMultiple(pointsPer, quantity, description) {
  quantity = quantity || 0;
  if (quantity !== 1) {
    description = quantity + 'x ' + description;
  }
  return { desc: description, value: quantity * pointsPer };
}

function rangeString(range) {
  const { min, max } = range;
  if (min === undefined) {
    return `≤ ${max}`;
  }
  if (max === undefined) {
    return `≥ ${min}`;
  }
  return `${min}-${max}`;
}

function lineScore(breakdown) {
  if (!breakdown) {
    return 'No stats yet';
  }

  const cmp = breakdown.completion.completions;
  const att = breakdown.completion.attempts;
  // This is net yards (passing yards minus sack yards).
  const yd = breakdown.passingYardage.yards;
  const int = breakdown.turnover.types.int;
  const td = breakdown.touchdown.count;

  return `${cmp}/${att}, ${yd} yd, ${td} TD, ${int} INT`;
}

export default TeamScoreCard;