args = splitHash();

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

		firebase.database().ref(getEventsPath()).once('value').then(onEventLoad);
	});

function getEventsPath() {
	return "events/" + args.year + "/" + args.week;
}

function makeLogoImageHref(team) {
	if (team == "WAS") {
		return "http://vergecampus.com/wp-content/uploads/2016/09/Joe-Biden.jpg";
	}
	return "http://arrogant-bastard.dyndns.org:81/bqbl/images/" + team + ".png";
}

function onEventLoad(snapshot) {
	var events = {};
	var interceptions = snapshot.val().interceptions;
	interceptions.forEach(function (interception) {
			interception.title = formatDescription("interception", interception);
			events[Number(interception.key)] = interception;
		});

	var safeties = snapshot.val().safeties;
	safeties.forEach(function (safety) {
			safety.title = formatDescription("safety", safety);
			events[Number(safety.key)] = safety;
		});

	var fumbles = snapshot.val().fumbles;
	fumbles.forEach(function (fumble) {
			fumble.title = formatDescription("fumble", fumble);
			events[Number(fumble.key)] = fumble;
		});

	var keys = Object.keys(events);
	for (var i = 0; i < keys.length; i++) {
		var event = events[keys[i]];
		event.time = formatTime(event);
		document.querySelector(".page-content").append(makeRow(event));
	}
}

function formatDescription(type, item) {
	return item.team + " " + type;
}

function formatTime(item) {
  return  "q" + item.quarter + " - " + item.time;
}

function makeRow(item, id) {
	var tpl = document.querySelector("#item_tpl").cloneNode(true);
	var descElement = tpl.querySelector("div.desc");
	var titleElement = tpl.querySelector("span.title");
	var imageElement = tpl.querySelector("img.logo");
	var timeElement = tpl.querySelector("div.time");
	
	tpl.setAttribute("id", id);
	descElement.textContent = item.desc;
	titleElement.textContent = item.title;
	timeElement.textContent = item.time;
	imageElement.setAttribute("src", makeLogoImageHref(item.team));
	return tpl;
};

// Take window.location.hash and turn it into a key:val map.
function splitHash() {
	// Strip leading # and split by &
	var items = window.location.hash.slice(1).split("&");
	var ret = {};
	items.forEach(function (item) {
			var vals = item.split("=");
			ret[vals[0]] = vals[1];
		});
	return ret;
}