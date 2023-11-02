'use strict';

import { isMobile } from '../helpers/helpers';
import {
	newRequestCallback,
	newRequestCallbackFactoryTarget,
	SearchGroupIdentifier,
	RequestCallBackStatus,
} from '../search/request';

var debug = 0 ? console.log.bind(console, '[explorer-node]') : function () {};

export function newSearchExplorerRoot(pageInfo) {
	let sectionKey = '';
	if (pageInfo.sectionsPath) {
		// Create a section key that's on the same format as what we have in Algolia.
		const parts = pageInfo.sectionsPath.split('/');
		const delim = ' > ';
		sectionKey = parts.join(delim);
	}
	pageInfo.sectionKey = sectionKey;

	return {
		// Explorer state.
		explorer: {
			// The current page.
			pageInfo: pageInfo,

			// Sorted by href.
			facets: [],

			// Callbacks called when facets are loaded.
			onFacetsLoaded: [],

			// Callbacks called on render after a navigation with Turbo.
			onTurboRender: [],

			searchActivated: false,
			onSearchActivated: [],
		},

		init: async function () {
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
				});
				this.explorer.facets = facets;
				this.explorer.onFacetsLoaded.forEach((cb) => cb());
				this.$watch('$store.search.results.main.sectionFacets', (value) => {
					// This will be called once a search starts.
					// Notify the child nodes.
					if (!this.explorer.searchActivated) {
						this.explorer.onSearchActivated.forEach((cb) => cb());
						this.explorer.searchActivated = true;
					}
					updateFacetState(this.explorer.facets, value);
				});
			}, createExplorerNodeRequest);
		},

		getFacetsFor: function (node) {
			return findChildren(node, this.explorer.facets);
		},

		findNode: function (href) {
			let index = this.explorer.facets.findIndex((n) => n.href === href);
			if (index === -1) {
				return null;
			}
			return this.explorer.facets[index];
		},

		// Open/close state and transitions.

		onTurboRender: function () {
			if (document.documentElement.hasAttribute('data-turbo-preview')) {
				// Turbolinks is displaying a preview
				return;
			}
			const pageInfo = this.explorer.pageInfo;
			debug('root.onTurboRender', pageInfo);
			if (pageInfo.isHome) {
				closeLevel(1, this.explorer.facets);
			} else {
				let hrefSection = pageInfo.hrefSection;
				if (pageInfo.section === 'api') {
					// The API section is currently a little special.
					hrefSection = pageInfo.href;
				}
				let currentNode = this.findNode(hrefSection);
				if (currentNode) {
					currentNode.open = currentNode.count > 0;
					openNodeAndCloseTheOthers(currentNode, this.explorer.facets);
				}
			}
			this.explorer.onTurboRender.forEach((cb) => cb());
		},

		closeIfMobile: function () {
			if (this.$store.nav.open.explorer && isMobile()) {
				this.$store.nav.open.explorer = false;
			}
		},

		isOpen: function () {
			return this.$store.nav.open.explorer;
		},

		// Tailwind transition classes for opening of the explorer.
		// Note that this will not trigger on initial page load, which is a good thing.
		transitions: function () {
			return {
				'x-transition:enter': 'transition-transform transition-opacity ease-out duration-500 sm:duration-700',
				'x-transition:enter-start': 'opacity-0 transform mobile:-translate-x-8 sm:-translate-y-8',
				'x-transition:enter-end': 'opacity-100 transform mobile:translate-x-0 sm:translate-y-0',
			};
		},
	};
}

export function newSearchExplorerNode(searchConfig, node = {}) {
	let templates = {};
	let ctrl = {
		node: node,
		state: {
			childNodes: [],
			pages: [],
			pagesLoaded: false,
			hydrated: node.open,
			activeHref: window.location.pathname + window.location.hash,
		},
		toggleOpen: function () {
			debug('toggleOpen', this.node.href, this.node.open, this.state.hydrated);
			this.hydrateIfNeeded();
			this.node.open = !this.node.open && this.node.count > 0;
			if (this.node.open) {
				openNodeAndCloseTheOthers(this.node, this.explorer.facets);
			}
			this.activatePageSearch();
		},

		isActive: function (href) {
			return href === this.state.activeHref;
		},

		showStaticLeafNodes: function () {
			// Keep it static until it isn't.
			return !this.state.pagesLoaded;
		},

		onClickStaticLeafNode: function (href, objectID) {
			window.explorerNodeClicked = true;
			this.state.activeHref = href;
			let hit = {
				objectID: objectID,
			};
			this.$store.nav.analytics.handler.clickHit(hit, 'DOCS: Explorer');
		},

		onClick: function (e, p = null) {
			// To avoid unnecessary scrolling on navigation.
			window.explorerNodeClicked = true;

			let hit = null;
			if (p) {
				hit = p.hit;
			} else {
				hit = this.node.hit;
			}

			if (hit) {
				this.state.activeHref = hit.href;
				// Send click events to Algolia insights.
				this.$store.nav.analytics.handler.clickHit(hit, 'DOCS: Explorer');
			}

			// We have no page/section listing for the QA section, so
			// we make it navigate to the search result for the second level.
			if (this.node.key === 'community') {
				e.preventDefault();
				this.toggleOpen();
				return;
			}

			if (this.node.key === 'community > question') {
				e.preventDefault();
				this.$store.nav.openSearchPanelWithQuery((query) => {
					query.addFilter('docType', this.node.key);
				});
				return;
			}
		},

		init: function init() {
			templates = {
				templateNode: this.$refs['templateNode'],
				templateNodePages: this.$refs['templateNodePages'],
			};

			this.explorer.onFacetsLoaded.push(() => {
				// Replace the temporary static nodes with a reactive one.
				let n = this.findNode(this.node.href);

				if (n) {
					n.open = this.node.open && n.count;
					this.node = n;
				}
			});

			this.explorer.onTurboRender.push(() => {
				// Reattach the proxy on navigation.
				let n = this.findNode(this.node.href);
				if (n) {
					this.node = n;
				}
			});

			this.explorer.onSearchActivated.push(() => {
				this.activatePageSearch();
			});
		},

		getNodesSection: function () {
			return this.getFacetsFor(this.node);
		},

		activatePageSearch: function () {
			let self = this;
			let factory = {
				status: function () {
					return self.node.open ? RequestCallBackStatus.On : RequestCallBackStatus.Off;
				},
				create: (query) => {
					return newRequestCallback(
						createExplorerNodeRequest(searchConfig, query, self.node.key),
						(result) => {
							let loc = window.location;
							let pages = result.hits.map((hit) => {
								if (hit.hierarchy && hit.hierarchy.length) {
									// This is the reference-section.
									// All pages in a section shares the same href (the section),
									// and the best match is selected while searching using Algolia's distinct keyword.
									// This is the explorer, and we need to link to the detail page.
									let last = item.hierarchy[item.hierarchy.length - 1];
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

								// This page active is both the pathname and the hash is the same.
								let active = pathname == loc.pathname && hash == loc.hash;

								return {
									title: hit.linkTitle ? hit.linkTitle : hit.title,
									linkTitle: hit.linkTitle ? hit.linkTitle : hit.title,
									href: hit.href,
									active: active,
									// Store away the original hit for Algolia events.
									hit: hit,
								};
							});
							pages.sort(itemsComparer);
							self.state.pages = pages;
							self.state.pagesLoaded = true;
						},
						{
							pronto: true,
							query: query,
							fileCacheID: self.node.key,
						}
					);
				},
			};
			this.$store.search.addSearches(newRequestCallbackFactoryTarget(factory, SearchGroupIdentifier.Main));
		},

		hydrateIfNeeded: function () {
			if (!this.state.hydrated) {
				this.hydrate();
			}
		},

		hydrate: function () {
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

const findChildren = function (node, nodes) {
	let children = [];

	// Nodes are sorted by href, so we can use a binary search.
	let index = nodes.findIndex((n) => n.href === node.href);
	if (index === -1) {
		return children;
	}

	// Now find all children one level down.
	let level = nodes[index].level;
	let child = nodes[index + 1];
	while (child && child.href.startsWith(node.href)) {
		if (child.level === level + 1) {
			children.push(child);
		}
		index++;
		child = nodes[index + 1];
	}
	return children;
};

const openNodeAndCloseTheOthers = function (node, nodes) {
	debug('openNodeAndCloseTheOthers', node.href);
	for (let i = 0; i < nodes.length; i++) {
		let n = nodes[i];
		n.open = node.href.startsWith(n.href);
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
