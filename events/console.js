document.addEventListener('DOMContentLoaded', function() {
		// Initialize Firebase
		var config = {
			apiKey: "AIzaSyCVbZ7U5Y4ZO-tsQpsZgIf7ROPJdpAXLuE",
			authDomain: "bqbl-591f3.firebaseapp.com",
			databaseURL: "https://bqbl-591f3.firebaseio.com",
			projectId: "bqbl-591f3",
			storageBucket: "bqbl-591f3.appspot.com",
			messagingSenderId: "983576610595"
		};
		firebase.initializeApp(config);

		firebase.database().ref("events/2016/1").once('value').then(onEventLoad);
	});

function onEventLoad(snapshot) {
	var fumbles = snapshot.val().fumbles;
	for (var i = 0; i < fumbles.length; i++) {
		var safety = fumbles[i];
		var row = makeRow(safety, i, "events/2016/1/fumbles");
		document.querySelector("#fumble_list").append(row);
	}

	var safeties = snapshot.val().safeties;
	for (var i = 0; i < safeties.length; i++) {
		var safety = safeties[i];
		var row = makeRow(safety, i, "events/2016/1/safeties");
		document.querySelector("#safety_list").append(row);
	}
}

function makeRow(item, i, path) {
	var tpl = document.querySelector("#radio_tpl").cloneNode(true);
	var descElement = tpl.querySelector("span.desc");
	var inputElement = tpl.querySelector("input");
	
	tpl.setAttribute("id", i);
	descElement.textContent = item.desc;
	inputElement.checked = item.valid;
	tpl.querySelector("input").onclick =
		clickHandler.bind(null, i, path, inputElement);
	return tpl;
};

function clickHandler(id, path, inputElement) {
  var updates = {};
  updates[path + "/" + id + "/valid"] = inputElement.checked;
  return firebase.database().ref().update(updates);
};
