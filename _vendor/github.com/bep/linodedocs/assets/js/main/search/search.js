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
		if (queries.requests.length == 0) {
			return;
		}

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

			result.getMatchedWords = function() {
				var words = new Set();
				this.sections.forEach((section) => {
					let attributesToHighlight = [ 'title', ...section.config.facetFilterNames() ];
					let hits = section.searchData.result.hits;

					hits.forEach((hit) => {
						var highlightResult = hit._highlightResult;

						attributesToHighlight.forEach((attr) => {
							var attrVals = Array.isArray(highlightResult[attr])
								? highlightResult[attr]
								: [ highlightResult[attr] ];
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

		var newSearcher = function(hitNormalizer) {
			return new Searcher(searchConfig, hitNormalizer, debug);
		};

		var newSearchItem = function(name, results, query, concurrent, subscribers = []) {
			return {
				name: name,
				dirty: true,
				publish: false,
				loaded: false,
				loading: false,
				concurrent: concurrent,
				subscribers: subscribers,
				query: query,
				results: results
			};
		};

		var newSearchState = function(self) {
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
				expandedNodes: new Map()
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
				if (!self.publish) {
					return;
				}
				let events = [];
				this.items().forEach((item) => {
					if (item.publish) {
						// TODO(bep) check how to limit the publishing?
						events = events.concat(item.subscribers);
					}
					item.loading = false;
				});
				if (events.length > 0) {
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
						if (item.concurrent && item.loading) {
							// In progress, it will eventually be sent.
							return true;
						}
						publish = !item.dirty;
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
					this.searchState.mainSearch.loaded = false;
					this.searchState.blankSearch.publish = true;
				}

				// Refresh the main search result on query or filter changes.
				this.searchState.mainSearch.dirty = regularSearch && !this.filters.isZero();

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
				var searcher = newSearcher(function(opts, hit) {
					let href;
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
						if (!this.excerpt) {
							return '';
						}
						if (this.excerpt.length <= maxLen) {
							return this.excerpt;
						}
						return `${this.excerpt.substring(0, maxLen)}…`;
					};
				});

				if (this.searchState.metaSearch.dirty) {
					searcher.add(
						{ requests: this.searchState.metaSearch.query.requests, isSectionMeta: true },
						(results) => {
							let m = results[0].hits.reduce(function(m, hit) {
								m.set(hit.objectID.toLowerCase(), hit);
								return m;
							}, new Map());
							this.searchState.metaSearch.results = m;
							this.searchState.metaSearch.dirty = false;
							this.searchState.metaSearch.loaded = true;
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

				var createSectionRequest = function(sectionConfig) {
					let facets = [ 'section.*' ];
					let filteringFacetNames = [];
					if (sectionConfig.filtering_facets) {
						filteringFacetNames = sectionConfig.filtering_facets.map((facet) => facet.name);
						facets = facets.concat(filteringFacetNames);
					}
					let hitsPerPage = self.showFullSearchResult
						? 1000
						: sectionConfig.hits_per_page || searchConfig.hits_per_page || 20;
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

					applySectionFilters(v.query);

					searcher.add({ requests: v.query.requests }, (results) => {
						v.results = results;
					});
				});

				if (regularSearch && this.searchState.mainSearch.dirty) {
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
						this.searchState.mainSearch.dirty = false;
						this.searchState.mainSearch.loaded = true;
						this.searchState.mainSearch.publish = true;
					});
				}

				if (
					!this.searchState.blankSearch.loaded ||
					(event === dispatcher.events.EVENT_SEARCHRESULT_BLANK && this.searchState.blankSearch.dirty)
				) {
					let requests = [];
					for (let section of sectionsIndices) {
						requests.push(
							createSectionRequest(this.searchState.mainSearch.results.sections[section].config)
						);
					}

					this.searchState.blankSearch.loading = true;
					searcher.add({ requests: requests }, (results) => {
						results.forEach((res, i) => {
							this.searchState.blankSearch.results.sections[sectionsIndices[i]].searchData.setResult(res);
						});
						this.searchState.blankSearch.dirty = false;
						this.searchState.blankSearch.loaded = true;
						this.searchState.blankSearch.publish = true;
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

	ctx.NewSimpleData = function() {
		const dispatcher = lnSearchEventDispatcher.New();

		return {
			data: { stats: {} },

			sprintfStatsProperty: function(index, property, format) {
				let v = this.data.stats[index];
				if (!v) {
					return '';
				}
				return sprintf(format, v[property]);
			},

			init: function() {
				dispatcher.searchBlank();
			},

			initSearchResult: function(data) {
				let results = data.blankSearch.results;
				for (let section of results.sections) {
					this.data.stats[section.config.name] = section.searchData.result;
				}
			}
		};
	};
})(lnSearch);
