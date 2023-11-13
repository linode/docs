'use strict';

import { getOffsetTop, isElementInViewport, isMobile } from '../helpers/index';
import {
	newRequestCallback,
	newRequestCallbackFactoryTarget,
	SearchGroupIdentifier,
	RequestCallBackStatus,
} from '../search/request';
import { isTopResultsPage } from '../search';
import { newCreateHref } from './create-href';

var debug = 0 ? console.log.bind(console, '[explorer]') : function () {};

const sectionDelimm = ' > ';
const startLevelRegularPages = 2;

// The main search result have some sections that does not fit into the left side explorer.
const shouldSkipSection = function (lvl0) {
	return lvl0.endsWith('-branches') || lvl0 === 'taxonomies' || lvl0 === 'bundles';
};

// Reports whether branch1 is the same or below branch2.
const isSameOrBelowBranch = function (branch1, branch2) {
	return branch1 === branch2 || branch1.startsWith(branch2 + ' >');
};

const nodeKeyToID = function (key) {
	return 'node-' + key.replace(/ > /g, '-');
};

export function newSearchExplorerController(searchConfig) {
	if (!searchConfig) {
		throw 'newSearchExplorerController: must provide searchConfig';
	}

	const router = newCreateHref(searchConfig);

	// This comparer is used to sort both sections
	// and leaf nodes in the explorer tree.
	// This functions orders by 1) Ordinal 2) PubDate or 3) Title.
	const itemsComparer = function (a, b) {
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

	const createExplorerNodeRequest = function (query, key) {
		let maxLeafNodes = searchConfig.explorer_max_leafnodes || 100;
		let sectionFilter = `section:${key}`;
		let facetFilters = query.toFacetFilters();
		let filters = '';

		return {
			indexName: searchConfig.indexName(searchConfig.sections_merged.index),
			filters: filters,
			facetFilters: facetFilters.concat(facetFilters, sectionFilter),
			distinct: 0,
			params: `query=${encodeURIComponent(query.lndq)}&hitsPerPage=${maxLeafNodes}`,
		};
	};

	const scrollToActive = function (self, nodeInfo) {
		let offset = 30; // Add some space above.
		let threshold = 200; // Avoid scrolling short distances if the item is in viewport.

		var isDone = false;
		var container = self.$el.parentNode;

		const scroll = function (what, to) {
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

		let li = document.getElementById(nodeKeyToID(nodeInfo.branchKey));
		if (!li) {
			scroll('li not found: ' + nodeInfo.branchKey, -1);
			return;
		}

		// Select the active branch or leaf node.
		let selector = nodeInfo.isBranch ? 'div > div a' : '.is-active-page';

		setTimeout(function () {
			// We have no simple way of knowing when the left menu is finished rendered,
			// but we want to at least try to scroll down to the active node,
			// and as soon as possible.
			let retries = [0, 200, 500, 1000, 2000];
			for (let i = 0; i < retries.length; i++) {
				let sleep = retries[i];

				setTimeout(function () {
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
								let change = oldScrollTop < scrollTop ? scrollTop - oldScrollTop : oldScrollTop - scrollTop;

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

	const getActiveNodeInfo = function () {
		let info = window.lnPageInfo;
		if (!info) {
			return null;
		}

		let isBranch = info.kind !== 'page';

		if (info.kind === 'home') {
			return {
				isBranch: isBranch,
				branchKey: '',
			};
		} else if (info.type === 'sections' || info.type === 'api') {
			// Dynamic section, fetch the node key from the location.
			return {
				isBranch: isBranch,
				branchKey: router.sectionsFromPath().join(' > '),
			};
		} else if (info.sectionsEntries) {
			return {
				isBranch: isBranch,
				branchKey: info.sectionsEntries.join(' > '),
			};
		} else {
			return {
				isBranch: false,
				branchKey: '',
			};
		}
	};

	var templates = {};

	var data = {
		// Set after the initial data load.
		loaded: false,

		// All nodes in the tree.
		nodes: {},

		// Contains all the root nodes (level === 1).
		rootNode: {
			sections: [],
		},

		// The search results.
		searchState: null,

		// Maps Algolia section to the Hugo section.
		sectionMapping: {},
	};

	data.walk = function (rootNode, shouldSkip) {
		const walkRecursive = function (n) {
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
		isMenuNavigation: false,
		scrollTop: 0,
		open: true,
		noTransitions: true,

		init: function () {
			templates = {
				templateLoopRoot: this.$refs['templateLoopRoot'],
				templateLoopNested: this.$refs['templateLoopNested'],
				templateTree: this.$refs['templateTree'],
			};
			this.target = this.$refs['explorer'];

			// Open the explorer menu on load when not on mobile.
			let shouldOpen = !isMobile();
			let isSearchPage = isTopResultsPage();
			if (isSearchPage) {
				// Show it after we have the search results.
				this.open = false;
			}

			loadInitialData = (sectionKeys = []) => {
				this.$store.search.withExplorerData(
					(data) => {
						this.data.initial = data;
						this.load();

						this.$watch('$store.search.results.main.result', (value) => {
							debug('main result');
							this.load();
							this.open = true;
						});
					},
					createExplorerNodeRequest,
					sectionKeys
				);
			};

			sectionKeys = [];

			if (shouldOpen) {
				onLoadNodeInfo = getActiveNodeInfo();
				if (onLoadNodeInfo.branchKey) {
					let sections = onLoadNodeInfo.branchKey.split(' > ');

					let currentKey = [];
					for (let i = 0; i < sections.length; i++) {
						currentKey.push(sections[i]);
						if (i < startLevelRegularPages - 1) {
							continue;
						}
						let section = currentKey.join(' > ');
						sectionKeys.push(section);
					}
				}
				loadInitialData(sectionKeys);
			}

			this.$watch('$store.nav.open.explorer', (value) => {
				this.noTransitions = false;
				if (value && !this.data.loaded) {
					loadInitialData();
				}
			});
		},

		isOpen: function () {
			return this.$store.nav.open.explorer && this.data.loaded;
		},

		closeIfMobile: function () {
			if (this.$store.nav.open.explorer && isMobile()) {
				this.$store.nav.open.explorer = false;
			}
		},

		load: function () {
			if (!this.getResult()) {
				return;
			}

			if (this.data.loaded) {
				this.filterNodes();
				return;
			}

			let shouldScroll = onLoadNodeInfo;

			this.buildNodes();
			this.render();
			this.data.loaded = true;

			if (shouldScroll) {
				var onLoadNodeInfoCopy = onLoadNodeInfo;
				this.$nextTick(() => {
					scrollToActive(this, onLoadNodeInfoCopy);
				});
			}

			// Only needed on inital page load,
			onLoadNodeInfo = null;
			__stopWatch('explorer.loaded');
		},

		onTurbolinksBeforeVisit: function (data) {
			this.scrollTop = this.$el.parentNode.scrollTop;
		},

		// Turbolinks replaces the body that we may have changed, so restore the
		// explorer state when navigating to a new page.
		onTurbolinksBeforeRender: function (data) {
			// Always close the left side tree menu when navigating away on mobile.
			this.closeIfMobile();
		},

		onTurbolinksRender: function (data) {
			if (document.documentElement.hasAttribute('data-turbolinks-preview')) {
				return;
			}

			let isMenuNavigation = this.isMenuNavigation;
			this.isMenuNavigation = false;

			if (!isMenuNavigation) {
				// This is a navigation by link.
				// The node was opened in the before-render event.
				let activeNodeInfo = getActiveNodeInfo();
				this.setActiveBranch(activeNodeInfo);
				scrollToActive(this, activeNodeInfo);
			} else {
				this.$el.parentNode.scrollTop = this.scrollTop;
			}
		},

		setActiveBranch: function (nodeInfo) {
			let nodeKey = nodeInfo.branchKey;
			for (let k in this.data.nodes) {
				let n = this.data.nodes[k];

				if (n.disabled) {
					continue;
				}

				if (isSameOrBelowBranch(nodeKey, n.key)) {
					if (!n.open) {
						n.toggleOpen();
					} else if (!nodeInfo.isBranch) {
						n.pages.forEach((page) => {
							page.active = page.href === window.location.pathname;
						});
					}
				} else if (n.open) {
					n.open = false;
				}
			}
		},

		render: function () {
			let fragment = new DocumentFragment();
			this.renderNodesRecursive(fragment, 1);
			this.target.innerHTML = '';
			this.target.appendChild(fragment);
		},

		renderNodesRecursive: function (ulEl, level) {
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

		createNode: function (opts) {
			let title = opts.title ? opts.title : opts.name;
			let ordinal = opts.ordinal ? opts.ordinal : 0;

			let n = {
				section: opts.section,
				parent: opts.parent,
				level: opts.level, // Starting at 1
				ordinal: ordinal,
				firstPublishedTime: opts.firstPublishedTime ? opts.firstPublishedTime : 0,
				name: opts.name,
				title: title,
				key: opts.key,
				href: opts.href,
				hit: opts.hit,
				active: opts.active,
				count: opts.count,
				icon: opts.level === 1 ? opts.section.config.explorer_icon : '',
				sections: [],
				pages: [], // Leaf nodes
				open: false,
				disabled: false,
				kind: opts.kind ? opts.kind : 'section',
				isGhostSection: opts.isGhostSection,
				sectionLvl0: opts.sectionLvl0,
			};

			let self = this;

			n.id = function () {
				return nodeKeyToID(this.key);
			};

			n.children = function () {
				if (this.pages.length === 0) {
					// The sections slice is sorted and ready to use.
					return this.sections;
				}

				const nodes = this.sections.concat(this.pages);

				nodes.sort(itemsComparer);

				return nodes;
			};

			n.isDisabled = function () {
				return false;
			};

			n.isLeaf = function () {
				return this.kind === 'page' || (this.level > 1 && (this.count === 0 || this.isGhostSection));
			};

			n.isPage = function () {
				return this.kind === 'page';
			};

			n.setAsActive = function () {
				if (!this.parent) {
					n.active = true;
					return;
				}

				this.parent.pages.forEach((p) => {
					p.active = p.key === n.key;
				});
			};

			n.onClick = function (e) {
				if (e.metaKey) {
					return;
				}
				if (!this.isLeaf() && !this.isDisabled() && !this.open) {
					this.toggleOpen();
				}

				if (this.isLeaf()) {
					this.setAsActive();
				}

				if (this.isGhostSection) {
					e.preventDefault();

					self.$store.nav.openSearchPanelWithQuery((query) => {
						query.addFilter('docType', this.sectionLvl0);
					});
					return;
				}

				if (this.href) {
					// Send click events to Algolia insights.
					if (this.hit) {
						self.$store.nav.analytics.handler.clickHit(this.hit, 'DOCS: Explorer');
					}

					let href = this.href;
					if (this.isLeaf() && href.startsWith('http')) {
						return;
					}
					self.isMenuNavigation = true;
					e.preventDefault();

					if (this.isLeaf()) {
						Turbo.visit(href);
					} else {
						// Add a slight delay here to allow the menu
						// to expand before we navigate.
						// This looks more natural.
						setTimeout(function () {
							Turbo.visit(href);
						}, 200);
					}
				}
			};

			// Detault implementations.
			n.showBorder1 = function () {
				return false;
			};

			n.showBorder2 = function () {
				return false;
			};

			n.loadPages = function () {};

			return n;
		},

		addPagesToNode: function (n, hits) {
			let pages = [];
			for (let item of hits) {
				let href = item.href;
				if (item.hierarchy && item.hierarchy.length) {
					// This is the reference-section.
					// All pages in a section shares the same href (the section),
					// and the best match is selected while searching using Algolia's distinct keyword.
					// This is the explorer, and we need to link to the detail page.
					let last = item.hierarchy[item.hierarchy.length - 1];
					href = last.href;
				}
				let active = href === window.location.pathname;

				pages.push(
					this.createNode({
						parent: n,
						section: n.section,
						key: href,
						href: href,
						hit: item,
						active: active,
						ordinal: item.ordinal,
						firstPublishedTime: item.firstPublishedTime,
						name: item.linkTitle,
						level: n.level + 1,
						kind: 'page',
						count: 0,
					})
				);
			}

			n.pages = pages;
		},

		// loadPages loads any leaf pages into node if not already loaded.
		loadPages: function (node) {
			let nodes = [];

			this.data.walk(this.data.rootNode, function (nn) {
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

			if (nodes.length === 0) {
				return;
			}

			var self = this;

			nodes.forEach((node) => {
				if (node.level < startLevelRegularPages) {
					return;
				}

				let factory = {
					status: function () {
						return node.open ? RequestCallBackStatus.On : RequestCallBackStatus.Off;
					},
					create: (query) => {
						return newRequestCallback(
							createExplorerNodeRequest(query, node.key),
							(result) => {
								this.addPagesToNode(node, result.hits);
							},
							{
								pronto: true,
								query: query,
								fileCacheID: node.key,
							}
						);
					},
				};

				this.$store.search.addSearches(newRequestCallbackFactoryTarget(factory, SearchGroupIdentifier.Main));
			});
		},

		buildNodes: function () {
			var result = this.getResult();
			var openSections = {};
			if (!this.data.loaded && this.data.initial) {
				openSections = this.data.initial.sections;
			}

			var self = this;

			this.data.parseKey = function (key) {
				let parts = key.split(sectionDelimm);
				let level = parts.length;
				let name = parts[parts.length - 1];

				let href = router.hrefSection(key);

				let parentKey = false;
				if (parts.length > 1) {
					parentKey = parts.slice(0, parts.length - 1).join(sectionDelimm);
				}

				return {
					parts: parts,
					level: level,
					key: key,
					name: name,
					href: href,
					parentKey: parentKey,
				};
			};

			this.data.add = function (sectionResult) {
				let kp = this.parseKey(sectionResult.key);

				let n = this.nodes[kp.key];
				let count = sectionResult.count;
				let meta = sectionResult.meta;

				let title;
				let ordinal = 0;
				if (meta) {
					title = meta.linkTitle;
					ordinal = meta.ordinal;
				}

				if (!n) {
					let section;
					if (kp.level === 1) {
						section = { config: searchConfig.sections[kp.key.toLowerCase()] };
						title = section.config.title;
					}

					let hit;

					if (sectionResult.hasObjectID) {
						// Create a pseudo hit for event tracking.
						hit = {
							objectID: kp.href,
							__position: sectionResult.position,
						};
					}

					n = self.createNode({
						key: kp.key,
						section: section,
						href: kp.href,
						name: kp.name,
						title: title,
						ordinal: ordinal,
						level: kp.level,
						count: count,
						isGhostSection: sectionResult.isGhostSection,
						sectionLvl0: sectionResult.sectionLvl0,
						hit: hit,
					});

					if (!n.disabled && onLoadNodeInfo && isSameOrBelowBranch(onLoadNodeInfo.branchKey, n.key)) {
						n.open = true;
					}

					n.isDisabled = function () {
						return this.disabled || this.count === 0;
					};

					n.toggleOpen = function () {
						if (!this.open) {
							// Close open nodes on the same or lower level.
							self.data.walk(this.parent, function (nn) {
								if (nn.open && nn !== n) {
									nn.open = false;
								}
								return false;
							});
						}
						this.open = !this.open;
						if (this.open) {
							this.loadPages();
						}
					};

					n.loadPages = function () {
						self.loadPages(this);
					};

					n.hasOpenDescendants = function () {
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

					n.showBorder1 = function () {
						return this.level > 1 && this.open && !this.hasOpenDescendants();
					};

					n.showBorder2 = function () {
						return this.level > 1 && this.open && this.hasOpenDescendants();
					};

					let childResults = openSections[kp.key];
					if (childResults) {
						self.addPagesToNode(n, childResults.hits);
					}

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

			// Build the nodes in the order configured.
			let resultSections = result.sections();
			searchConfig.sectionsSorted.forEach((sectionCfg) => {
				resultSections.forEach((section) => {
					let key = section.key.toLowerCase();
					if (key.startsWith(sectionCfg.name) && !shouldSkipSection(section.sectionLvl0)) {
						this.data.add(section);
					}
				});
			});

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

		getResult: function () {
			if (this.data.loaded) {
				return this.$store.search.results.main.result;
			}
			return this.data.initial.blank.result;
		},

		// Update hidden state and facet counts based on a updated search result.
		filterNodes: function () {
			debug('filterNodes');
			let result = this.getResult();

			let seen = new Set();
			let resultSections = result.sections();

			for (let resultSection of resultSections) {
				if (shouldSkipSection(resultSection.sectionLvl0)) {
					continue;
				}
				let kp = this.data.parseKey(resultSection.key);
				let n = this.data.nodes[kp.key];
				if (!n) {
					console.warn(`node with key ${kp.key} not set`);
					continue;
				}

				n.count = resultSection.count;
				seen.add(kp.key);
			}

			for (let k in this.data.nodes) {
				let n = this.data.nodes[k];

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
			}
		},

		// Tailwind transition classes for opening of the explorer.
		transitions: function () {
			if (this.noTransitions) {
				// No transition on initial page load. It looks jittery and gives a penalty in Lightroom.
				return {};
			}

			return {
				'x-transition:enter': 'transition-transform transition-opacity ease-out duration-500 sm:duration-700',
				'x-transition:enter-start': 'opacity-0 transform mobile:-translate-x-8 sm:-translate-y-8',
				'x-transition:enter-end': 'opacity-100 transform mobile:translate-x-0 sm:translate-y-0',
			};
		},
	};
}
