var lnHome = {};

(function(ctx) {
	'use strict';

	var debug =
		(typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0 ? console.log.bind(console, '[home]') : function() {};

	const searchName = 'search:data-home';

	ctx.New = function(searchConfig) {
		if (!searchConfig) {
			throw 'lnHome.New: must provide searchConfig';
		}
		debug('New');

		const dispatcher = lnSearchEventDispatcher.New();

		// Number of tiles per paginated page.
		const tilesPageSize = isMobile() ? 2 : 4;
		const tilesAlgoliaPreloadPages = 5;
		const productsStripPageSize = isMobile() ? 2 : 6;

		// The section names we paginate on the home page.
		// This maps to the name attribute in the search configuration.
		// No filters are currently applied, and the order will be the order from Algolia.
		const sectionNames = [ 'docs', 'blog', 'resources', 'marketplace', 'qa' ];

		const newPager = function(pageSize, el, items, mobileOverlap = 0.1) {
			if (!el) {
				throw 'pager element must be provided';
			}

			if (!items) {
				throw 'items must be provided';
			}

			let pager = {
				index: 0, // current page, zero based.
				numPages: 0, // The total number of pages.
				el: el,
				items: items,
				pageSize: pageSize,
				numPages: Math.ceil(items.length / pageSize)
			};

			pager.adjustIndex = function(incr) {
				let index = this.index + incr;
				if (index < 0) {
					index = 0;
				} else if (index >= this.numPages) {
					index = this.numPages - 1;
				}
				this.index = index;
				this.el.style.setProperty('--carousel-page', this.index);
				toggleBooleanClass('last-slide', pager.el, !this.hasNext());
			};

			pager.ready = function() {
				return pager.el && pager.items && pager.items.length > 0;
			};

			pager.hasNext = function() {
				return this.index < this.numPages - 1;
			};

			pager.next = function() {
				this.adjustIndex(1);
			};

			pager.hasPrev = function() {
				return this.index > 0;
			};

			pager.prev = function() {
				this.adjustIndex(-1);
			};

			// progress returns a slice of bools of size length indicating the progress of this pager.
			// This construct may look a little odd, but it makes the AlpineJS template construct simple.
			pager.progress = function() {
				if (this.numPages === 0) {
					return [];
				}
				let page = this.index + 1;
				let progressSlice = [];
				for (let i = 1; i <= this.numPages; i++) {
					progressSlice.push(i <= page);
				}
				return progressSlice;
			};

			pager.adjustIndex(0);
			pager.el.style.setProperty('--carousel-page-size', pager.pageSize);
			pager.el.style.setProperty('--carousel-slide-count', pager.items.length);
			pager.el.style.setProperty('--carousel-mobile-overlap', mobileOverlap);

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
				var self = this;
				sectionNames.forEach((name) => {
					let sectionConfig = searchConfig.sections.find((s) => s.name === name);
					if (!sectionConfig) {
						throw `no index with name ${name} found`;
					}

					let filters = sectionConfig.filters || '';
					searchRequests.push({
						page: 0,
						params: `query=&hitsPerPage=${tilesPageSize * tilesAlgoliaPreloadPages}`,
						indexName: sectionConfig.index,
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

				let meta = results.metaSearch.results;
				let sectionsResults = results.blankSearch.results;

				debug('receiveCommonData: meta', meta);

				let productsSection = sectionsResults.findSectionByName('products');
				let productsFacets = productsSection.getFacet('section.lvl2');
				let productsItems = [];

				for (var k in productsFacets) {
					let count = productsFacets[k];
					let m = meta.get(k);
					if (m) {
						productsItems.push({
							title: m.linkTitle,
							href: m.href,
							count: count,
							icon: m.thumbnail
						});
					}
				}

				debug('receiveCommonData: productsItems', productsItems);

				this.data.sectionMeta['products'] = meta.get('products');
				sectionNames.forEach((name) => {
					this.data.sectionMeta[name] = meta.get(name);
				});
				let el = this.$refs[`carousel-products`];
				this.data.productsTiles = newPager(productsStripPageSize, el, productsItems, 0.5);
			},

			receiveData: function(results) {
				debug('receiveData', results);
				var self = this;
				// Match results by index name.
				results.forEach((result) => {
					let sectionConfig = searchConfig.sections.find((s) => {
						if (s.index !== result.index) {
							return false;
						}
						if (s.filters) {
							// We have some sections that share the same index.
							return result.params.endsWith(encodeURIComponent(s.filters));
						}
						return true;
					});

					if (!sectionConfig) {
						throw `no index ${result.index} found`;
					}

					let name = sectionConfig.name;
					let el = self.$refs[`carousel-${name}`];
					let pager = newPager(tilesPageSize, el, result.hits);
					self.data.sectionTiles[name] = pager;
				});

				this.data.loaded = true;
			}
		};
	};
})(lnHome);
