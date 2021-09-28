'use strict';

import { getOffsetTop, isElementInViewport, isMobile, sendEvent, toggleBooleanClass } from '../helpers/index';
import { newDispatcher } from '../search/index';
import { newCreateHref } from './create-href';

var debug = 0 ? console.log.bind(console, '[explorer]') : function() {};

const SECTION_DELIM = ' > ';
const taxonomiesSection = 'taxonomies';

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
		if (!open) {
			self.softTransitions = false;
		}
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

	const scrollToActive = function(self, nodeInfo) {
		let offset = 30; // Add some space above.
		let threshold = 200; // Avoid scrolling short distances if the item is in viewport.

		var isDone = false;
		var container = self.$el.parentNode;

		const scroll = function(what, to) {
			if (to >= 0 && container.scrollTop !== to) {
				container.scrollTop = to;
			}

			debug('scroll', what, to);

			isDone = true;
		};

		if (!nodeInfo.branchKey) {
			scroll('home', 0);
			return;
		}

		let li = self.$refs[nodeInfo.branchKey];
		if (!li) {
			scroll('li not found:' + nodeInfo.branchKey, -1);
			return;
		}

		// Select the active branch or leaf node.
		let selector = nodeInfo.isBranch ? 'div > div a' : '.is-active-page';

		setTimeout(function() {
			// We have no simple way of knowing when the left menu is finished rendered,
			// but we want to at least try to scroll down to the active node,
			// and as soon as possible.
			let retries = [ 0, 200, 500, 1000, 2000 ];
			for (let i = 0; i < retries.length; i++) {
				let sleep = retries[i];

				setTimeout(function() {
					if (isDone) {
						return;
					}

					let active = li.querySelector(selector);

					if (active && active.getBoundingClientRect().top) {
						let container = self.$el.parentNode;
						let scrollTop = getOffsetTop(container, active);
						if (scrollTop) {
							// If we're near the top, we might as well go all the way.
							if (scrollTop < 100) {
								scroll('near the top', 0);
								return;
							}

							scrollTop = scrollTop - offset;

							let oldScrollTop = self.scrollTop;

							// If the active element is in viewport and
							// within the threshold distance, we just
							// keep the current scrollTop.
							if (oldScrollTop && threshold && isElementInViewport(active)) {
								let change =
									oldScrollTop < scrollTop ? scrollTop - oldScrollTop : oldScrollTop - scrollTop;

								if (change < threshold) {
									// Avoid minor scroll changes.
									scroll('less than threshold', -1);
									return;
								}
							}

							scroll('scroll', scrollTop);
						}
					} else if (i + 1 === retries.length) {
						scroll('timed out', 0);
					}
				}, sleep);
			}
		}, 0);
	};

	const getActiveNodeInfo = function() {
		let info = window.lnPageInfo;
		if (!info) {
			return null;
		}

		let isBranch = info.kind !== 'page';

		if (info.kind === 'home') {
			return {
				isBranch: isBranch,
				branchKey: ''
			};
		} else if (info.type === 'sections' || info.type === 'api') {
			// Dynamic section, fetch the node key from the location.
			return {
				isBranch: isBranch,
				branchKey: router.sectionsFromPath().join(' > ')
			};
		} else if (info.sectionsEntries) {
			return {
				isBranch: isBranch,
				branchKey: info.sectionsEntries.join(' > ')
			};
		}

		return null;
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
	var onLoadNodeInfo = null;

	return {
		data: data,
		initState: initStates.INITIAL,
		open: false,
		isSearchFiltered: false,
		scrollTop: 0,

		// onSearchReady is called when the search system is ready.
		// Note that this does not necessarily mean that a search has been performed.
		onSearchReady: function() {
			if (this.initState < initStates.SEARCH_READY) {
				this.initState = initStates.SEARCH_READY;
				if (onLoadNodeInfo && onLoadNodeInfo.branchKey) {
					// Load everything in one query.
					let sections = onLoadNodeInfo.branchKey.split(' > ');
					let sectionName = sections[0];
					let sectionConfig = { config: searchConfig.sections[sectionName] };
					let currentKey = [];
					let queries = [];
					sections.forEach((section) => {
						currentKey.push(section);
						queries.push({ key: currentKey.join(' > '), section: sectionConfig });
					});
					dispatcher.searchNodes({
						data: queries
					});
				}
			}
		},

		// Receives the initial data set once.
		receiveDataInit: function(data) {
			this.receiveData(data, true);
		},

		// Receives an updated result set based on a query or a filter applied.
		// Note that we cannot apply this until the initial data set is loaded.
		receiveData: function(data, isBlank = false) {
			debug('receiveData', data, this.open, this.initState, isBlank);
			if (this.initState === initStates.LOADING) {
				return;
			}

			if (!isBlank && !data.blankSearch.isLoaded()) {
				return;
			}

			this.data.searchState = data;
			this.isSearchFiltered = data.query.isFiltered() || data.mainSearch.results.isSectionDisabled();
			if (this.initState < initStates.DATA_LOADED) {
				this.initState = initStates.DATA_LOADED;
			}
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
			debug('receiveToggle', detail);
			if (detail.source === component) {
				return;
			}
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
			let shouldScroll = onLoadNodeInfo && this.initState < initStates.LOADED;
			this.loadIf(this.open);
			if (shouldScroll) {
				var self = this;
				var onLoadNodeInfoCopy = onLoadNodeInfo;
				self.$nextTick(function() {
					scrollToActive(self, onLoadNodeInfoCopy);
				});
			}

			// Only needed on inital page load,
			onLoadNodeInfo = null;
		},

		loadIf: function(open) {
			if (!open) {
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
			this.initState = initStates.LOADED;
		},

		onHashchange: function() {
			debug('onHashchange');
			if (this.open && isMobile()) {
				this.open = false;
				toggleBooleanClass('explorer-open', document.body, this.open);
			}
		},

		onTurbolinksBeforeVisit: function(data) {
			this.scrollTop = this.$el.parentNode.scrollTop;
		},

		// Turbolinks replaces the body that we may have changed, so restore the
		// explorer state when navigating to a new page.
		onTurbolinksBeforeRender: function(data) {
			if (this.open && isMobile()) {
				// Always close the left side tree menu when navigating away on mobile.
				this.open = false;
			}

			if (this.initState >= initStates.LOADED && !this.isMenuNavigation) {
				let branchKey = data.newBody.dataset.branch;
				if (branchKey === 'sections') {
					branchKey = router.sectionsFromPath().join(' > ');
				}

				this.setActiveBranch(branchKey);
			}

			toggleBooleanClass('explorer-open', data.newBody, this.open);
		},

		onTurbolinksRender: function(data) {
			if (document.documentElement.hasAttribute('data-turbolinks-preview')) {
				return;
			}

			let isMenuNavigation = this.isMenuNavigation;
			this.isMenuNavigation = false;

			if (!isMenuNavigation) {
				// This is a navigation by link.
				// The node was opened in the before-render event.
				let activeNodeInfo = getActiveNodeInfo();
				if (activeNodeInfo) {
					var self = this;
					this.$nextTick(function() {
						scrollToActive(self, activeNodeInfo);
					});
				}
			} else {
				this.$el.parentNode.scrollTop = this.scrollTop;
			}
		},

		setActiveBranch: function(nodeKey) {
			for (let k in this.data.nodes) {
				let n = this.data.nodes[k];

				if (n.disabled) {
					continue;
				}

				if (nodeKey.startsWith(n.key)) {
					if (!n.open) {
						n.toggleOpen();
					} else {
						n.pages.forEach((p) => {
							// Force a rerender of the leaf nodes to get correct active state.
							n.dirty++;
						});
					}
				} else if (n.open) {
					n.open = false;
				}
			}
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

				// Open the explorer menu on load when not on mobile.
				let shouldOpen = !isMobile();

				// Prepare the DOM templates. The final render of the nodes is performed lazily on expansion.
				self.render();

				if (shouldOpen) {
					// Do opacity transitions only on initial load.
					self.softTransitions = true;
					onLoadNodeInfo = getActiveNodeInfo();
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
				section: opts.section,
				level: opts.level, // Starting at 1
				ordinal: ordinal,
				name: opts.name,
				title: title,
				key: opts.key,
				href: opts.href,
				count: opts.count,
				dirty: 0,
				icon: opts.level === 1 ? opts.section.config.explorer_icon : '',
				sections: [],
				pages: [], // Leaf nodes
				open: false,
				disabled: false,
				kind: opts.kind ? opts.kind : 'section',
				isGhostSection: opts.isGhostSection
			};

			let self = this;

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
			};

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
					self.isMenuNavigation = true;

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

				// We list the taxonomies in search listings, but not in the explorer.
				if (kp.parts[0] === taxonomiesSection) {
					return;
				}

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
					};

					n.toggleOpen = function(loadPagesOnNextTick = false) {
						// Send tracking event to GA:
						let wasOpen = this.open;
						setTimeout(function() {
							let event = {
								event: 'gaEvent',
								eventCategory: 'Explore Nav',
								eventAction: wasOpen ? 'Close' : 'Open',
								eventLabel: n.key,
								nonInteraction: true
							};
							window.gtag(event);
						}, 0);

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

			if (this.initState < initStates.BLANK_LOADED || !this.data.searchState.mainSearch.isLoaded()) {
				debug('getResults: blank');
				return this.data.searchState.blankSearch.results;
			}
			debug('getResults: main');
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

			if (this.initState > initStates.BLANK_LOADED && this.data.searchState.searchOpts.isNodeToggle) {
				for (let [ key, val ] of this.data.searchState.expandedNodes.entries()) {
					if (val && val.searchResult && val.searchResult.hits && val.searchResult.hits.length > 0) {
						let hits = val.searchResult.hits;
						let n = this.data.nodes[key];
						addPagesToNode(n, hits);
					}
				}
				// No need to update everything.
				if (!onLoadNodeInfo) {
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
					// We list the taxonomies in search listings, but not in the explorer.
					if (kp.parts[0] === taxonomiesSection) {
						continue;
					}
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

				if (!n.disabled && onLoadNodeInfo && onLoadNodeInfo.branchKey.startsWith(n.key)) {
					n.open = true;
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
		},

		// Tailwind transition classes for opening of the explorer.
		transitions: function() {
			if (this.softTransitions) {
				// The regular transform looks jittery when applied on the original load.
				// So only apply a short opacity transition here:
				return {
					enter: 'transition-opacityt duration-200 sm:duration-500',
					enterStart: 'opacity-0',
					enterEnd: 'opacity-100'
				};
			}

			return {
				enter: 'transition-transform transition-opacity ease-out duration-500 sm:duration-700',
				enterStart: 'opacity-0 transform mobile:-translate-x-8 sm:-translate-y-8',
				enterEnd: 'opacity-100 transform mobile:translate-x-0 sm:translate-y-0'
			};
		}
	};
}
