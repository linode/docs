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
		const tilesPageSize = isMobile() ? 2 : 4;
		const tilesAlgoliaPreloadPages = 5;
		const productsStripPageSize = isMobile() ? 2 : 6;

		// The section names we paginate on the home page.
		// This maps to the name attribute in the search configuration.
		// No filters are currently applied, and the order will be the order from Algolia.
		const sectionNames = [ 'docs', 'blog', 'resources', 'marketplace' ];

		const newPager = function(pageSize) {
			// The reason this is a plain object and not a class is because of limitations in AlpineJS'
			// reactivity.
			// The reasoning behind this comment is to prevent some wasteful work for the next person thinking
			// "Oh, wouldn't this be nicer as a class?"
			//
			// Note that we currently do not use the "loadMore" function.
			let pager = {
				pages: [ [] ], // two dimensional array of pages of items.
				index: 0, // current page, zero based

				pageSize: pageSize
			};

			pager.setItems = function(items) {
				this.pages = [];
				for (var i = 0; i < items.length; i += this.pageSize) {
					this.pages[this.pages.length] = items.slice(i, i + this.pageSize);
				}
				this.adjustIndex(0);
			};

			pager.current = function() {
				if (this.pages.length === 0) {
					return [];
				}
				return this.pages[this.index];
			};

			pager.hasPages = function() {
				return this.pages.length > 0;
			};

			pager.hasNext = function() {
				return this.index < this.pages.length - 1;
			};

			// peek returns the next page without moving the cursor.
			// You need to check with hasNext before calling this.
			pager.peek = function() {
				return this.pages[this.index + 1];
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

			pager.adjustIndex = function(incr) {
				let index = this.index + incr;
				if (index < 0) {
					index = 0;
				} else if (index >= this.pages.length) {
					index = this.pages.length - 1;
				}
				this.index = index;
			};

			// progress returns a slice of bools of size length indicating the progress of this pager.
			// This construct may look a little odd, but it makes the AlpineJS template construct simple.
			pager.progress = function() {
				if (this.pages.length === 0) {
					return [];
				}
				let numPages = this.pages.length;
				let page = this.index + 1;
				let progressSlice = [];
				for (let i = 1; i <= numPages; i++) {
					progressSlice.push(i <= page);
				}
				return progressSlice;
			};
			return pager;
		};

		var sectionTiles = {};
		var searchRequests = [];
		sectionNames.forEach((name) => {
			let sectionConfig = searchConfig.sections.find((s) => s.name === name);
			if (!sectionConfig) {
				throw `no index with name ${name} found`;
			}

			sectionTiles[name] = newPager(tilesPageSize);

			let filters = sectionConfig.filters || '';
			searchRequests.push({
				page: 0,
				params: `query=&hitsPerPage=${tilesPageSize * tilesAlgoliaPreloadPages}`,
				indexName: sectionConfig.index,
				filters: filters
			});
		});

		dispatcher.searchStandalone(
			{
				key: `home:section-tiles`,
				requests: searchRequests
			},
			searchName
		);

		return {
			data: {
				// Data for the top level products strip.
				productTiles: newPager(productsStripPageSize),

				// Maps the values in sectionNames to their tiles data.
				sectionTiles: sectionTiles,

				// Metadata about sections.
				sectionMeta: {},

				// Loading state
				commonDataLoaded: false,
				loaded: false
			},

			mounted: function() {
				debug('mounted');
				if (isTouchDevice()) {
					// Set up swipe listeners for the pagers on this page.
					var self = this;
					const addSwipeListeners = function(pager, el) {
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
					};
					let tilesEl = self.$refs['tiles-products'];
					let pager = self.data.productTiles;
					addSwipeListeners(pager, tilesEl);
					sectionNames.forEach((name) => {
						let tilesEl = self.$refs[`tiles-${name}`];
						let pager = self.data.sectionTiles[name];
						addSwipeListeners(pager, tilesEl);
					});
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

					var section = self.data.sectionTiles[sectionConfig.name];
					section.setItems(result.hits);
				});

				this.data.loaded = true;
			}
		};
	};
})(lnHome);
