'use strict';

//import { debounce } from '../helpers/index';
import { newDispatcher } from './dispatcher';
import { isTopResultsPage } from './filters';

var debug = 0 ? console.log.bind(console, '[search-input]') : function() {};

export function newSearchInputController() {
	var dispatcher = newDispatcher();

	var self = {
		query: null, // The query object received from filters.
		queryString: null, // The query string from input. We start searching when this gets a non-null value.
		focus: false,
		searchOpen: isTopResultsPage()
	};

	self.init = function() {
		debug('init');

		this.$watch('queryString', () => {
			this.dispatch();
			/*var self = this;
			debounce(function() {
				self.dispatch();
			}, 100)();*/
		});
	};

	self.dispatch = function() {
		if (!this.searchOpen) {
			return;
		}
		// It's set to null when the search is closed.
		if (this.queryString != null) {
			dispatcher.applySearchFilters({ filters: { q: this.queryString }, triggerSearch: true });
		}
	};

	self.close = function() {
		this.queryString = null; // Set to null to avoid searching.
		this.searchOpen = false;
		this.setFocus(false);
		dispatcher.searchToggle(false);
	};

	self.onTurbolinksBeforeRender = function(data) {
		this.searchOpen = false;
	};

	self.setFocus = function(focus) {
		this.focus = focus;
	};

	self.click = function() {
		if (!this.searchOpen) {
			this.searchOpen = true;
			if (this.queryString === null) {
				this.queryString = '';
			}
			this.dispatch();
			this.setFocus(true);
		}
	};

	self.hasQuery = function() {
		return this.query !== null && this.query.q;
	};

	self.receiveData = function(data) {
		debug('receiveData', data);
		this.query = data.query;
		if (this.queryString === null) {
			this.queryString = this.query.q;
		}
	};

	return self;
}
