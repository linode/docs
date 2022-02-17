import { newQuery, QueryHandler } from './query';
import { getCurrentLang, LRUMap, toDateString } from '../helpers';
import { newCreateHref, addLangToHref } from '../navigation/index';
import {
	newRequestCallback,
	newRequestCallbackFactories,
	SearchGroupIdentifier,
	RequestCallBackStatus
} from './request';

const debug = 0 ? console.log.bind(console, '[search-store]') : function() {};
const debugFetch = 0 ? console.log.bind(console, '[search-fetch]') : function() {};

export const searchGroupIdentifiers = {
	MAIN: 1,
	AD_HOC: 2
};

export function newSearchStore(searchConfig, Alpine) {
	let results = {
		blank: { loaded: false },
		main: { loaded: false }
	};
	const searcher = new Searcher(searchConfig, results.blank, debug);
	let searchEffectMain = null;
	let searchEffectAdHoc = null;
	const router = newCreateHref(searchConfig);
	const queryHandler = new QueryHandler();

	let store = {
		// This is the only query instance. When search is active, any change to this will trigger a new search for searchGroupMain.
		query: newQuery(),

		// searchGroupMain holds the main search and others that should react to changes
		// to the query filters.
		searchGroupMain: newRequestCallbackFactories(),

		// searchGroupAdHoc holds, typically, one time queries needed to fetch
		// data for the home page etc.
		searchGroupAdHoc: newRequestCallbackFactories(),

		// The blank (needed for the explorer and section metadata) and the main search result.
		results: results,

		updateLocationWithQuery() {
			let href = window.location.pathname + window.location.hash;
			let search = queryHandler.queryAndLocationToQueryString(this.query);
			if (search) {
				href += '?' + search;
			}

			// See https://github.com/hotwired/turbo/issues/163#issuecomment-933691878
			history.replaceState({ turbo: {} }, null, href);
		},

		executeBatch() {
			searcher.executeBatch();
		},

		addSearches(...requestCallBackFactoryTargets) {
			requestCallBackFactoryTargets.forEach((rcf) => {
				switch (rcf.target) {
					case SearchGroupIdentifier.Main:
						this.searchToggle(true);
						this.searchGroupMain.push(rcf.factory);
						break;
					case SearchGroupIdentifier.AdHoc:
						this.searchGroupAdHoc.push(rcf.factory);
						break;
					default:
						throw `unknown search group ${rcf.target}`;
				}
			});
		},

		init() {
			this.results.blank.getSectionMeta = function(key) {
				if (!this.metaStatic) {
					return null;
				}
				key = key.toLocaleLowerCase();
				// First look in the static data set.
				if (key.endsWith('-branches')) {
					key = key.substring(0, key.indexOf('-branches'));
				}
				let m = this.metaStatic.get(key);
				let sectionConfigIdx = searchConfig.sectionsSorted.findIndex((section) => {
					return section.name === key.toLocaleLowerCase();
				});

				if (!m) {
					// Then look in the Algolia data.
					if (!this.metaResult) {
						return null;
					}
					m = this.metaResult.get(key);
					if (!m && sectionConfigIdx !== -1) {
						let index = searchConfig.sectionsSorted[sectionConfigIdx];
						m = { title: index.title, linkTitle: index.title };
					}
				}

				if (m) {
					m.ordinal = sectionConfigIdx !== -1 ? sectionConfigIdx + 1 : m.ordinal;
					if (!m.href) {
						m.href = router.hrefSection(key);
					}
				}

				return m;
			};

			// Is the main search, i.e. what you see when you're typing into the search form.
			// This will start executing once searchEffectMain activates (see searchToggle).
			this.searchGroupMain.push({
				status: function() {
					// Will be active as long as searchEffectMain is active, but
					// the cache will prevent new remote Algolia requests as long
					// as the query does not change.
					return RequestCallBackStatus.On;
				},
				create: (query) => {
					return newRequestCallback(
						createSectionRequest(query),
						(result) => {
							this.results.main.result = result;
							this.results.main.loaded = true;
						},
						true
					);
				}
			});

			searchEffectAdHoc = Alpine.effect(() => {
				debug('searchEffectAdHoc', this.searchGroupAdHoc.length);
				searcher.searchFactories(this.searchGroupAdHoc, null);
			});
		},
		searchToggle: function(active) {
			if (searchEffectMain === null) {
				// Start watching.
				searchEffectMain = Alpine.effect(() => {
					searcher.searchFactories(this.searchGroupMain, this.query);
				});
			}
			searchEffectMain.active = active;
		},
		isSearching: function() {
			return searchEffectMain && searchEffectMain.active;
		},

		withBlank: async function(callback = () => {}) {
			debug('withBlank');

			if (this.results.blank.loaded) {
				callback(this.results.blank);
				return;
			}

			let loadCount = 0;
			let markLoaded = () => {
				loadCount++;
				if (loadCount === 3) {
					this.results.blank.loaded = true;
					callback(this.results.blank);
				}
			};

			// Section metadata from Hugo.
			const response = await fetch('/docs/data/sections/index.json');
			if (response.ok) {
				const data = await response.json();
				this.results.blank.metaStatic = data.reduce(function(m, item) {
					item.href = router.hrefSection(item.objectID);
					m.set(item.objectID, item);
					return m;
				}, new Map());
				markLoaded();
			}

			searcher.batcher.add(
				// Load section meta data from Algolia.
				newRequestCallback(
					{
						indexName: searchConfig.meta_index,
						params: 'query=&hitsPerPage=600',
						// We load the Hugo data from the published JSON to save Algolia queries on
						// load (for the breadcrumbs).
						// This filter is just to save some bytes for when the Algolia data IS loaded,
						// as the guides is the most populated section tree.
						filters:
							'NOT section:guides AND NOT section:api AND NOT section:products AND NOT section:content AND NOT section:development'
					},
					(result) => {
						debug('withBlank.blank.metaResult:', result);
						this.results.blank.metaResult = result.hits.reduce(function(m, hit) {
							// The blog sections have mixed-case objectIDs, but we need this lookup to be case insensitive.
							m.set(hit.objectID.toLowerCase(), hit);
							return m;
						}, new Map());
						markLoaded();
					}
				),
				newRequestCallback(createSectionRequest(), (result) => {
					if (result.index != 'linode-merged') {
						throw `invalid state: ${result.index}`;
					}
					debug('withBlank.blank.result:', result);
					this.results.blank.result = result;
					markLoaded();
				})
			);
		}
	};

	const createSectionRequest = function(query) {
		debug('createSectionRequest:', query);
		let sectionConfig = searchConfig.sections_merged;
		let facets = sectionConfig.section_facet ? [ sectionConfig.section_facet ] : [ 'section.*' ];
		let filteringFacetNames = [];
		if (sectionConfig.filtering_facets) {
			filteringFacetNames = sectionConfig.filtering_facets.map((facet) => facet.name);
			facets = facets.concat(filteringFacetNames);
		}

		let hitsPerPage = 0;
		let q = '';
		let filters = sectionConfig.filters || '';
		let facetFilters = [];
		let attributesToHighlight = [];
		let page = 0;

		if (query) {
			hitsPerPage = sectionConfig.hits_per_page || searchConfig.hits_per_page || 20;
			q = encodeURIComponent(query.lndq);
			facetFilters = query.toFacetFilters();
			attributesToHighlight = [ 'title', 'excerpt', ...filteringFacetNames ];
			page = query.p;
		}

		return {
			indexName: sectionConfig.index,
			filters: filters,
			facetFilters: facetFilters,
			facets: facets,
			attributesToHighlight: attributesToHighlight,
			params: `query=${q}&hitsPerPage=${hitsPerPage}&page=${page}`
		};
	};

	return store;
}

// Normalization of search results.
const normalizeResult = function(self, result) {
	let hitsStart = 0;
	let hitsEnd = 0;

	if (result.nbHits) {
		hitsStart = result.page * result.hitsPerPage;
		hitsStart = hitsStart ? hitsStart + 1 : 1;
		hitsEnd = hitsStart + result.hits.length - 1;
	}

	result.stats = {
		totalNbHits: result.nbHits,
		totalNbPages: result.nbPages,
		hitsStart: hitsStart,
		hitsEnd: hitsEnd
	};

	let facets = result.facets;
	if (facets) {
		// Apply metadata to the section facets.
		let facetsMeta = {};
		Object.entries(facets).forEach(([ k, v ]) => {
			if (k === 'docType' || k.startsWith('section.')) {
				let obj = {};
				Object.entries(v).forEach(([ kk, vv ]) => {
					let m = self.metaProvider.getSectionMeta(kk.toLocaleLowerCase());
					obj[kk] = { count: vv, meta: m };
				});
				facetsMeta[k] = obj;
			} else {
				facetsMeta[k] = v;
			}
		});
		result.facetsMeta = facetsMeta;
	}

	result.sections = function() {
		let sections = [];

		if (!this.facets) {
			return sections;
		}

		for (let i = 0; ; i++) {
			// webserver
			// webserver apache
			let key = `section.lvl${i}`;
			let sectionFacets = this.facets[key];
			let facetsMeta = this.facetsMeta[key];

			if (!sectionFacets) {
				break;
			}

			for (let k in sectionFacets) {
				let sectionLvl0 = k;
				if (i > 0) {
					sectionLvl0 = k.split(' > ')[0];
				}
				let meta;
				let facetMeta = facetsMeta[k];
				if (facetMeta) {
					meta = facetMeta.meta;
				}

				let isGhostSection = k === 'community > question';
				sections.push({
					key: k,
					count: sectionFacets[k],
					isGhostSection: isGhostSection,
					sectionLvl0: sectionLvl0,
					meta: meta
				});
			}
		}

		return sections;
	};

	let lang = getCurrentLang();

	result.hits.forEach((hit) => {
		hit.sectionTitle = hit.section;
		if (hit.section) {
			hit.section = hit.section.toLowerCase();
		}

		hit.rootSectionTitle = hit['section.lvl0'];
		if (hit.rootSectionTitle && hit.rootSectionTitle.endsWith('-branches')) {
			hit.rootSectionTitle = hit.rootSectionTitle.substring(0, hit.rootSectionTitle.indexOf('-branches'));
		}

		hit.titleHighlighted =
			hit._highlightResult && hit._highlightResult.title ? hit._highlightResult.title.value : hit.title;

		hit.excerptHighlighted =
			hit._highlightResult && hit._highlightResult.excerpt ? hit._highlightResult.excerpt.value : hit.excerpt;

		hit.linkTitle = hit.linkTitle || hit.title;

		if (hit.href) {
			hit.isExternalLink = hit.href.startsWith('http');
		}

		if (lang && lang !== 'en' && hit.href) {
			hit.href = addLangToHref(hit.href, lang);
		}

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

		hit.tagsValues = function() {
			if (!this.tags) {
				return [];
			}

			return Object.values(this.tags);
		};
	});
};

class SearchBatcher {
	constructor(searchConfig, metaProvider) {
		const algoliaHost = `https://${searchConfig.app_id}-dsn.algolia.net`;
		this.headers = {
			'X-Algolia-Application-Id': searchConfig.app_id,
			'X-Algolia-API-Key': searchConfig.api_key
		};

		this.urlQueries = `${algoliaHost}/1/indexes/*/queries`;
		this.cache = new LRUMap(12); // Query cache.
		this.cacheEnabled = true;
		this.metaProvider = metaProvider;
		this.interval = () => {
			return this.executeCount === 0 ? 300 : 100; // in ms between batch executions.
		};
		this.executeCount = 0;
		this.fetchCount = 0;
		this.queue = [];
	}

	add(...requestCallbacks) {
		if (!this.timer) {
			this.timer = setTimeout(() => {
				this.executeBatch('timers');
			}, this.interval());
		}
		// Search cache first, add the rest to the batch queue.
		let cacheResult = this.searchCache(...requestCallbacks);
		if (cacheResult.cacheMisses.length === 0) {
			return;
		}
		this.queue = this.queue.concat(...cacheResult.cacheMisses);
	}

	executeBatch(what = 'manual') {
		let requestCallbacks = [ ...this.queue ];

		this.queue.length = 0;
		this.timer = null;

		this.search(...requestCallbacks);
		this.executeCount++;
	}

	searchCache(...requestCallbacks) {
		debug('searchCache, num requests:', requestCallbacks.length);
		if (requestCallbacks.length === 0) {
			return { cacheMisses: [], cacheMissesKeys: [] };
		}
		// Try the cache first
		let cacheMisses = [];
		let cacheMissesKeys = [];

		if (!this.cacheEnabled) {
			for (let i = 0; i < requestCallbacks.length; i++) {
				let cb = requestCallbacks[i];
				let key = JSON.stringify(cb.request);
				cacheMisses.push(requestCallbacks[i]);
				cacheMissesKeys.push(key);
			}
			return { cacheMisses: cacheMisses, cacheMissesKeys: cacheMissesKeys };
		}

		for (let i = 0; i < requestCallbacks.length; i++) {
			let cb = requestCallbacks[i];
			if (!cb.request) {
				console.warn('invalid state', cb);
				throw 'must provide a request';
			}
			let key = JSON.stringify(cb.request);
			let cachedResult = this.cache.get(key);
			if (cachedResult) {
				cb.callback(cachedResult);
			} else {
				cacheMisses.push(requestCallbacks[i]);
				cacheMissesKeys.push(key);
			}
		}

		return { cacheMisses: cacheMisses, cacheMissesKeys: cacheMissesKeys };
	}

	search(...requestCallbacks) {
		debug('search, num requests:', requestCallbacks.length);
		if (requestCallbacks.length === 0) {
			return;
		}

		// Try the cache first
		let cacheResult = this.searchCache(...requestCallbacks);
		if (cacheResult.cacheMisses.length === 0) {
			return;
		}

		// There may be still be duplicate requests.
		let requests = [];
		let requestCallbackMap = new Map();
		let cacheMissesKeysCopy = [ ...cacheResult.cacheMissesKeys ];

		cacheResult.cacheMissesKeys.length = 0;

		for (let i = 0; i < cacheMissesKeysCopy.length; i++) {
			let rc = cacheResult.cacheMisses[i];
			let rck = cacheMissesKeysCopy[i];

			if (!requestCallbackMap.has(rck)) {
				requests.push(rc.request);
				cacheResult.cacheMissesKeys.push(rck);
				cacheResult.cacheMisses.push(rc);
				requestCallbackMap.set(rck, []);
			}
			requestCallbackMap.get(rck).push(rc.callback);
		}

		let queries = {
			requests: requests
		};

		debugFetch(`fetch.POST(${queries.requests.length})`, queries);

		fetch(this.urlQueries, {
			method: 'POST',
			headers: this.headers,
			body: JSON.stringify(queries)
		})
			.then((response) => response.json())
			.then((data) => {
				this.fetchCount++;
				for (let i = 0; i < data.results.length; i++) {
					let result = data.results[i];
					normalizeResult(this, result);
					let key = cacheResult.cacheMissesKeys[i];
					if (!key) {
						throw `invalid state: no key set for results ${i}`;
					}
					if (this.cacheEnabled) {
						this.cache.set(key, result);
					}

					requestCallbackMap.get(key).forEach((callback) => {
						callback(result);
					});
				}
			})
			.catch(function(error) {
				console.warn('Algolia query failed:', error);
			});
	}
}

class Searcher {
	constructor(searchConfig, metaProvider, debug = function() {}) {
		this.batcher = new SearchBatcher(searchConfig, metaProvider);
	}

	searchFactories(factories, query) {
		let requestCallbacks = [];
		for (let i = factories.length - 1; i >= 0; i--) {
			let cbf = factories[i];
			if (cbf.status() > RequestCallBackStatus.Off) {
				let requestCallback = cbf.create(query);
				requestCallbacks.push(requestCallback);
			}
			if (cbf.status() !== RequestCallBackStatus.On) {
				debug('remove inactive search factory');
				factories.splice(i, 1);
			}
		}
		debug('factories length:', factories.length);
		this.search(...requestCallbacks);
	}

	search(...requestCallbacks) {
		if (this.batcher.executeCount > 0 && requestCallbacks.length === 1 && requestCallbacks[0].pronto) {
			// This is the user typing, search right away.
			this.batcher.search(...requestCallbacks);
		} else {
			this.batcher.add(...requestCallbacks);
		}
	}

	executeBatch() {
		this.batcher.executeBatch();
	}
}

export function getSearchConfig(params) {
	let cfg = params.search_config;

	cfg.sectionsSorted = Object.values(cfg.sections);
	cfg.sectionsSorted.sort((a, b) => {
		return a.weight < b.weight ? -1 : 1;
	});

	cfg.sectionsSorted.forEach((sectionCfg) => {
		sectionCfg.nounPlural = function(count = 2) {
			let noun = this.noun || this.title;

			if (count === 0 || (count > 1 && !noun.endsWith('s'))) {
				noun += 's';
			}
			return noun;
		};
	});

	return cfg;
}
