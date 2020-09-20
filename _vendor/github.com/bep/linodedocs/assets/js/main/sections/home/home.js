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

		const dispatcher = lnSearchEventDispatcher.New();

		// Number of tiles per paginated page.
		const tilesPageSize = isMobile() ? 3 : 4;
		const tilesAlgoliaPreloadPages = 4; // Load 16 articles per section per query.
		const productsStripPageSize = isMobile() ? 3 : 6;

		// The section names we paginate on the home page.
		// This maps to the name attribute in the search configuration.
		// No filters are currently applied, and the order will be the order from Algolia.
		const sectionNames = [ 'docs', 'blog', 'resources', 'marketplace' ];

		const newPager = function(sectionConfig, pageSize, loadMore) {
			// The reason this is a plain object and not a class is because of limitations in AlpineJS'
			// reactivity.
			// The reasoning behind this comment is to prevent some wasteful work for the next person thinking
			// "Oh, wouldn't this be nicer as a class?"
			let pager = {
				items: [],
				low: 0,
				high: pageSize,
				sectionConfig: sectionConfig,
				pageSize: pageSize
			};

			pager.loadMore = loadMore;
			if (!loadMore) {
				pager.end = true;
			}

			pager.setItems = function(items) {
				this.items.length = 0;
				this.addItems(items);
			};

			pager.addItems = function(items) {
				this.items = this.items.concat(items);
			};

			pager.current = function() {
				return this.items.slice(this.low, this.high());
			};

			pager.hasNext = function() {
				return !(this.end && this.high() >= this.items.length);
			};

			pager.next = function() {
				this.adjustLow(this.pageSize);
				let high = this.high();
				if (this.loadMore && this.items.length - high <= this.pageSize) {
					// We need to load more data.
					this.loadMore(high);
				}
			};

			pager.prev = function() {
				this.adjustLow(-this.pageSize);
			};

			pager.high = function() {
				return Math.min(this.low + this.pageSize, this.items.length);
			};

			pager.adjustLow = function(incr) {
				let low = this.low + incr;
				if (low < 0) {
					low = 0;
				}
				this.low = low;
			};

			// progress returns a slice of bools of size length indicating the progress of this pager.
			// Note that this currently only works for the products strip where all items
			// are loaded at once.
			pager.progress = function(size) {
				if (this.items.length === 0) {
					return [];
				}
				let progress = this.high() / this.items.length;
				let progressAdjusted = Math.floor(progress * size);

				let progressSlice = [];
				for (let i = 0; i < size; i++) {
					progressSlice.push(i < progressAdjusted);
				}
				return progressSlice;
			};
			return pager;
		};

		var sectionTiles = {};
		sectionNames.forEach((name) => {
			let sectionConfig = searchConfig.sections.find((s) => s.name === name);
			if (!sectionConfig) {
				throw `no index with name ${name} found`;
			}

			sectionTiles[name] = newPager(sectionConfig, tilesPageSize, function(high) {
				sectionTiles.dispatchQueries(name, high / tilesAlgoliaPreloadPages);
			});
		});

		sectionTiles.dispatchQueries = function(sections, page = 0) {
			var sections = Array.isArray(sections) ? sections : [ sections ];

			var requests = [];

			Object.values(this).forEach((val) => {
				if (!val.sectionConfig) {
					return;
				}
				if (!sections.includes(val.sectionConfig.name)) {
					return;
				}
				let filters = val.sectionConfig.filters || '';
				requests.push({
					page: page,
					params: `query=&hitsPerPage=${tilesPageSize * tilesAlgoliaPreloadPages}`,
					indexName: val.sectionConfig.index,
					filters: filters
				});
			});

			let cacheKey = `home:section-tiles:${sections.join('|')}/${page}`;

			debug('dispatchQueries', sections, requests);

			dispatcher.searchStandalone(
				{
					key: cacheKey,
					requests: requests
				},
				searchName
			);
		};

		return {
			data: {
				// Data for the top level products strip.
				productTiles: newPager(null, productsStripPageSize),

				// Maps the values in sectionNames to their tiles data.
				sectionTiles: sectionTiles,

				// Metadata about sections.
				sectionMeta: {},

				// Loading state
				commonDataLoaded: false,
				loaded: false
			},

			init: function() {
				debug('init');
				this.data.sectionTiles.dispatchQueries(sectionNames);
			},

			receiveCommonData: function(results) {
				debug('receiveCommonData', results);
				if (this.commonDataLoaded) {
					return;
				}
				this.commonDataLoaded = true;

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

				this.data.productTiles.setItems(productsItems);

				this.data.sectionMeta['products'] = meta.get('products');
				sectionNames.forEach((name) => {
					this.data.sectionMeta[name] = meta.get(name);
				});

				debug('receiveCommonData: productsFacets', productsFacets);
			},

			receiveData: function(results) {
				debug('receiveData', results);
				var self = this;
				// We can get a partial result set, so we need
				// to match by index name.
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

					var section = self.data.sectionTiles[sectionConfig.name];
					section.end = result.hits.length === 0;
					if (result.page === 0) {
						section.setItems(result.hits);
					} else {
						section.addItems(result.hits);
					}
				});

				this.data.loaded = true;
			}
		};
	};
})(lnHome);
