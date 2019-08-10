import React, { Component, useState } from 'react';

//TODO: Every stylesheet in the source directory appears to be getting included.
import './draft.css'
import { withFirebase } from '../Firebase';
import * as FOOTBALL from '../../constants/football';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';

class DraftPageBase extends Component {
  constructor(props) {
    super(props);
    this.leagueid = props.match.params.league || "nbqbl";
    this.firebase = props.firebase;
    this.state = {
      inLeague: false,
      value: 0
    };
  }

  componentDidMount() {
    this.props.firebase.league_spec(this.leagueid).once('value').then(data => {
      let lsr = new LeagueSpecReader();
      let uid = this.props.firebase.getCurrentUser() ? this.props.firebase.getCurrentUser().uid : null;
      let isInLeague = lsr.isInLeague(uid, data.val());
      this.setState({ inLeague: isInLeague });
    });
  }

  addUser() {
    // TODO: Race conditions ahoy!
    this.props.firebase.league_spec(this.leagueid).once('value').then(data => {
      let leagueData = data.val();
      let lsr = new LeagueSpecReader();
      let uid = this.props.firebase.getCurrentUser() ? this.props.firebase.getCurrentUser().uid : null;
      let newData = lsr.addUser(uid, leagueData);
      this.props.firebase.league_spec(this.leagueid).update(newData);
    });

  }

  selectCallback(team) {
    this.props.firebase.draftTeam()({team: team, league:this.leagueid}).then(function(result) {
      var sanitizedMessage = result.data;
      console.log(sanitizedMessage)
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
          <DraftSelectionGrid selectCallback={this.selectCallback.bind(this)} /> : <NotInLeagueUI adduser={this.addUser.bind(this)} />
        }
      </TabPanel>
      <TabPanel value={this.state.value} index={1}>
        <DraftSelectionList />
      </TabPanel>
    </React.Fragment>
  }
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

function DraftSelectionGrid({ taken = ["ARI", "CLE"], selectCallback }) {
  const [selected, setSelected] = useState("DEN");

  function updateSelection(team) {
    if (!taken.includes(team)) {
      setSelected(team);
    }
  }

  return (
    <React.Fragment>
      {FOOTBALL.ALL_TEAMS.map(team =>
        <div className={["team", selected == team ? "team-selected" : "", taken.includes(team) ? "taken" : ""].join(' ')}
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
      <DraftSnackbar teamSelected={selected} selectCallback={selectCallback} />
    </React.Fragment>
  );
}

function DraftSnackbar(props) {
  const [open, setOpen] = React.useState(props.teamSelected);

  function handleClick() {
    setOpen(true);
  }

  function handleConfirm(event, reason) {
    props.selectCallback(props.teamSelected)
    handleClose(event, reason);
  }

  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        onClose={handleClose}
        message={<span id="message-id">Draft!</span>}
        action={[
          <Button key="undo" color="secondary" size="small" onClick={handleConfirm}>
            CONFIRM
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

class LeagueSpecReader {
  isInLeague(uid, leagueData) {
    for (let i = 0; i < leagueData.users.length; i++) {
      if (leagueData.users[i].uid == uid) {
        return true;
      }
    }
    return false;
  }

  addUser(uid, leagueData) {
    leagueData.users.push({ name: "Foo", uid: uid, teams: [] });
    return leagueData;
  }
}

const DraftPage = compose(
  withRouter,
  withFirebase,
)(DraftPageBase);

export default DraftPage;
