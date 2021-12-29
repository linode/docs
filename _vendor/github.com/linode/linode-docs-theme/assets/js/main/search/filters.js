'use strict';

import { toggleBooleanClass } from '../helpers';
import { QueryHandler } from './query';

var debug = 0 ? console.log.bind(console, '[filters]') : function() {};

export function newSearchFiltersController(searchConfig, queryCallback = function(action) {}) {
	const queryHandler = new QueryHandler();

	var ctrl = {
		// The 3 search views.
		view: 1,

		filters: {
			open: false, // Used on mobile to open/close the filter panel.
			loaded: false
		}
	};

	// The UI state.
	ctrl.filters.data = {
		// Maps a facet name to a filter. The filter maps to the owning section.
		filters: new Map(),

		filtersarr: function() {
			return Array.from(this.filters).map(([ name, value ]) => value).filter((value) => {
				return !value.hidden;
			});
		},

		countActive: function() {
			var count = 0;
			this.filters.forEach((filter, facetName) => {
				if (!filter.allChecked) {
					count++;
				}
			});
			return count;
		},

		// Holds the state for the tags filters.
		tags: {
			open: false,
			searchString: '', // to filter the tags by.
			filter: [],
			filterBySearchString: function() {
				let tags = this.filter;
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
		}
	};

	// Navigation.
	ctrl.incrPage = function(num) {
		let query = this.getQ();
		query.p += num;
		if (query.p < 0) {
			query.p = 0;
		}
		this.$store.nav.scrollToNavBarIfPinned();
	};

	ctrl.getQ = function() {
		return this.$store.search.query;
	};

	ctrl.init = function() {
		debug('init()');
		this.$nextTick(() => {
			if (this.$store.search.results.blank.loaded) {
				this.initData(this.$store.search.results.blank.result);
			}

			this.$watch('filters.open', (value) => {
				toggleBooleanClass('search-panel_filters-open', document.body, value);
				if (!this.filters.loaded) {
					this.$store.search.withBlank();
				}
			});
			this.$watch('$store.search.results.blank.result', (value) => {
				debug('blank result');
				this.initData(value);
			});

			this.$watch('$store.search.results.main.result', (value) => {
				debug('main result');
				this.updateData(value);
				this.populateFilters();
			});

			this.$watch('$store.nav.searchResults', (value) => {
				if (value.open || !value.userChange) {
					return;
				}

				// User has closed the search input, clear all filters.
				this.filters.data.filters.forEach((filter, key) => {
					filter.allChecked = true;
					filter.checkboxes.forEach((e) => {
						e.checked = false;
					});
				});
			});
		});
	};

	ctrl.updateData = function(result) {
		debug('updateData', result, this.filters.loaded);
		if (!this.filters.loaded) {
			return;
		}

		var facets = result.facetsMeta;
		if (!facets) {
			return;
		}

		searchConfig.sections_merged.filtering_facets.forEach((facetConfig) => {
			let facet = facets[facetConfig.name];

			let filters = this.filters.data.filters.get(facetConfig.name);
			if (!filters) {
				return;
			}

			for (cb of filters.checkboxes) {
				let count = 0;
				if (facet) {
					let facetv = facet[cb.value];
					if (facetv) {
						count = facetv.count | facetv;
					}
				}
				cb.count = count;
			}
		});
	};

	ctrl.initData = function(result) {
		if (this.filters.loaded) {
			return;
		}
		debug('initData', result);

		this.filters.data.stats = result.stats;

		if (!result.facetsMeta) {
			return;
		}

		var facets = result.facetsMeta;

		searchConfig.sections_merged.filtering_facets.forEach((facetConfig) => {
			let facet = facets[facetConfig.name];

			let checkboxes = [];
			for (let k in facet) {
				let v = facet[k];
				let count = v.count || v;
				let title = v.meta ? v.meta.linkTitle : k;
				let ordinal = v.meta ? v.meta.ordinal : 0;
				checkboxes.push({ value: k, title: title, count: count, checked: false, ordinal: ordinal });
			}

			checkboxes.sort((a, b) => {
				if (a.ordinal === b.ordinal) {
					return a.title < b.title ? -1 : 1;
				}

				return a.ordinal === 0 ? 1 : a.ordinal - b.ordinal;
			});

			this.filters.data.filters.set(facetConfig.name, {
				hidden: facetConfig.isTags,
				title: facetConfig.title,
				name: facetConfig.name,
				allChecked: true,
				wasAllChecked: true,
				checkboxes: checkboxes
			});
		});

		this.populateFilters();
		debug('filters loaded:', this.filters.data.filters);
		this.filters.loaded = true;
	};

	ctrl.populateFilters = function() {
		if (this.filters.loaded) {
			return;
		}
		debug('populateFilters');
		// Get the UI in synch with the search params.
		let query = this.getQ();
		this.filters.data.filters.forEach((filter, key) => {
			let vals = query.filters.get(key);
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

		this.filters.data.tags.filter = this.filters.data.filters.get('tags');
	};

	// apply applies the current UI filters. This is invoked on any change.
	ctrl.apply = function() {
		debug('apply');
		let query = this.getQ();
		// Clear filters, preserve q.
		query.filters.clear();
		query.p = 0;

		this.filters.data.filters.forEach((filter, facetName) => {
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
					query.addFilter(facetName, cb.value);
				}
			}

			filter.allChecked = filter.allChecked || !someChecked;
			filter.wasAllChecked = filter.allChecked;
		});
	};

	return ctrl;
}

export function isTopResultsPage() {
	return window.location.href.includes('topresults');
}
