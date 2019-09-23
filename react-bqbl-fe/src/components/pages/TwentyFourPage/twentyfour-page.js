import React from 'react';

import { withFirebase } from '../../Firebase';
import * as FOOTBALL from '../../../constants/football';

import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

function TwentyFourPageBase(props) {

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
    props.firebase.add247(props.year, values);
  };

  return (
    <React.Fragment>
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
      <Button value="Submit" onClick={onClick}> Submit</Button>
    </React.Fragment>
  );
}

const TwentyFourPage = compose(
  withRouter,
  withFirebase,
)(TwentyFourPageBase);

export default TwentyFourPage;
