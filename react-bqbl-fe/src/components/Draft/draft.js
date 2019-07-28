import React, { Component } from 'react';

import './draft.css'
import { withFirebase } from '../Firebase';
import * as FOOTBALL from '../../constants/football';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

class DraftPageBase extends Component {
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
    // this.props.firebase.tmp_starts_year(user.uid, '2019')
    //   .on('value', snapshot => {
    //     const vals = snapshot.val();
    //     const valsList = Object.keys(vals).map(key => ({
    //       ...vals[key],
    //       uid: key,
    //     }));
    //     this.setState({ valsList: valsList })
    //   })
  }

  updateCallback(weekData, weekId) {
//    this.props.firebase.tmp_starts_week(this.user.uid, '2019', weekId).update(weekData);
  }

  render() {
    return (
      <React.Fragment>
        {FOOTBALL.ALL_TEAMS.map(team =>
          <div className="team" key={team}>
            <img
              src={
                'http://i.nflcdn.com/static/site/7.5/img/logos/svg/' +
                'teams-matte/' + team + '.svg'}
              width='80px'
              alt="" /><br />
            <div className="cell">
              {team}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}





  // handleSelect(e) {
  //   var idx = e.currentTarget.getAttribute("id");
  //   let newState = this.state;
  //   if (newState.weekData.teams.length <= idx) {
  //     newState.weekData.teams.push({
  //       name: e.currentTarget.value,
  //       selected: true
  //     })
  //   } else {
  //     newState.weekData.teams[idx].name = e.currentTarget.value;
  //     newState.weekData.teams[idx].selected = true;
  //   }
  //   this.setState(newState);
  //   this.state.updateCallback(this.state.weekData, this.state.weekIndex)
  // }


          // <NativeSelect
          //   value={this.state.weekData.teams[4] && (this.state.weekData.teams[4].name || "")}
          //   onChange={this.handleSelect.bind(this)}
          //   input={<Input name="dh-1" id="4"
          //   />}
          // >          <option value="">None</option>
          //   {ALL_TEAMS.map(team => <option value={team} key={team}>{team}</option>
          //   )}      </NativeSelect>


const DraftPage = compose(
  withRouter,
  withFirebase,
)(DraftPageBase);

export default DraftPage;
