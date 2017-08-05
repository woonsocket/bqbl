function updatePage() {
	args = splitHash();
	document.querySelector("#players_list").innerHTML = "";
	document.querySelector("#teams_list").innerHTML = "";
	firebase.database().ref("score/" + args.year + "/" + args.week).once('value').then(function (snapshot) {
			// todo harveyj clean up
			window.scores = snapshot.val();
			console.log(window.scores);
			firebase.database().ref("users/").once('value').then(onEventLoad);
		});
}

function onEventLoad(usersRaw) {
	var users = usersRaw.val();
	Object.keys(users).forEach(function (userKey) {
			var row = makeRow(users[userKey], userKey);
			document.querySelector("#players_list").append(row);
		});
}

function makeRow(user, id) {
	var tpl = document.querySelector("#item_tpl").cloneNode(true);
	console.log(user);
	console.log(args.week);
	var weeks = user.weeks;

	tpl.querySelector(".name").textContent = user.name;				

	console.log(weeks[args.week]);
	var week = weeks[args.week];
	var found = 0;
	for (var i = 0; i < user.teams.length; i++) {
		var team = user.teams[i];
		if (week[team]) {
			tpl.querySelector(".team-" + found).textContent = team;			
			found += 1;
		}
		// todo harveyj use window.scores to sum up aggregate score.
	}

	return tpl;
};

