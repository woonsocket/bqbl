function updatePage() {
	args = splitHash();
	document.querySelector("#fumbles_list").innerHTML = "";
	document.querySelector("#safeties_list").innerHTML = "";
	document.querySelector("#benchings_list").innerHTML = "";
	console.log(getEventsPath());
	firebase.database().ref(getEventsPath()).once('value').then(onEventLoad);
}

function onEventLoad(snapshot) {
	var fumbles = snapshot.val().fumbles;
	for (var i = 0; i < fumbles.length; i++) {
		var fumble = fumbles[i];
		var row = makeRow(fumble, i, getEventsPath() + "/fumbles");
		document.querySelector("#fumbles_list").append(row);
	}

	var safeties = snapshot.val().safeties;
	for (var i = 0; i < safeties.length; i++) {
		var safety = safeties[i];
		var row = makeRow(safety, i, getEventsPath() + "/safeties");
		document.querySelector("#safeties_list").append(row);
	}

	var allTeams = ["ARI","ATL","BAL","BUF","CAR","CHI","CIN","CLE","DAL","DEN","DET",
									"GB","HOU","IND","JAX","KC","LA","MIA","MIN","NE","NO","NYG","NYJ",
									"OAK", "PHI","PIT","SD","SEA","SF","TB","TEN","WSH"];
	var benchings = snapshot.val().benchings;
	allTeams.forEach(function(team) {
			var valid = benchings && benchings[team] && benchings[team].valid;
			var row = makeRow({"desc": team, "valid": valid}, team, getEventsPath() + "/benchings");
			document.querySelector("#benchings_list").append(row);
		});
}

function makeRow(item, id, path) {
	var tpl = document.querySelector("#item_tpl").cloneNode(true);
	var descElement = tpl.querySelector("span.desc");
	var inputElement = tpl.querySelector("input");
	
	tpl.setAttribute("id", id);
	descElement.textContent = item.desc;
	inputElement.checked = item.valid;
	tpl.querySelector("input").onclick =
		clickHandler.bind(null, id, path, inputElement);
	return tpl;
};

function clickHandler(id, path, inputElement) {
  var updates = {};
  updates[path + "/" + id + "/valid"] = inputElement.checked;
  return firebase.database().ref().update(updates);
};
