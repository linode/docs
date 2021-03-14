'use strict';

var debug = 0 ? console.log.bind(console, '[navbar]') : function() {};

// TODO(bep) remove?
export function newNavbarController() {
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
}
