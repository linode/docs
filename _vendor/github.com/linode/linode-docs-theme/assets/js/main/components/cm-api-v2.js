// This is your domain, as in, how you who are calling the API wish to be identified.
var MY_DOMAIN = 'linode.com';
var REQUIRE_USER_EXPRESSED_PERMISSION = true;
var _STATE = {};

/**
 * Different pages add the Consent Manager in different locations, so all callers of the API must wait till
 * the API is loaded. The API is loaded in two stages:
 *      1) The first stage is where the "PrivacyManagerAPI" object exists on the page and where default and
 *         page/domain specific settings can be obtained. If your requirements demand user consent, you must wait
 *         for the second stage load, but it is always recommended to wait for the second stage no matter what.
 *         The "loading" parameter will be added to all API responses when the API is in this state.
 *      2) The second stage loads the user preferences and the domain specific information. If you made a
 *         postMessage API call during the first stage, then the API will automatically send you another, updated,
 *         response if the result has changed.
 */
function runOnce() {
	// CHECK: for API exists on the page
	if (!_STATE.hasRunOnce && window.PrivacyManagerAPI) {
		// console.log("doing run once");

		// Register with the API for automatic updates of user preferences (for the settings you care about)
		// --OR-- if the API is loading, then this will send an update when the API is done and has loaded the user preferences.
		window.addEventListener(
			'message',
			function (e) {
				try {
					var json = JSON.parse(e.data);
					json.PrivacyManagerAPI && handleAPIResponse(json.PrivacyManagerAPI);
				} catch (e) {
					e.name != 'SyntaxError' && console.log(e);
				}
			},
			false
		);
		var apiObject = {
			PrivacyManagerAPI: {
				self: MY_DOMAIN,
				action: 'getConsent',
				timestamp: new Date().getTime(),
				type: 'functional',
			},
		};
		window.top.postMessage(JSON.stringify(apiObject), '*');
		apiObject = {
			PrivacyManagerAPI: {
				self: MY_DOMAIN,
				action: 'getConsent',
				timestamp: new Date().getTime(),
				type: 'advertising',
			},
		};
		window.top.postMessage(JSON.stringify(apiObject), '*');

		_STATE.hasRunOnce = true;
		_STATE.i && clearInterval(_STATE.i);
	}
}

/**
 * This function returns value of notice_behavior cookie to determine location and behavior manager based on domain.
 * When no notice_behavior cookie exists, this returns a blank string.
 */
function getBehavior() {
	var result = '';
	var rx = new RegExp('\\s*notice_behavior\\s*=\\s*([^;]*)').exec(document.cookie);
	if (rx && rx.length > 1) {
		result = rx[1];
	}
	return result;
}

/**
 * This function is called whenever a user preference is initially set, is retrieved for the first time on this page, or is updated.
 * This is the gateway function which should be customized by each client (you) to determine when and how to handle the API response.
 *
 * The second half of the function determines settings from the CM API, and decides which elements on the page should be "activated" based upon those settings.
 * Elements can only be activated once. Elements can not be deactivated, once activated.
 */
function handleAPIResponse(response) {
	// CHECK: make sure this response is to YOU. You will actually get the messages to all API callers on this page, not just to you.
	if (!response.source || response.self != MY_DOMAIN) return;
	// console.log("user decision",response);

	var tcm = window.trustecm;

	// Required trackers/cookies are always allowed, no need to ask permission.
	if (!_STATE.hasLoadedRequired) {
		tcm.required = true;
		_STATE.hasLoadedRequired = true;
	}

	// Check if behavior manager is EU
	var isEU = /.*(,|)eu/i.test(getBehavior());

	//Case where we don't want to do anything till the user has made a preference.
	if (isEU && REQUIRE_USER_EXPRESSED_PERMISSION && response.source != 'asserted') return;

	// Step 1) Get Consent Manager settings (user prefs)
	//         These API calls are DIFFERENT than the original API call ("response" parameter) so they must be called separately.
	// Step 2) Apply the settings after checking if approved
	var setting = null;

	if (!_STATE.hasLoadeSocialMedia) {
		setting = PrivacyManagerAPI.callApi('getConsent', MY_DOMAIN, null, null, 'Social Media Cookies');
		is_approved = setting.consent == 'approved';
		tcm.socialmedia = is_approved;
		if (is_approved) {
			_STATE.hasLoadeSocialMedia = true;
		}
	}

	if (!_STATE.hasLoadedTargeting) {
		setting = PrivacyManagerAPI.callApi('getConsent', MY_DOMAIN, null, null, 'Targeting Cookies');
		is_approved = setting.consent == 'approved';
		tcm.targeting = is_approved;
		if (is_approved) {
			_STATE.hasLoadedTargeting = true;
		}
	}

	if (!_STATE.hasLoadedFunctional) {
		setting = PrivacyManagerAPI.callApi('getConsent', MY_DOMAIN, null, null, 'Functional Cookies');
		is_approved = setting.consent == 'approved';
		tcm.functional = is_approved;
		if (is_approved) {
			_STATE.hasLoadedFunctional = true;
		}
	}

	if (!_STATE.hasLoadedPerformance) {
		setting = PrivacyManagerAPI.callApi('getConsent', MY_DOMAIN, null, null, 'Performance Cookies');
		is_approved = setting.consent == 'approved';
		tcm.performance = is_approved;
		if (is_approved) {
			_STATE.hasLoadedPerformance = true;
		}
	}

	// No additional checking, this always fires, but only after a user has consented
	if (!_STATE.hasLoadedAnyConsent) {
		tcm.any = true;
		_STATE.hasLoadedAnyConsent = true;
	}
}

export function initConsentManager(domain) {
	MY_DOMAIN = domain;
	_STATE.i = setInterval(runOnce, 10);
}
