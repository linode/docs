var lnSearchFilters = {};

(function(ctx) {
	'use strict';

	var debug =
		(typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0 ? console.log.bind(console, '[filters]') : function() {};

	ctx.New = function() {
		var dispatcher = lnSearchEventDispatcher.New();

		const applySearchFiltersFromLocation = function(self) {
			let params = new URLSearchParams(window.location.hash.slice(1));
			let hasSearchParam = false;
			params.forEach((paramVal, paramKey) => {
				let filter = self.data.filters.get(paramKey);
				if (!filter) {
					return;
				}

				hasSearchParam = true;

				let vals = paramVal.split(',');

				filter.checkboxes.forEach((e) => {
					// TODO(bep) the tags checkboxes are hidden, so there is currently no
					// way to turn them off. So do this here for now.
					if (paramKey === 'tags') {
						e.checked = false;
					}
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

		return {
			data: {
				// Maps a facet name to a filter. The filter maps to the owning section.
				filters: filters,

				stats: {
					totalNbHits: 0
				}
			},

			open: false,

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
								sections: [ section.config.name ],
								allChecked: true,
								wasAllChecked: true,
								checkboxes: checkboxes
							});
						}
					});
				});

				debug('receiveData', this.data);
			},

			applyFilter: function(triggerSearch = false) {
				debug('applyFilter', this.data.filters);

				let m = new Map();
				m.triggerSearch = triggerSearch;

				var self = this;

				this.data.filters.forEach((filter, facetName) => {
					let filters = new Set();

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
								filters.add(`${facetName}:${cb.value}`);
							}
						}
					}

					filter.allChecked = filter.allChecked || !someChecked;
					filter.wasAllChecked = filter.allChecked;

					if (!filter.isSectionToggle && filters.size > 0) {
						filter.sections.forEach((section) => {
							let f = m.get(section);
							if (f) {
								filters.forEach((filter) => {
									f.add(filter);
								});
							} else {
								m.set(section, filters);
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

			onHashchange: function() {
				debug('onHashchange');
				applySearchFiltersFromLocation(this);
			},

			toggleOpen: function() {
				this.open = !this.open;
				sendEvent('nav:toggle', { what: 'search-panel__filters', open: this.open });
			}
		};
	};
})(lnSearchFilters);
