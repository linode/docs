'use strict';

import { getScrollLeft } from '../helpers/index';

var debug = 0 ? console.log.bind(console, '[tabs]') : function () {};

export function newTabsController() {
	return {
		tabs: {
			ids: [],
			active: 0,
		},
		// Ordinal for all the tabs components on a page. Used for debugging.
		ordinal: 0,

		// Top position of the tabs element when clicked.
		topPos: 0,

		updateActive(init = false) {
			let tabsEl = this.$refs.tabs;
			let tabsNavEl = this.$refs.tabsNav;
			let oldActive = this.tabs.active;
			let newActive = 0;
			let tabsState = this.$store.nav.tabs;

			// Loop over the ids and set the active tab to either the first one or the one that is set to active in the global store.
			let activeSet = false;
			this.tabs.ids.forEach((id, index) => {
				if (tabsState.active[id]) {
					newActive = index;
					activeSet = true;
				}
			});

			// This is a tab set we have not seen before, so set the first one to active.
			if (!activeSet && this.tabs.ids.length > 0) {
				tabsState.active[this.tabs.ids[0]] = true;
			}

			this.tabs.active = newActive;

			this.tabs.ids.forEach((id, index) => {
				let isActive = index === newActive;
				let tabContentEl = this.$refs['tabs-content-' + index];
				if (isActive) {
					let tabEl = this.$refs['tab-' + index];
					// This is a workaround for Safari that seems to get confused
					// when we set scrollLeft on a scrolled element.
					tabsNavEl.style.overflowX = 'hidden';
					let scrollLeft = getScrollLeft(tabsNavEl, tabEl);
					if (scrollLeft) {
						tabsNavEl.scrollLeft = scrollLeft;
					}
					tabsNavEl.style.overflowX = 'auto';
				}
				tabContentEl.style.display = isActive ? '' : 'none';
			});

			if (init) {
				return;
			}

			// We only need to adjust the currently clicked component,
			// and not the top one.
			if (this.ordinal == 0 || this.ordinal != tabsState.ordinal) {
				return;
			}

			let topPosAfter = tabsEl.getBoundingClientRect().top;
			// Restore offset of the clicked tab if it has changed.
			let diff = topPosAfter - this.topPos;

			if (diff) {
				window.scrollBy(0, diff);
			}
		},
		initTabs(ordinal) {
			this.ordinal = ordinal;
			this.$nextTick(() => {
				this.$watch('$store.nav.tabs.counter', () => {
					this.updateActive();
				});

				this.updateActive(true);
			});
		},
		initTab(id) {
			if (this.ordinal == 0) {
				debug('initTab', id);
			}
			this.tabs.ids.push(id);
		},
		isActive: function (ordinal) {
			return this.tabs.active === ordinal;
		},

		setActive: function (ordinal) {
			if (this.ordinal == 0) {
				debug('setActive', ordinal);
			}
			this.clickedTab = ordinal;
			if (this.tabs.active === ordinal) {
				return;
			}

			let tabsEl = this.$refs.tabs;
			// Preserve offset of the clicked tab.
			this.topPos = tabsEl.getBoundingClientRect().top;
			let tabsState = this.$store.nav.tabs;

			tabsState.ordinal = this.ordinal;

			let id = this.tabs.ids[ordinal];
			if (id) {
				this.tabs.ids.forEach((id2) => {
					tabsState.active[id2] = id === id2;
				});
				// Will trigger updateActive() in all tabs components.
				tabsState.counter = this.$store.nav.tabs.counter + 1;
			}
		},
	};
}
