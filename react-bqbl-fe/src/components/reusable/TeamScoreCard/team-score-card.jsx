import React, { useState } from "react";

import styles from "./TeamScoreCard.module.css";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import { styled } from '@mui/material/styles';

import PropTypes from "prop-types";

import { teamLogoImage } from "../../../constants/football";
import PasserStats from "../PasserStats/passer-stats";
import ScoreValue from "../ScoreValue/score-value";

// From https://mui.com/material-ui/react-card/
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return (<IconButton {...other} />);
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

TeamScoreCard.propTypes = {
  score: PropTypes.object.isRequired,
  boxScoreLink: PropTypes.string.isRequired,
};

function TeamScoreCard(props) {
  const [expanded, setExpanded] = useState(false);

  function handleExpandClick() {
    setExpanded(!expanded);
  };

  function makeUrl() {
    return teamLogoImage(props.score.teamName);
  }

  return (
    <Card className={styles.teamScoreCard}>
      <div>
        <div
          style={{
            backgroundImage: `url(${makeUrl()})`,
          }}
          className={styles.bg}
        ></div>

        <Box className={styles.headerText}>
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
          <List className={styles.scoreComponentList}>
            {breakdownToComponents(props.score.breakdown).map((line, index) => (
              <LineItem line={line} key={"lineitem" + index} />
            ))}
            <div className={styles.comp}>
              <b>
                <div className={styles.compDesc}>Total</div>
                <div className={styles.compScore}>
                  <ScoreValue score={props.score.total} />
                </div>
              </b>
            </div>
            {!props.score.gameInfo.clock.includes('Final') && (
              <div className={styles.comp}>
                <b>
                  <div className={styles.compDesc}>Projection</div>
                  <div className={styles.compScore}>
                    <ScoreValue score={props.score.projection.total} />
                  </div>
                </b>
              </div>
            )}
          </List>
        </CardContent>
      </CardActionArea>
      <CardActions disableSpacing>
        <Button size="small" color="primary" href={props.boxScoreLink}>
          {boxScoreLinkText(props.score)}
        </Button>
        {props.score.passers && (
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        )}
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <div className={styles.passerStats}>
            {props.score.passers && Object.values(props.score.passers).map((passer) => (
               <PasserStats passer={passer} />
             ))}
          </div>
        </CardContent>
      </Collapse>
    </Card>
  );
}

LineItem.propTypes = {
  line: PropTypes.object.isRequired,
};

function LineItem(props) {
  return (
    <div className={styles.comp}>
      <div className={styles.compDesc}>{props.line.desc}</div>
      <div className={styles.compScore}>
        <ScoreValue score={props.line.value} />
      </div>
    </div>
  );
}

function breakdownToComponents(breakdown) {
  const components = [];
  // TODO(aerion): Individual turnover values aren't stored in the breakdown so
  // we have to recompute them here. Re-think this schema.
  components.push(
    simpleMultiple(25, breakdown.turnover.types.int6, "INT returned for TD")
  );
  components.push(
    simpleMultiple(
      5,
      breakdown.turnover.types.int - breakdown.turnover.types.int6,
      "INT"
    )
  );
  components.push(
    simpleMultiple(25, breakdown.turnover.types.fum6, "fumble lost for TD")
  );
  components.push(
    simpleMultiple(
      5,
      breakdown.turnover.types.fuml - breakdown.turnover.types.fum6,
      "fumble lost"
    )
  );
  // An OT turnover-6 is worth 50 points total: 25 for the turnover itself, plus
  // 25 bonus points for being in OT. (But again, ideally this code wouldn't
  // have to make that distinction.)
  components.push(
    simpleMultiple(25, breakdown.turnover.types.ot6, "turnover-TD in OT")
  );
  components.push(simpleMultiple(2, breakdown.fumbleKept.count, "fumble kept"));
  components.push({
    desc: `${breakdown.turnover.count}-turnover bonus`,
    value: breakdown.turnover.bonusValue,
  });

  components.push({
    desc: `${breakdown.touchdown.count}-touchdown game`,
    value: breakdown.touchdown.value,
  });

  components.push({
    desc: rangeString(breakdown.passingYardage.range) + " passing yards",
    value: breakdown.passingYardage.value,
  });
  components.push({
    desc: rangeString(breakdown.completion.range) + "% completion rate",
    value: breakdown.completion.value,
  });
  components.push({
    desc: "longest pass " + rangeString(breakdown.longPass.range) + " yards",
    value: breakdown.longPass.value,
  });
  components.push({
    desc: rangeString(breakdown.rushingYardage.range) + " rushing yards",
    value: breakdown.rushingYardage.value,
  });

  components.push({
    desc:
      breakdown.sack.count === 1 ? "1 sack" : `${breakdown.sack.count} sacks`,
    value: breakdown.sack.value,
  });

  components.push({
    desc: `${breakdown.safety.count}x QB at fault for safety`,
    value: breakdown.safety.value,
  });

  if (breakdown.fieldPosition) {
    let yardLineDesc = describeYardLine(breakdown.fieldPosition.bestYardLine);
    components.push({
      desc: `field position (${yardLineDesc})`,
      value: breakdown.fieldPosition.value,
    });
  }

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

  return components.filter((c) => c.value !== 0);
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
    description = quantity + "x " + description;
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

/**
 * @param {number} yardLine An integer from 1 to 100, inclusive. Represents the
 * distance from the team's own goal line.
 */
function describeYardLine(yardLine) {
  if (yardLine < 50) {
    return `own ${yardLine}`;
  } else if (yardLine === 50) {
    return `50-yard line`;
  } else if (yardLine < 100) {
    return `opp. ${100 - yardLine}`;
  } else if (yardLine === 100) {
    return `opp. goal`;
  }
  // Should not happen.
  return `${yardLine}-yard line`;
}

function lineScore(breakdown) {
  if (!breakdown) {
    return "No stats yet";
  }

  const cmp = breakdown.completion.completions;
  const att = breakdown.completion.attempts;
  // This is net yards (passing yards minus sack yards).
  const yd = breakdown.passingYardage.yards;
  const int = breakdown.turnover.types.int;
  const td = breakdown.touchdown.count;

  return `${cmp}/${att}, ${yd} yd, ${td} TD, ${int} INT`;
}

function boxScoreLinkText(score) {
  if (score.gameInfo && score.gameInfo.aName) {
    const { aName, aScore, hName, hScore } = score.gameInfo;
    return `${aName} ${aScore} @ ${hName} ${hScore}`;
  }
  return "Box Score Link";
}

export default TeamScoreCard;
