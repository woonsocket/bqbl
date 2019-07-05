import React, { Component } from 'react';

import './lineup.css'
import { withFirebase } from '../Firebase';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Input from '@material-ui/core/Input';
import NativeSelect from '@material-ui/core/NativeSelect';

const ALL_TEAMS = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET",
  "GB", "HOU", "IND", "JAX", "KC", "LA", "MIA", "MIN", "NE", "NO", "NYG", "NYJ",
  "OAK", "PHI", "PIT", "SD", "SEA", "SF", "TB", "TEN", "WSH"]


class LineupPageBase extends Component {
  constructor(props) {
    super(props);
    this.user = null;
    this.dh = true;
    this.state = {
      valsList: [],
    };
  }

  componentDidMount() {
    this.props.firebase.addAuthListener(this.authChanged.bind(this))
  }

  authChanged(user) {
    if (!user) {
      console.log("bail!");
      return;
    }
    this.user = user;
    this.props.firebase.tmp_starts_year(user.uid, '2019')
      .on('value', snapshot => {
        const vals = snapshot.val();
        const valsList = Object.keys(vals).map(key => ({
          ...vals[key],
          uid: key,
        }));
        this.setState({ valsList: valsList })
      })
  }

  updateCallback(weekData, weekId) {
    this.props.firebase.tmp_starts_week(this.user.uid, '2019', weekId)
      .update(weekData);
    console.log(weekData)
  }

  render() {
    return (
      <React.Fragment>
        {this.state.valsList.map((week, index) => (
          <div key={index}>
            <LineupWeek
              week={week} index={index} dh={this.dh}
              updateCallback={this.updateCallback.bind(this)}
            />
          </div>
        ))}
      </React.Fragment>
    );
  }
}


class LineupWeek extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weekData: props.week,
      weekIndex: props.index,
      updateCallback: props.updateCallback,
      dh: props.dh
    };
  }

  handleClick(e) {
    var idx = e.currentTarget.getAttribute("data-idx");
    let newState = this.state;
    newState.weekData.teams[idx].selected =
      !this.state.weekData.teams[idx].selected;
    this.setState(newState);
    this.state.updateCallback(this.state.weekData, this.state.weekIndex)
  }

  handleSelect(e) {
    var idx = e.currentTarget.getAttribute("id");
    let newState = this.state;
    if (newState.weekData.teams.length <= idx) {
      newState.weekData.teams.push({
        name: e.currentTarget.value,
        selected: true
      })
    } else {
      newState.weekData.teams[idx].name = e.currentTarget.value;
      newState.weekData.teams[idx].selected = true;
    }
    this.setState(newState);
    this.state.updateCallback(this.state.weekData, this.state.weekIndex)
  }

  render() {
    return (
      <React.Fragment>
        <div className="id" key={this.state.weekData.id}>
          Week {this.state.weekData.id}</div>
        {this.state.weekData.teams.slice(0, 4).map((team, idx) => (
          <div key={idx} data-idx={idx} onClick={this.handleClick.bind(this)}
            className={team.selected ? "team" : "team selected"}>{team.name}
          </div>
        ))}
        {this.state.dh &&
          <NativeSelect
            value={this.state.weekData.teams[4] && (this.state.weekData.teams[4].name || "")}
            onChange={this.handleSelect.bind(this)}
            input={<Input name="dh-1" id="4"
            />}
          >          <option value="">None</option>
            {ALL_TEAMS.map(team => <option value={team} key={team}>{team}</option>
            )}      </NativeSelect>

        }

        {this.state.dh &&
          <NativeSelect
            value={this.state.weekData.teams[5] && (this.state.weekData.teams[5].name || "")}
            onChange={this.handleSelect.bind(this)}
            input={<Input name="dh-2" id="5"
            />}
          >          <option value="">None</option>
            {ALL_TEAMS.map(team => <option value={team} key={team}>{team}</option>
            )}      </NativeSelect>

        }

      </React.Fragment>
    )
  }
}

const LineupPage = compose(
  withRouter,
  withFirebase,
)(LineupPageBase);

export default LineupPage;
