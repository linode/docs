import { getCookie } from '../helpers';

var debug = 0 ? console.log.bind(console, '[trustarc]') : function () {};

const cookieNamePrivacy = 'cmapi_cookie_privacy';
const cookieNameNotice = 'notice_behavior';

export function initConsentManager(trustarcDomain, trustecm, callback) {
	debug('initConsentManager for domain', trustarcDomain);

	// Check to see if any of the TrustArc cookies are already set.
	if (getCookie(cookieNamePrivacy) || getCookie(cookieNameNotice)) {
		debug('TrustArc cookieset');
		doInit(trustecm);
		callback();
	}

	var apiObject = {
		PrivacyManagerAPI: {
			action: 'getConsentDecision',
			timestamp: new Date().getTime(),
			self: trustarcDomain,
		},
	};

	onConsent = function (e) {
		if (typeof e.data != 'string') {
			return;
		}

		let data;
		try {
			data = JSON.parse(e.data);
		} catch (err) {
			return;
		}

		if (data.source == 'preference_manager' && data.message == 'submit_preferences') {
			debug('TrustArc preference message received:', data.message, data.data);
			doInit(trustecm, data.data);
			callback();
		} else if (data.source == 'preference_manager') {
			//debug('Unhandled TrustArc message received:', data.message, JSON.stringify(data));
		}
	};

	window.top.postMessage(JSON.stringify(apiObject), '*');
	window.addEventListener('message', onConsent, false);
}

function doInit(trustecm, privacyCookie = '') {
	// Assume that initConsentManager can be called multiple times and that the consent state may have changed.
	// Start with a clean slate.
	for (let bucket in trustecm) {
		trustecm[bucket] = false;
	}

	let buckets = {
		required: 1,
		performance: 2,
		functional: 3,
		targeting: 4,
		social: 5,
	};

	if (privacyCookie) {
		// The privacy settings fetched from the API are zero based. We need to convert them to 1 based,
		// which is what's stored in the cookie.
		let parts = privacyCookie.split(',');
		for (let i = 0; i < parts.length; i++) {
			parts[i] = parseInt(parts[i]) + 1;
		}
		privacyCookie = parts.join(',');
		debug('received privacy settings from API', privacyCookie);
	} else {
		// If the user has expressed consent, then the cmapi_cookie_privacy cookie will be set, and we can check there to see if the user has allowed a particular bucket.
		privacyCookie = getCookie(cookieNamePrivacy);
		debug('read privacyCookie', privacyCookie);
	}

	if (privacyCookie) {
		for (let bucket in buckets) {
			if (privacyCookie.indexOf(buckets[bucket]) > -1) {
				trustecm[bucket] = true;
			}
		}
		debug('trustecm', trustecm);
		return;
	}

	// If the user has not expressed consent, then the cmapi_cookie_privacy cookie will be missing, so we look instead at the notice_behavior cookie.
	// If it contains the word expressed, then it means we can only fire required tags. But if it doesn't contain expressed, then full consent is implied,
	// and it's ok to fire all the tags.
	noticeBehaviorCookie = getCookie(cookieNameNotice);
	debug('noticeBehaviorCookie', noticeBehaviorCookie);
	if (!noticeBehaviorCookie) {
		return;
	}
	if (noticeBehaviorCookie.indexOf('expressed') > -1) {
		debug('expressed');
		trustecm.required = true;
		return;
	}
	for (let bucket in trustecm) {
		trustecm[bucket] = true;
	}
	debug('trustecm', trustecm);
}
