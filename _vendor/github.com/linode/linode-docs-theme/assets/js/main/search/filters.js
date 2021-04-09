'use strict';

import { sendEvent } from '../helpers/index';
import { newDispatcher } from './dispatcher';
import { newQuery, QueryHandler } from './query';

var debug = 0 ? console.log.bind(console, '[filters]') : function() {};

export function newSearchFiltersController(searchConfig, opts) {
	var dispatcher = newDispatcher();
	const queryHandler = new QueryHandler(searchConfig.sectionsSorted);

	// The query object received (e.g. from the query string) and
	// passed to the search engine.
	var query = newQuery();

	const applySearchFiltersFromSearchParams = function(self, opts) {
		debug('applySearchFiltersFromSearchParams', opts);

		let newQuery;
		let filters = opts.filters;
		// We can get these search queries from the URL or an event.
		if (typeof filters === 'string') {
			newQuery = queryHandler.queryFromString(filters);
		} else {
			newQuery = queryHandler.queryFromRecord(filters);
		}

		// Preserve e.g. section filtering from UI.
		query.setNonEmptyFrom(newQuery);

		handleQueryUpdate(self, opts.triggerSearch);
	};

	const handleQueryUpdate = function(self, triggerSearch) {
		self.populateFilters();
		self.updateWindowLocation(triggerSearch);
		dispatcher.searchQuery(query);
	};

	var filters = new Map();
	filters.countActive = function() {
		var count = 0;
		this.forEach((filter, facetName) => {
			if (!filter.allChecked) {
				count++;
			}
		});
		return count;
	};

	// The UI state.
	var data = {
		// Maps a facet name to a filter. The filter maps to the owning section.
		filters: filters,

		stats: {
			totalNbHits: 0
		}
	};

	// Holds the state for the tags filters.
	data.tags = {
		open: false,
		searchString: '', // to filter the tags by.
		getFilter: function() {
			return data.filters.get('tags');
		},
		filterBySearchString: function() {
			let tags = this.getFilter();
			if (!tags) {
				return [];
			}
			let checkboxes = tags.checkboxes;
			if (!this.searchString) {
				return checkboxes;
			}

			let searchString = this.searchString.toUpperCase();
			return checkboxes.filter((cb) => cb.title.toUpperCase().includes(searchString));
		}
	};

	return {
		data: data,
		open: false,
		loaded: false,

		init: function() {
			debug('init', this.loaded);
			var self = this;
			return function() {
				self.doInit();
			};
		},

		doInit: function() {
			let queryFromLocation = queryHandler.queryFromLocation();

			if (queryFromLocation._view !== '') {
				// _view is set on the /search query params to distinguish
				// that standalone search from any filtering applied via the
				// search input filters.
				// Nothing more to do here.
				return;
			}

			query = queryFromLocation;

			if (opts.search_on_load) {
				dispatcher.searchQuery(queryFromLocation);
			} else if (query.isAnyFilterSet()) {
				// Broadcast the search filters, but do not execute.
				dispatcher.searchQuery(queryFromLocation, false);
			}
		},

		receiveSearchFilters: function(data) {
			debug('receiveSearchFilters', data);
			let opts = data;
			if (!opts.filters) {
				opts = {
					filters: data,
					triggerSearch: true
				};
			}
			applySearchFiltersFromSearchParams(this, opts);
		},

		receiveData: function(data) {
			this.data.stats = data.mainSearch.results.getStats();
		},

		initData: function(data) {
			if (this.data.loaded) {
				return;
			}
			debug('initData', data);

			let s = data.blankSearch;
			let results = s.results;
			this.data.stats = results.getStats();
			var sectionFilterCheckBoxes = [];
			// Special case.
			this.data.filters.set('sections', {
				isSectionToggle: true,
				title: 'Doc Type',
				name: 'type',
				allChecked: true,
				wasAllChecked: true,
				checkboxes: sectionFilterCheckBoxes
			});

			results.sections.forEach((section) => {
				sectionFilterCheckBoxes.push({
					value: section.config.name,
					title: section.config.title,
					checked: false
				});

				if (!section.config.filtering_facets) {
					return;
				}

				if (!section.searchData.result.facets) {
					return;
				}

				var facets = section.searchData.result.facets;
				section.config.filtering_facets.forEach((facetConfig) => {
					let filter = this.data.filters.get(facetConfig.name);
					let facet = facets[facetConfig.name];
					if (filter) {
						// There are  more than one index sharing the same facet,
						// merge the values.
						filter.sections.push(section.config.name);
						for (let k in facet) {
							let v = facet[k];
							let existing = filter.checkboxes.find((c) => c.value === k);
							if (existing) {
								existing.count += v;
							} else {
								filter.checkboxes.push({ value: k, title: k, count: v, checked: false });
							}
						}
					} else {
						let checkboxes = [];
						for (let k in facet) {
							let v = facet[k];
							checkboxes.push({ value: k, title: k, count: v, checked: false });
						}
						this.data.filters.set(facetConfig.name, {
							hidden: facetConfig.isTags,
							title: facetConfig.title,
							name: facetConfig.name,
							sections: [ section.config.name ],
							allChecked: true,
							wasAllChecked: true,
							checkboxes: checkboxes
						});
					}
				});
			});

			this.populateFilters();
			this.data.loaded = true;
		},

		populateFilters: function() {
			// Get the UI in synch with the search params.
			this.data.filters.forEach((filter, key) => {
				let vals;
				switch (key) {
					case 'sections':
						vals = query.sections;
						break;
					default:
						vals = query.filters.get(key);
				}
				if (vals && vals.length > 0) {
					filter.allChecked = false;
					filter.checkboxes.forEach((e) => {
						e.checked = vals.includes(e.value.toLowerCase());
					});
				} else {
					filter.allChecked = true;
					filter.checkboxes.forEach((e) => {
						e.checked = false;
					});
				}
				filter.wasAllChecked = filter.allChecked;
			});
		},

		applyFilter: function() {
			debug('applyFilter', this.data);
			// Clear filters, preserve q.
			query.sections.length = 0;
			query.filters.clear();

			this.data.filters.forEach((filter, facetName) => {
				// If all checked is pressed
				if (filter.allChecked) {
					for (let cb of filter.checkboxes) {
						if (cb.checked) {
							filter.allChecked = !filter.wasAllChecked;
							if (!filter.allChecked) {
								break;
							}
							cb.checked = false;
						}
					}
				}

				var someChecked = false;
				for (let cb of filter.checkboxes) {
					if (!filter.allChecked && cb.checked) {
						someChecked = true;
						if (filter.isSectionToggle) {
							query.sections.push(cb.value);
						} else {
							query.addFilter(facetName, cb.value);
						}
					}
				}

				filter.allChecked = filter.allChecked || !someChecked;
				filter.wasAllChecked = filter.allChecked;
			});

			this.updateWindowLocation();
			dispatcher.searchQuery(query);
		},

		toggleOpen: function() {
			this.open = !this.open;
			sendEvent('nav:toggle', { what: 'search-panel__filters', open: this.open });
		},

		onTurbolinksRender: function(data) {
			let noQueryStringNeeded =
				!history.replaceState || opts.standaloneSearch || window.location.search || !query.isAnyFilterSet();
			let isTop = isTopResultsPage();

			if (!noQueryStringNeeded) {
				let isSections = window.lnPageInfo && window.lnPageInfo.type === 'sections';
				if (isSections || isTop) {
					// Add the search query filters to the location search so filters gets restored.
					history.replaceState(
						null,
						null,
						window.location.pathname + '?' + queryHandler.queryToQueryString(query)
					);
				}
			}

			if (isTop) {
				// Make sure we show the
				this.doInit();
			}
		},

		searchToggle: function(show) {
			if (!show) {
				// Clear the filters
				query = newQuery();
				handleQueryUpdate(this, false);
				if (this.prevPathname) {
					Turbolinks.visit(this.prevPathname, { action: 'replace' });
				} else {
					// Go home.
					Turbolinks.visit('/docs/');
				}
			}
		},

		onPopState: function(e) {
			let queryFromLocation = queryHandler.queryFromLocation();

			if (queryFromLocation._view !== '') {
				return;
			}

			query = queryFromLocation;
			if (query.isAnyFilterSet()) {
				dispatcher.searchQuery(queryFromLocation);
			}
			if (queryFromLocation.hasFilter()) {
				this.populateFilters();
			}
		},

		updateWindowLocation: function(triggerSearch = true) {
			if (!history.pushState) {
				return;
			}
			let newSearch = !isTopResultsPage();
			// TODO check triggerSearch usage (suspect it's always true)
			if (!triggerSearch && newSearch) {
				let href = window.location.pathname;
				if (query.isAnyFilterSet() && query.q !== '') {
					href += '?' + queryHandler.queryToQueryString(query);
				}
				history.replaceState(null, null, href);
			} else {
				let queryString = queryHandler.queryToQueryString(query);
				if (newSearch) {
					this.prevPathname = window.location.pathname;
					history.pushState(null, null, '/docs/topresults/?' + queryString);
				} else {
					history.replaceState(null, null, '/docs/topresults/?' + queryString);
				}
			}
		}
	};
}

export function isTopResultsPage() {
	return window.location.href.includes('topresults');
}
