var lnSearchFilters = {};

(function(ctx) {
	'use strict';

	var debug =
		(typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0 ? console.log.bind(console, '[filters]') : function() {};

	ctx.New = function() {
		var dispatcher = lnSearchEventDispatcher.New();

		const applySearchFiltersFromSearchParams = function(self, searchParams) {
			let params = new URLSearchParams(searchParams);
			let hasSearchParam = false;

			params.forEach((paramVal, paramKey) => {
				let filter = self.data.filters.get(paramKey);
				if (!filter) {
					return;
				}

				hasSearchParam = true;

				let vals = paramVal.split(',');

				filter.checkboxes.forEach((e) => {
					if (vals.includes(e.value.toLowerCase())) {
						e.checked = true;
						filter.allChecked = false;
					}
				});
			});

			if (hasSearchParam) {
				self.applyFilter(true);
			}
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

			receiveSearchFilters: function(data) {
				debug('receiveSearchFilters', data);
				if (!this.data.loaded) {
					dispatcher.searchBlank();
					this.$nextTick(() => {
						applySearchFiltersFromSearchParams(this, data);
					});
				} else {
					applySearchFiltersFromSearchParams(this, data);
				}
			},

			receiveData: function(data) {
				debug('receiveData', data.mainSearch.results);
				this.data.stats = data.mainSearch.results.getStats();
			},

			initData: function(data) {
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
								name: facetConfig.title,
								sections: [ section.config.name ],
								allChecked: true,
								wasAllChecked: true,
								checkboxes: checkboxes
							});
						}
					});
				});

				this.data.loaded = true;
				debug('receiveData', this.data);
			},

			applyFilter: function(triggerSearch = true) {
				debug('applyFilter', this.data.filters);

				let m = new Map();
				m.triggerSearch = triggerSearch;

				this.data.filters.forEach((filter, facetName) => {
					let filters = filter.isSectionToggle ? new Set() : [];

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
								filters.add(cb.value);
							} else {
								filters.push(`${facetName}:${cb.value}`);
							}
						}
					}

					filter.allChecked = filter.allChecked || !someChecked;
					filter.wasAllChecked = filter.allChecked;

					if (!filter.isSectionToggle && filters.length > 0) {
						filter.sections.forEach((section) => {
							let f = m.get(section);
							if (f) {
								f.push(filters);
							} else {
								m.set(section, [ filters ]);
							}
						});
					} else if (filter.isSectionToggle) {
						m.set('sectionToggle', filters);
					}
				});

				let sectionToggle = m.get('sectionToggle') || new Set();
				m.isSectionEnabled = function(section) {
					return sectionToggle.size == 0 || sectionToggle.has(section);
				};

				dispatcher.applyFacetFilters(m);
			},

			toggleOpen: function() {
				this.open = !this.open;
				sendEvent('nav:toggle', { what: 'search-panel__filters', open: this.open });
			}
		};
	};
})(lnSearchFilters);
