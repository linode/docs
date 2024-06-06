'use strict';

import { isMobile, scrollToActiveExplorerNode } from '../helpers/helpers';
import {
	newRequestCallback,
	newRequestCallbackFactoryTarget,
	SearchGroupIdentifier,
	RequestCallBackStatus,
} from '../search/request';

var debug = 0 ? console.log.bind(console, '[explorer-node]') : function () {};
var debugDev = 0 ? console.log.bind(console, '[explorer-node-dev]') : function () {};

const explorerCommon = {
	isOpen: function () {
		return this.$store.nav.open.explorer;
	},

	closeIfMobile: function () {
		if (this.$store.nav.open.explorer && isMobile()) {
			this.$store.nav.open.explorer = false;
		}
	},

	activateHydration: function (permanent = false) {
		this.$store.search.explorer.showHydratedExplorer = true;
		if (permanent) {
			this.$store.search.explorer.showAlwaysHydratedExplorer = permanent;
		}
	},
};

export function newSearchExplorerInitial() {
	return {
		...explorerCommon,

		onClickStaticLeafNode: function (e, href, objectID) {
			debug('onClickStaticLeafNode', href, objectID);
			let hit = {
				objectID: objectID || href,
			};
			this.$store.nav.analytics.handler.clickHit(hit, 'DOCS: Explorer');
		},

		onClickStaticBranchNode: function (e, href, objectID, key) {
			debug('onClickStaticBranchNode', href, key);
			let hit = {
				objectID: objectID || href,
			};

			this.$store.nav.analytics.handler.clickHit(hit, 'DOCS: Explorer');
		},

		// Move to a hydrated version of the explorer tree.
		// key is the node that triggered this.
		// Open was that node's open state when the event was triggered.
		hydrateAndSwitchOpenStateForKey(key, open) {
			debug('hydrateAndSwitchOpenStateForKey', key, open);
			this.$store.search.explorer.keyOpenStack.push({ key: key, open: open });
		},

		onRender(e) {
			if (document.documentElement.hasAttribute('data-turbo-preview')) {
				return;
			}
			scrollToActiveExplorerNode();
		},
	};
}

export function newSearchExplorerHydrated(searchConfig) {
	let sectionKey = '';

	return {
		...explorerCommon,

		// Callbacks called on onRender.
		onRenders: [],

		// Explorer state.
		explorer: {
			// The top level nodes.
			rootNodes: [],

			// Sorted by href.
			facets: [],
		},

		isActive: function () {
			return this.isOpen() && this.$store.search.shouldShowHydratedExplorerAndIsHydrated();
		},

		init: async function () {
			debug('newSearchExplorerHydrated.init');
			const handleKeyOpenStack = () => {
				let stack = this.$store.search.explorer.keyOpenStack;
				debug('handleKeyOpenStack', stack.length);
				if (!stack.length) {
					return;
				}
				let nn = stack.pop();
				let open = !nn.open;
				let n = this.explorer.facets.find((n) => n.key === nn.key);
				if (n && n.open != open) {
					n.open = open;
					if (open) {
						openNodeAndCloseTheOthers(n, this.explorer.facets);
					}
				}
				this.activateHydration();
			};

			this.$store.search.withExplorerData((data) => {
				let facets = data.blank.sectionFacets;
				// Apply some metadata used for Algolia events and similar.
				let position = 0;
				facets.forEach((n) => {
					// These are also indexed on its own.
					if (n.href.startsWith('/docs/guides/') || n.href.startsWith('/docs/products/')) {
						position++;
						n.hit = {
							objectID: n.href,
							__position: position,
						};
					}

					// Create a id that's a valid selector.
					n.id = n.href.replace(/\W/g, '_');
				});
				this.explorer.facets = facets;
				let rootNodes = this.explorer.facets.filter(
					(n) => n.level === 1 && n.key !== 'bundles' && n.key != 'community',
				);
				// Apply explorer_icon and weight from searchConfig.sections.
				rootNodes.forEach((n) => {
					let section = searchConfig.sections[n.key.toLowerCase()];
					if (section) {
						n.icon = section.explorer_icon;
						n.weight = section.weight;
						n.title = section.title;
					}
				});

				// Sort by weight, then by title.
				rootNodes.sort((a, b) => {
					if (a.weight === b.weight) {
						return a.title.localeCompare(b.title);
					}
					return a.weight - b.weight;
				});

				this.explorer.rootNodes = rootNodes;

				this.$watch('$store.search.results.main.sectionFacets', (value) => {
					debug('watch $store.search.results.main.sectionFacets');
					updateFacetState(this.explorer.facets, value);
				});

				this.$watch('$store.search.explorer.keyOpenStack', (value) => {
					debug('$store.search.explorer.keyOpenStack', value);
					handleKeyOpenStack();
				});

				this.openAndCloseNodes();
				this.$store.search.explorer.hydrated = true;
			}, createExplorerNodeRequest);
		},

		onBeforeRender(e) {
			if (this.$store.search.explorer.showAlwaysHydratedExplorer) {
				this.$store.search.explorer.showHydratedExplorer = false;
			}
		},

		onRender(e) {
			if (document.documentElement.hasAttribute('data-turbo-preview')) {
				return;
			}
			this.openAndCloseNodes();
			this.onRenders.forEach((cb) => cb(e));
		},

		getFacetsFor: function (node) {
			return findChildren(node.href, this.explorer.facets);
		},

		findNode: function (href) {
			let index = this.explorer.facets.findIndex((n) => n.href === href);
			if (index === -1) {
				return null;
			}
			return this.explorer.facets[index];
		},

		// Open/close state and transitions.

		openAndCloseNodes: function () {
			if (!this.isActive) {
				return;
			}
			let pageInfo = getPageInfo();
			if (!pageInfo) {
				return;
			}
			debug('openAndCloseNodes', pageInfo.href);
			if (pageInfo.kind === 'home') {
				closeLevel(1, this.explorer.facets);
			} else {
				let hrefSection = pageInfo.hrefSection;
				if (pageInfo.section === 'api') {
					// The API section is currently a little special.
					hrefSection = pageInfo.href;
				} else if (pageInfo.href === '/docs/sections/') {
					// E.g. blog, marketplace. These are static only on the first level.
					// We need to open up the second level.
					hrefSection = decodeURI(window.location.pathname);

					// We don't have a static representation of these nodes.
					this.activateHydration(true);
				}
				debugDev('openAndCloseNodes.hrefSection', hrefSection);
				let currentNode = this.findNode(hrefSection);
				if (currentNode) {
					currentNode.open = currentNode.count > 0;
					openNodeAndCloseTheOthers(currentNode, this.explorer.facets);
				}
			}
		},
	};
}

export function newSearchExplorerNode(searchConfig, node) {
	let templates = {};

	const isActivePage = (p) => {
		return p.pathname === window.location.pathname && p.hash === window.location.hash;
	};

	let ctrl = {
		node: node,
		counter: 0,
		state: {
			childNodes: [],
			pages: [],
			pagesLoaded: false,
			pageSearchActive: false,
			hydrated: false,
		},

		init: function init() {
			debug('init', this.node.href);
			templates = {
				templateNode: this.$refs['templateNode'],
				templateNodePages: this.$refs['templateNodePages'],
			};

			this.onRenders.push((e) => {
				if (this.state.pagesLoaded) {
					// Update the active page.
					this.state.pages.forEach((p) => {
						let active = isActivePage(p);
						if (p.active !== active) {
							p.active = active;
						}
					});
				}
			});

			this.$watch('node.open', (value) => {
				debug('watch node.open', this.node.href, value);
				if (value) {
					this.hydrateNodeIfNeeded();
				} else {
					// Avoid doing searches for pages when the node is closed.
					// Searching will be restarted when the node is opened again.
					this.state.pageSearchActive = false;
				}
			});

			return this.$nextTick(() => {
				if (this.node.open) {
					this.hydrateNodeIfNeeded();
				}
			});
		},

		toggleOpen: function () {
			debug('toggleOpen', this.node.href, this.node.open, this.state.hydrated);
			this.hydrateNodeIfNeeded();
			this.node.open = !this.node.open && this.node.count > 0;
			if (this.node.open) {
				openNodeAndCloseTheOthers(this.node, this.explorer.facets);
			}
		},

		showStaticLeafNodes: function () {
			// Keep it static until it isn't.
			return !this.state.pagesLoaded;
		},

		onClick: function (e, p = null) {
			let hit = null;
			if (p) {
				hit = p.hit;
			} else {
				hit = this.node.hit;
			}

			if (hit) {
				// Send click events to Algolia insights.
				this.$store.nav.analytics.handler.clickHit(hit, 'DOCS: Explorer');
			}
		},

		getNodesSection: function () {
			return this.getFacetsFor(this.node);
		},

		activatePageSearchIfNeeded: function () {
			debug('activatePageSearchIfNeeded', this.node.href, this.state.pageSearchActive);
			if (this.state.pageSearchActive) {
				return;
			}
			this.state.pageSearchActive = true;
			let self = this;
			let factory = {
				status: function () {
					return self.state.pageSearchActive ? RequestCallBackStatus.On : RequestCallBackStatus.Off;
				},
				create: (query) => {
					return newRequestCallback(
						createExplorerNodeRequest(searchConfig, query, self.node.key),
						(result) => {
							debug('pages result', self.node.href, result.hits.length);
							let loc = window.location;
							let pages = result.hits.map((hit) => {
								if (hit.hierarchy && hit.hierarchy.length) {
									// This is the reference-section.
									// All pages in a section shares the same href (the section),
									// and the best match is selected while searching using Algolia's distinct keyword.
									// This is the explorer, and we need to link to the detail page.
									let last = hit.hierarchy[hit.hierarchy.length - 1];
									hit.href = last.href;
								}

								// Split hit.ref into pathname and hash.
								// This is needed to compare with the current location.
								// Note that this is currently only relevant for the API pages.
								let pathname = hit.href;
								let hash = '';
								let hashIndex = hit.href.indexOf('#');
								if (hashIndex !== -1) {
									pathname = hit.href.substring(0, hashIndex);
									hash = hit.href.substring(hashIndex);
								}

								let p = {
									title: hit.linkTitle ? hit.linkTitle : hit.title,
									linkTitle: hit.linkTitle ? hit.linkTitle : hit.title,
									href: hit.href,

									pathname: pathname,
									hash: hash,
									// Store away the original hit for Algolia events.
									hit: hit,
								};
								p.active = isActivePage(p);
								return p;
							});
							pages.sort(itemsComparer);
							self.state.pages = pages;
							self.state.pagesLoaded = true;
						},
						{
							pronto: true,
							query: query,
							fileCacheID: self.node.key,
						},
					);
				},
			};
			this.$store.search.addSearches(newRequestCallbackFactoryTarget(factory, SearchGroupIdentifier.Main));
		},

		hydrateNodeIfNeeded: function () {
			if (this.destroyed) {
				return;
			}
			if (!this.state.hydrated) {
				debug('hydrateNodeIfNeeded', this.node.href);
				this.hydrateNode();
			} else {
				debug('hydrateNodeIfNeeded.already hydrated', this.node.href);
			}

			this.activatePageSearchIfNeeded();
		},

		hydrateNode: function () {
			debug('hydrateNode', this.node.href);
			let self = this;
			this.state.hydrated = true;

			const nodeElement = this.$refs['node-tree'];

			let nodeTemplate = document.importNode(templates.templateNode.content.querySelector('template'), true);
			let nodePagesTemplate = document.importNode(templates.templateNodePages.content.querySelector('template'), true);

			// First append the leaf nodes.
			nodeElement.appendChild(nodePagesTemplate);
			// Then append the branch nodes.
			nodeElement.appendChild(nodeTemplate);
		},
	};

	return ctrl;
}

const findChildren = function (href, nodes) {
	let children = [];

	// Nodes are sorted by href, so we can use a binary search.
	let index = nodes.findIndex((n) => n.href === href);
	if (index === -1) {
		return children;
	}

	// Now find all children one level down.
	let level = nodes[index].level;
	let child = nodes[index + 1];
	while (child && child.href.startsWith(href)) {
		if (child.level === level + 1) {
			children.push(child);
		}
		index++;
		child = nodes[index + 1];
	}
	return children;
};

const openNodeAndCloseTheOthers = function (node, nodes) {
	debugDev('openNodeAndCloseTheOthers', node.href);
	for (let i = 0; i < nodes.length; i++) {
		let n = nodes[i];
		if (node.href.startsWith(n.href)) {
			n.open = true;
		} else {
			n.open = false;
		}
		if (n.open) {
			debugDev('openNodeAndCloseTheOthers.open', n.href);
		}
	}
};

const closeLevel = function (level, nodes) {
	debug('closeLevel', level);
	for (let i = 0; i < nodes.length; i++) {
		let n = nodes[i];
		if (n.open && n.level === level) {
			n.open = false;
		}
	}
};

const updateFacetState = function (to, from) {
	// from is a subset of to.
	// If a node in from is not found in to, disable it.
	// For matches, update count.
	// For non-matches, set count to 0.
	let fromIndex = 0;
	for (let toIndex = 0; toIndex < to.length; toIndex++) {
		let toNode = to[toIndex];
		let fromNode = null;
		if (toIndex >= from.length) {
			let idx = from.findIndex((n) => n.href === toNode.href);
			if (idx !== -1) {
				fromNode = from[idx];
			}
			if (!fromNode) {
				toNode.count = 0;
				toNode.open = false;
				continue;
			}
		} else {
			fromNode = from[fromIndex];
		}

		if (toNode.href === fromNode.href) {
			toNode.count = fromNode.count;
			fromIndex++;
			continue;
		}

		toNode.count = 0;
		toNode.open = false;
	}
};

const createExplorerNodeRequest = function (searchConfig, query, key) {
	let maxLeafNodes = 200; // This needs to big enough to cover the biggest section.
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

const getPageInfo = function () {
	let info = window.lnPageInfo;
	if (!info) {
		return null;
	}
	let sectionKey = '';
	if (info.sectionsPath) {
		// Create a section key that's on the same format as what we have in Algolia.
		const parts = info.sectionsPath.split('/');
		const delim = ' > ';
		sectionKey = parts.join(delim);
	}
	info.sectionKey = sectionKey;

	return info;
};

// This comparer is used to sort both sections
// and leaf nodes in the explorer tree.
// This functions orders by 1) Ordinal 2) PubDate or 3) Title.
// Note: The sort was made simpler to get it in line with the static render,
// but the old code is commented out if we want to revert it later.
const itemsComparer = function (a, b) {
	return a.linkTitle.localeCompare(b.linkTitle);
	/*
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
	*/
};
