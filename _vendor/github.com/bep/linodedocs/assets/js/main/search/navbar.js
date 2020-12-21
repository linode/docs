var lnSearchNavbar = {};

(function(ctx) {
	'use strict';

	var debug =
		(typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0
			? console.log.bind(console, '[search-navbar]')
			: function() {};
	ctx.New = function() {
		return {
			filtersOpen: false,
			data: {
				stats: { totalNbHits: 0 }
			},

			receiveData: function(data) {
				debug('receiveData', data.mainSearch.results);
				this.data.stats = data.mainSearch.results.getStats();
			},
			toggleFiltersOpen: function() {
				this.filtersOpen = !this.filtersOpen;
				sendEvent('nav:toggle', { what: 'search-panel__filters', open: this.filtersOpen });
			}
		};
	};
})(lnSearchNavbar);
