var lnHome = {};

(function(ctx) {
	'use strict';

	var debug =
		(typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0 ? console.log.bind(console, '[home]') : function() {};

	const searchName = 'search:data-home';

	ctx.New = function(searchConfig, developersItems) {
		if (!searchConfig) {
			throw 'lnHome.New: must provide searchConfig';
		}
		debug('New');

		const dispatcher = lnSearchEventDispatcher.New();

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

		// Create a new pager for the given el and items.
		// pageSize is the number of items per page.
		// mobileOverlap is how much of the third tile we show (to indicate swipe).
		const newPager = function(pageSize, el, items, alwaysShowNavigation = false) {
			if (!el) {
				throw 'pager element must be provided';
			}

			if (!items) {
				throw 'items must be provided';
			}

			debug('newPager', el, items);

			let pager = {
				index: 0, // current slide, zero based.
				numPages: 0, // The total number of pages.
				pageSize: pageSize, // The number of slides per page.
				showNavigation: alwaysShowNavigation, // Whether to show the prev/next and the progress bar.
				el: el, // The carousel DOM element.
				items: items // The items; an item must have a linkTitle and an href set.
			};

			pager.toggleShowNavigation = function(show) {
				if (!alwaysShowNavigation) {
					this.showNavigation = show;
				}
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

			pager.el.style.setProperty('--carousel-slide-count', pager.items.length);

			pager.refreshPageSize();
			pager.adjustIndex(0);

			if (isTouchDevice()) {
				lnSwipe.New(el, function(direction) {
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
				commonDataLoaded: false,
				loaded: false
			},

			init: function() {
				debug('init');

				var searchRequests = [];
				sectionNames.forEach((name) => {
					let sectionConfig = searchConfig.sections.find((s) => s.name === name);
					if (!sectionConfig) {
						throw `no index with name ${name} found`;
					}

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

			// receiveCommonData receives the common search data also used in other components,
			// such as section metadata and facets.
			receiveCommonData: function(results) {
				debug('receiveCommonData', results);

				if (this.commonDataLoaded) {
					return;
				}

				this.commonDataLoaded = true;

				if (!results.blankSearch.isLoaded()) {
					throw 'missing data';
				}

				let meta = results.metaSearch;
				let sectionsResults = results.blankSearch.results;

				debug('receiveCommonData: meta', meta);

				let productsSection = sectionsResults.findSectionByName('products');
				let productsFacets = productsSection.getFacet('section.lvl2');
				let productsItems = [];

				for (var k in productsFacets) {
					let count = productsFacets[k];
					let m = meta.getSectionMeta(k);
					if (m) {
						productsItems.push({
							title: m.title,
							linkTitle: m.linkTitle || m.title,
							href: m.href,
							count: count,
							icon: m.thumbnail
						});
					}
				}

				debug('receiveCommonData: productsItems', productsItems);

				this.data.sectionMeta['products'] = meta.getSectionMeta('products');
				sectionNames.forEach((name) => {
					this.data.sectionMeta[name] = meta.getSectionMeta(name);
				});
				this.data.productsTiles = newPager(
					productsStripPageSize,
					this.$refs[`carousel-products`],
					productsItems,
					true
				);
				// Make the developers pager the same size as the products pager.
				this.data.developersTiles = newPager(
					productsStripPageSize,
					this.$refs[`carousel-developers`],
					developersItems,
					false
				);
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
					let el = self.$refs[`carousel-${name}`];
					let pager = newPager(tilesPageSize, el, result.hits);
					self.data.sectionTiles[name] = pager;
				}

				this.data.loaded = true;
			}
		};
	};
})(lnHome);
