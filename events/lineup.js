function updatePage() {
	args = splitHash();
	document.querySelector("#page_content").innerHTML = "";
	if (firebase.auth().currentUser == null) {
		console.log('null!');
	} else {
		firebase.database().ref(getUserPath()).once('value').then(onEventLoad);
	}
}

function onEventLoad(snapshot) {
	console.log(snapshot.val());
	var weeks = snapshot.val().weeks;
	var weeksKeys = Object.keys(weeks);
	Object.keys(weeks).forEach(function (week) {
			var row = makeRow(weeks[week], week, snapshot.val().teams);
			document.querySelector("#page_content").append(row);
		});
}

function makeRow(week, id, teams) {
	var tpl = document.querySelector("#item_tpl").cloneNode(true);
	tpl.querySelector(".week").textContent=id;
	for (var i = 0; i < 4; i++) {
		var path = getUserPath()+"/weeks"+"/"+id+"/"+teams[i];
		tpl.querySelector(".team-" + i).textContent = teams[i];
		tpl.setAttribute("id", id);
		if (week[teams[i]] == "1") {
			tpl.querySelector(".team-" + i).classList.add("selected");
			console.log(week[teams[i]]);
			console.log(tpl);
		}
		tpl.querySelector(".team-"+i)
			.addEventListener('click',
												clickHandler.bind(null, id, path, tpl),
												true);
	}
	return tpl;
};

function clickHandler(id, path, row, e) {
	console.log(path);
	console.log(e.target);
	var val;
	if (e.target.classList.contains("selected")) {
		e.target.classList.remove("selected");
		val = 0;
	} else {
		console.log(row.querySelectorAll(".selected"));
		if (row.querySelectorAll(".selected").length > 1) {
			return;
		}
		e.target.classList.add("selected");
		val = 1;
	}

  var updates = {};
  updates[path] = val;
  return firebase.database().ref().update(updates);
};


function getUserPath() {
	return "users/" + firebase.auth().currentUser.uid;
}