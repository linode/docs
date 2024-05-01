(function () {
	if (new URLSearchParams(window.location.search).get('__forceconsent') === 'true') {
		forceSetCookieConsent();
	}
	if (new URLSearchParams(window.location.search).get('__api_shouldfail') === 'true') {
		window.__api_shouldfail = true;
	}
})();

// forceSetCookieConsent simulates setting the TrustArc consent.
// This function is only included/invoked in test environments.
function forceSetCookieConsent() {
	localStorage.setItem(
		'truste.eu.cookie.cmapi_cookie_privacy',
		'{"name":"truste.eu.cookie.cmapi_cookie_privacy","value":"permit 1,2,3,4,5","path":"/","expires":1662226579397}'
	);
	localStorage.setItem(
		'truste.eu.cookie.notice_preferences',
		'{"name":"truste.eu.cookie.notice_preferences","value":"2,4:","path":"/","expires":1662226579393}'
	);
	localStorage.setItem(
		'truste.eu.cookie.notice_gdpr_prefs',
		'{"name":"truste.eu.cookie.notice_gdpr_prefs","value":"0,1,2,3,4:","path":"/","expires":1662226579395}'
	);

	localStorage.setItem(
		'truste.eu.cookie.cmapi_gtm_bl',
		'{"name":"truste.eu.cookie.cmapi_gtm_bl","value":"","path":"/","expires":1662226579396}'
	);

	document.cookie = 'cmapi_cookie_privacy=permit 1,2,3;';
	document.cookie = 'cmapi_gtm_bl=;';
	document.cookie = 'notice_gdpr_prefs=0,1,2,3,4:;';
	document.cookie = 'notice_preferences=2,4:;';
	document.cookie = 'notice_behavior=implied,us';
}
