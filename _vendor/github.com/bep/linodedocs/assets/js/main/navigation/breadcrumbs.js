var lnBreadcrumbs = {};

(function(ctx) {
	'use strict';

	var debug =
		(typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0 ? console.log.bind(console, '[breadcrumbs]') : function() {};

	ctx.New = function(searchConfig) {
		if (!searchConfig) {
			throw 'lnBreadcrumbs.New: must provide searchConfig';
		}

		const hrefFactory = lnCreateHref.New(searchConfig);
		const dispatcher = lnSearchEventDispatcher.New();

		return {
			data: {
				sections: null,
				breadcrumbs: []
			},

			loaded: false,

			receiveData: function(data) {
				debug('receiveData', this.loaded, this.data);
				if (this.loaded) {
					return;
				}
				this.loaded = true;
				this.data.sections = data.metaSearch.results;
				this.createBreadcrumbs();
			},

			init: function(page) {
				debug('init', page);
				this.$nextTick(() => {
					dispatcher.searchBlank();
				});
				this.page = page;
			},

			createBreadcrumbs: function() {
				debug('createBreadcrumbs', this.page);
				if (this.page.isStatic && this.page.sectionsEntries) {
					let parts = this.page.sectionsEntries;
					let isDocs = parts[0] !== 'products' && parts[0] !== 'api';
					if (isDocs) {
						parts.unshift('docs');
					}
					let sections = this.assembleSections(parts);
					if (!isDocs) {
						sections.pop();
					}
					sections.push(this.page);
					this.data.breadcrumbs = sections;
					debug('route', parts, this.data.breadcrumbs);
					return;
				}

				let parts = hrefFactory.sectionsFromPath();
				if (!parts) {
					return;
				}
				this.data.breadcrumbs = this.assembleSections(parts);
			},

			assembleSections: function(parts) {
				let sections = [];
				let sectionKeys = [];
				for (let section of parts) {
					sectionKeys.push(section);
					let key = sectionKeys.join(' > ');
					let sm = this.data.sections.get(key);
					if (sm) {
						sections.push(sm);
					}
				}
				return sections;
			}
		};
	};
})(lnBreadcrumbs);
