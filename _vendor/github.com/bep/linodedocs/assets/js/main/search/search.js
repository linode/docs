var lnSearch = {};

class Searcher {
	constructor(searchConfig, hitNormalizer, debug = function() {}) {
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
	}

	add(opts, callback) {
		let requests = opts.requests;
		let start = this.requests.length;
		let end = start + requests.length;
		requests.forEach((query) => {
			if (!query.params) {
				query.params = 'query=&hitsPerPage=2345';
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
			console.log(error);
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

		const designMode = false;

		// Normalization of a search hit across the search indixes.
		const normalizeHit = function(self) {
			return function(opts, hit) {
				hit.sectionTitle = hit.section;
				if (hit.section) {
					hit.section = hit.section.toLowerCase();
				}

				if (self.searchState.metaSearch.results.get) {
					let m = self.searchState.metaSearch.results.get(hit.section);
					if (m) {
						hit.sectionTitle = m.linkTitle;
					}
				}

				hit.titleHighlighted = hit._highlightResult ? hit._highlightResult.title.value : hit.title;

				let href;
				if (opts.isSectionMeta) {
					href = router.hrefSection(hit.objectID);
				} else if (hit.url) {
					// A blog entry.
					href = router.hrefEntry(hit);
				} else {
					href = hit.href;
				}
				hit.href = href;
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

			// Assume only one for now.
			let sectionConfig = searchConfig.sections.find((s) => s.name === sections);

			var filters = new Set();
			sectionConfig.facetFilterNames().forEach((filterName) => {
				let filterCsv = params.get(filterName);
				if (filterCsv) {
					let values = filterCsv.split(',');
					values.forEach((v) => {
						filters.add(`${filterName}:${v}`);
					});
				}
			});

			self.filters.facets.set(sectionConfig.name, filters);

			return true;
		};

		// Prepares the data structure to store the search results in.
		const newSearchResults = function(self, blank) {
			var sectionFiltersToQueryParams = function(filters) {
				if (!filters) {
					return '';
				}

				if (!(filters instanceof Set)) {
					return sectionFilterToQueryParam(filters);
				}

				var queryString = '';

				var csvMap = new Map();
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

		const newSearcher = function(hitNormalizer) {
			return new Searcher(searchConfig, hitNormalizer, debug);
		};

		// searchItemLoadingStates represents the main loading state of a search item.
		const searchItemLoadingStates = {
			INITIAL: 0, // Initial state, also set when it needs a refresh.
			LOADING: 1, // It's loading, so do not start another.
			LOADED: 2 // Loaded and ready to use.
		};

		const newSearchItem = function(name, results, query, concurrent, subscribers = []) {
			let item = {
				name: name,

				publish: false,
				concurrent: concurrent,
				loadingState: searchItemLoadingStates.INITIAL,

				subscribers: subscribers,
				query: query,
				results: results
			};

			item.shouldLoad = function() {
				return this.loadingState === searchItemLoadingStates.INITIAL;
			};

			item.resetLoadingStateIf = function(b) {
				if (b) {
					this.loadingState = searchItemLoadingStates.INITIAL;
					this.publish = false;
				}
			};

			item.setResults = function(results) {
				this.results = results;
				this.loadingState = searchItemLoadingStates.LOADED;
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

			return item;
		};

		const newSearchState = function(self) {
			let s = {
				mainSearch: newSearchItem('main', newSearchResults(self, false), {}, true, [
					dispatcher.events.EVENT_SEARCHRESULT
					// eslint-disable-next-line array-bracket-newline
				]),
				blankSearch: newSearchItem('blank', newSearchResults(self, true), {}, false, [
					dispatcher.events.EVENT_SEARCHRESULT_BLANK
					// eslint-disable-next-line array-bracket-newline
				]),
				metaSearch: newSearchItem(
					'meta',
					{},
					{
						requests: [
							{
								indexName: searchConfig.meta_index,
								params: 'query=&hitsPerPage=500'
							}
						]
					},
					false
				),

				namedSearches: new Map(),
				expandedNodes: new Map(),

				// For the standalone searches on the home page etc.
				staticSearchRequests: [],
				staticSearchRequestsResults: [],
				staticSearchCache: new Map()
			};

			s.items = function() {
				return [ this.mainSearch, this.blankSearch, this.metaSearch ].concat(
					Array.from(this.namedSearches.values())
				);
			};

			s.subscribe = function(name, query, e) {
				let events = Array.isArray(e) ? e : [ e ];
				this.namedSearches.set(name, newSearchItem(name, {}, query, false, events));
			};

			s.publish = function() {
				// The staticSearchRequestsResults standalone searches that's not participating in the global
				// filtering game, so publish it whenever it's set.
				for (let i = 0; i < this.staticSearchRequestsResults.length; i++) {
					let r = this.staticSearchRequestsResults.pop();
					sendEvent(r.event, r.results);
				}

				if (!this.publish) {
					return;
				}

				let events = [];
				this.items().forEach((item) => {
					if (item.publish && item.isLoaded()) {
						// TODO(bep) check how to limit the publishing?
						events = events.concat(item.subscribers);
					}
				});

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
					// Broadcast the blank result set to components that needs it.
					dispatcher.searchBlank();
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

				var event = opts.event;
				if (event === dispatcher.events.EVENT_SEARCHRESULT_BLANK && this.searchState.blankSearch.loading) {
					// One is already in progress.
					return;
				}

				let regularSearch = opts.regularSearch !== undefined ? opts.regularSearch : false;
				this.filters.query = regularSearch ? opts.query || '' : this.filters.query;
				if (designMode || (regularSearch && (this.filters.query.length > 0 || opts.allowEmptyQuery))) {
					this.show = true;
				} else if (regularSearch && this.filters.query.length === 0) {
					this.show = false;
				}

				if (!this.show) {
					this.searchState.mainSearch.resetLoadingStateIf(true);
					this.searchState.blankSearch.publish = true;
				}

				if (opts.requests) {
					this.searchState.staticSearchRequests.push({
						requests: opts.requests,
						event: event
					});
				}

				// Refresh the main search result on query or filter changes.
				this.searchState.mainSearch.resetLoadingStateIf(regularSearch && !this.filters.isZero());

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
				var searcher = newSearcher(normalizeHit(self));

				if (this.searchState.staticSearchRequests.length > 0) {
					for (let i = 0; i < this.searchState.staticSearchRequests.length; i++) {
						let r = this.searchState.staticSearchRequests.pop();
						let requests = r.requests.requests;
						let event = r.event;
						let key = r.requests.key;

						let cachedResults = this.searchState.staticSearchCache.get(key);
						if (cachedResults) {
							self.searchState.staticSearchRequestsResults.push({ event: event, results: cachedResults });
						} else {
							searcher.add({ requests: requests }, (results) => {
								self.searchState.staticSearchRequestsResults.push({ event: event, results: results });
								self.searchState.staticSearchCache.set(key, results);
							});
						}
					}
				}

				if (this.searchState.metaSearch.shouldLoad()) {
					searcher.add(
						{ requests: this.searchState.metaSearch.query.requests, isSectionMeta: true },
						(results) => {
							let m = results[0].hits.reduce(function(m, hit) {
								m.set(hit.objectID.toLowerCase(), hit);
								return m;
							}, new Map());
							this.searchState.metaSearch.setResults(m);
						}
					);
				}

				var applySectionFilters = function(opts) {
					let sectionConfig = opts.sectionConfig;
					let requests = opts.requests;
					let indexFilters = self.filters.facets.get(sectionConfig.name) || new Set();
					let facetFilters = Array.from(indexFilters);

					requests.forEach((req) => {
						req.facetFilters = [ facetFilters ];
						if (!req.params) {
							req.params = `query=${encodeURIComponent(self.filters.query)}&hitsPerPage=2345`;
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
					let indexFilters = self.filters.facets.get(sectionConfig.name) || new Set();
					let facetFilters = Array.from(indexFilters);

					return {
						indexName: sectionConfig.indexName(),
						filters: filters,
						facetFilters: [ facetFilters ],
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
					v.publish = true;

					if (v.query.sectionConfig) {
						applySectionFilters(v.query);
					}

					searcher.add({ requests: v.query.requests }, (results) => {
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

				if (event === dispatcher.events.EVENT_SEARCHRESULT_BLANK && this.searchState.blankSearch.shouldLoad()) {
					let requests = [];
					for (let section of searchConfig.sections) {
						requests.push(createSectionRequest(section, true));
					}

					this.searchState.blankSearch.loading = true;
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
							facetFilters: [ facetFilters.concat(facetFilters, sectionFilter) ],
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

			searchNode: function(detail) {
				let n = detail.data.node;
				let closing = !detail.open;
				let key = n.key;

				if (closing) {
					// Close this and descendant leaf queries.
					for (let [ k, expandedNode ] of this.searchState.expandedNodes.entries()) {
						if (expandedNode.key.startsWith(key)) {
							this.searchState.expandedNodes.delete(k);
						}
					}
					return;
				}

				let regularPagesStartLevel = n.section.config.explorer_regular_pages_start_level || 3;

				if (n.level < regularPagesStartLevel || this.searchState.expandedNodes.has(n.key)) {
					return;
				}

				this.searchState.expandedNodes.set(n.key, n);
				this.search({ isNodeToggle: true, event: dispatcher.events.EVENT_SEARCHRESULT });
			}
		};
	};
})(lnSearch);
