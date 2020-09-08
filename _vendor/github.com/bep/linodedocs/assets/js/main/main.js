/*

Note that we currently use Hugo to create our JS bundle, so no require, no import. For now.

*/

// Toggle this to show debug information in the console.
var LN_DEBUG = 0;

(function() {
	// Prevent turbolinks from handling anchor links.
	// See https://github.com/turbolinks/turbolinks/issues/75
	document.addEventListener('turbolinks:click', function(event) {
		const anchorElement = event.target.closest('a');

		var noTurbolink =
			anchorElement.hash &&
			anchorElement.origin === window.location.origin &&
			anchorElement.pathname === window.location.pathname;

		if (noTurbolink) {
			event.preventDefault();
		}
	});
})();

function sendEvent(name, data, el = document) {
	var event = new CustomEvent(name, {
		bubbles: true,
		detail: data
	});
	el.dispatchEvent(event);
}

function toggleBooleanClass(baseClass, el, truthy) {
	const is = `is-${baseClass}`;
	const isNot = `is-not-${baseClass}`;

	if (truthy) {
		if (el.classList.contains(isNot)) {
			el.classList.add(is);
			el.classList.remove(isNot);
		}
	} else if (el.classList.contains(is)) {
		el.classList.remove(is);
		el.classList.add(isNot);
	}
}

function toggleClass(openClass, el, open) {
	if (open) {
		el.classList.add(openClass);
	} else {
		el.classList.remove(openClass);
	}
}

function toDateString(date) {
	var year = date.getFullYear().toString().substr(-2);
	var month = date.getMonth() + 1;
	var day = date.getDate();

	if (day < 10) {
		day = '0' + day;
	}
	if (month < 10) {
		month = '0' + month;
	}

	return sprintf('%s/%s/%s', month, day, year);
}

// https://gist.github.com/rmariuzzo/8761698
function sprintf(format) {
	var args = Array.prototype.slice.call(arguments, 1);
	var i = 0;
	return format.replace(/%s/g, function() {
		return args[i++];
	});
}

function isMobile() {
	return document.documentElement.clientWidth < 768;
}

function isTopBarPinned() {
	return document.body.classList.contains('is-topbar-pinned');
}
