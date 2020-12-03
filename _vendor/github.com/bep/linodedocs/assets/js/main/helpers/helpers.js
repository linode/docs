function sendEvent(name, data, el = document) {
	var event = new CustomEvent(name, {
		bubbles: true,
		detail: data
	});
	el.dispatchEvent(event);
}

function setDocumentMeta(meta) {
	document.title = meta.title;
}

function toggleBooleanClass(baseClass, el, truthy) {
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

function toggleClass(openClass, el, open) {
	if (open) {
		el.classList.add(openClass);
	} else {
		el.classList.remove(openClass);
	}
}

const capitalize = (s) => {
	if (typeof s !== 'string') return '';
	return s.charAt(0).toUpperCase() + s.slice(1);
};

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

function isTouchDevice() {
	try {
		document.createEvent('TouchEvent');
		return true;
	} catch (e) {
		return false;
	}
}

function isTopBarPinned() {
	return document.body.classList.contains('is-topbar-pinned');
}
