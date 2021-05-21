'use strict';

import { isMobile, sendEvent, toggleBooleanClass } from '../helpers/index';

var debug = 0 ? console.log.bind(console, '[navbar]') : function() {};

const getScrollPosNavbar = function() {
	let h = window.getComputedStyle(document.getElementById('grid')).getPropertyValue('--height-linode-menu-row');
	return parseInt(h, 10) - 1;
};

const isOrIsNotClass = function(baseClass, b) {
	if (b) {
		return `is-${baseClass}`;
	}
	return `is-not-${baseClass}`;
};

const baseClass = 'topbar-pinned';
const is = isOrIsNotClass(baseClass, true);
const isNot = isOrIsNotClass(baseClass, false);

const addClassOnScroll = () => {
	document.body.classList.add(is);
	document.body.classList.remove(isNot);
	sendEvent('nav:toggle', { what: 'topbar-pinned', open: true });
};
const removeClassOnScroll = () => {
	document.body.classList.add(isNot);
	document.body.classList.remove(is);
	sendEvent('nav:toggle', { what: 'topbar-pinned', open: false });
};

const closeSearchBar = function() {
	sendEvent('nav:toggle', { what: 'search-input', open: false });
};

const closeExplorer = function() {
	sendEvent('nav:toggle', { what: 'explorer', open: false });
};

const closeToC = function() {
	sendEvent('nav:toggle', { what: 'toc', open: false });
};

const toggleSearchResults = function(self, open) {
	if (open && isMobile()) {
		toggleExplorer(self, false);
	}
	toggleBooleanClass('search-panel-open', document.body, open);
};

const toggleExplorer = function(self) {
	let open = self.toggles.explorer;
	toggleBooleanClass('explorer-open', document.body, open);
	sendEvent('nav:toggle', { what: 'explorer', open: open });
	if (open && self.toggles.searchInput) {
		closeSearchBar();
	}
	if (open && isMobile() && self.toggles.toc) {
		closeToC();
	}
};

const toggleToC = function(self, open, broadcast = false) {
	self.toggles.toc = open;
	toggleBooleanClass('toc-open', document.body, open);
	if (open && self.toggles.searchInput) {
		closeSearchBar();
	}
	if (open && isMobile() && self.toggles.explorer) {
		closeExplorer();
	}
	if (broadcast) {
		self.$nextTick(() => {
			sendEvent('nav:toggle', { what: 'toc', open: open });
		});
	}
};

export function newNavController() {
	return {
		pinned: false,
		reloaded: false,
		explorerPreloaded: false,
		toggles: {
			searchInput: false,
			searchResults: false,
			explorer: false,
			toc: false
		},
		init: function() {
			var self = this;

			// Return a callback to make sure its run after Alpine has made its initial updates to the DOM.
			return function() {
				// Set up watcher to synchronize Alpine model changes with the classes we set on the
				// body element to get proper CSS state.
				this.$watch('pinned', () => {
					if (self.pinned) {
						addClassOnScroll();
					} else {
						removeClassOnScroll();
					}
				});
				this.$watch('toggles.explorer', () => {
					toggleExplorer(self);
				});
				this.$watch('toggles.searchInput', () => {
					toggleBooleanClass('search-input-open', document.body, self.toggles.searchInput);
					if (self.toggles.searchInput && self.toggles.explorer) {
						self.toggles.explorer = false;
					}
				});
				this.$watch('toggles.searchResults', () => {
					let open = self.toggles.searchResults;
					toggleSearchResults(self, open);
					if (open) {
						let scrollPosNavbar = getScrollPosNavbar();
						if (window.scrollY > scrollPosNavbar) {
							// This means we're in sticky/poweruser mode.
							// Scroll up to the navbar.
							window.scrollTo(0, scrollPosNavbar);
						}
					}
				});
			};
		},
		receiveToggle: function(detail) {
			debug('receiveToggle', detail);
			// Toggle body classes on the form is-explorer-open and is-not-explorer-open.
			// Note that if you add a new class to this scheme, its default state must be
			// present in the body class list when the page is loaded.
			switch (detail.what) {
				case 'search-input':
					this.toggles.searchInput = detail.open;
					break;
				case 'search-panel':
					this.toggles.searchResults = detail.open;
					break;
				case 'explorer':
					this.toggles.explorer = detail.open;
					break;
				case 'search-panel__filters':
					toggleBooleanClass('search-panel_filters-open', document.body, detail.open);
					break;
				case 'toc':
					toggleToC(this, detail.open);
					break;
				case 'topbar-pinned':
					if (!detail.open) {
						closeSearchBar();
					}
					break;
				default:
					debug('ignore', detail.what);
			}
		},
		preloadExplorer: function() {
			if (this.explorerPreloaded) {
				return;
			}
			sendEvent('nav:toggle', { what: 'explorer-preload', open: true });
			this.explorerPreloaded = true;
		},
		onScroll: function() {
			let scrollpos = window.scrollY;
			let self = this;
			let scrollPosNavbar = getScrollPosNavbar();
			if (scrollpos >= scrollPosNavbar) {
				if (!self.pinned) {
					self.pinned = true;
				}
			} else if (!self.reloaded && self.pinned && scrollpos < 10) {
				self.pinned = false;
			}
			self.reloaded = false;
		},
		onTurbolinksBeforeRender: function(data) {
			this.toggles.searchInput = false;
			if (isMobile()) {
				this.toggles.explorer = false;
			}
		},
		onTurbolinksRender: function(data) {
			debug('onTurbolinksRender', { pinned: this.pinned });
			if (this.pinned) {
				this.reloaded = true;
				let scrollPosNavbar = getScrollPosNavbar();
				window.scrollTo(0, scrollPosNavbar);
				addClassOnScroll();
			}
		},
		onHashchange: function() {
			debug('onHashchange');
			this.toggles.searchResults = false;
		}
	};
}
