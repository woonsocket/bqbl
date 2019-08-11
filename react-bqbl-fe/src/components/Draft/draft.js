import React, { Component, useState } from 'react';

//TODO: Every stylesheet in the source directory appears to be getting included.
import './draft.css'
import { withFirebase } from '../Firebase';
import * as FOOTBALL from '../../constants/football';
import TabPanel from '../reusable/TabPanel/tab-panel'

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

class DraftPageBase extends Component {
  constructor(props) {
    super(props);
    this.leagueid = props.match.params.league || "abqbl";
    this.year = props.match.params.year || "2019";
    this.firebase = props.firebase;
    this.state = {
      inLeague: false,
      value: 0
    };
  }

  componentDidMount() {
    this.props.firebase.league_spec(this.leagueid).once('value').then(data => {
      let lsdp = new LeagueSpecDataProxy({year: this.year});
      let uid = this.props.firebase.getCurrentUser() ? this.props.firebase.getCurrentUser().uid : null;
      let isInLeague = lsdp.isInLeague(uid, data.val());
      let takenTeams = lsdp.getTakenTeams(data.val());
      let draftList = lsdp.getDraftList(data.val())
      this.setState({ inLeague: isInLeague, takenTeams: takenTeams, draftList: draftList});
    });
  }

  addUser() {
    // TODO: Race conditions ahoy!
    this.props.firebase.league_spec(this.leagueid).once('value').then(data => {
      let leagueData = data.val();
      let lsdp = new LeagueSpecDataProxy();
      let uid = this.props.firebase.getCurrentUser() ? this.props.firebase.getCurrentUser().uid : null;
      let newData = lsdp.addUser(uid, leagueData);
      this.props.firebase.league_spec(this.leagueid).update(newData);
    });

  }

  selectCallback(team) {
    this.props.firebase.draftTeam()({team: team, league:this.leagueid}).then(function(result) {
      console.log(result);
    });
    
  }

  handleChange(event, newValue) {
    this.setState({ value: newValue });
  }

  render() {
    // TODO: Redirect away from this page entirely for signed-out users.
    return <React.Fragment>
      <Tabs value={this.state.value} onChange={this.handleChange.bind(this)} variant="fullWidth">
        <Tab label="Select" />
        <Tab label="History" />
      </Tabs>
      <TabPanel value={this.state.value} index={0}>
        {this.state.inLeague ?
          <DraftSelectionGrid selectCallback={this.selectCallback.bind(this)} 
            taken={this.state.takenTeams}/> 
          : <NotInLeagueUI adduser={this.addUser.bind(this)} />
        }
      </TabPanel>
      <TabPanel value={this.state.value} index={1}>
        <DraftSelectionList draftList={this.state.draftList} />
      </TabPanel>
    </React.Fragment>
  }
}

function DraftSelectionGrid({ taken=[], selectCallback }) {
  const [selectedTeam, setSelectedTeam] = useState("");

  function updateSelection(team) {
    if (!taken.includes(team)) {
      setSelectedTeam(team);
    }
  }


  return (
    <div className="grid-container">
      {FOOTBALL.ALL_TEAMS.map(team =>
        <div className={["team", selectedTeam == team ? "team-selected" : "", taken.includes(team) ? "taken" : ""].join(' ')}
          key={team}
          onClick={updateSelection.bind(this, team)}
        >
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
      <DraftSnackbar selectedTeam={selectedTeam} selectCallback={selectCallback} setSelectedTeamCallback={setSelectedTeam} />
    </div>
  );
}

function DraftSnackbar({selectedTeam, selectCallback, setSelectedTeamCallback}) {

  function handleConfirm(event, reason) {
    selectCallback(selectedTeam)
    handleClose(event, reason);
  }

  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setSelectedTeamCallback('');
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={selectedTeam != ""}
        onClose={handleClose}
        message={<span id="message-id">Confirm selection</span>}
        action={[
          <Button key="undo" color="secondary" size="small" onClick={handleConfirm}>
            DRAFT {selectedTeam}
          </Button>,
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </div>
  );
}


function DraftSelectionList({ draftList=[{team:'DAL', uid: 15}] }) {

  return (
    draftList.map((row, idx) =>
      <div key={idx}>
        <span>{idx+1}</span>
        <img
          src={
            'http://i.nflcdn.com/static/site/7.5/img/logos/svg/' +
            'teams-matte/' + row.team + '.svg'}
          width='20px'
          alt="" />
        <span className="cell">
          {row.team}
          {"  "}
          {row.uid}
        </span>
      </div>
    )
  )
}

function NotInLeagueUI(props) {
  return (
    <div>
      <Button onClick={props.adduser}>Join</Button>
    </div>
  );

}

class LeagueSpecDataProxy {
  constructor (props) {
    this.year = props.year;
    console.log(props.year)
  }

  isInLeague(uid, leagueData) {
    const users = leagueData.users[this.year];
    for (let i = 0; i < users.length; i++) {
      if (users[i].uid == uid) {
        return true;
      }
    }
    return false;
  }

  addUser(uid, leagueData) {
    let users = leagueData.users[this.year];
    users.push({ name: "Foo", uid: uid, teams: [] });
    return leagueData;
  }

  getTakenTeams(leagueData) {
    return leagueData.draft[this.year].map(draftItem => {return draftItem.team })
  }

  getDraftList(leagueData) {
    return leagueData.draft[this.year];
  }
}

const DraftPage = compose(
  withRouter,
  withFirebase,
)(DraftPageBase);

export default DraftPage;
