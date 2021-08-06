'use strict';

import { isMobile, isTouchDevice, newSwiper } from '../../helpers/index';
import { newDispatcher } from '../../search/index';

var debug = 0 ? console.log.bind(console, '[home]') : function() {};

const searchName = 'search:data-home';

export function newHomeController(searchConfig, staticData) {
	debug('newHomeController');

	const dispatcher = newDispatcher();

	// Number of tiles per paginated page.
	// It will scale down with page size.
	const tilesPageSize = 6;
	const tilesPageSizeMobile = 2;
	const productsStripPageSize = 6;
	// Avoid loading too much data when on mobile.
	const tilesAlgoliaPreloadItems = isMobile() ? 12 : 30;

	// Set and removed when left menu opens.
	const cssClassMenyStateChanging = 'kind-home--menu-state-is-changing';

	// The section names we paginate on the home page.
	// This maps to the name attribute in the search configuration.
	// No filters are currently applied, and the order will be the order from Algolia.
	const sectionNames = [ 'guides', 'blog', 'resources', 'marketplace', 'qa' ];

	const withSectionConfigs = function(callback) {
		sectionNames.forEach((name) => {
			let sectionConfig = searchConfig.sectionsSorted.find((s) => s.name === name);
			if (!sectionConfig) {
				throw `no index with name ${name} found`;
			}
			callback(sectionConfig);
		});
	};

	// Create a new pager for the given el and items.
	// pageSize is the number of items per page.
	// mobileOverlap is how much of the third tile we show (to indicate swipe).
	const newPager = function(pageSize, el, items = null) {
		if (!el) {
			throw 'pager element must be provided';
		}

		debug('newPager', el);

		if (!items) {
			// Set up some temporary placeholders. The real data will arrive later.
			items = [];

			for (let i = 0; i < tilesAlgoliaPreloadItems; i++) {
				// The real data arrives later.
				let href = `#dummy${i}`;
				let item = { linkTitle: '', href: href, objectID: href };
				item.excerptTruncated = function() {};

				items.push(item);
			}
		}

		let pager = {
			index: 0, // current slide, zero based.
			numPages: 0, // The total number of pages.
			pageSize: pageSize, // The number of slides per page.
			showNavigation: false, // Whether to show the prev/next and the progress bar.
			el: el, // The carousel DOM element.
			items: items // The items; an item must have a linkTitle and an href set.
		};

		pager.toggleShowNavigation = function(show) {
			this.showNavigation = show;
		};

		// We set up some dummy initial on component init and receive the real items a little bit later.
		pager.setItems = function(items) {
			this.items = items;
			this.initItems();
		};

		pager.initItems = function() {
			this.el.style.setProperty('--carousel-slide-count', this.items.length);

			this.refreshPageSize();
			this.adjustIndex(0);
		};

		// adjustIndex by incr number of slides in either direction.
		pager.adjustIndex = function(incr) {
			let index = this.index + incr;
			if (index < 0) {
				index = 0;
			} else if (index >= this.items.length) {
				index = this.items.length - 1;
			}
			this.index = index;
			this.el.style.setProperty('--carousel-slide', this.index);
		};

		// Refresh page size from CSS.
		// --carousel-page-size can be a calc expression so we need to do it
		// in this roundabout  way.
		pager.refreshPageSize = function() {
			let psEl = this.el.querySelector('.page-size');
			let style = getComputedStyle(psEl);
			let ps = style.getPropertyValue('z-index');
			let pageSize = parseInt(ps, 10);
			this.numPages = Math.ceil(this.items.length / pageSize);

			if (pageSize !== this.pageSize) {
				this.pageSize = pageSize;
				this.adjustIndex(0);
			}
		};

		pager.hasNext = function() {
			return this.index + this.pageSize < this.items.length;
		};

		pager.next = function() {
			this.adjustIndex(1 * this.pageSize);
		};

		pager.hasPrev = function() {
			return this.index > 0;
		};

		pager.prev = function() {
			this.adjustIndex(-1 * this.pageSize);
		};

		pager.page = function() {
			return Math.ceil((this.index + 1) / this.pageSize);
		};

		// progress returns a slice of bools of size length indicating the progress of this pager.
		// This construct may look a little odd, but it makes the AlpineJS template construct simple.
		pager.progress = function() {
			if (this.numPages === 0) {
				return [];
			}
			let page = this.page();
			let progressSlice = [];
			for (let i = 1; i <= this.numPages; i++) {
				progressSlice.push(i <= page);
			}
			return progressSlice;
		};

		let pageSizeXl = pageSize;
		let pageSizeLg = pageSize === tilesPageSizeMobile ? tilesPageSizeMobile : pageSize - 1;
		let pageSizeMd = pageSize === tilesPageSizeMobile ? tilesPageSizeMobile : pageSize - 2;

		pager.el.style.setProperty('--carousel-page-size--mobile', tilesPageSizeMobile);
		pager.el.style.setProperty('--carousel-page-size--xl', pageSizeXl);
		pager.el.style.setProperty('--carousel-page-size--lg', pageSizeLg);
		pager.el.style.setProperty('--carousel-page-size--md', pageSizeMd);

		pager.initItems();

		if (isTouchDevice()) {
			newSwiper(el, function(direction) {
				switch (direction) {
					case 'left':
						pager.next();
						break;
					case 'right':
						pager.prev();
						break;
				}
			});
		}

		return pager;
	};

	return {
		data: {
			// Data for the top level products strip.
			productsTiles: null,

			// Data for the developers strip.
			developersTiles: null,

			// Maps the values in sectionNames to their tiles data.
			sectionTiles: {},

			// Metadata about sections.
			sectionMeta: {},

			// Loading state
			loaded: false
		},

		init: function() {
			debug('init');

			var searchRequests = [];
			withSectionConfigs((sectionConfig) => {
				let filters = sectionConfig.filters || '';
				searchRequests.push({
					page: 0,
					params: `query=&hitsPerPage=${tilesAlgoliaPreloadItems}`,
					indexName: sectionConfig.index_by_pubdate || sectionConfig.index,
					filters: filters
				});
			});

			this.$nextTick(function() {
				dispatcher.searchStandalone(
					{
						key: `home:section-tiles`,
						requests: searchRequests
					},
					searchName
				);
			});

			var self = this;

			return function() {
				withSectionConfigs((sectionConfig) => {
					let name = sectionConfig.name;
					let el = self.$refs[`carousel-${name}`];
					let pager = newPager(tilesPageSize, el);
					self.data.sectionTiles[name] = pager;
				});

				self.data.productsTiles = newPager(
					productsStripPageSize,
					self.$refs[`carousel-products`],
					staticData.productItems
				);
				// Make the developers pager the same size as the products pager.
				self.data.developersTiles = newPager(
					productsStripPageSize,
					self.$refs[`carousel-developers`],
					staticData.developerItems
				);
			};
		},

		// onNavChange triggers on screen resize or e.g. if the explorer opens/closes.
		// The slide width may have changed so the pager number of pages may have changed.
		onNavChange: function(data) {
			let menuStateChange = data && data.what === 'explorer' && data.source === 'explorer';
			if (menuStateChange) {
				// Avoid the scroll transition when the left menu changes state.
				this.$el.classList.add(cssClassMenyStateChanging);
			}
			if (this.data.productsTiles) {
				this.data.productsTiles.refreshPageSize();
			}
			if (this.data.developersTiles) {
				this.data.developersTiles.refreshPageSize();
			}
			for (let i in this.data.sectionTiles) {
				this.data.sectionTiles[i].refreshPageSize();
			}
			if (menuStateChange) {
				this.$el.classList.remove(cssClassMenyStateChanging);
			}
		},

		receiveData: function(results) {
			debug('receiveData', results);
			var self = this;
			// Match results by index name.
			let sectionConfigs = searchConfig.findSectionsBySearchResults(results);

			for (let i in sectionConfigs) {
				let sectionConfig = sectionConfigs[i];
				let result = results[i];
				let name = sectionConfig.name;
				self.data.sectionTiles[name].setItems(result.hits);
			}

			this.data.loaded = true;
		}
	};
}
