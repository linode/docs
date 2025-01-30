(function () {
	let params = new URLSearchParams(window.location.search);

	let opts = {
		forceConsent: params.get('__forceconsent') === 'true',
		apiShouldfail: params.get('__api_shouldfail') === 'true',
	};

	console.log('Loading test environment with options:', opts);

	if (opts.forceConsent) {
		forceSetCookieConsent(opts);
	}
	if (opts.apiShouldfail) {
		window.__api_shouldfail = true;
	}
})();

// forceSetCookieConsent simulates setting the OneTrust consent.
// This function is only included/invoked in test environments.
function forceSetCookieConsent(opts) {
	document.cookie = 'OptanonAlertBoxClosed=2024-09-18T09:20:34.230Z';
	document.cookie =
		'OptanonConsent=isGpcEnabled=0&datestamp=Mon+Sep+23+2024+10%3A25%3A39+GMT%2B0200+(Central+European+Summer+Time)&version=202403.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=c3c54993-fe07-4044-b425-0ca7d930a31f&interactionCount=60&isAnonUser=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1%2CC0005%3A1&geolocation=NO%3B03&AwaitingReconsent=false';
}
