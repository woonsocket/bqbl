import React from 'react';

import { withFirebase } from '../../Firebase';
import * as FOOTBALL from '../../../constants/football';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

import TeamIcon from '../../reusable/TeamIcon/team-icon';

function TwentyFourPageBase(props) {

  let [scores247, setScores247] = React.useState({});

  React.useEffect(() => {
    return props.firebase.get247(props.year, setScores247);
  }, [props.firebase]);

  return (
    <>
      <h2>{props.year} scores</h2>
      <ScoreTable scores={scores247} />
      <h2>Award points</h2>
      <ScoreForm firebase={props.firebase} year={props.year} />
    </>
  );
}

ScoreForm.propTypes = {
  firebase: PropTypes.object.isRequired,
  year: PropTypes.string.isRequired,
};

function ScoreForm(props) {
  const [values, setValues] = React.useState({
    desc: '',
    points: 0,
    team: 'NYJ',
    url: '',
    week: ''
  });

  const handleChange = name => event => {
    setValues({...values,
      [name]: event.target.value,
    });
  };

  const onClick = () => {
    props.firebase.push247(props.year, values);
  };

  return (
    <>
      <TextField
        label="Desc"
        margin="normal"
        value={values.desc}
        onChange={handleChange('desc')}
        variant="outlined" /><br />
      <TextField
        label="Points"
        margin="normal"
        value={values.points}
        onChange={handleChange('points')}
        variant="outlined" /><br />
      <div> Team: <Select
        label="Team"
        value={values.team}
        onChange={handleChange('team')}
      >
        {FOOTBALL.ALL_TEAMS.map(team =>
          <MenuItem value={team} key={team}>{team}</MenuItem>)}
      </Select></div>
      <TextField
        label="Url"
        margin="normal"
        value={values.url}
        onChange={handleChange('url')}
        variant="outlined" /><br />
      <TextField
        label="Week"
        defaultValue="1"
        margin="normal"
        value={values.week}
        onChange={handleChange('week')}
        variant="outlined" /><br />
      <Button value="Submit" color="primary" variant="contained" onClick={onClick}>
        Add
      </Button>
    </>
  );
}

ScoreTable.propTypes = {
  scores: PropTypes.object.isRequired,
};

function ScoreTable(props) {
  // TODO(aerion): Validate the props.scores.
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell scope="row">Team</TableCell>
          <TableCell scope="row">Week</TableCell>
          <TableCell scope="row">Points</TableCell>
          <TableCell scope="row">Description</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(props.scores).map(([key, item]) => (
          <TableRow key={key}>
            <TableCell scope="row">
              <TeamIcon team={item.team} width="40px" />
            </TableCell>
            <TableCell scope="row">{item.week}</TableCell>
            <TableCell scope="row">{item.points}</TableCell>
            <TableCell scope="row">
              {item.desc}
              {item.url && (
                <Button size="small" color="primary" href={item.url}>
                  Link
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const TwentyFourPage = compose(
  withRouter,
  withFirebase,
)(TwentyFourPageBase);

export default TwentyFourPage;
