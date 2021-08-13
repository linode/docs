export function sendEvent(name, data, el = document) {
	var event = new CustomEvent(name, {
		bubbles: true,
		detail: data
	});
	el.dispatchEvent(event);
}

export function setDocumentMeta(meta) {
	document.title = meta.title;
}

export function toggleBooleanClass(baseClass, el, truthy) {
	const is = `is-${baseClass}`;
	const isNot = `is-not-${baseClass}`;

	if (truthy) {
		if (el.classList.contains(isNot)) {
			el.classList.remove(isNot);
		}
		el.classList.add(is);
	} else {
		if (el.classList.contains(is)) {
			el.classList.remove(is);
		}
		el.classList.add(isNot);
	}
}

export function toggleClass(openClass, el, open) {
	if (open) {
		el.classList.add(openClass);
	} else {
		el.classList.remove(openClass);
	}
}

// normalizeSpace replaces any whitespace character (spaces, tabs, newlines and Unicode space) with a space.
// Multiple spaces are collapsed into one.
export function normalizeSpace(text) {
	return text.replace(/\s\s+/g, ' ');
}

export const capitalize = (s) => {
	if (typeof s !== 'string') return '';
	return s.charAt(0).toUpperCase() + s.slice(1);
};

export function toDateString(date) {
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
export function sprintf(format) {
	var args = Array.prototype.slice.call(arguments, 1);
	var i = 0;
	return format.replace(/%s/g, function() {
		return args[i++];
	});
}

// Borrowed from AlpineJS: https://github.com/alpinejs/alpine/blob/master/src/utils.js
export function debounce(func, wait) {
	var timeout;
	return function() {
		var context = this,
			args = arguments;
		var later = function() {
			timeout = null;
			func.apply(context, args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

export function waitUntil(condition) {
	const checkResolved = function(resolve, condition, callCounter = 0) {
		if (callCounter > 100) {
			console.error('waitUntil timed out');
			resolve();
			return;
		}
		if (condition()) {
			resolve();
			return;
		}

		callCounter++;
		setTimeout(function() {
			checkResolved(resolve, condition, callCounter);
		}, 200);
	};

	return new Promise((resolve) => {
		checkResolved(resolve, condition);
	});
}

export function isMobile() {
	return document.documentElement.clientWidth < 768;
}

export function isScreenLargerThan(px) {
	return document.documentElement.clientWidth > px;
}

export function isTouchDevice() {
	try {
		document.createEvent('TouchEvent');
		return true;
	} catch (e) {
		return false;
	}
}

export function isTopBarPinned() {
	return document.body.classList.contains('is-topbar-pinned');
}
