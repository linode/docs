'use strict';

import { isMobile, sendEvent, toggleBooleanClass } from '../helpers/index';
import { newDispatcher } from '../search/index';
import { newCreateHref } from './create-href';

var debug = 0 ? console.log.bind(console, '[explorer]') : function() {};

const SECTION_DELIM = ' > ';

export function newSearchExplorerController(searchConfig) {
	if (!searchConfig) {
		throw 'newSearchExplorerController: must provide searchConfig';
	}

	const router = newCreateHref(searchConfig);
	const dispatcher = newDispatcher();
	const component = 'explorer';

	// Toggle this on to expand the tree on load.
	// But also remember to revert it when done.
	const designMode = false;

	// This comparer is used to sort both sections
	// and leaf nodes in the explorer tree.
	// This functions orders by 1) Ordinal 2) PubDate or 3) Title.
	const itemsComparer = function(a, b) {
		if (a.ordinal === b.ordinal) {
			if (a.firstPublishedTime === b.firstPublishedTime) {
				let atitle = a.linkTitle || a.title;
				let btitle = b.linkTitle || b.title;
				return atitle < btitle ? -1 : 1;
			}
			// Sort newest first.
			return a.firstPublishedTime > b.firstPublishedTime ? -1 : 1;
		}
		return a.ordinal - b.ordinal;
	};

	const setOpenStatus = function(self, open) {
		debug('setOpenStatus', open, self.initState);
		if (open) {
			prepare(self);
		}
		self.open = open;
		sendEvent('nav:toggle', { what: component, open: self.open, source: component });
	};

	const prepare = function(self) {
		debug('prepare', self.initState);
		switch (self.initState) {
			case initStates.OPENING:
				break;
			case initStates.INITIAL:
				self.initState = initStates.OPENING;
				break;
			case initStates.SEARCH_READY:
				debug('prepare:searchBlank');
				dispatcher.searchBlank();
				break;
			default:
				debug('prepare:loadIf');
				self.loadIf(true);
				break;
		}
	};

	// initStates represents the state of the loading of the initial data set.
	// We may get filtered search results before we've finished with the initial build,
	// and we need to prevent those building before we're ready.
	const initStates = {
		INITIAL: 0,
		OPENING: 1,
		SEARCH_READY: 2,
		DATA_LOADED: 3,
		LOADING: 4,
		LOADED: 5
	};

	var templates = {};

	var data = {
		// All nodes in the tree (all indices).
		nodes: {},

		// Contains all the root nodes (level === 1).
		rootNode: {
			sections: []
		},

		// The search results.
		searchState: null,

		// Maps Algolia section to the Hugo section.
		sectionMapping: {}
	};

	data.walk = function(rootNode, shouldSkip) {
		const walkRecursive = function(n) {
			for (let nn of n.sections) {
				if (shouldSkip(nn)) {
					continue;
				}
				walkRecursive(nn);
			}
		};

		for (let n of rootNode.sections) {
			if (shouldSkip(n)) {
				continue;
			}
			walkRecursive(n);
		}
	};

	// May be set on initial load to expand to a given node.
	var activeNodeKey = '';

	return {
		data: data,
		initState: initStates.INITIAL,
		open: false,
		isSearchFiltered: false,
		scrollTop: 0,

		// onSearchReady is called when the search system is ready.
		// Note that this does not necessarily mean that a search has been performed.
		onSearchReady: function() {
			switch (this.initState) {
				case initStates.INITIAL:
					this.initState = initStates.SEARCH_READY;
					break;
				case initStates.OPENING:
					if (activeNodeKey != '') {
						// Load everything in one query.
						let sectionName = activeNodeKey.split('>')[0].trim();
						dispatcher.searchNodes({
							data: [
								{ key: activeNodeKey, section: { config: searchConfig.sections[sectionName] } }
							]
						});
					} else {
						dispatcher.searchBlank();
					}
					break;
			}
		},

		// Receives the initial, blank, result set with all the initial
		// facets and their counts.
		receiveDataInit: function(data) {
			debug('receiveDataInit', data, this.open, this.initState);
			this.data.searchState = data;
			this.initState = initStates.DATA_LOADED;
			this.load();
		},

		// Receives an updated result set based on a query or a filter applied.
		// Note that we cannot apply this until the initial data set is loaded.
		receiveData: function(data) {
			debug('receiveData', data, this.open, this.initState);
			if (this.initState < initStates.LOADED) {
				return;
			}
			this.data.searchState = data;
			this.isSearchFiltered = data.query.isFiltered() || data.mainSearch.results.isSectionDisabled();
			this.load();
		},

		isOpen: function() {
			return this.open && this.initState === initStates.LOADED;
		},

		closeIfMobile: function() {
			if (this.open && isMobile()) {
				setOpenStatus(this, false);
			}
		},

		receiveToggle: function(detail) {
			if (detail.source === component) {
				return;
			}
			debug('receiveToggle', detail);
			switch (detail.what) {
				case 'search-input':
					if (detail.open) {
						setOpenStatus(this, false);
					}
					break;
				case 'explorer':
					setOpenStatus(this, detail.open);
					break;
				case 'explorer-preload':
					prepare(this);
					break;
				default:
				// Ignore
			}
		},

		load: function() {
			this.loadIf(this.open);
		},

		loadIf: function(open) {
			if (!open) {
				return;
			}

			if (this.initState < initStates.DATA_LOADED) {
				// It will eventually get here.
				return;
			}

			if (this.initState === initStates.LOADING) {
				return;
			}

			if (this.initState === initStates.LOADED) {
				this.filterNodes();
				return;
			}

			this.initState = initStates.LOADING;
			this.buildNodes();
			this.filterNodes();
			var self = this;
			this.$nextTick(function() {
				self.initState = initStates.LOADED;
			});
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
			this.renderNodesRecursive(this.target, 1);
		},

		renderNodesRecursive: function(ulEl, level) {
			let templ =
				level === 1
					? document.importNode(templates.templateLoopRoot.content.querySelector('template'), true)
					: document.importNode(templates.templateLoopNested.content.querySelector('template'), true);

			let li = document.importNode(templates.templateTree.content.querySelector('.explorer__node'), true);

			let mainLoop = templ.content.querySelector('template');
			mainLoop.content.appendChild(li);
			ulEl.appendChild(templ);

			ulEl = li.querySelector('.node-tree');

			if (level >= 5) {
				// configure
				return;
			}

			level++;

			this.renderNodesRecursive(ulEl, level);
		},

		// Initialize the component with the DOM templates to use for rendering.

		init: function(page) {
			var self = this;
			// This needs to be done AFTER Alpine has made its initial updates to the DOM,
			// so return a callback function.
			return function() {
				templates = {
					templateLoopRoot: self.$refs['templateLoopRoot'],
					templateLoopNested: self.$refs['templateLoopNested'],
					templateTree: self.$refs['templateTree']
				};
				self.target = self.$refs['explorer'];

				// Open the explorer menu on load when not on mobile, only for the the home page and any of the pages in the /api section.
				// Note that this applies only to the initial load.
				let shouldOpen = !isMobile() && (designMode || page.kind === 'home' || page.type === 'api');

				if (page.type === 'api') {
					activeNodeKey = page.href.substr(1).slice(0, -1).split('/').slice(1).join(' > ');
				}

				// Prepare the DOM templates. The final render of the nodes is performed lazily on expansion.
				self.render();

				if (shouldOpen) {
					setOpenStatus(self, true);
				}
			};
		},

		createNode: function(opts) {
			let title = opts.level === 1 ? opts.section.config.title : opts.name;
			let ordinal = opts.ordinal ? opts.ordinal : 0;
			if (opts.level > 1) {
				let m = this.data.searchState.metaSearch.getSectionMeta(opts.key.toLowerCase());
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
				disabled: false,
				kind: opts.kind ? opts.kind : 'section',
				isGhostSection: opts.isGhostSection
			};

			n.children = function() {
				if (this.pages.length === 0) {
					// The sections slice is sorted and ready to use.
					return this.sections;
				}

				const nodes = this.sections.concat(this.pages);
				nodes.sort(itemsComparer);

				return nodes;
			};

			n.isDisabled = function() {
				return false;
			}

			n.isLeaf = function() {
				return this.kind === 'page' || (this.level > 1 && (this.count === 0 || this.isGhostSection));
			};

			n.isPage = function() {
				return this.kind === 'page';
			};

			n.isActive = function() {
				return window.location.href.endsWith(this.href);
			};

			n.onClick = function(e) {
				if (!this.isLeaf() && !this.isDisabled() && !this.open) {
					this.toggleOpen();
				}

				if (this.isGhostSection) {
					e.preventDefault();
					sendEvent('search:filter', `sections=${opts.section.config.name}`);
					return;
				}

				if (this.href) {
					let href = this.href;

					if (this.isLeaf()) {
						Turbolinks.visit(href);
					} else {
						// Add a slight delay here to allow the menu
						// to expand before we navigate.
						// This looks more natural.
						setTimeout(function() {
							Turbolinks.visit(href);
						}, 200);
					}
				}
			};

			// Detault implementations.
			n.showBorder1 = function() {
				return false;
			};

			n.showBorder2 = function() {
				return false;
			};

			n.loadPages = function() {};

			return n;
		},

		// loadPages loads any leaf pages into node if not already loaded.
		loadPages: function(node) {
			let nodes = [];

			this.data.walk(this.data.rootNode, function(nn) {
				if (nn.open) {
					nodes.push(nn);
				}

				// If it's not open we skip any descendants.
				return !nn.open;
			});

			if (!node.open) {
				// Preload
				nodes.push(node);
			}

			let detail = { data: nodes };
			dispatcher.searchNodes(detail);
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

			this.data.add = function(section, sectionResult) {
				let kp = this.parseKey(sectionResult.key);

				let n = this.nodes[kp.key];
				let count = sectionResult.count;

				if (!n) {
					n = self.createNode({
						section: section,
						key: kp.key,
						href: kp.href,
						name: kp.name,
						level: kp.level,
						count: count,
						isGhostSection: sectionResult.isGhostSection
					});

					n.isDisabled = function() {
						return this.disabled || this.count === 0;
					}

					n.toggleOpen = function(loadPagesOnNextTick = false) {
						if (!this.open) {
							// Close open nodes on the same or lower level.
							self.data.walk(this.parent, function(nn) {
								if (nn.open && nn !== n) {
									nn.open = false;
								}
								return false;
							});
						}
						this.open = !this.open;
						if (this.open) {
							if (loadPagesOnNextTick) {
								self.$nextTick(() => {
									this.loadPages();
								});
							} else {
								this.loadPages();
							}
						}
					};

					n.loadPages = function() {
						self.loadPages(this);
					};

					n.hasOpenDescendants = function() {
						for (let s of n.sections) {
							if (s.open) {
								return true;
							}
						}

						for (let s of n.sections) {
							if (s.hasOpenDescendants()) {
								return true;
							}
						}
						return false;
					};

					n.showBorder1 = function() {
						return this.level > 1 && this.open && !this.hasOpenDescendants();
					};

					n.showBorder2 = function() {
						return this.level > 1 && this.open && this.hasOpenDescendants();
					};

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
						n.parent = parentNode;
					}
				}
			};

			for (let section of sections) {
				let searchData = section.searchData;
				for (let sectionResult of searchData.resultSections()) {
					this.data.add(section, sectionResult);
				}
			}

			for (let k in this.data.nodes) {
				let n = this.data.nodes[k];

				n.sections.sort(itemsComparer);
			}

			debug('nodes', this.data.nodes);

			for (let k in this.data.nodes) {
				let n = this.data.nodes[k];

				if (n.level !== 1) {
					continue;
				}
				n.parent = this.data.rootNode;
				this.data.rootNode.sections.push(n);
			}
		},

		getResults: function() {
			if (!this.data.searchState) {
				return null;
			}

			if (this.initState == initStates.LOADING || !this.data.searchState.mainSearch.isLoaded()) {
				return this.data.searchState.blankSearch.results;
			}

			return this.data.searchState.mainSearch.results;
		},

		
		// Update hidden state and facet counts based on a updated search result.
		filterNodes: function() {
			debug('filterNodes', this.data);

			var self = this;

			const addPagesToNode = function(n, hits) {
				let pages = [];
				for (let item of hits) {
					let href = item.href;
					pages.push(
						self.createNode({
							section: n.section,
							key: href,
							href: href,
							ordinal: item.ordinal,
							name: item.linkTitle,
							level: n.level + 1,
							kind: 'page',
							count: 0
						})
					);
				}

				n.pages = pages;
			};

			if (this.data.searchState.searchOpts.isNodeToggle) {
				for (let [ key, val ] of this.data.searchState.expandedNodes.entries()) {
					if (val && val.searchResult && val.searchResult.hits) {
						let hits = val.searchResult.hits;
						let n = this.data.nodes[key];
						addPagesToNode(n, hits);
					}
				}
				// No need to update everything.
				if (activeNodeKey === '') {
					return;
				}
			}

			let results = this.getResults();

			let seen = new Set();

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
						console.warn(`node with key ${kp.key} not set`);
						continue;
					}

					n.count = resultSection.count;
					seen.add(kp.key);
				}
			}

			for (let k in this.data.nodes) {
				let n = this.data.nodes[k];
				if (n.level === 1) {
					n.disabled = !n.section.isEnabled();
					if (n.disabled) {
						n.open = false;
						n.count = 0;
					}
				}

				if (!n.disabled && activeNodeKey && activeNodeKey.startsWith(n.key)) {
					n.toggleOpen(true);
				}

				if (!seen.has(n.key)) {
					if (n.level === 1) {
						n.count = 0;
						n.open = false;
					} else {
						// Hide it in the DOM.
						n.hidden = true;
					}

					continue;
				} else {
					n.hidden = false;
				}

				let expanded = this.data.searchState.expandedNodes.get(n.key);

				if (expanded && expanded.searchResult && expanded.searchResult.hits) {
					addPagesToNode(n, expanded.searchResult.hits);
				} else {
					n.pages = [];
				}
			}

			// Only activate this on first build.
			activeNodeKey = '';
		}
	};
}
