import { isMobile } from '../helpers/helpers';
import { getScrollPosNavbar } from './nav';
import { AnalyticsEventsCollector } from './nav-analytics';
import { RecommendationsFetcher } from './recommendations';

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

		onetrust: {
			required: false,
			performance: false,
			functional: false,
			targeting: false,
			socialmedia: false,

			toggleConsentDialog(event) {
				if (!window.OneTrust) {
					return;
				}
				debug('toggleConsentDialog');
				// TODO1 see https://github.com/linode/linode-docs-theme/issues/954 Cookie Consent Links
				window.OneTrust.ToggleInfoDisplay();
				event.preventDefault();
			},
		},

		recommendations: new RecommendationsFetcher(searchConfig),

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
			let getLastQueryID = () => {
				return searchStore.results.lastQueryID;
			};
			this.analytics = new AnalyticsEventsCollector(searchConfig, getLastQueryID, this.onetrust);

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
		},

		updateOptanonGroups(groups) {
			// Groups on form ,C0001,C0002,C0003,C0004,C0005,
			// Split on comma, remove empty strings.
			let groupArray = groups.split(',').filter(Boolean);
			this.onetrust.required = groupArray.includes('C0001');
			this.onetrust.performance = groupArray.includes('C0002');
			this.onetrust.functional = groupArray.includes('C0003');
			this.onetrust.targeting = groupArray.includes('C0004');
			this.onetrust.socialmedia = groupArray.includes('C0005');

			console.log('updateOptanonGroups', this.onetrust);
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
