import { isMobile } from '../helpers';
import { getScrollPosNavbar } from './nav';
import { AnalyticsEventsCollector } from './nav-analytics';
import { initConsentManager } from '../components/index';

export function newNavStore(searchConfig, searchStore, params, Alpine) {
	const debug = 0 ? console.log.bind(console, '[nav-store]') : function () {};

	return {
		// Stack used when we manipulate the navigation history and to track it so we can go back if needed.
		history: [],
		lang: 'en', // Set by the language switcher.

		pinned: false,
		searchResults: {
			open: false, // Whether the search panel is open or not.
			userChange: false, // Whether this is a user or a system change.
		},

		// State for the tabs shortcode.
		tabs: {
			// Holds ids for all active tabs.
			active: {},

			// Incremented to trigger a re-render of the tabs.
			counter: 0,

			// Ordinal of the last clicked tabs component.
			ordinal: 0,
		},

		searchEvents: null,

		open: {
			explorer: !isMobile(),
			toc: false,
		},

		// TrustArc consent settings. This will also be set on the window object,
		// but keep it here so we can react on changes.
		trustecm: {
			required: false,
			socialmedia: false,
			targeting: false,
			functional: false,
			performance: false,
		},

		init() {
			const tabsKey = 'tabs';
			const urlDelimiter = ',';
			let url = new URL(window.location);
			let currentTabsString = url.searchParams.get(tabsKey);
			if (currentTabsString) {
				// Split the string into an array.
				let activeTabs = currentTabsString.split(urlDelimiter);
				// Set the active tabs.
				for (let tab of activeTabs) {
					this.tabs.active[tab] = true;
				}
			}

			// Keep some common query parameters in the URL in sync with the store.
			Alpine.effect(() => {
				// This will effectively watch for any changes to the tabs state.
				if (this.tabs.counter) {
					let url = new URL(window.location);
					let currentTabsString = url.searchParams.get(tabsKey);

					// Create a sorted list of active tabs.
					let activeTabs = [];
					for (let tab in this.tabs.active) {
						if (this.tabs.active[tab]) {
							activeTabs.push(tab);
						}
					}
					activeTabs.sort();
					// Create a string from the list.
					let activeTabsString = activeTabs.join(urlDelimiter);

					// Only update the URL if the tabs string has changed.
					if (currentTabsString !== activeTabsString) {
						let searchParams = new URLSearchParams(url.search);
						searchParams.set(tabsKey, activeTabsString);
						let newUrl = url.pathname + '?' + searchParams.toString();
						history.replaceState({ turbo: {} }, '', newUrl);
						debug('tabs', activeTabsString);
					}
				}
			});
			window.trustecm = this.trustecm;
			let getLastQueryID = () => {
				return searchStore.results.lastQueryID;
			};
			this.analytics = new AnalyticsEventsCollector(searchConfig, getLastQueryID, this.trustecm);

			// The callback below may be called multiple times.
			let analyticsLoadEventPublished = false;
			let cb = () => {
				if (!analyticsLoadEventPublished && document.body.dataset.objectid) {
					analyticsLoadEventPublished = true;
					let analyticsItem = {
						__queryID: getLastQueryID(),
						objectID: document.body.dataset.objectid,
						event: 'view',
						eventName: 'DOCS: Guide Load',
					};
					this.analytics.handler.pushItem(analyticsItem);
					this.analytics.handler.startNewPage();
				}
			};

			initConsentManager(params.trustarc_domain, this.trustecm, cb);
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

		pushTopResults(queryString) {
			// Add a noindex meta tag to the page so it doesn't get indexed.
			let meta = document.createElement('meta');
			meta.name = 'robots';
			meta.content = 'noindex';
			document.head.appendChild(meta);
			this.pushState('/docs/topresults/' + queryString);
		},

		scrollToNavBarIfPinned() {
			if (!this.pinned) {
				return;
			}
			let scrollPosNavbar = getScrollPosNavbar();
			window.scrollTo(0, scrollPosNavbar);
		},
	};
}
