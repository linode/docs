'use strict';

import { getIntParamFromLocation, updatePaginationParamInLocation } from '../helpers/index';

var debug = 0 ? console.log.bind(console, '[paginator]') : function () {};

export function newPaginatorController() {
	const scrollToTop = () => {
		window.scrollTo(0, 0);
	};

	const pageKey = 'page';

	return {
		pages: [],
		items: [],
		page: 1,
		showAll: false,

		// Page navigation.
		current() {
			if (this.showAll) {
				return this.items;
			}
			return this.pages[this.currentPage() - 1];
		},
		currentPage() {
			return parseInt(this.page, 10);
		},
		first() {
			this.page = 1;
			scrollToTop();
		},
		last() {
			this.page = this.pages.length;
			scrollToTop();
		},
		next() {
			if (this.page < this.pages.length) {
				this.page++;
			}
			scrollToTop();
		},
		prev() {
			if (this.page > 0) {
				this.page--;
			}
			scrollToTop();
		},
		toggleAll() {
			this.showAll = !this.showAll;
			this.page = this.showAll ? -1 : 1;
			scrollToTop();
		},
		statusText() {
			if (this.showAll) {
				return 'All Pages';
			}
			let current = this.currentPage();
			let total = this.pages.length;
			return `Page ${current} of ${total}`;
		},

		async initPaginator(url, pageSize) {
			this.page = getIntParamFromLocation(pageKey);

			this.$watch('page', (page) => {
				updatePaginationParamInLocation(pageKey, page);
			});

			let data = await fetch(url);
			let items = await data.json();

			// Split the items into pages.
			let pages = [];
			let page = [];
			for (let i = 0; i < items.length; i++) {
				page.push(items[i]);
				if (page.length >= pageSize) {
					pages.push(page);
					page = [];
				}
			}
			if (page.length > 0) {
				pages.push(page);
			}
			this.pages = pages;
			this.items = items;

			if (this.page < 0) {
				this.showAll = true;
			} else if (this.page < 1 || this.page > this.pages.length) {
				this.page = 1;
			}
		},
	};
}
