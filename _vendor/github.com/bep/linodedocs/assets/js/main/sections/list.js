var lnSectionsController = {};

(function(ctx) {
	'use strict';

	var debug =
		(typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0 ? console.log.bind(console, '[list]') : function() {};

	// The event where we will receive the serch result.
	const EVENT_SEARCHRESULT_FILTERED = 'search:categories-results-filtered';

	const designMode = false;

	ctx.New = function(searchConfig) {
		if (!searchConfig) {
			throw 'lnSectionsController.New: must provide searchConfig';
		}

		const dispatcher = lnSearchEventDispatcher.New();
		const hrefFactory = lnCreateHref.New(searchConfig);

		const searchName = 'section-list';

		function sortObject(obj, less) {
			return Object.keys(obj).sort(less).reduce(function(result, key) {
				result[key] = obj[key];
				return result;
			}, {});
		}

		var sortOptions = [
			{
				title: 'Sort by Category',
				field: '',
				sortSections: true,
				firstText: 'Ascending',
				secondText: 'Descending',
				enabled: true,
				down: false
			},
			{
				title: 'Sort Alphabetically',
				field: 'title',
				firstText: 'Ascending',
				secondText: 'Descending',
				enabled: false,
				down: false
			},
			{
				title: 'Sort by Published date',
				field: 'firstPublishedTime',
				firstText: 'Newest first',
				secondText: 'Oldest first',
				moreIsLess: true,
				enabled: false,
				down: false
			},
			{
				title: 'Sort by Modified date',
				field: 'lastUpdatedTime',
				firstText: 'Newest first',
				secondText: 'Oldest first',
				moreIsLess: true,
				enabled: false,
				down: false
			}
		];

		return {
			uiState: {
				// When togled on we show a list of all descendant guides.
				listGuidesPerSection: false,

				// When togled on we show a list of all the guides in this section.
				// This is enabled for bottom level only
				listGuides: false,

				// Enabled  on first level or when we get to the bottom level.
				noToggleGuidesLink: false,

				sorting: {
					options: sortOptions,
					open: false
				}
			},
			loaded: false, // if data is loaded from Algolia
			status: { ok: true }, // error state
			data: {
				result: {
					hits: []
				},
				page: [],
				meta: {
					title: '',
					excerpt: ''
				},
				key: '',
				sections: [],
				hitsBySection: {},
				sectionMeta: {},
				lvl: 0
			},

			init: function() {
				if (designMode) {
					this.uiState.listGuidesPerSection = true;
					this.uiState.sorting.open = true;
				}

				let parts = hrefFactory.sectionsFromPath();
				if (!parts) {
					return;
				}

				let last = parts[parts.length - 1];
				let indexName = parts[0];
				this.key = parts.join(' > ');
				let sectionConfig = searchConfig.sections.find((s) => s.name === indexName);
				this.data.lvl = parts.length - 1;

				this.request = {
					page: 0,
					indexName: sectionConfig.index,
					facets: [ 'section.*' ],
					filters: `section.lvl${this.data.lvl}:'${this.key}'`
				};

				this.data.sectionConfig = sectionConfig;
				this.data.meta.title = last.charAt(0).toUpperCase() + last.slice(1);

				this.dispatchQuery();

				var self = this;

				this.uiState.sorting.sort = function(opt) {
					this.options.forEach((o) => {
						o.enabled = opt === o;
					});

					if (opt.sortSections) {
						self.data.hitsBySection = sortObject(self.data.hitsBySection, (a, b) => {
							if (opt.down) {
								return a < b ? 1 : -1;
							}
							return a < b ? -1 : 1;
						});
						return;
					}

					self.data.result.hits.sort((a, b) => {
						let f1 = a[opt.field];
						let f2 = b[opt.field];
						if (f1 === f2) {
							return 0;
						}
						if ((opt.moreIsLess && !opt.down) || (!opt.moreIsLess && opt.down)) {
							return f1 < f2 ? 1 : -1;
						}
						return f1 < f2 ? -1 : 1;
					});
				};

				this.uiState.showSectionsTiles = function() {
					if (!self.loaded) {
						return false;
					}
					return !this.listGuidesPerSection && !this.listGuides;
				};
				this.uiState.showGuidesWithSortOption = function() {
					if (!self.loaded) {
						return false;
					}
					return this.listGuidesPerSection && !this.listGuides;
				};
				this.uiState.showGuidesPerSection = function() {
					return this.listGuidesPerSection && (!this.sorting.open || this.sorting.options[0].enabled);
				};
				this.uiState.showSortedGuideList = function() {
					if (!self.loaded) {
						return false;
					}
					return this.listGuidesPerSection && (this.sorting.open && !this.sorting.options[0].enabled);
				};

				this.uiState.showGuidesTiles = function() {
					if (!self.loaded) {
						return false;
					}
					return this.listGuides;
				};
			},

			dispatchQuery: function(hitsPerPage) {
				let opts = {
					// This is used to apply the correct filters.
					sectionConfig: this.data.sectionConfig,
					requests: [ this.request ]
				};
				dispatcher.subscribe(searchName, opts, EVENT_SEARCHRESULT_FILTERED);
			},

			receiveData: function(data) {
				debug('receiveData', data);

				let ns = data.namedSearches.get(searchName);
				if (!ns.results[0]) {
					return;
				}

				this.data.sectionMetaMap = data.metaSearch.results;
				this.data.sectionMeta = this.data.sectionMetaMap.get(this.key);
				if (this.data.sectionMeta) {
					this.data.meta = this.data.sectionMeta;
				}

				this.data.result = ns.results[0];

				if (!this.data.result) {
					return;
				}

				let facets = this.data.result.facets;

				// Sort the hits by section by default
				this.data.result.hits.sort((a, b) => (a.section < b.section ? -1 : 1));

				// The section listing we're interested in is at the next level.
				let nextLevel = this.data.lvl + 1;
				let sectionFacet = facets[`section.lvl${nextLevel}`];
				let hitsBySection = this.data.result.hits.reduce(function(h, hit) {
					h[hit.section] = (h[hit.section] || []).concat(hit);
					return h;
				}, {});

				this.data.hitsBySection = hitsBySection;

				var self = this;
				var assembleSections = function(parts) {
					let sections = [];
					let sectionKeys = [];
					for (let section of parts) {
						sectionKeys.push(section);
						let key = sectionKeys.join(' > ');
						let sm = self.data.sectionMetaMap.get(key);
						if (sm) {
							sections.push(sm);
						}
					}
					return sections;
				};

				this.data.sectionsFromKey = function(key) {
					return assembleSections(key.split(' > '));
				};

				if (this.data.lvl === 0) {
					this.uiState.noToggleGuidesLink = true;
				} else if (!sectionFacet) {
					// Bottom level.
					this.uiState.listGuides = true;
					this.uiState.noToggleGuidesLink = true;
					this.loaded = true;
					return;
				}

				let newSection = function(key) {
					let m = self.data.sectionMetaMap.get(key);
					let s = { key, title: '', thumbnail: '' };
					s.href = hrefFactory.hrefSection(key);

					if (m) {
						s.title = m.title;
						s.thumbnail = m.thumbnail;
					}
					return s;
				};

				this.data.sections = Object.keys(sectionFacet).map((key) => newSection(key));
				this.loaded = true;
			},

			/**
			 * Function triggered when the main search gets updated.
			 * 
			 * @param  {} results
			 */
			searchUpdated: function(results) {
				debug('searchUpdated', results);
				this.dispatchQuery();
			},

			toggleShowGuides: function() {
				let loadGuides = !this.uiState.listGuidesPerSection;
				this.uiState.listGuidesPerSection = !this.uiState.listGuidesPerSection;
				if (loadGuides) {
					this.dispatchQuery();
				}
			}
		};
	};
})(lnSectionsController);
