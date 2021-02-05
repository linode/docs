// Configuration (search API key etc.)
import * as params from '@params';
// AlpineJS controllers and helpers.
import { newSearchController, newSearchInputController, newSearchFiltersController } from './search';
import {
	newToCController,
	newInitController,
	newBreadcrumbsController,
	newSearchExplorerController,
	newNavController
} from './navigation';
import { newHomeController } from './sections/home/home';
import { loadSVG, newClipboardController, newDisqus, newDropdownsController } from './components/index';
import { newSectionsController } from './sections/sections/index';
import { newOnIntersectionController } from './components/index';
import { sendEvent } from './helpers/index';

// Set up the AlpineJS controllers
const searchConfig = getSearchConfig(params);

window.lnc = {
	// Search navigation.
	NewSearchController: () => newSearchController(searchConfig),
	NewSearchInputController: newSearchInputController,
	NewSearchFiltersController: (opts = {}) => newSearchFiltersController(searchConfig, opts),
	NewInitController: newInitController,

	NewSearchExplorerController: () => newSearchExplorerController(searchConfig),
	NewNavController: newNavController,
	NewTocController: newToCController,
	NewBreadcrumbsController: () => newBreadcrumbsController(searchConfig),

	NewDropdownsController: newDropdownsController,
	NewDisqusController: newDisqus,

	// Page controllers.
	NewHomeController: (developerItems) => newHomeController(searchConfig, developerItems),
	NewSectionsController: () => newSectionsController(searchConfig)
};

// Set up the AlpineJS helpers.
window.lnh = {
	LoadSVG: loadSVG,
	OnIntersection: newOnIntersectionController,
	CopyToClipBoard: newClipboardController,
	SendEvent: sendEvent
};

// Set up global event listeners etc.
(function() {
	window.deferLoadingAlpine = function(callback) {
		// This does nothing, which prevents Alpine.start() from doing double work.
		// The components gets initialized in turbolinks:load by the
		// Turbolinks AlpineJS adapter.
		// This hook also prevents the Alpine JS mutation observer to start,
		// which currently is unneeded overhead as we don't add any components dynamically.
		// If that changes, uncommenting the line below should do the trick.
		//  Alpine.listenForNewUninitializedComponentsAtRunTime()
	};

	// Hide JS-powered blocks on browsers with JavaScript disabled.
	document.addEventListener('turbolinks:load', function(event) {
		document.body.classList.remove('no-js');
	});

	// Prevent turbolinks from handling anchor links.
	// See https://github.com/turbolinks/turbolinks/issues/75
	document.addEventListener('turbolinks:click', function(event) {
		const anchorElement = event.target.closest('a');

		// Turbolinks intercepts all clicks on <a href> links to the same domain.
		// The documentation is hosted at linode.com/docs, but there are links
		// to other sections of that same domain, so prevent Turbolinks from handling those.
		// pathname is a USVString containing an initial '/' followed by the path of the URL
		//(or the empty string if there is no path).
		var noTurbolink = !anchorElement.pathname.startsWith('/docs/');

		if (noTurbolink) {
			// Prepare a clean state for when the user comes back.
			Turbolinks.clearCache();
		}

		if (!noTurbolink) {
			// Prevent Turbolinks from handling #hash locations on the same page.
			noTurbolink =
				anchorElement.hash &&
				anchorElement.origin === window.location.origin &&
				anchorElement.pathname === window.location.pathname;
		}

		if (noTurbolink) {
			event.preventDefault();
		}
	});

	// For integration tests. Cypress doesn't catch these (smells like a bug).
	if (window.Cypress) {
		window.addEventListener('unhandledrejection', function(e) {
			console.error(e);
			return false;
		});
	}
})();

function getSearchConfig(params) {
	let cfg = params.search_config;
	cfg.findSectionByName = function(name) {
		return this.sections.find((s) => {
			return s.name === name;
		});
	};
	cfg.findSectionsBySearchResults = function(results) {
		var self = this;
		var sections = [];
		results.forEach((result) => {
			let sectionConfig = self.sections.find((s) => {
				if (s.index !== result.index && s.index_by_pubdate != result.index) {
					return false;
				}
				if (s.filters) {
					// We have some sections that share the same index.
					return result.params.endsWith(encodeURIComponent(s.filters));
				}
				return true;
			});

			if (!sectionConfig) {
				throw `no index ${result.index} found`;
			}

			sections.push(sectionConfig);
		});

		return sections;
	};
	return cfg;
}
