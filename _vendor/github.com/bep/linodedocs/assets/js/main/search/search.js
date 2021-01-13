var lnSearch = {};

class Searcher {
	constructor(searchConfig, hitNormalizer, onError, debug = function() {}) {
		const algoliaHost = `https://${searchConfig.app_id}-dsn.algolia.net`;
		this.headers = {
			'X-Algolia-Application-Id': searchConfig.app_id,
			'X-Algolia-API-Key': searchConfig.api_key
		};
		this.normalizeHit = hitNormalizer;
		this.urlQueries = `${algoliaHost}/1/indexes/*/queries`;
		this.requests = [];
		this.callbacks = [];
		this.debug = debug;
		this.onError = onError;
	}

	addSearchItem(item, callback) {
		item.markAsLoading();
		this.add({ requests: item.query.requests, isSectionMeta: item.name === 'meta' }, callback);
	}

	add(opts, callback) {
		let requests = opts.requests;
		let start = this.requests.length;
		let end = start + requests.length;
		requests.forEach((query) => {
			if (!query.params) {
				query.params = 'query=&hitsPerPage=500';
			}
		});

		this.requests = this.requests.concat(requests);
		this.callbacks.push({
			opts: opts,
			callback: callback,
			start: start,
			end: end
		});
	}

	execute(done) {
		var self = this;
		let queries = {
			requests: this.requests
		};

		this.debug('execute', this.requests);

		if (queries.requests.length == 0) {
			done();
			return;
		}

		this.search(queries, function(data) {
			let results = data.results;
			self.callbacks.forEach((cb) => {
				let slice = results.slice(cb.start, cb.end);
				slice.forEach((result) => {
					result.hits.forEach((hit) => {
						self.normalizeHit(cb.opts, hit);
					});
				});
				cb.callback(slice);
			});
			done();
		});
	}

	search(
		queries,
		handleData,
		handleError = (error) => {
			this.onError(error);
		}
	) {
		fetch(this.urlQueries, {
			method: 'POST',
			headers: this.headers,
			body: JSON.stringify(queries)
		})
			.then((response) => response.json())
			.then((data) => {
				handleData(data);
			})
			.catch(function(error) {
				handleError(error);
			});
	}
}

(function(ctx) {
	'use strict';

	var debug =
		(typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0 ? console.log.bind(console, '[search-main]') : function() {};

	/**
  	* Create a new search client that interacts with Algolia.
  	* 
  	* @param {cfg} The Algolia config.
  	*/
	ctx.New = function(searchConfig) {
		debug('New', searchConfig);

		const dispatcher = lnSearchEventDispatcher.New();
		const router = lnCreateHref.New(searchConfig);

		// Toggle this on to always show the search results.
		// Useful for search related style changes, but remember to turn it off!
		const designMode = false;

		// Normalization of a search hit across the search indices.
		const normalizeHit = function(self) {
			return function(opts, hit) {
				hit.sectionTitle = hit.section;
				if (hit.section) {
					hit.section = hit.section.toLowerCase();
				}

				let m = self.searchState.metaSearch.getSectionMeta(hit.section);
				if (m) {
					hit.sectionTitle = m.linkTitle;
				}

				hit.titleHighlighted =
					hit._highlightResult && hit._highlightResult.title ? hit._highlightResult.title.value : hit.title;
				hit.linkTitle = hit.linkTitle || hit.title;

				let href;
				if (opts.isSectionMeta) {
					href = router.hrefSection(hit.objectID);
				} else if (hit.url) {
					if (hit.section === 'resources > webinars') {
						href = hit.url;
					} else {
						// A blog entry.
						href = router.hrefEntry(hit);
					}
				} else if (hit.objectType === 'question') {
					// A question.
					href = `https://www.linode.com/community/questions/${hit.linodeId}`;
				} else {
					href = hit.href;
				}
				hit.href = href;
				if (href) {
					hit.isExternalLink = href.startsWith('http');
				}
				hit.isLinkToSelf = function() {
					return this.href && window.location.href.endsWith(hit.href);
				};
				hit.firstPublishedDateString = '';
				if (hit.firstPublishedTime) {
					hit.firstPublishedDateString = toDateString(new Date(hit.firstPublishedTime * 1000));
				}

				hit.excerptTruncated = function(maxLen = 300) {
					let excerpt = this.excerpt || this.description;
					if (!excerpt) {
						return '';
					}
					if (excerpt.length <= maxLen) {
						return excerpt;
					}
					return `${excerpt.substring(0, maxLen)} …`;
				};
			};
		};

		// Creates a search filters from the browser location,
		// e.g. "?sections=docs&q=apache".
		const createSearchFiltersFromLocation = function(self) {
			if (!window.location.search) {
				return false;
			}
			let params = new URLSearchParams(window.location.search.slice(1));
			let sections = params.get('sections');
			self.filters.query = params.get('q');
			let mainSearch = self.searchState.mainSearch;
			mainSearch.results.sections.forEach((section) => {
				section.disabledPermanent = !sections.includes(section.config.name);
			});

			sections.split(',').forEach((section) => {
				let sectionConfig = searchConfig.sections.find((s) => s.name === section);

				if (!sectionConfig) {
					throw `section ${section} not found`;
				}

				var filterGroups = [];
				sectionConfig.facetFilterNames().forEach((filterName) => {
					let filters = [];
					let filterCsv = params.get(filterName);
					if (filterCsv) {
						let values = filterCsv.split(',');
						values.forEach((v) => {
							filters.push(`${filterName}:${v}`);
						});
					}
					if (filters.length > 0) {
						filterGroups.push(filters);
					}
				});

				self.filters.facets.set(sectionConfig.name, filterGroups);
			});

			return true;
		};

		// Prepares the data structure to store the search results in.
		const newSearchResults = function(self, blank) {
			var sectionFiltersToQueryParams = function(filterGroups) {
				if (!filterGroups) {
					return '';
				}

				var queryString = '';

				var csvMap = new Map();
				filterGroups.forEach((filters) => {
					filters.forEach((filter) => {
						let keyVal = filter.split(':');
						let key = keyVal[0];
						let val = keyVal[1];
						let csv = csvMap.get(key);
						if (!csv) {
							csvMap.set(key, val);
						} else {
							csvMap.set(key, csv + ',' + val);
						}
					});
				});

				csvMap.forEach((val, key) => {
					queryString = queryString.concat('&', `${key}=${encodeURIComponent(val.toLowerCase())}`);
				});

				return queryString;
			};

			let sections = [];
			for (let sectionCfg of searchConfig.sections) {
				let searchData = {
					name: sectionCfg.name,
					// The main result.
					result: { hits: [] },
					facetFilters: []
				};

				sectionCfg.indexName = function() {
					return sectionCfg.index || sectionCfg.name;
				};

				sectionCfg.facetFilterNames = function() {
					return this.filtering_facets ? this.filtering_facets.map((facet) => facet.name) : [];
				};

				searchData.setResult = function(result) {
					let sectionFilters = self.filters.facets.get(sectionCfg.name);
					this.href =
						'/docs/search/?sections=' +
						sectionCfg.name +
						'&q=' +
						encodeURIComponent(self.filters.query) +
						sectionFiltersToQueryParams(sectionFilters);
					this.result = result;
					this.result.hits.forEach((hit) => {
						hit.sectionCfg = sectionCfg;
						if (!hit.href) {
							hit.href = hit.url;
						}

						hit.facets = new Map();
						hit.tags = [];
						if (!sectionCfg.filtering_facets) {
							return;
						}

						sectionCfg.filtering_facets.forEach((facetConfig) => {
							let h = hit._highlightResult[facetConfig.name];
							if (h) {
								let values = h.map ? h.map((e) => e.value) : h.value;
								if (facetConfig.isTags) {
									hit.tags = values;
								} else {
									let s = values.join ? values.join(', ') : values;
									hit.facets.set(facetConfig.title, { value: values, string: s });
								}
							}
						});
					});

					return this.result.hits;
				};

				searchData.facetKey = function(idx) {
					return `section.lvl${idx}`;
				};

				searchData.resultSections = function() {
					let sections = [];

					if (!this.result.facets) {
						return sections;
					}

					if (sectionCfg.section_facet) {
						// Special case for the community section
						// which is one level only with the objectID
						// facet separating questions and answers.
						let name = sectionCfg.name;
						let sectionFacets = this.result.facets[sectionCfg.section_facet];
						if (!sectionFacets) {
							return sections;
						}
						let total = 0;
						let s = [];
						for (let k in sectionFacets) {
							let count = sectionFacets[k];
							total += count;
							s.push({ key: `${name} > ${k}`, count: count, isGhostSection: true });
						}

						// First add the top level node.
						sections.push({ key: `${name}`, count: total, isGhostSection: true });
						// Then the children.
						sections = sections.concat(s);

						return sections;
					}

					for (let i = 0; ; i++) {
						// webserver
						// webserver apache
						let key = this.facetKey(i);
						let sectionFacets = this.result.facets[key];

						if (!sectionFacets) {
							break;
						}

						for (let k in sectionFacets) {
							sections.push({ key: k, count: sectionFacets[k] });
						}
					}

					return sections;
				};

				let section = { config: sectionCfg, searchData: searchData };

				section.isEnabled = function() {
					if (this.disabledPermanent) {
						return false;
					}
					if (!self.filters.facets.isSectionEnabled) {
						return true;
					}
					return self.filters.facets.isSectionEnabled(section.config.name);
				};

				section.getFacet = function(name) {
					let facets = this.searchData.result.facets;
					return facets[name];
				};
				sections.push(section);
			}

			var result = { blank: blank, sections: sections };

			result.getStats = function() {
				var stats = { totalNbHits: 0, totalNbPages: 0 };
				this.sections.forEach((section) => {
					if (!section.isEnabled()) {
						return;
					}
					let data = section.searchData.result;
					stats.totalNbHits += data.nbHits;
					stats.totalNbPages += data.nbPages;
				});
				return stats;
			};

			result.findSectionByName = function(name) {
				return this.sections.find((section) => section.config.name === name);
			};

			result.getMatchedWords = function() {
				var words = new Set();
				this.sections.forEach((section) => {
					let attributesToHighlight = [ 'title', ...section.config.facetFilterNames() ];
					let hits = section.searchData.result.hits;

					hits.forEach((hit) => {
						var highlightResult = hit._highlightResult;
						if (!highlightResult) {
							return;
						}

						attributesToHighlight.forEach((attr) => {
							let val = highlightResult[attr];
							let attrVals = Array.isArray(val) ? val : [ val ];
							attrVals.forEach((attrVal) => {
								if (attrVal && attrVal.matchedWords !== undefined) {
									attrVal.matchedWords.forEach((word) => {
										if (!words.has(word)) {
											words.add(word);
										}
									});
								}
							});
						});
					});
				});
				return words;
			};

			return result;
		};

		const newSearcher = function(hitNormalizer, onError) {
			return new Searcher(searchConfig, hitNormalizer, onError, debug);
		};

		// searchItemLoadingStates represents the main loading state of a search item.
		const searchItemLoadingStates = {
			INITIAL: 0, // Initial state, also set when it needs a refresh.
			LOADING: 1, // It's loading, so do not start another.
			LOADED: 2, // Loaded and ready to use.
			DISABLED: 3 // May be loaded, but the data is stale.
		};

		const newSearchItem = function(opts) {
			var item = Object.assign({}, opts);

			item.publish = false;
			item.loadingState = searchItemLoadingStates.INITIAL;
			item.subscribers = item.subscribers || [];
			item.query = item.query || {};
			item.results = item.results || {};

			item.shouldCancel =
				item.shouldCancel ||
				function() {
					return false;
				};

			item.shouldLoad = function() {
				return this.loadingState === searchItemLoadingStates.INITIAL;
			};

			item.isLoading = function() {
				return this.loadingState === searchItemLoadingStates.LOADING;
			};

			item.reset = function() {
				this.resetLoadingStateIf(true);
			};

			item.resetLoadingStateIf = function(b) {
				if (b) {
					this.loadingState = searchItemLoadingStates.INITIAL;
					this.publish = false;
					if (this.hugoData) {
						this.hugoData.loadingState = searchItemLoadingStates.INITIAL;
					}
				}
				return b;
			};

			item.disableIf = function(b) {
				if (b) {
					this.loadingState = searchItemLoadingStates.DISABLED;
				}
				return b;
			};

			item.setResults = function(results) {
				this.results = results;
				this.loadingState = searchItemLoadingStates.LOADED;
			};

			item.markAsLoading = function() {
				this.loadingState = searchItemLoadingStates.LOADING;
			};

			item.markAsLoaded = function() {
				this.loadingState = searchItemLoadingStates.LOADED;
				this.publish = true;
			};

			item.isLoading = function() {
				return this.loadingState === searchItemLoadingStates.LOADING;
			};

			item.isLoaded = function() {
				return this.loadingState === searchItemLoadingStates.LOADED;
			};

			item.shouldPublish = function() {
				return this.publish && this.loadingState >= searchItemLoadingStates.LOADED;
			};

			return item;
		};

		const newSearchState = function(self) {
			let s = {
				mainSearch: newSearchItem({
					name: 'main',
					results: newSearchResults(self, false),
					concurrent: true,
					subscribers: [ dispatcher.events.EVENT_SEARCHRESULT ]
				}),
				blankSearch: newSearchItem({
					name: 'blank',
					results: newSearchResults(self, true),
					subscribers: [ dispatcher.events.EVENT_SEARCHRESULT_BLANK ]
				}),
				metaSearch: newSearchItem({
					name: 'meta',
					getSectionMeta: function(key) {
						// First look in the Hugo data
						let m = this.hugoData.data.get(key);
						if (m) {
							return m;
						}
						// Then look in the Algolia data.
						if (!this.results.get) {
							return null;
						}
						return this.results.get(key);
					},
					hugoData: {
						loadingState: searchItemLoadingStates.INITIAL,
						data: new Map(),
						loadIfNotLoaded: function() {
							if (this.loadingState > searchItemLoadingStates.INITIAL) {
								return;
							}
							this.loadingState = searchItemLoadingStates.LOADING;
							var self = this;
							fetch('/docs/data/sections/index.json', {})
								.then((response) => response.json())
								.then((data) => {
									self.data = data.reduce(function(m, item) {
										item.href = router.hrefSection(item.objectID);
										m.set(item.objectID, item);
										return m;
									}, new Map());
									self.loadingState = searchItemLoadingStates.LOADED;
									dispatcher.broadCastSearchResult(s, dispatcher.events.EVENT_SEARCHRESULT_INITIAL);
								})
								.catch(function(error) {
									console.warn(error);
									self.loadingState = searchItemLoadingStates.INITIAL;
								});
						}
					},

					query: {
						requests: [
							{
								indexName: searchConfig.meta_index,
								params: 'query=&hitsPerPage=600',
								// We load the Hugo data from the published JSON to save Algolia queries on
								// load (for the breadcrumbs).
								// This filter is just to save some bytes for when the Algolia data IS loaded,
								// as the guides is the most populated section tree.
								filters:
									'NOT section:guides AND NOT section:api AND NOT section:products AND NOT section:content AND NOT section:development'
							}
						]
					}
				}),

				namedSearches: new Map(),
				expandedNodes: new Map(),

				// For the standalone searches on the home page etc.
				staticSearchRequests: [],
				staticSearchRequestsResults: [],
				staticSearchCache: new Map()
			};

			// Load metadata from /docs/data/sections/index.json
			s.metaSearch.hugoData.loadIfNotLoaded();

			s.reset = function() {
				this.mainSearch.reset();
				this.blankSearch.reset();
				this.metaSearch.reset();
				this.namedSearches.forEach((v, k) => {
					v.reset();
				});
			};

			s.items = function() {
				return [ this.mainSearch, this.blankSearch, this.metaSearch ].concat(
					Array.from(this.namedSearches.values())
				);
			};

			s.subscribe = function(name, query, e) {
				let events = Array.isArray(e) ? e : [ e ];
				this.namedSearches.set(
					name,
					newSearchItem({ name: name, query: query, subscribers: events, shouldCancel: query.shouldCancel })
				);
			};

			s.publish = function() {
				debug('publish');
				let events = [];

				if (this.staticSearchRequestsResults.length > 0) {
					if (this.blankSearch.isLoaded()) {
						events.push(dispatcher.events.EVENT_SEARCHRESULT_BLANK);
					}
				}

				// The staticSearchRequestsResults standalone searches that's not participating in the global
				// filtering game, so publish it whenever it's set.
				let len = this.staticSearchRequestsResults.length;
				for (let i = 0; i < len; i++) {
					let r = this.staticSearchRequestsResults.pop();
					sendEvent(r.event, r.results);
				}

				if (this.expandedNodes.size > 0) {
					events.push(dispatcher.events.EVENT_SEARCHRESULT);
				}

				this.items().forEach((item) => {
					if (item.shouldPublish()) {
						events = events.concat(item.subscribers);
					}
				});

				events = [ ...new Set(events) ];

				if (events.length > 0) {
					debug('broadcast', this, events);
					dispatcher.broadCastSearchResult(this, events);
				}
			};

			s.publishIfCached = function(event) {
				if (!self.publish) {
					return false;
				}
				let publish = false;
				for (let item of this.items()) {
					if (item.subscribers.includes(event)) {
						if (item.concurrent && item.isLoading()) {
							// In progress, it will eventually be sent.
							return true;
						}
						publish = item.isLoading();
						if (publish) {
							break;
						}
					}
				}

				if (publish) {
					dispatcher.broadCastSearchResult(this, event);
				}

				return publish;
			};

			return s;
		};

		return {
			show: false, // Toggles the main search listing on/off.
			publish: true, // Whether to publish events on search updates.
			showFullSearchResult: false, // Whether to respect hits_per_page section config setting.

			filters: { query: '', facets: new Map() },

			searchState: null,

			init: function(filtersFromLocation = false) {
				debug('init', filtersFromLocation);

				this.searchState = newSearchState(this);
				this.publish = !filtersFromLocation;
				this.showFullSearchResult = filtersFromLocation;

				this.filters.isZero = function() {
					return this.query === '' && this.facets.size === 0;
				};

				if (filtersFromLocation) {
					let hasQueryFilter = createSearchFiltersFromLocation(this);
					if (hasQueryFilter) {
						this.search({
							regularSearch: true,
							allowEmptyQuery: true,
							query: this.filters.query
						});
					}
					return;
				}

				if (this.publish) {
					this.$watch('show', () => {
						sendEvent('nav:toggle', { what: 'search-panel', open: this.show });
					});
				}

				this.$nextTick(function() {
					if (designMode) {
						dispatcher.search({ query: 'apache centos' });
					}
				});
			},

			subscribe: function(detail) {
				debug('subscribe', detail);
				this.searchState.subscribe(detail.name, detail.opts, detail.event);
				this.search({ event: detail.event });
			},

			applyFacetFilters: function(filters) {
				debug('applyFacetFilters', filters);
				this.filters.facets = filters;
				this.search({
					regularSearch: true,
					allowEmptyQuery: filters.triggerSearch,
					query: this.filters.query,
					event: dispatcher.events.EVENT_SEARCHRESULT
				});
			},

			onTurbolinksBeforeRender: function(data) {
				if (document.documentElement.hasAttribute('data-turbolinks-preview')) {
					// Turbolinks is displaying a preview
					return;
				}
				debug('onTurbolinksBeforeRender', data);
				this.show = false;
			},

			search: function(arg) {
				let opts = arg || {};
				debug('search', opts);

				this.searchState.metaSearch.hugoData.loadIfNotLoaded();

				var event = opts.event;
				if (event === dispatcher.events.EVENT_SEARCHRESULT_BLANK && this.searchState.blankSearch.isLoading()) {
					// One is already in progress.
					return;
				}

				this.searchState.searchOpts = opts;

				let regularSearch = opts.regularSearch !== undefined ? opts.regularSearch : false;
				this.filters.query = regularSearch ? opts.query || '' : this.filters.query;
				if (designMode || (regularSearch && (this.filters.query.length > 0 || opts.allowEmptyQuery))) {
					this.show = true;
				} else if (regularSearch && this.filters.query.length === 0) {
					this.show = false;
				}

				var needsBlankResult = event === dispatcher.events.EVENT_SEARCHRESULT_BLANK;

				if (!this.show) {
					needsBlankResult = true;
				}

				if (opts.requests) {
					this.searchState.staticSearchRequests.push({
						requests: opts.requests,
						event: event
					});
					needsBlankResult = true;
				}

				// Refresh the main search result on query or filter changes.
				this.searchState.mainSearch.resetLoadingStateIf(regularSearch && !this.filters.isZero());

				// Disable main search if all filters are cleared.
				// This means that the explorer etc. will fall back to the blank search result.
				if (this.searchState.mainSearch.disableIf(regularSearch && this.filters.isZero())) {
					needsBlankResult = true;
					// Make sure that also this gets published, even if the search data has not changed.
					this.searchState.mainSearch.publish = true;
				}

				if (needsBlankResult) {
					this.searchState.blankSearch.publish = true;
				}

				// Refresh the expanded explorer nodes on query or filter changes,
				// or if a new node is expanded.
				if (regularSearch || opts.isNodeToggle) {
					for (let node of this.searchState.expandedNodes.values()) {
						node.dirty = true;
					}
					this.searchState.mainSearch.publish = true;
				}

				if (!opts.isNodeToggle && this.searchState.publishIfCached(event)) {
					return;
				}

				var self = this;
				var searcher = newSearcher(normalizeHit(self), function(err) {
					self.searchState.reset();
					// TODO(bep) error status in view
					throw err;
				});

				if (this.searchState.staticSearchRequests.length > 0) {
					for (let i = 0; i < this.searchState.staticSearchRequests.length; i++) {
						let r = this.searchState.staticSearchRequests.pop();
						let requests = r.requests.requests;
						let event = r.event;
						let key = r.requests.key;

						let cachedResults = this.searchState.staticSearchCache.get(key);
						if (cachedResults) {
							this.searchState.staticSearchRequestsResults.push({ event: event, results: cachedResults });
						} else {
							searcher.add({ requests: requests }, (results) => {
								this.searchState.staticSearchRequestsResults.push({ event: event, results: results });
								this.searchState.staticSearchCache.set(key, results);
							});
						}
					}
				}

				if (this.searchState.metaSearch.shouldLoad()) {
					searcher.addSearchItem(this.searchState.metaSearch, (results) => {
						let m = results[0].hits.reduce(function(m, hit) {
							// The blog sections have mixed-case objectIDs, but we need this lookup to be case insensitive.
							m.set(hit.objectID.toLowerCase(), hit);
							return m;
						}, new Map());
						this.searchState.metaSearch.setResults(m);
					});
				}

				var applySectionFilters = function(opts) {
					let sectionConfig = opts.sectionConfig;
					let requests = opts.requests;
					let facetFilters = self.filters.facets.get(sectionConfig.name) || [];

					requests.forEach((req) => {
						req.facetFilters = facetFilters;
						if (!req.params) {
							req.params = `query=${encodeURIComponent(self.filters.query)}&hitsPerPage=100`;
						} else if (req.params.includes('query=&')) {
							req.params = req.params.replace(
								'query=&',
								`query=${encodeURIComponent(self.filters.query)}&`
							);
						}
					});
				};

				var createSectionRequest = function(sectionConfig, isBlank = false) {
					let facets = sectionConfig.section_facet ? [ sectionConfig.section_facet ] : [ 'section.*' ];
					let filteringFacetNames = [];
					if (sectionConfig.filtering_facets) {
						filteringFacetNames = sectionConfig.filtering_facets.map((facet) => facet.name);
						facets = facets.concat(filteringFacetNames);
					}
					let hitsPerPage = 0;
					if (!isBlank) {
						hitsPerPage = self.showFullSearchResult
							? 1000
							: sectionConfig.hits_per_page || searchConfig.hits_per_page || 20;
					}
					let filters = sectionConfig.filters || '';
					let facetFilters = self.filters.facets.get(sectionConfig.name) || [];
					return {
						indexName: sectionConfig.indexName(),
						filters: filters,
						facetFilters: facetFilters,
						facets: facets,
						attributesToHighlight: [ 'title', ...filteringFacetNames ],
						params: `query=${encodeURIComponent(self.filters.query)}&hitsPerPage=${hitsPerPage}`
					};
				};

				let sectionsIndices = [];
				this.searchState.mainSearch.results.sections.forEach((section, i) => {
					if (section.isEnabled()) {
						sectionsIndices.push(i);
					}
				});

				this.searchState.namedSearches.forEach((v, k) => {
					if (v.shouldCancel()) {
						// Remove it. We will get a new subscription if this is needed in the future.
						self.searchState.namedSearches.delete(k);
						return;
					}
					v.publish = true;

					if (v.query.sectionConfig) {
						applySectionFilters(v.query);
					}

					searcher.addSearchItem(v, (results) => {
						v.setResults(results);
					});
				});

				if (regularSearch && this.searchState.mainSearch.shouldLoad()) {
					let requests = [];

					for (let section of sectionsIndices) {
						requests.push(
							createSectionRequest(this.searchState.mainSearch.results.sections[section].config)
						);
					}

					searcher.add({ requests: requests }, (results) => {
						results.forEach((res, i) => {
							this.searchState.mainSearch.results.sections[sectionsIndices[i]].searchData.setResult(res);
						});
						this.searchState.mainSearch.markAsLoaded();
					});
				}

				if (needsBlankResult && this.searchState.blankSearch.shouldLoad()) {
					let requests = [];
					for (let section of searchConfig.sections) {
						requests.push(createSectionRequest(section, true));
					}

					this.searchState.blankSearch.markAsLoading();
					searcher.add({ requests: requests }, (results) => {
						results.forEach((res, i) => {
							this.searchState.blankSearch.results.sections[i].searchData.setResult(res);
						});
						this.searchState.blankSearch.markAsLoaded();
					});
				}

				if (this.searchState.expandedNodes.size > 0) {
					for (let node of this.searchState.expandedNodes.values()) {
						if (!node.dirty) {
							continue;
						}

						let maxLeafNodes =
							node.section.config.explorer_max_leafnodes || searchConfig.explorer_max_leafnodes || 100;
						let sectionFilter = `section:${node.key}`;
						let filters = node.section.config.filters || '';
						let indexFilters = self.filters.facets.get(node.section.config.name) || new Set();
						let facetFilters = Array.from(indexFilters);
						let request = {
							indexName: node.section.config.indexName(),
							filters: filters,
							facetFilters: facetFilters.concat(facetFilters, sectionFilter),
							params: `query=${encodeURIComponent(this.filters.query)}&hitsPerPage=${maxLeafNodes}`
						};

						searcher.add({ requests: [ request ] }, (results) => {
							results.forEach((res, i) => {
								node.searchResult = res;
								node.dirty = false;
							});
						});
					}
				}
				searcher.execute(() => {
					debug('publish', event, self.searchState);
					self.searchState.publish();
				});
			},

			searchNodes: function(detail) {
				let nodes = detail.data;
				let doSearch = false;
				let keys = new Set();

				nodes.forEach((n) => {
					keys.add(n.key);
					let regularPagesStartLevel = n.section.config.explorer_regular_pages_start_level || 3;

					if (n.level < regularPagesStartLevel || this.searchState.expandedNodes.has(n.key)) {
						return;
					}

					doSearch = true;

					this.searchState.expandedNodes.set(n.key, n);
				});

				for (let k of this.searchState.expandedNodes.keys()) {
					if (!keys.has(k)) {
						this.searchState.expandedNodes.delete(k);
					}
				}

				if (doSearch) {
					this.search({ isNodeToggle: true, event: dispatcher.events.EVENT_SEARCHRESULT });
				}
			}
		};
	};
})(lnSearch);
