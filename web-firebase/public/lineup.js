var lineupTableTpl = null;

function onPageLoad() {
	loadHandlebarsTemplate("lineup-table.tpl.js", function (loadedTpl) {
		lineupTableTpl = loadedTpl;
	});

	loadHandlebarsTemplate("header.tpl.js", function (headerTpl) {
		var headerHtml = headerTpl({"title": "Lineup"});
		document.getElementById("header").innerHTML = headerHtml;
	});
}

function updatePage() {
	args = splitHash();
	document.querySelector("#content").innerHTML = "";
	if (firebase.auth().currentUser == null) {
		console.log('null!');
	} else {
		firebase.database().ref(getUserPath()).once('value').then(onEventLoad);
	}
}

function onEventLoad(snapshot) {
	var weeks = snapshot.val().weeks;
	var lineupTableDict = {
		'week': []
	};
	weeks.forEach(function (week, i) {
		var row = makeRow(week, i, snapshot.val().teams);
		lineupTableDict.week.push(row);
	});
	document.querySelector("#content").innerHTML = lineupTableTpl(lineupTableDict);

	document.querySelectorAll(".cell-listener").forEach(function (cell) {
		cell.addEventListener('click', lineupOnClick);
	});
}

function makeRow(week, id, teams) {
	for (var i = 0; i < 4; i++) {
		if (week[teams[i]] == "1") {
			week[teams[i]] = {'selected': 'selected'};
		}
	}

	weekDict = { 
		'week': id,
		'team': week,
	};
	return weekDict;
};

function lineupOnClick(e) {
	var val;
	if (e.target.classList.contains("selected")) {
		e.target.classList.remove("selected");
		val = 0;
	} else {
		if (e.target.parentElement.querySelectorAll(".selected").length > 1) {
			return;
		}
		e.target.classList.add("selected");
		val = 1;
	}

	var week = e.target.getAttribute('data-week');
	var team = e.target.getAttribute('data-team');
	var path = getLineupPath(week, team);
	var updates = {};
	updates[path] = val;
	return firebase.database().ref().update(updates);
};

function getLineupPath(week, team) {
	return getUserPath() + "/weeks/" + week + "/" + team;
}

function getUserPath() {
	return "users/" + firebase.auth().currentUser.uid;
}