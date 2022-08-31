'use strict';

import { isMobile, toggleBooleanClass } from '../helpers/index';
import { isTopResultsPage } from '../search';
import { newQuery, QueryHandler } from '../search/query';

var debug = 0 ? console.log.bind(console, '[navbar]') : function () {};

const queryHandler = new QueryHandler();

export const getScrollPosNavbar = function () {
	let h = window.getComputedStyle(document.getElementById('grid')).getPropertyValue('--height-linode-menu-row');
	return parseInt(h, 10) - 1;
};

// Called when the search main results panel opens or closes.
const onNavSearchResults = function (self, val, oldVal) {
	if (val.open === oldVal.open) {
		return;
	}
	if (!val.userChange) {
		// Not a user action.
		return;
	}

	if (!val.open) {
		// Clear filters and navigate back or home.
		self.$store.search.query = newQuery();
		self.$store.nav.goBack();
	} else {
		let newSearch = !isTopResultsPage();
		if (newSearch) {
			let queryString = queryHandler.queryToQueryString(self.$store.search.query);
			if (queryString) {
				queryString = '?' + queryString;
			}
			self.$store.nav.pushState('/docs/topresults/' + queryString);
		}
	}
};

const applyUIState = function (self, init = false) {
	let setClassAndWatch = (initValue, prop, baseClass) => {
		toggleBooleanClass(baseClass, document.body, initValue);
		if (init) {
			self.$watch(prop, (val, oldVal) => {
				toggleBooleanClass(baseClass, document.body, val);

				switch (prop) {
					case '$store.nav.open.explorer':
						if (val && isMobile() && self.$store.nav.open.toc) {
							self.$store.nav.open.toc = false;
						}
						break;
				}
			});
		}
	};

	if (init) {
		self.$watch('$store.nav.searchResults', (val, oldVal) => {
			onNavSearchResults(self, val, oldVal);
		});
	}

	setClassAndWatch(self.$store.nav.searchResults.open, '$store.nav.searchResults.open', 'search-panel-open');
	setClassAndWatch(self.$store.nav.open.explorer, '$store.nav.open.explorer', 'explorer-open');
	setClassAndWatch(self.$store.nav.open.toc, '$store.nav.open.toc', 'toc-open');
	setClassAndWatch(self.$store.nav.pinned, '$store.nav.pinned', 'topbar-pinned');
};

export function newNavController(weglot_api_key) {
	return {
		init: function () {
			applyUIState(this, true);

			if (isTopResultsPage()) {
				this.$store.search.searchToggle(true);
				this.$store.nav.searchResults.open = true;
			}
			this.$store.search.query = queryHandler.queryFromLocation();
			this.$watch('$store.search.query.lndq', (val, oldVal) => {
				this.$store.search.query.lndqCleared = oldVal && !val;

				// Navigate back to page 0 when the user changes the text input.
				if (this.$store.search.query.p) {
					this.$store.search.query.p = 0;
				}
			});
		},

		onEffect: function () {
			this.$store.search.updateLocationWithQuery();
		},

		onPopState: function (event) {
			if (isTopResultsPage()) {
				this.$store.nav.searchResults.open = true;
			} else if (this.$store.nav.searchResults.open) {
				this.$store.nav.searchResults.open = false;
			}
		},

		onTurboBeforeRender: function (event) {
			if (!isTopResultsPage()) {
				// Always hide the search panel unless on the search page.
				this.$store.nav.searchResults = { open: false };
			}
		},

		onTurboRender: function () {
			if (document.documentElement.hasAttribute('data-turbo-preview')) {
				return;
			}

			applyUIState(this, false);

			if (document.body.dataset.objectid) {
				// Add a view event to Algolia analytics.
				let analyticsItem = {
					__queryID: this.$store.search.results.lastQueryID,
					objectID: document.body.dataset.objectid,
					event: 'view',
					eventName: 'DOCS: Guide Navigate',
				};
				this.$store.nav.analytics.handler.pushItem(analyticsItem);
			}

			/*
			TODO(bep) this causes a flicker effect in Turbo.
			See https://github.com/hotwired/turbo/issues/354#issuecomment-913132264
			if (this.$store.nav.pinned) {
				this.reloaded = true;
				let scrollPosNavbar = getScrollPosNavbar();
				this.$nextTick(() => {
					//window.scrollTo(0, scrollPosNavbar);
				});
			}*/
		},

		onScroll: function () {
			let scrollpos = window.scrollY;
			let scrollPosNavbar = getScrollPosNavbar();
			if (scrollpos >= scrollPosNavbar) {
				if (!this.$store.nav.pinned) {
					this.$store.nav.pinned = true;
				}
			} else if (!self.reloaded && this.$store.nav.pinned && scrollpos < 10) {
				this.$store.nav.pinned = false;
			}
			self.reloaded = false;
		},
	};
}
