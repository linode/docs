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

export function isObjectEmpty(object) {
	for (key in object) {
		return false;
	}
	return true;
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

// Function borrowed from https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
export function isElementInViewport(el) {
	var rect = el.getBoundingClientRect();

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}

// getOffsetTop returns the distance from container down to el.
export function getOffsetTop(container, el) {
	var distance = 0;

	if (el.offsetParent) {
		while (true) {
			distance += el.offsetTop;
			el = el.offsetParent;
			if (!el || el === container) {
				break;
			}
		}
	}
	return distance < 0 ? 0 : distance;
}
	
export function setIsTranslating(el, timeout = 1000) {
	let currentLang = getCurrentLang();
	if (!currentLang || currentLang == 'en') {
		return;
	}

	let els = isIterable(el) ? el : [ el ];

	els.forEach((el) => {
		el.classList.add('is-translating');
	});

	setTimeout(function() {
		els.forEach((el) => {
			el.classList.remove('is-translating');
		});
	}, timeout);
}

// getLang gets the language from either the URL or the browser's local storage.
export function getCurrentLang() {
	let lang = getCurrentLangFromLocation();
	if (lang) {
		return lang;
	}

	// _x_ is the special namespace used by AlpineJS.
	// Read it directly here because we need to access it before Alpine is loaded.
	return JSON.parse(localStorage.getItem('_x_currentLang'));
}

export function getCurrentLangFromLocation() {
	return new URLSearchParams(window.location.search).get('lang');
}

export function isIterable(obj) {
	return Symbol.iterator in Object(obj);
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

export function walk(el, callback) {
	if (typeof ShadowRoot === 'function' && el instanceof ShadowRoot) {
		Array.from(el.childNodes).forEach((el2) => walk(el2, callback));
		return;
	}
	let skip = false;
	callback(el, () => (skip = true));
	if (skip) return;
	let node = el.firstElementChild;
	while (node) {
		walk(node, callback, false);
		node = node.nextElementSibling;
	}
}
