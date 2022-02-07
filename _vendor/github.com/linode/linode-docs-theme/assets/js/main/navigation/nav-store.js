import { isMobile } from '../helpers';
import { getScrollPosNavbar } from './nav';
import { initConsentManager } from '../components/index';

export function newNavStore(searchStore) {
	return {
		// Stack used when we manipulate the navigation history and to track it so we can go back if needed.
		history: [],
		lang: 'en', // Set by the language switcher.

		pinned: false,
		searchResults: {
			open: false, // Whether the search panel is open or not.
			userChange: false // Whether this is a user or a system change.
		},
		open: {
			explorer: !isMobile(),
			toc: false
		},

		// TrustArc consent settings. This will also be set on the window object,
		// but keep it here so we can react on changes.
		trustecm: {
			required: false,
			advertising: false,
			functional: false,
			any: false,
		},

		init() {
			window.trustecm  = this.trustecm;
			initConsentManager()
		},

		openSearchPanel(scrollUp = false) {
			if (!this.searchResults.open) {
				this.searchResults = { open: true, userChange: true };
				searchStore.searchToggle(true);
			}
			if (scrollUp) {
				this.scrollToNavBarIfPinned();
			}
		},

		openSearchPanelWithQuery(callback) {
			callback(searchStore.query);
			this.openSearchPanel(true);
		},

		goBack() {
			let href = this.history.pop();
			if (href) {
				// This means we have a history, so just go back.
				history.back();
				return;
			}

			// We got here directly, no history. Navigate back to the home page.
			Turbo.visit('/docs');
		},

		pushState(href) {
			// Store the old so we can go back.
			this.history.push(window.location.pathname);
			history.pushState({}, '', href);
		},

		scrollToNavBarIfPinned() {
			if (!this.pinned) {
				return;
			}
			let scrollPosNavbar = getScrollPosNavbar();
			window.scrollTo(0, scrollPosNavbar);
		}
	};
}
