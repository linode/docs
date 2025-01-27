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
	newTabsController,
} from './components/index';
import { toggleBooleanClass, setIsTranslating, getCurrentLang, scrollToActiveExplorerNode } from './helpers/helpers';
import { leackChecker } from './helpers/leak-checker';
import {
	addLangToLinks,
	newBreadcrumbsController,
	newLanguageSwitcherController,
	newNavController,
	newPromoCodesController,
	newToCController,
	newPaginatorController,
	newSearchExplorerInitial,
	newSearchExplorerHydrated,
	newSearchExplorerNode,
} from './navigation/index';
import { newNavStore } from './navigation/nav-store';
// AlpineJS controllers and helpers.
import { newSearchFiltersController, newSearchInputController, newSearchStore, getSearchConfig } from './search/index';
import { newHomeController } from './sections/home/home';
import { newSectionsController } from './sections/sections/index';
import { newSVGViewerController } from './navigation/svg-viewer';
import { newFileIssueButton } from './navigation/file-issue-button';

// Set up the search configuration (as defined in config.toml).
const searchConfig = getSearchConfig(params);

// Handle consent changes.
(function () {
	window.OptanonWrapper = function () {
		const e = new CustomEvent('onetrust:groups-updated', { detail: OnetrustActiveGroups });
		window.dispatchEvent(e);
	};
})();

// Set up and start Alpine.
(function () {
	// For integration tests.
	if (window.Cypress) {
		window.truste = {};
		window.addEventListener('unhandledrejection', function (e) {
			console.error(e);
			return false;
		});
	}

	__stopWatch('index.js.start');

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

	let fetchController = function (url) {
		return {
			data: {},
			init: async function () {
				let res = await fetch(url);
				if (res.ok) {
					this.data = await res.json();
				}
			},
		};
	};

	// Register AlpineJS controllers.
	{
		// Search and navigation.
		Alpine.data('lncNav', () => newNavController(params.weglot_api_key));
		Alpine.data('lncLanguageSwitcher', newLanguageSwitcherController(params.weglot_api_key));
		Alpine.data('lncSearchFilters', () => newSearchFiltersController(searchConfig));
		Alpine.data('lncSearchInput', newSearchInputController);
		Alpine.data('lncSearchExplorerNode', (node = {}) => newSearchExplorerNode(searchConfig, node));
		Alpine.data('lncSearchExplorerInitial', () => newSearchExplorerInitial());
		Alpine.data('lncSearchExplorerHydrated', () => newSearchExplorerHydrated(searchConfig));
		Alpine.data('lncToc', newToCController);
		Alpine.data('lncBreadcrumbs', () => newBreadcrumbsController(searchConfig));
		Alpine.data('lncDropdowns', newDropdownsController);
		Alpine.data('lncTabs', newTabsController);
		Alpine.data('lncDisqus', newDisqus);
		Alpine.data('lncPaginator', newPaginatorController);
		Alpine.data('lncPromoCodes', () => newPromoCodesController(params.is_test));
		Alpine.data('lncFetch', fetchController);
		Alpine.data('lnvSVGViewer', newSVGViewerController);
		if (params.file_issue_button && params.file_issue_button.enable) {
			Alpine.data('lncFileIssueButton', () => newFileIssueButton(params.file_issue_button));
		}

		// Page controllers.
		Alpine.data('lncHome', (staticData) => {
			return newHomeController(searchConfig, staticData);
		});

		Alpine.data('lncSections', () => newSectionsController(searchConfig, params));

		if (!params.enable_leak_checker) {
			Alpine.data('lncLeakChecker', () => leackChecker(Alpine));
		}
	}

	// Set up AlpineJS stores.
	{
		Alpine.store('search', newSearchStore(searchConfig, params, Alpine));
		Alpine.store('nav', newNavStore(searchConfig, Alpine.store('search'), params, Alpine));
	}

	// Start Alpine.
	Alpine.start();

	// Start the Turbo-Alpine bridge.
	bridgeTurboAndAlpine(Alpine);
})();

// Set up global event listeners etc.
(function () {
	if (!window.__stopWatch) {
		window.__stopWatch = function (name) {};
	}
	// Set up a global function to send events to Google Analytics.
	window.gtag = function (event) {
		this.dataLayer = this.dataLayer || [];
		this.dataLayer.push(event);
	};

	let pushDataLayer = function (eventName) {
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

		toggleBooleanClass('turbo-loaded', document.documentElement, true);

		// Init language links.
		let languageSwitcherTarget = document.getElementById('weglot_here');

		let languageSwitcherTemplate = document.getElementById('language-switcher-template');
		let languageSwitcherSource = document.importNode(languageSwitcherTemplate.content, true);
		languageSwitcherTarget.replaceChildren(languageSwitcherSource);

		window.turbolinksLoaded = true;
		setTimeout(function () {
			pushDataLayer('docs_load');
		}, 2000);
	});

	document.addEventListener('turbo:before-render', function (event) {
		let body = event.detail.newBody;

		// This hides the relevant elements for a second if the user has selected a language different from the default one.
		// This should avoid the static and untranslated content showing.
		setIsTranslating(body.querySelectorAll('.hide-on-lang-nav'));
	});

	document.addEventListener('turbo:render', function (event) {
		if (document.documentElement.hasAttribute('data-turbo-preview')) {
			// Turbolinks is displaying a preview
			return;
		}

		reloadOTBanner();

		pushDataLayer('docs_navigate');
	});

	// Preserve scroll position when navigating with Turbo on all elements with the data-preserve-scroll attribute.
	if (!window.scrollPositions) {
		window.scrollPositions = {};
	}
	if (!window.scrollHandledByClick) {
		window.scrollHandledByClick = {};
	}

	function turboClick(e) {
		if (e.detail.url.includes('/docs/api')) {
			// Disable Turbo for the API docs to allow for edge redirects.
			e.preventDefault();
		}
	}

	function preserveScroll(e) {
		document.querySelectorAll('[data-preserve-scroll]').forEach((el) => {
			// Check if the event's target is a child of the element.
			// For the explorer use case we only want to track clicks inside the explorer.
			let target = e.target;
			let isChild = false;
			while (target) {
				if (target === el) {
					isChild = true;
					break;
				}
				target = target.parentElement;
			}

			if (isChild) {
				scrollPositions[el.id] = el.scrollTop;
				scrollHandledByClick[el.id] = true;
			}
		});
	}

	function restoreScroll(e) {
		if (!window.turbolinksLoaded) {
			// The scroll on the first page load is handled by others.
			return;
		}
		const isFinalRender = e.type === 'turbo:render' && !document.documentElement.hasAttribute('data-turbo-preview');

		document.querySelectorAll('[data-preserve-scroll]').forEach((element) => {
			let id = element.id;
			let scrollPos = scrollPositions[id];
			if (!scrollPos) {
				return;
			}
			element.scrollTop = scrollPos;
			if (isFinalRender) {
				delete scrollPositions[id];
			}
		});

		if (!e.detail || !e.detail.newBody) return;
		e.detail.newBody.querySelectorAll('[data-preserve-scroll]').forEach((element) => {
			let id = element.id;
			element.scrollTop = scrollPositions[id];
		});
	}

	window.addEventListener('turbo:click', preserveScroll);
	window.addEventListener('turbo:click', turboClick);
	window.addEventListener('turbo:before-render', restoreScroll);
	window.addEventListener('turbo:render', restoreScroll);
})();

// See https://my.onetrust.com/s/article/UUID-69162cb7-c4a2-ac70-39a1-ca69c9340046?language=en_US&topicId=0TO1Q000000ssJBWAY
function reloadOTBanner() {
	var otConsentSdk = document.getElementById('onetrust-consent-sdk');
	if (otConsentSdk) {
		otConsentSdk.remove();
	}

	if (window.OneTrust != null) {
		OneTrust.Init();

		setTimeout(function () {
			OneTrust.LoadBanner();

			var toggleDisplay = document.getElementsByClassName('ot-sdk-show-settings');

			for (var i = 0; i < toggleDisplay.length; i++) {
				toggleDisplay[i].onclick = function (event) {
					event.stopImmediatePropagation();
					window.OneTrust.ToggleInfoDisplay();
				};
			}
		}, 1000);
	}
}
