'use strict';

var debug = 0 ? console.log.bind(console, '[paginator]') : function () {};

export function newPaginatorController() {
	const scrollToTop = () => {
		window.scrollTo(0, 0);
	};

	const pageKey = 'page';

	const updateLocation = (page) => {
		let url = new URL(window.location);
		url.hash = '';
		if (page == 1) {
			url.searchParams.delete(pageKey);
		} else {
			url.searchParams.set(pageKey, page);
		}
		window.history.replaceState({ turbo: {} }, '', url);
	};

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
			let loc = new URL(window.location);
			let currentPageString = loc.searchParams.get(pageKey);
			if (currentPageString) {
				this.page = parseInt(currentPageString, 10);
			}

			this.$watch('page', (page) => {
				updateLocation(page);
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
