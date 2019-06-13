import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import './lineup.css'
class LineupPageBase extends Component {
  constructor(props) {
    super(props);
    this.user = null;
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
  }

  render() {
    return (
      <React.Fragment>

        {this.state.valsList.map((week, index) => (
          <div>
            <LineupWeek
              week={week} index={index} 
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
      updateCallback: props.updateCallback
    };
  }

  handleClick(elem) {
    var idx = elem.currentTarget.getAttribute("data-idx");
    this.state.weekData.teams[idx].selected = 
      ! this.state.weekData.teams[idx].selected;
    this.setState(this.state);
    this.state.updateCallback(this.state.weekData, this.state.weekIndex)
  }

  render() {
    return (
      <React.Fragment>
        <div className="id" id={this.state.weekData.id}>
          Week {this.state.weekData.id}</div>
        {this.state.weekData.teams.map((team, idx) => (
          <div data-idx={idx} onClick={this.handleClick.bind(this)}
            className={team.selected ? "team" : "team selected"}>{team.name}
          </div>
        ))}
      </React.Fragment>
    )
  }
};

const LineupPage = compose(
  withRouter,
  withFirebase,
)(LineupPageBase);

export default LineupPage;
