'use strict';

import { setDocumentMeta } from '../../helpers/index';
import { newCreateHref } from '../../navigation/index';
import { newDispatcher } from '../../search/index';

var debug = 0 ? console.log.bind(console, '[list]') : function() {};

const searchName = 'search:data-categories-filtered';
const designMode = false;

export function newSectionsController(searchConfig) {
	if (!searchConfig) {
		throw 'newSectionsController: must provide searchConfig';
	}

	const dispatcher = newDispatcher();
	const hrefFactory = newCreateHref(searchConfig);

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
		status: { code: 200 }, // error state
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
			lvl: 0
		},

		init: function() {
			if (designMode) {
				this.uiState.listGuidesPerSection = true;
				this.uiState.sorting.open = true;
			}

			let parts = hrefFactory.sectionsFromPath();

			let last = parts[parts.length - 1];
			let indexName = parts[0];
			this.key = parts.join(' > ');
			let sectionConfig = searchConfig.sectionsSorted.find((s) => s.name === indexName);
			if (!sectionConfig) {
				throw `no search config found for section ${indexName}`;
			}
			this.data.lvl = parts.length - 1;

			this.request = {
				page: 0,
				indexName: sectionConfig.index_by_pubdate || sectionConfig.index,
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

		dispatchQuery: function() {
			var currPath = window.location.pathname;
			let opts = {
				// This is used to apply the correct filters.
				sectionConfig: this.data.sectionConfig,
				requests: [ this.request ],

				// Returns whether to cancel this subscription.
				// We get refreshed search results on filter changes,
				// but we don't need these when we're no longer on this page.
				shouldCancel: function() {
					return window.location.pathname !== currPath;
				}
			};
			dispatcher.subscribe(searchName, opts, searchName);
		},

		receiveData: function(data) {
			debug('receiveData', data);

			let ns = data.namedSearches.get(searchName);
			if (!ns) {
				return;
			}

			this.data.result = ns.results[0];
			this.data.sectionMetaMap = data.metaSearch;
			let sectionMeta = this.data.sectionMetaMap.getSectionMeta(this.key);
			if (sectionMeta) {
				this.data.meta = sectionMeta;
			} else {
				if (!(this.data.results && this.data.results.nbHits)) {
					this.status.code = 404;
					this.status.message = 'Page Not Found';
					return;
				}
			}

			this.status.code = 200;

			// Update <head>
			setDocumentMeta({
				title: this.data.meta.title
			});

			let facets = this.data.result.facets;

			// The section listing we're interested in is at the next level.
			let nextLevel = this.data.lvl + 1;
			let sectionFacet = facets[`section.lvl${nextLevel}`];

			if (sectionFacet) {
				// We're not at the bottom level. This will show sort options.
				// Sort the hits by section by default
				this.data.result.hits.sort((a, b) => (a.section < b.section ? -1 : 1));
			}

			let hitsBySection = this.data.result.hits.reduce(function(h, hit) {
				h[hit.section] = (h[hit.section] || []).concat(hit);
				return h;
			}, {});

			this.data.hitsBySection = hitsBySection;

			var self = this;
			var assembleSections = function(parts) {
				let sections = [];
				if (!parts) {
					return sections;
				}
				let sectionKeys = [];
				for (let section of parts) {
					sectionKeys.push(section);
					let key = sectionKeys.join(' > ');
					let sm = self.data.sectionMetaMap.getSectionMeta(key);
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

			let newSection = function(key, value) {
				let m = self.data.sectionMetaMap.getSectionMeta(key);
				let s = { key, title: '', linkTitle: '', thumbnail: '', count: value };
				s.href = hrefFactory.hrefSection(key);

				if (m) {
					s.title = m.title;
					s.linkTitle = m.linkTitle || m.title;
					s.thumbnail = m.thumbnail;
					s.thumbnailInline = m.thumbnailInline || m.thumbnailinline;
				}

				return s;
			};

			this.data.sections = [];
			for (var key in sectionFacet) {
				this.data.sections.push(newSection(key.toLowerCase(), sectionFacet[key]));
			}

			this.loaded = true;
		},

		toggleShowGuides: function() {
			let loadGuides = !this.uiState.listGuidesPerSection;
			this.uiState.listGuidesPerSection = !this.uiState.listGuidesPerSection;
			if (loadGuides) {
				this.dispatchQuery();
			}
		}
	};
}
