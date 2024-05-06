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

// See https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html#RULE_.237_-_Fixing_DOM_Cross-site_Scripting_Vulnerabilities
export function sanitizeHTML(text) {
	var element = document.createElement('div');
	element.innerText = text;
	return element.innerHTML;
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
	return format.replace(/%s/g, function () {
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

// getScrollLeft returns the scrollLeft value needed to make the child element visible.
export function getScrollLeft(parent, child) {
	const parentRect = parent.getBoundingClientRect();
	const childRect = child.getBoundingClientRect();

	// If the child is already visible, return 0.
	if (childRect.left >= parentRect.left && childRect.right <= parentRect.right) {
		return 0;
	}

	return childRect.left - parentRect.left;
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

	let els = isIterable(el) ? el : [el];

	els.forEach((el) => {
		el.classList.add('is-translating');
	});

	setTimeout(function () {
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

const validLangs = ['en', 'es'];

export function getCurrentLangFromLocation() {
	let lang = new URLSearchParams(window.location.search).get('lang');
	if (validLangs.includes(lang)) {
		return lang;
	}
	return '';
}

export function getIntParamFromLocation(param) {
	let value = new URLSearchParams(window.location.search).get(param);
	if (value) {
		return parseInt(value, 10);
	}
	return 0;
}

export function isIterable(obj) {
	return Symbol.iterator in Object(obj);
}

export function isMobile() {
	return document.documentElement.clientWidth < 768;
}

export function isDesktop() {
	return isScreenLargerThan(1279); // xl in Tailwind config.
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

export function updatePaginationParamInLocation(pageKey, pageNum, firstPage = 1) {
	let url = new URL(window.location);
	url.hash = '';
	if (pageNum == firstPage) {
		url.searchParams.delete(pageKey);
	} else {
		url.searchParams.set(pageKey, pageNum);
	}
	window.history.replaceState({ turbo: {} }, '', url);
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

const month = 30 * 24 * 60 * 60 * 1000;

export function setCookie(name, value, duration = month) {
	const d = new Date();
	d.setTime(d.getTime() + duration);
	const expires = `expires=${d.toUTCString()}`;
	document.cookie = `${name}=${value};${expires};path=/`;
}

export function getCookie(name) {
	const prefix = `${name}=`;
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(prefix) === 0) {
			return c.substring(prefix.length, c.length);
		}
	}
	return '';
}

export function supportsCookies() {
	try {
		return Boolean(navigator.cookieEnabled);
	} catch (e) {
		return false;
	}
}

// https://github.com/algolia/search-insights.js/blob/738e5d9e2a9c416104949ca3509b65e7cb790079/lib/utils/uuid.ts
export function createUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}
