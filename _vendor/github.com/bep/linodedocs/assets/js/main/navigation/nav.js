var lnNavController = {};

(function(ctx) {
	'use strict';

	var debug =
		(typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0 ? console.log.bind(console, '[navbar]') : function() {};

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

	const toggleToC = function(self, open) {
		self.toggles.toc = open;
		toggleBooleanClass('toc-open', document.body, open);
		if (open && self.toggles.searchInput) {
			closeSearchBar();
		}
		if (open && isMobile() && self.toggles.explorer) {
			closeExplorer();
		}
	};

	ctx.New = function() {
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
						// Move the main scroll positon to top.
						if (window.scrollY > 0) {
							// Setting it <= 1 would toggle off the pinned navbar.
							window.scrollTo(0, 2);
						}
					}
				});
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
				const thresholdOn = 150;

				let scrollpos = window.scrollY;
				let self = this;
				if (scrollpos >= thresholdOn) {
					if (!self.pinned) {
						self.pinned = true;
					}
				} else if (!self.reloaded && self.pinned && scrollpos === 0) {
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
				if (this.pinned) {
					this.reloaded = true;
					addClassOnScroll();
				}
			},
			onHashchange: function() {
				debug('onHashchange');
				this.toggles.searchResults = false;
			}
		};
	};
})(lnNavController);
