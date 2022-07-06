'use strict';

import { newRequestCallbackFactoryTarget, SearchGroupIdentifier, RequestCallBackStatus } from '../../search/request';
import { isMobile, isTouchDevice, newSwiper } from '../../helpers/index';

var debug = 0 ? console.log.bind(console, '[home]') : function () {};

export function newHomeController(searchConfig, staticData) {
	debug('newHomeController');

	// The section we paginate on the home page.
	// This maps to section.lvl0 in linode-merged.
	const sectionLevel0s = ['guides', 'blog', 'resources', 'marketplace', 'community'];

	// Avoid loading too much data when on mobile.
	const tilesAlgoliaPreloadItems = isMobile() ? 12 : 30;

	const requestFromSection = function (name) {
		return {
			page: 0,
			params: `query=&hitsPerPage=${tilesAlgoliaPreloadItems}`,
			indexName: searchConfig.indexName(searchConfig.sections_merged.index_by_pubdate),
			facets: ['section.*'],
			filters: `section.lvl0:${name} AND NOT excludeFromViews:home`,
		};
	};

	// Number of tiles per paginated page.
	// It will scale down with page size.
	const tilesPageSize = 6;
	const tilesPageSizeMobile = 2;
	const productsStripPageSize = 6;

	// Create a new pager for the given el and items.
	// pageSize is the number of items per page.
	// mobileOverlap is how much of the third tile we show (to indicate swipe).
	const newPager = function (pageSize, el, items = null) {
		if (!el) {
			throw 'pager element must be provided';
		}

		debug('newPager');

		if (!items) {
			// Set up some temporary placeholders. The real data will arrive later.
			items = [];

			for (let i = 0; i < tilesAlgoliaPreloadItems; i++) {
				// The real data arrives later.
				let href = `#dummy${i}`;
				let item = { linkTitle: '', href: href, objectID: href };
				item.excerptTruncated = function () {};

				items.push(item);
			}
		}

		let pager = {
			index: 0, // current slide, zero based.
			numPages: 0, // The total number of pages.
			pageSize: pageSize, // The number of slides per page.
			showNavigation: false, // Whether to show the prev/next and the progress bar.
			el: el, // The carousel DOM element.
			items: items, // The items; an item must have a linkTitle and an href set.
		};

		pager.toggleShowNavigation = function (show) {
			this.showNavigation = show;
		};

		// We set up some dummy initial on component init and receive the real items a little bit later.
		pager.setItems = function (items) {
			if (!this.el) {
				// User has navigated away.
				return;
			}
			this.items = items;
			this.initItems();
		};

		pager.initItems = function () {
			this.el.style.setProperty('--carousel-slide-count', this.items.length);

			this.refreshPageSize();
			this.adjustIndex(0);
		};

		// adjustIndex by incr number of slides in either direction.
		pager.adjustIndex = function (incr) {
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
		pager.refreshPageSize = function () {
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

		pager.hasNext = function () {
			return this.index + this.pageSize < this.items.length;
		};

		pager.next = function () {
			this.adjustIndex(1 * this.pageSize);
		};

		pager.hasPrev = function () {
			return this.index > 0;
		};

		pager.prev = function () {
			this.adjustIndex(-1 * this.pageSize);
		};

		pager.page = function () {
			return Math.ceil((this.index + 1) / this.pageSize);
		};

		// progress returns a slice of bools of size length indicating the progress of this pager.
		// This construct may look a little odd, but it makes the AlpineJS template construct simple.
		pager.progress = function () {
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
			newSwiper(el, function (direction) {
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

	// Maps the values in sectionLevel0s to their tiles data.
	let sectionTiles = {};

	return {
		data: {
			sectionTiles: sectionTiles,
		},
		loaded: false,
		menuStateChanging: false,

		init: function () {
			debug('init');

			this.$nextTick(() => {
				debug('init: nextTick');
				// Set up placeholders for the dynamic carousels.
				// The data will arrive on intersect.
				sectionLevel0s.forEach((name) => {
					let el = this.$refs[`carousel-${name}`];
					let pager = newPager(tilesPageSize, el);
					this.data.sectionTiles[name] = pager;
				});

				// Initialize the static carousels.
				this.data.sectionTiles['products'] = newPager(
					productsStripPageSize,
					this.$refs[`carousel-products`],
					staticData.productItems
				);
				// Make the developers pager the same size as the products pager.
				this.data.sectionTiles['developers'] = newPager(
					productsStripPageSize,
					this.$refs[`carousel-developers`],
					staticData.developerItems
				);

				this.loaded = true;
			});
		},

		destroy: function () {
			// Prevents memory leak.
			Object.values(sectionTiles).forEach((tile) => {
				tile.el = null;
			});
		},

		initCarousels: function () {
			debug('initCarousels');
			this.$nextTick(() => {
				sectionLevel0s.forEach((name) => {
					let factory = {
						status: function () {
							return RequestCallBackStatus.Once;
						},
						create: () => {
							return {
								request: requestFromSection(name),
								callback: (result) => {
									this.data.sectionTiles[name].setItems(result.hits);
								},
							};
						},
					};

					this.$store.search.addSearches(newRequestCallbackFactoryTarget(factory, SearchGroupIdentifier.AdHoc));
				});
			});
		},

		onEffect: function () {
			// This construct may look odd, but this method is called from an x-effect,
			// so this will trigger on any change to the open state.
			let el = this.$store.nav.open.explorer;
			this.onNavChange(true);
		},

		// onNavChange triggers on screen resize or e.g. if the explorer opens/closes.
		// The slide width may have changed so the pager number of pages may have changed.
		onNavChange: function (menuStateChange = false) {
			if (menuStateChange) {
				// Avoid the scroll transition when the left menu changes state.
				this.menuStateChanging = true;
			}
			for (let i in this.data.sectionTiles) {
				this.data.sectionTiles[i].refreshPageSize();
			}
			if (menuStateChange) {
				this.menuStateChanging = false;
			}
		},
	};
}
