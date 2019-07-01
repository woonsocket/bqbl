import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import WeekTeamRow from '../WeekTeam/week-team';

import { withFirebase } from '../Firebase';

const ALL_WEEKS_REVERSE = ["17", "16", "15", "14", "13", "12", "11", "10",
  "9", "8", "7", "6", "5", "4", "3", "2", "1"];
const FOLD = 4;

class PlayerStandingsPageBase extends Component {
  constructor(props) {
    super(props);
    this.user = null;
    this.state = {
      players: [],
    };
  }

  componentDidMount() {
    var scoresPromise = this.props.firebase.scores_year('2018').once('value');
    var startsPromise =
      this.props.firebase.league_starts_year(
        '2019', "-KtC8hcGgvbh2W2Tq79n").once('value');

    Promise.all([scoresPromise, startsPromise]).then(
      ([scoresSnapshot, startsSnapshot]) => {
        const scores = scoresSnapshot.val();
        const starts = startsSnapshot.val();
        const players = {};
        for (var weekIndex of Object.keys(starts)) {
          const week = starts[weekIndex];
          for (const playerKey of Object.keys(week)) {
            const name = week[playerKey].name;
            if (!players[name]) {
              players[name] = {};
            }
            if (week[playerKey].starts) {
              for (const start of week[playerKey].starts) {
                if (scores[weekIndex][start.name]) {
                  start["total"] = scores[weekIndex][start.name].total;
                }
              }
            }
            players[name][weekIndex] = week[playerKey];
          }
        }
        this.setState({ players: players });
      })
  }

  render() {
    return (
      <React.Fragment>
        {Object.entries(this.state.players).map(([name, player]) => (
          <div>
            <PlayerYearCard
              player={player}
              name={name}
            />
          </div>
        ))}
      </React.Fragment>
    );
  }
}


class PlayerYearCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: props.player,
      name: props.name,
      expanded: false,
    };
  }

  handleExpandClick() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    return (
      <React.Fragment>
        {/* {JSON.stringify(this.state)} */}
        <Card>
          <CardHeader
            avatar={
              <Avatar aria-label="Recipe">
                {this.state.name[0]}
              </Avatar>
            }
            title={this.state.name}
            subheader="Total"
          />
          <CardContent>
            {ALL_WEEKS_REVERSE.slice(0, FOLD).map(weekId => (
              <WeekTeamRow week={this.state.player[weekId]} weekId={weekId}>
              </WeekTeamRow>
            ))}

          </CardContent>
          <CardActions disableSpacing>
            <IconButton
              // className={clsx(this.classes.expand, {
              //   [this.classes.expandOpen]: this.state.expanded,
              // })}
              onClick={this.handleExpandClick.bind(this)}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>
              {ALL_WEEKS_REVERSE.slice(FOLD).map(weekId => (
                <WeekTeamRow week={this.state.player[weekId]} weekId={weekId}>
                </WeekTeamRow>
              ))}
            </CardContent>
          </Collapse>
        </Card>
      </React.Fragment>
    )
  }
};
const PlayerStandingsPage = compose(
  withRouter,
  withFirebase,
)(PlayerStandingsPageBase);

export default PlayerStandingsPage;