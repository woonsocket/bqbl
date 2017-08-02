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

		firebase.auth().onAuthStateChanged(onAuthStateChanged);
		window.addEventListener("hashchange", updatePage, false);
		onPageLoad();
	});

function onAuthStateChanged(user) {
	if (user) {
		// User is signed in.
		var displayName = user.displayName;
		var email = user.email;
		var emailVerified = user.emailVerified;
		var photoURL = user.photoURL;
		var isAnonymous = user.isAnonymous;
		var uid = user.uid;
		var providerData = user.providerData;
		document.querySelector(".login").textContent = user.displayName;
	} else {
		document.querySelector(".login").textContent="Log in";
	}
	updatePage();
}

function handleSignIn() {
	var provider = new firebase.auth.GoogleAuthProvider();
	if (firebase.auth().currentUser) {
		firebase.auth().signOut().then(function() {
			}).catch(function(error) {
					// An error happened.
				});
	} else {
		firebase.auth().signInWithRedirect(provider);
	}
}

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

function getUserPath() {
	return "users/" + firebase.auth().currentUser.uid;
}

function getEventsPath() {
	return "events/" + args.year + "/" + args.week;
}

// https://stackoverflow.com/questions/23013447/how-to-define-handlebar-js-templates-in-an-external-file
function loadHandlebarsTemplate(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var raw = xhr.responseText;
			var compiled = Handlebars.compile(raw);
			callback(compiled);
		}
	};
	xhr.send();     
}