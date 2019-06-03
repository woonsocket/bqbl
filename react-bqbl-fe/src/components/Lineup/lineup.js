import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import './lineup.css'
class LineupPageBase extends Component {
  constructor(props) {
    super(props);

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
    console.log(user);
    this.props.firebase.starts_year(user.uid, '2018').on('value', snapshot => {
      console.log(snapshot.val());
      const vals = snapshot.val();
      const valsList = Object.keys(vals).map(key => ({
        ...vals[key],
        uid: key,
      }));
      this.setState({ valsList: valsList })
    })
  }

  render() {
    return (
      <React.Fragment>

        {this.state.valsList.map((week, index) => (
          <div>
            <LineupWeek
              week={week} index={index}
            />
          </div>
        ))}
      </React.Fragment>
    );
  }
}


const LineupWeek = ({ week, index }) => (
  <React.Fragment>
    <div className="id">Week {week.id}</div> 
    {week.teams.map((team) => (
        <div className={team.selected ? "team" : "team selected"}>{team.name}</div>
    ))}
  </React.Fragment>
);


const LineupPage = compose(
  withRouter,
  withFirebase,
)(LineupPageBase);

export default LineupPage;
