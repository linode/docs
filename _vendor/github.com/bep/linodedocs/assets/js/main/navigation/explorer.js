var lnSearchExplorer = {};

(function(ctx) {
	'use strict';

	var debug =
		(typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0 ? console.log.bind(console, '[explorer]') : function() {};

	const SECTION_DELIM = ' > ';

	ctx.New = function(searchConfig) {
		if (!searchConfig) {
			throw 'lnSearchExplorer.New: must provide searchConfig';
		}

		const router = lnCreateHref.New(searchConfig);
		const dispatcher = lnSearchEventDispatcher.New();

		// Toggle this on to expand the tree on load.
		// But also remember to revert it when done.
		const designMode = false;

		const setOpenStatus = function(self, open) {
			debug('setOpenStatus', open);
			self.open = open;
			sendEvent('nav:toggle', { what: 'explorer', open: self.open });
		};

		// initStates represents the state of the loading of the initial data set.
		// We may get filtered search results before we've finished with the initial build,
		// and we need to prevent those building before we're ready.
		const initStates = {
			INITIAL: 0,
			LOADING: 1,
			LOADED: 2
		};

		return {
			data: {
				// All nodes in the tree (all indices).
				nodes: {},

				// The search results.
				searchState: null,

				// Maps Algolia section to the Hugo section.
				sectionMapping: {}
			},

			initState: initStates.INITIAL,
			open: false,
			scrollTop: 0,
			pathname: '',

			isOpen: function() {
				return this.open && this.initState === initStates.LOADED;
			},
			sendData: function() {
				var self = this;
				self.$nextTick(function() {
					dispatcher.broadcastExplorerData(self.data);
				});
			},

			receiveDataInit: function(data) {
				debug('receiveDataInit', data, this.open, this.initState);
				this.data.searchState = data;
				this.load();
			},

			receiveData: function(data) {
				debug('receiveData', data, this.open, this.initState);
				this.data.searchState = data;
				this.load();
			},

			toggleOpen: function() {
				setOpenStatus(this, !this.open);
			},

			closeIfMobile: function() {
				if (this.open && isMobile()) {
					setOpenStatus(this, false);
				}
			},

			receiveToggle: function(detail) {
				debug('receiveToggle', detail);
				switch (detail.what) {
					case 'search-input':
						if (detail.open) {
							setOpenStatus(this, false);
						}
						break;
					case 'explorer':
						this.open = detail.open;
						break;
					default:
					// Ignore
				}
			},

			load: function() {
				if (this.initState === initStates.LOADING) {
					return;
				}

				if (this.initState === initStates.LOADED) {
					this.filterNodes();
					return;
				}

				if (!this.data.searchState) {
					// It will eventually get here.
					return;
				}
				this.initState = initStates.LOADING;
				this.buildNodes();
				this.filterNodes();
				this.initState = initStates.LOADED;
			},

			// Turbolinks replaces the body that we may have changed, so restore the
			// explorer state when navigating to a new page.
			onTurbolinksBeforeRender: function(data) {
				if (this.open && isMobile()) {
					// Always close the left side tree menu when navigating away on mobile.
					this.open = false;
				}
				toggleBooleanClass('explorer-open', data.newBody, this.open);
				let nav = this.$el.parentNode;
				this.scrollTop = nav.scrollTop;
			},
			onHashchange: function() {
				debug('onHashchange');
				if (this.open && isMobile()) {
					this.open = false;
					toggleBooleanClass('explorer-open', document.body, this.open);
				}
			},

			onTurbolinksRender: function(data) {
				let navEl = this.$el.parentNode;
				navEl.scrollTop = this.scrollTop;
			},

			render: function() {
				this.target.innerHTML = '';
				for (let k in this.data.nodes) {
					let n = this.data.nodes[k];
					if (n.level !== 1) {
						continue;
					}
					this.target.appendChild(this.renderNode(n));
				}
				this.loaded = true;
			},

			renderNode: function(node) {
				let li = document.importNode(this.templateNode.content.querySelector('.explorer__node'), true);
				li.setAttribute('x-data', `lnSearchExplorer.NewNode('${node.key}')`);
				li.setAttribute('x-init', 'init();');
				let ul = li.querySelector('.node-tree');
				for (let i in node.sections) {
					ul.appendChild(this.renderNode(node.sections[i]));
				}

				return li;
			},

			// Initialize the component with the DOM templates to use for rendering.
			// This needs to be done AFTER Alpine has made its initial updates to the DOM.
			init: function(templateNode, target) {
				this.templateNode = templateNode;
				this.target = target;
				if (designMode) {
					setOpenStatus(this, true);
				}
			},

			createNode: function(opts) {
				var self = this;

				let title = opts.level === 1 ? opts.section.config.title : opts.name;
				let ordinal = 1;
				if (opts.level > 1) {
					let m = this.data.searchState.metaSearch.results.get(opts.key.toLowerCase());
					if (m) {
						title = m.linkTitle;
						if (m.ordinal) {
							ordinal = m.ordinal;
						}
					}
				}

				let n = {
					dirty: true, // Used for lazy expansion
					section: opts.section,
					level: opts.level, // Starting at 1
					ordinal: ordinal,
					name: opts.name,
					title: title,
					key: opts.key,
					href: opts.href,
					count: opts.count,
					icon: opts.level === 1 ? opts.section.config.explorer_icon : '',
					sections: [],
					pages: [], // Leaf nodes
					open: false,
					disabled: false
				};

				return n;
			},

			buildNodes: function() {
				debug('buildNodes', this.data.searchState);
				var results = this.getResults();

				var self = this;

				let sections = results.sections;

				this.data.parseKey = function(key) {
					let parts = key.split(SECTION_DELIM);
					let level = parts.length;
					let name = parts[parts.length - 1];

					let href = router.hrefSection(key);

					let parentKey = false;
					if (parts.length > 1) {
						parentKey = parts.slice(0, parts.length - 1).join(SECTION_DELIM);
					}

					return {
						parts: parts,
						level: level,
						key: key,
						name: name,
						href: href,
						parentKey: parentKey
					};
				};

				this.data.add = function(section, key, count) {
					let kp = this.parseKey(key);

					let n = this.nodes[kp.key];

					if (!n) {
						n = self.createNode({
							section: section,
							key: kp.key,
							href: kp.href,
							name: kp.name,
							level: kp.level,
							count: count
						});

						this.nodes[kp.key] = n;
					} else {
						// Update the existing node.
						n.count = count;
						n.sections.length = 0;
					}

					if (kp.parentKey) {
						if (kp.key == kp.parentKey) {
							throw 'invalid state: ' + kp.key;
						}
						let parentNode = this.nodes[kp.parentKey];

						if (parentNode) {
							parentNode.sections.push(n);
						}
					}
				};

				for (let index of sections) {
					let searchData = index.searchData;
					for (let section of searchData.resultSections()) {
						this.data.add(index, section.key, section.count);
					}
				}

				for (let k in this.data.nodes) {
					let n = this.data.nodes[k];

					n.sections.sort(function(a, b) {
						if (a.ordinal === b.ordinal) {
							if (a.name === b.name) {
								return 0;
							}
							return a.name < b.name ? -1 : 1;
						}

						return a.ordinal - b.ordinal;
					});
				}

				debug('nodes', this.data.nodes);

				self.render();
				self.sendData();
			},

			getResults: function() {
				if (!this.data.searchState) {
					return null;
				}

				if (this.data.searchState.mainSearch.loaded) {
					return this.data.searchState.mainSearch.results;
				}
				return this.data.searchState.blankSearch.results;
			},

			// Rebuilds and renders the node tree based on the search result given.
			filterNodes: function() {
				debug('filterNodes', this.data);
				let results = this.getResults();

				let seen = new Set();
				var self = this;

				// There should be no new nodes.
				// So first, update what's changed and hide the rest.
				for (let section of results.sections) {
					let searchData = section.searchData;

					let resultSections = searchData.resultSections();

					if (resultSections.length > 0) {
						seen.add(section.config.name);
					}

					for (let resultSection of resultSections) {
						let kp = this.data.parseKey(resultSection.key);
						let n = this.data.nodes[kp.key];
						if (!n) {
							throw `node with key ${kp.key} not set`;
						}

						n.count = resultSection.count;
						n.hidden = false;
						seen.add(kp.key);
					}
				}

				for (let k in this.data.nodes) {
					let n = this.data.nodes[k];
					if (!seen.has(n.key)) {
						if (n.level === 1) {
							n.count = 0;
						} else {
							// Hide it in the DOM.
							n.hidden = true;
						}

						continue;
					}

					let expanded = this.data.searchState.expandedNodes.get(n.key);

					if (expanded && expanded.searchResult && expanded.searchResult.hits) {
						let pages = [];
						for (let item of expanded.searchResult.hits) {
							let href = item.href;
							pages.push(
								self.createNode({
									section: n.section,
									key: href,
									href: href,
									name: item.title,
									level: n.level + 1,
									count: 0
								})
							);
						}
						n.pages = pages;
					} else {
						n.pages = [];
					}
				}

				this.sendData();
			}
		};
	};

	ctx.NewNode = function(id) {
		const dispatcher = lnSearchEventDispatcher.New();

		var loading = false;

		let n = { title: '' };
		n.isActive = function() {
			return false;
		};

		return {
			id: id,
			data: {
				hidden: false,
				open: false,
				numOpenDescendants: 0,
				dirty: 0, // We increment this in some cases to force re-render.
				pages: [],
				node: n
			},
			href: '',

			toggleOpen: function() {
				this.toggleOpenLocal(!this.data.open);
			},

			toggleOpenLocal: function(open) {
				let detail = { data: this.data, open: open };
				if (!loading && open) {
					loading = true;
					dispatcher.searchNode(detail);
				}

				this.data.open = open;

				// Also send it upwards to do descendant calculations.
				dispatcher.toggleExplorerNode(detail, this.$el);
			},

			loadPages: function() {
				if (!loading && !this.data.open) {
					loading = true;
					let detail = { data: this.data, open: true };
					dispatcher.searchNode(detail);
				}
			},

			showBorder1: function() {
				return this.data.node.level > 1 && this.data.open && this.data.numOpenDescendants === 0;
			},

			showBorder2: function() {
				return this.data.node.level > 1 && this.data.open && this.data.numOpenDescendants > 0;
			},

			receiveToggledOpenDescendant: function(detail) {
				let data = detail.data;

				if (data.node.key !== this.data.node.key) {
					if (data.open) {
						this.data.numOpenDescendants++;
					} else {
						this.data.numOpenDescendants--;
					}
				}
			},

			receiveToggledOpen: function(detail) {
				let data = detail.data;

				if (data.node.key !== this.data.node.key) {
					if (data.open && this.data.open) {
						if (!data.node.key.startsWith(this.data.node.key)) {
							this.toggleOpenLocal(false);
						}
					}
				}
			},

			onTurbolinksBeforeRender: function(data) {
				this.href = window.location.href;
			},

			applyFacetFilters: function(filters) {
				if (this.data.node.level !== 1) {
					return;
				}

				// Toggle the disabled state on the top level nodes.
				// We do this via the facet filter event to avoid the delay having to
				// wait for the search to finish.
				this.data.node.disabled = !filters.isSectionEnabled(this.data.node.section.config.name);
			},

			receiveData: function(e) {
				var self = this;
				self.data.node = e.detail.nodes[self.id];
				self.data.count = self.data.node.count;
				self.data.pages = self.data.node.pages;

				// Set if node not in current search.
				this.data.hidden = this.data.node.hidden;
				loading = false;
			},

			isActive: function(page) {
				return window.location.href.endsWith(page.href);
			},

			init: function() {
				document.addEventListener('search:explorer-data', this.receiveData.bind(this));
				document.addEventListener('turbolinks:before-render', this.onTurbolinksBeforeRender.bind(this));
			}
		};
	};
})(lnSearchExplorer);
