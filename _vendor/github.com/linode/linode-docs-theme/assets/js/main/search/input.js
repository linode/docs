'use strict';

var debug = 0 ? console.log.bind(console, '[search-input]') : function() {};

export function newSearchInputController() {
	return {
		focus: false,
		click: function() {
			this.$store.nav.openSearchPanel();
		},
		setFocus: function(focus) {
			this.focus = focus;
		},
		close: function() {
			this.$store.nav.searchResults = { open: false, userChange: true };
		}
	};
}
