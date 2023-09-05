import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-recompose';
import * as FOOTBALL from '../../../constants/football';
import { useWeek, useYear } from '../../AppState';
import { withFirebase } from '../../Firebase';
import IconAndName from '../../reusable/IconAndName/icon-and-name';




function TwentyFourPageBase(props) {

  let [scores247, setScores247] = React.useState({});
  let year = useYear();
  let week = useWeek();

  React.useEffect(() => {
    return props.firebase.get247(year, setScores247);
  }, [props.firebase, year]);

  return (
    <>
      <h2>{props.year} scores</h2>
      <ScoreTable scores={scores247} />
      <h2>Award points</h2>
      <ScoreForm firebase={props.firebase} year={year} week={week} />
    </>
  );
}

ScoreForm.propTypes = {
  firebase: PropTypes.object.isRequired,
  year: PropTypes.string.isRequired,
  week: PropTypes.string,
};

function ScoreForm(props) {
  const [values, setValues] = React.useState({
    desc: '',
    points: 0,
    team: 'NYJ',
    url: '',
    week: props.week || '1',
  });

  const handleChange = name => event => {
    // Coerce the numeric field to be a number. There's probably a better way to
    // deal with this.
    const newValue = (name === 'points') ?
        Number(event.target.value) :
        event.target.value;
    setValues({...values,
      [name]: newValue,
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
        type="number"
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
              <IconAndName team={item.team} width="40px" />
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
