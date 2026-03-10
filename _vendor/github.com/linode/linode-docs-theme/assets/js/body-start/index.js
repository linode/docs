import { isMobile, toggleBooleanClass } from '../main/helpers/helpers';

(function () {
	if (!window.truste) {
		window.truste = {};
	}

	if (isMobile()) {
		// This body class is default open, toggle off if on mobile.
		toggleBooleanClass('explorer-open', document.body, false);
	}
	toggleBooleanClass('loaded', document.body, true);
})();
