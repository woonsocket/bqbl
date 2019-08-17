import React, { Component } from 'react';

import './player-standings-page.css';
import { withFirebase } from '../Firebase';
import * as FOOTBALL from "../../constants/football"
import IconScoreCell from '../reusable/IconScoreCell/icon-score-cell'

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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';


export const WEEK_IDS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"]
const ALL_WEEKS_REVERSE = WEEK_IDS.reverse();
const FOLD = 4;

class PlayerStandingsPageBase extends Component {
  constructor(props) {
    super(props);
    this.user = null;
    this.league = this.props.match.params.leagueid || "-KtC8hcGgvbh2W2Tq79n";
    this.year = this.props.match.params.year || "2018";
    this.state = {
      players: [],
      playerTable: {}
    };
  }

  componentDidMount() {
    this.props.firebase.getScores(
      this.league, this.year, ALL_WEEKS_REVERSE, this.setState.bind(this));
  }

  render() {
    return Object.entries(this.state.playerTable).map(([playerId, player]) => (
            <PlayerYearCard player={player} name={playerId} key={playerId}/>
        ))
  }
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
        <Table>
          
          <TableBody>
            {ALL_WEEKS_REVERSE.slice(0, FOLD)
              .filter(weekId => Object.keys(props.player.start_rows).includes(weekId))
              .map(weekId => (
                <TableRow key={weekId}>
                  <TableCell component="th" scope="row">
                    {"Week " + weekId}
                  </TableCell>
                  <TableCell align="left"><IconScoreCell team={props.player.start_rows[weekId].team_1.team_name} score={props.player.start_rows[weekId].team_1.score} /> </TableCell>
                  <TableCell align="left"><IconScoreCell team={props.player.start_rows[weekId].team_2.team_name} score={props.player.start_rows[weekId].team_2.score} /> </TableCell>
                </TableRow>
              ))}
            {/* <Collapse in={expanded} timeout="auto" unmountOnExit> */}
              {ALL_WEEKS_REVERSE.slice(FOLD)
                .filter(weekId => Object.keys(props.player.start_rows).includes(weekId))
                .map(weekId => (
                  <TableRow key={weekId}>
                    <TableCell component="th" scope="row">
                      {"Week " + weekId}
                    </TableCell>
                    <TableCell align="left"><IconScoreCell team={props.player.start_rows[weekId].team_1.team_name} score={props.player.start_rows[weekId].team_1.score} /> </TableCell>
                    <TableCell align="left"><IconScoreCell team={props.player.start_rows[weekId].team_2.team_name} score={props.player.start_rows[weekId].team_2.score} /> </TableCell>
                  </TableRow>
                ))}
            {/* </Collapse> */}
          </TableBody>
        </Table>

      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          // className={clsx(this.classes.expand, {
          //   [this.classes.expandOpen]: this.state.expanded,
          // })}
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