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

		firebase.auth().onAuthStateChanged(function(user) {
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
			});

		window.addEventListener("hashchange", updatePage, false);
	});

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

function getEventsPath() {
	return "events/" + args.year + "/" + args.week;
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