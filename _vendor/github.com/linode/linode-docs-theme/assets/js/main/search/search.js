('use strict');

import { newDispatcher } from './dispatcher';
import { newCreateHref } from '../navigation/create-href';
import { sendEvent, toDateString, waitUntil } from '../helpers/index';
import { newQuery, QueryHandler } from './query';
import { isTopResultsPage } from './filters';

const debug = 0 ? console.log.bind(console, '[search-main]') : function() {};
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

/**
  	* Create a new search client that interacts with Algolia.
  	* 
  	* @param {cfg} The Algolia config.
  	*/
export function newSearchController(searchConfig) {
	debug('newSearchController', searchConfig);

	const dispatcher = newDispatcher();
	const router = newCreateHref(searchConfig);
	const queryHandler = new QueryHandler(searchConfig.sectionsSorted);

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

			hit.excerptHighlighted =
				hit._highlightResult && hit._highlightResult.excerpt ? hit._highlightResult.excerpt.value : hit.excerpt;

			hit.linkTitle = hit.linkTitle || hit.title;

			let href;
			if (opts.isSectionMeta) {
				href = router.hrefSection(hit.objectID);
			} else if (hit.url) {
				href = hit.url;
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

			if (!hit.thumbnailUrl) {
				hit.thumbnailUrl = '/docs/media/images/Linode-Default-416x234.jpg';
			}
		};
	};

	// Prepares the data structure to store the search results in.
	const newSearchResults = function(self, blank) {
		let sections = [];
		for (let sectionCfg of searchConfig.sectionsSorted) {
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

			sectionCfg.nounPlural = function(count = 2) {
				let noun = this.noun || this.title;

				if (count === 0 || (count > 1 && !noun.endsWith('s'))) {
					noun += 's';
				}
				return noun;
			};

			searchData.setResult = function(result) {
				let q = queryHandler.queryToQueryForSection(self.query(), sectionCfg.name);
				q._view = 'search';
				let queryString = queryHandler.queryToQueryString(q);
				this.href = `/docs/search/?${queryString}`;

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

			searchData.textHelpers = {
				resultsIn: function() {
					let nbHits = searchData.result.nbHits || 0;
					let resultNoun = nbHits === 1 ? 'Result' : 'Results';
					return `${nbHits} ${resultNoun} in ${section.config.title}`;
				}
			};

			let section = { config: sectionCfg, searchData: searchData };

			section.isEnabled = function() {
				if (this.disabledPermanent) {
					return false;
				}
				return self.query().isSectionEnabled(section.config.name);
			};

			section.hasHit = function() {
				let nbHits =
					this.searchData.result && this.searchData.result.nbHits ? this.searchData.result.nbHits : 0;
				return nbHits > 0;
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

		result.isSectionDisabled = function() {
			for (let section of sections) {
				if (!section.isEnabled()) {
					return true
				}
			}
			return false;
		};

		result.findSectionByName = function(name) {
			return this.sections.find((section) => section.config.name === name);
		};

		result.getMatchedWords = function() {
			var words = new Set();
			this.sections.forEach((section) => {
				let attributesToHighlight = [ 'title', 'excerpt', ...section.config.facetFilterNames() ];
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
			query: newQuery(),
			queryChanged: false,
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
					loadIfNotLoaded: async function(foo) {
						if (this.loadingState === searchItemLoadingStates.LOADING) {
							var self = this;
							await waitUntil(function() {
								return self.loadingState !== searchItemLoadingStates.LOADING;
							});
						}

						if (this.loadingState === searchItemLoadingStates.LOADED) {
							return;
						}

						this.loadingState = searchItemLoadingStates.LOADING;
						const response = await fetch('/docs/data/sections/index.json');
						if (response.ok) {
							const data = await response.json();
							this.data = data.reduce(function(m, item) {
								item.href = router.hrefSection(item.objectID);
								m.set(item.objectID, item);
								return m;
							}, new Map());
							dispatcher.broadCastSearchResult(s, dispatcher.events.EVENT_SEARCHRESULT_INITIAL);
						}

						this.loadingState = searchItemLoadingStates.LOADED;
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

		s.reset = function() {
			this.mainSearch.reset();
			this.blankSearch.reset();
			this.metaSearch.reset();
			this.namedSearches.forEach((v, k) => {
				v.reset();
			});
		};

		s.items = function() {
			// The events will be sent in this order.
			return [ this.blankSearch, this.metaSearch, this.mainSearch ].concat(
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
				events.push(dispatcher.events.EVENT_SEARCHRESULT_ANY);
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
					publish = item.isLoaded();
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
		standaloneSearch: false, // Standalone vs top results search.
		view: 1, // The active search view (1: list view, 2: section view, 3: tiles view)

		searchState: null,

		init: function(standaloneSearch = false) {
			debug('init');

			this.searchState = newSearchState(this);
			this.publish = !standaloneSearch;

			if (standaloneSearch) {
				let query = queryHandler.queryFromLocation();
				debug('standalone', query);
				this.standaloneSearch = { query: query };
				return function() {
					this.search();
				};
			}

			// Load metadata from /docs/data/sections/index.json
			this.searchState.metaSearch.hugoData.loadIfNotLoaded('init');

			this.$watch('show', () => {
				sendEvent('nav:toggle', { what: 'search-panel', open: this.show });
			});

			return function() {
				dispatcher.searchReady();
			};
		},

		subscribe: function(detail) {
			debug('subscribe', detail);
			this.searchState.subscribe(detail.name, detail.opts, detail.event);
			this.search({ event: detail.event });
		},

		onTurbolinksBeforeRender: function(data) {
			debug('onTurbolinksBeforeRender', data);
			this.show = false;
		},

		query: function() {
			if (this.standaloneSearch) {
				return this.standaloneSearch.query;
			}
			return this.searchState.query;
		},

		search: async function(arg) {
			let opts = arg || {};
			debug('search', opts);

			var regularSearch = false;
			var executeSearch = this.standaloneSearch || opts.executeSearch;
			var event = opts.event;
			this.show = isTopResultsPage();

			if (!this.standaloneSearch && opts.query) {
				// A Query object, a regular user search.

				regularSearch = true;
				this.searchState.queryChanged = !this.searchState.query.eq(opts.query);
				if (this.searchState.queryChanged) {
					// Clone it so we can detect changes.
					this.searchState.query = queryHandler.queryToQuery(opts.query);
				}

				if (!executeSearch) {
					// Done.
					return;
				}
			}

			// Make sure that the Hugo hosted static data is loaded before we do any searches.
			// TODO(bep) receive this in the constructor.
			await this.searchState.metaSearch.hugoData.loadIfNotLoaded('search');

			if (event === dispatcher.events.EVENT_SEARCHRESULT_BLANK) {
				if (this.searchState.blankSearch.isLoading()) {
					// One is already in progress.
					return;
				}

				if (!this.searchState.blankSearch.isLoaded()) {
					// This will in many cases be a situation where it is followed by a data query.
					// Wait a little to avoid doing an extra Algolia request.
					var isDone = false;
					var self = this;
					var start = new Date().getTime();
					await waitUntil(function() {
						if (self.searchState.blankSearch.isLoaded()) {
							isDone = true;
							return true;
						}
						let now = new Date().getTime();
						return now - start > 500;
					});

					if (isDone) {
						return;
					}
				}
			}

			this.searchState.searchOpts = opts;
			var needsBlankResult = event === dispatcher.events.EVENT_SEARCHRESULT_BLANK || !this.standaloneSearch;

			if (opts.requests) {
				this.searchState.staticSearchRequests.push({
					requests: opts.requests,
					event: event
				});
				needsBlankResult = true;
			}

			// Refresh the main search result on query or filter changes.
			this.searchState.mainSearch.resetLoadingStateIf(regularSearch && this.searchState.queryChanged);

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

			var filtersPerSection = queryHandler.filtersPerSection(this.query());
			var applySectionFilters = function(opts) {
				let sectionConfig = opts.sectionConfig;
				let requests = opts.requests;
				let facetFilters = filtersPerSection.get(sectionConfig.name) || [];

				requests.forEach((req) => {
					req.facetFilters = facetFilters;
					if (!req.params) {
						req.params = `query=${encodeURIComponent(self.query().q)}&hitsPerPage=100`;
					} else if (req.params.includes('query=&')) {
						req.params = req.params.replace('query=&', `query=${encodeURIComponent(self.query().q)}&`);
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
					hitsPerPage = self.standaloneSearch
						? 100
						: sectionConfig.hits_per_page || searchConfig.hits_per_page || 20;
				}
				let q = isBlank ? '' : encodeURIComponent(self.query().q);
				let filters = sectionConfig.filters || '';
				let facetFilters = isBlank ? [] : filtersPerSection.get(sectionConfig.name) || [];

				return {
					indexName: sectionConfig.indexName(),
					filters: filters,
					facetFilters: facetFilters,
					facets: facets,
					attributesToHighlight: [ 'title', 'excerpt', ...filteringFacetNames ],
					params: `query=${q}&hitsPerPage=${hitsPerPage}`
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

			let loadMainSearch = this.standaloneSearch;
			if (!loadMainSearch && this.searchState.mainSearch.shouldLoad()) {
				// namedSearches contains the category listing searches. If
				// we come in from a bookmarked URL we need to make sure that we
				// also load the main search to get the correct highlighting in the
				// input box.
				loadMainSearch = regularSearch || this.searchState.namedSearches.size > 0;
			}

			if (loadMainSearch) {
				let requests = [];

				for (let section of sectionsIndices) {
					requests.push(createSectionRequest(this.searchState.mainSearch.results.sections[section].config));
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
				for (let section of searchConfig.sectionsSorted) {
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
					let facetFilters = filtersPerSection.get(node.section.config.name) || [];
					let request = {
						indexName: node.section.config.indexName(),
						filters: filters,
						facetFilters: facetFilters.concat(facetFilters, sectionFilter),
						params: `query=${encodeURIComponent(this.query().q)}&hitsPerPage=${maxLeafNodes}`
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
				if (self.publish) {
					debug('publish', event, self.searchState);
					self.searchState.publish();
				}
				self.show = self.show || self.standaloneSearch;
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
}
