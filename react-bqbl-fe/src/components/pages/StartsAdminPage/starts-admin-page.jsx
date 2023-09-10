import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import NativeSelect from "@mui/material/NativeSelect";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import * as FOOTBALL from "../../../constants/football";
import { useLeague, useYear } from "../../AppState";
import { FirebaseContext } from "../../Firebase";
import RequireLeague from "../../reusable/RequireLeague";

function StartsAdminPage() {
  return (
    <RequireLeague>
      <StartsAdmin />
    </RequireLeague>
  );
}

function StartsAdmin() {
  const firebase = useContext(FirebaseContext);
  let [weeks, setWeeks] = useState({});
  let [uid, setUid] = useState("");
  let [users, setUsers] = useState([]);

  let year = useYear();
  let league = useLeague();

  const handleChange = (event) => {
    setUid(event.target.value);
  };

  useEffect(() => {
    firebase.getUsersThen(league, year, setUsers);
  }, [firebase, league, year]);

  useEffect(() => {
    if (!uid) {
      return;
    }
    const unsubStarts = firebase.getStartsYearThen(uid, league, year, setWeeks);
    return () => {
      unsubStarts();
    };
  }, [firebase, league, year, uid]);

  return (
    <div>
      <div>
        <Select id="user-select" label="User" onChange={handleChange} value={uid}>
          <MenuItem value={""} key={100}>
            None
          </MenuItem>

          {Object.entries(users).map((entry, index) => (
            <MenuItem value={entry[0]} key={index}>
              {entry[1].name}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Table size="small">
        <TableBody>
          {Object.values(weeks).map((week, index) => (
            <StartsWeek
              week={week}
              league={league}
              year={year}
              index={index}
              key={index}
              uid={uid}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

StartsWeek.propTypes = {
  week: PropTypes.object.isRequired,
  league: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
};

function StartsWeek(props) {
  const firebase = useContext(FirebaseContext);
  let [teamOne, setTeamOne] = useState(getSelectedTeam(props.week, 1));
  let [teamTwo, setTeamTwo] = useState(getSelectedTeam(props.week, 2));

  useEffect(() => {
    const defaultTeamOne = getSelectedTeam(props.week, 1);
    const defaultTeamTwo = getSelectedTeam(props.week, 2);
    if (teamOne != defaultTeamOne || teamTwo != defaultTeamTwo) {
      let newWeek = props.week;
      let teamOneSeen = false;
      let teamTwoSeen = false;
      for (let team of newWeek.teams) {
        if (team.name == teamOne) {
          teamOneSeen = true;
          team.selected = true;
        } else if (team.name == teamTwo) {
          teamTwoSeen = true;
          team.selected = true;
        } else {
          team.selected = false;
        }
      }
      if (!teamOneSeen) newWeek.teams.push({ name: teamOne, selected: true });
      if (!teamTwoSeen) newWeek.teams.push({ name: teamTwo, selected: true });
      firebase.updateStartsRow(
        props.league,
        props.year,
        props.week.id,
        props.uid,
        newWeek
      );
    }
  }, [teamOne, teamTwo]);

  function getSelectedTeam(week, offset) {
    let found = 0;
    for (let team of week.teams) {
      if (team.selected) {
        found++;
      }
      if (found == offset) {
        return team.name;
      }
    }
    return "";
  }

  return (
    <TableRow key={props.week.id}>
      <TableCell scope="row">{props.week.id}</TableCell>

      <TableCell align="center" key={"" + props.week.id + "1"}>
        <TeamSelector
          selectCallback={setTeamOne}
          weekId={props.week.id}
          team={teamOne || {}}
        />
      </TableCell>

      <TableCell align="center" key={"" + props.week.id + "2"}>
        <TeamSelector
          selectCallback={setTeamTwo}
          weekId={props.week.id}
          team={teamTwo || {}}
        />
      </TableCell>
    </TableRow>
  );
}

function TeamSelector({ selectCallback, team, disabled }) {
  return (
    <NativeSelect
      value={team || ""}
      onChange={(e) => selectCallback.bind(null)(e.target.value)}
      input={<Input />}
      disabled={disabled}
    >
      <option value="">None</option>
      {FOOTBALL.ALL_TEAMS.map((team) => (
        <option value={team} key={team}>
          {team}
        </option>
      ))}
    </NativeSelect>
  );
}

export default StartsAdminPage;
