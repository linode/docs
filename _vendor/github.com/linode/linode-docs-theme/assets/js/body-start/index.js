import { setIsTranslating, isMobile, toggleBooleanClass } from '../main/helpers/index';

(function () {
	if (!window.turbolinksLoaded) {
		// If a language other than en is set, we need to try to prevent the
		// untranslated content from being visible.
		setIsTranslating(document.body);
	}

	if (isMobile()) {
		// This body class is default open, toggle off if on mobile.
		toggleBooleanClass('explorer-open', document.body, false);
	}
	toggleBooleanClass('loaded', document.body, true);
})();
