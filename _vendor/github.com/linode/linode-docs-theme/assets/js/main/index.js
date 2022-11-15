// Configuration (search API key etc.)
import * as params from '@params';
import Alpine from 'jslibs/alpinejs/v3/alpinejs/dist/module.esm.js';
import intersect from 'jslibs/alpinejs/v3/intersect/dist/module.esm.js';
import persist from 'jslibs/alpinejs/v3/persist/dist/module.esm.js';
import { bridgeTurboAndAlpine } from './alpine-turbo-bridge';
import {
	alpineRegisterMagicHelpers,
	alpineRegisterDirectiveSVG,
	newDisqus,
	newDropdownsController,
} from './components/index';
import { isMobile, setIsTranslating, getCurrentLang, leackChecker } from './helpers/index';
import {
	addLangToLinks,
	newBreadcrumbsController,
	newLanguageSwitcherController,
	newNavController,
	newPromoCodesController,
	newSearchExplorerController,
	newToCController,
} from './navigation/index';
import { newNavStore } from './navigation/nav-store';
// AlpineJS controllers and helpers.
import { newSearchFiltersController, newSearchInputController, newSearchStore, getSearchConfig } from './search/index';
import { newHomeController } from './sections/home/home';
import { newSectionsController } from './sections/sections/index';

// Set up the search configuration (as defined in config.toml).
const searchConfig = getSearchConfig(params);

// Set up and start Alpine.
(function () {
	// Register AlpineJS plugins.
	{
		Alpine.plugin(intersect);
		Alpine.plugin(persist);
	}

	// Register AlpineJS magics and directives.
	{
		// Handles copy to clipboard etc.
		alpineRegisterMagicHelpers(Alpine);
		// Handles inlining of SVGs.
		alpineRegisterDirectiveSVG(Alpine);
	}

	// Register AlpineJS controllers.
	{
		// Search and navigation.
		Alpine.data('lncNav', () => newNavController(params.weglot_api_key));
		Alpine.data('lncLanguageSwitcher', newLanguageSwitcherController(params.weglot_api_key));
		Alpine.data('lncSearchFilters', () => newSearchFiltersController(searchConfig));
		Alpine.data('lncSearchInput', newSearchInputController);
		Alpine.data('lncSearchExplorer', () => newSearchExplorerController(searchConfig));
		Alpine.data('lncToc', newToCController);
		Alpine.data('lncBreadcrumbs', () => newBreadcrumbsController(searchConfig));
		Alpine.data('lncDropdowns', newDropdownsController);
		Alpine.data('lncDisqus', newDisqus);
		Alpine.data('lncPromoCodes', () => newPromoCodesController(params.is_test));

		// Page controllers.
		Alpine.data('lncHome', (staticData) => {
			return newHomeController(searchConfig, staticData);
		});

		Alpine.data('lncSections', () => newSectionsController(searchConfig));

		if (!params.enable_leak_checker) {
			Alpine.data('lncLeakChecker', () => leackChecker(Alpine));
		}
	}

	// Set up AlpineJS stores.
	{
		Alpine.store('search', newSearchStore(searchConfig, Alpine));
		Alpine.store('nav', newNavStore(searchConfig, Alpine.store('search')));
	}

	if (!isMobile()) {
		// We always need the blank resul set in desktop, so load that early.
		let store = Alpine.store('search');
		store.withBlank();
	}

	// Start Alpine.
	Alpine.start();

	// Start the Turbo-Alpine bridge.
	bridgeTurboAndAlpine(Alpine);
})();

// Set up global event listeners etc.
(function () {
	// Set up a global function to send events to Google Analytics.
	window.gtag = function (event) {
		this.dataLayer = this.dataLayer || [];
		this.dataLayer.push(event);
	};

	let pushGTag = function (eventName) {
		let event = {
			event: eventName,
		};

		if (window._dataLayer) {
			while (window._dataLayer.length) {
				let obj = window._dataLayer.pop();
				for (const [key, value] of Object.entries(obj)) {
					event[key] = value;
				}
			}
		}

		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push(event);
	};

	document.addEventListener('turbo:load', function (event) {
		// Hide JS-powered blocks on browsers with JavaScript disabled.
		document.body.classList.remove('no-js');

		// Update any static links to the current language.
		let lang = getCurrentLang();
		if (lang && lang !== 'en') {
			addLangToLinks(lang, document.getElementById('linode-menus'));
			addLangToLinks(lang, document.getElementById('footer'));
		}

		if (window.turbolinksLoaded) {
			// Make sure we only fire one event to GTM.
			// The navigation events gets handled by turbo:render
			return;
		}

		// Init language links.
		let languageSwitcherTarget = document.getElementById('weglot_here');

		let languageSwitcherTemplate = document.getElementById('language-switcher-template');
		let languageSwitcherSource = document.importNode(languageSwitcherTemplate.content, true);
		languageSwitcherTarget.appendChild(languageSwitcherSource);

		window.turbolinksLoaded = true;
		setTimeout(function () {
			pushGTag('docs_load');
		}, 2000);
	});

	document.addEventListener('turbo:before-render', function (event) {
		let body = event.detail.newBody;

		// This hides the relevant elements for a second if the user has selected a language different from the default one.
		// This should avoid the static and untranslated content showing.
		setIsTranslating(body.querySelectorAll('.hide-on-lang-nav'));
	});

	document.addEventListener('turbo:render', function (event) {
		if (document.documentElement.hasAttribute('data-turbolinks-preview')) {
			// Turbolinks is displaying a preview
			return;
		}

		pushGTag('docs_navigate');
	});

	// For integration tests. Cypress doesn't catch these (smells like a bug).
	if (window.Cypress) {
		window.addEventListener('unhandledrejection', function (e) {
			console.error(e);
			return false;
		});
	}
})();
