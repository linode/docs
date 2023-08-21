'use strict';

import { isDesktop, isMobile } from '../helpers/index';

var debug = 0 ? console.log.bind(console, '[toc]') : function () {};
var devMode = false;

const setProgress = function (self, el) {
	let mainEl = document.querySelector('#main__content');
	let mainHeight = mainEl.offsetHeight;
	let mainStart = mainEl.offsetTop;
	let progress = Math.round(((el.offsetTop - mainStart) / mainHeight) * 100);
	self.activeHeading.title = el.innerText;
	self.activeHeading.progress = progress;
};

export function newToCController(
	opts = {
		level2Only: false,
		setProgress: true,
		desktopOnly: false,
	}
) {
	return {
		activeHeading: {
			title: '',
			progress: 0,
		},
		enabled: false,
		showHeading: true,
		opts: opts,
		isActive: function () {
			if (this.opts.desktopOnly && !isDesktop()) {
				return false;
			}
			return true;
		},
		initToC: function () {
			let { level2Only } = this.opts;
			if (level2Only) {
				this.headerEls = () => document.querySelectorAll('#main__content h2');
			} else {
				this.headerEls = () => document.querySelectorAll('#main__content h2, #main__content h3');
			}

			this.createTOC();
			if (devMode) {
				this.$store.nav.open.toc = true;
			}

			this.$nextTick(() => {
				this.createTOC();
			});
		},
		createTOC: function () {
			let self = this;
			self.activeHeading.title = '';
			let ol = this.$refs.ol;
			let olFragment = document.createDocumentFragment();
			let row = [];
			let prevLevel = 0;

			this.headerEls().forEach((el) => {
				if (el.hasAttribute('data-toc-ignore')) {
					return;
				}
				// Skip hidden elements and headers without ID.
				if (!el || el.offsetParent === null || !el.id) {
					return;
				}
				self.enabled = true;
				let id = el.id;
				let level = parseInt(el.nodeName.substring(1), 10);

				// We need to start out with a level 2 header for the logic
				// below to work.
				if (prevLevel === 0 && level != 2) {
					return;
				}

				let li = document.createElement('li');

				li.classList.add(`level-${level}`);

				let a = document.createElement('a');

				a.setAttribute('href', `#${id}`);
				a.addEventListener('click', (e) => {
					const { href } = e.target;
					const targetUrl = new URL(href);
					let heading = document.getElementById(targetUrl.hash.substring(1));
					self.closeIfMobile();
					if (heading) {
						e.preventDefault();
						// 24 px whitespace
						// + 56 px for pinned topbar
						// OR
						// + 97 px for unpinned topbar
						let spaceAbove = 24 + (document.body.classList.contains('is-topbar-pinned') ? 56 : 97);
						window.scrollTo({
							left: 0,
							top: heading.offsetTop - spaceAbove,
							behavior: 'smooth',
						});
						// We want the smooth scroll AND the hash to be updated -- without triggering any hashchange event.
						if (history.pushState) {
							history.pushState(null, null, targetUrl.hash);
						}
					}
				});
				if (a.attributes.href.value === window.location.hash) {
					li.classList.add('active');
					setProgress(self, el);
				}
				a.innerHTML = el.innerText;

				li.appendChild(a);

				if (level == 2) {
					row.length = 0;
					row.push(olFragment);
					olFragment.appendChild(li);
				} else if (level === prevLevel) {
					let ol = row[row.length - 1];
					ol.appendChild(li);
				} else if (level > prevLevel) {
					let ol = document.createElement('ol');
					let li2 = row[row.length - 1].lastChild;
					li2.appendChild(ol);
					ol.appendChild(li);
					row.push(ol);
				} else if (level < prevLevel) {
					let diff = prevLevel - level;
					row.length = row.length - diff;
					let ol = row[row.length - 1];
					ol.appendChild(li);
				}
				prevLevel = level;
			});

			if (!this.enabled) {
				this.$store.nav.open.toc = false;
				return;
			}

			// On mobile, add close/open to h2 headers with descendants.
			if (isMobile() && this.$refs.headerCloseButton) {
				olFragment.querySelectorAll('.level-2').forEach((li) => {
					if (li.querySelector('li') !== null) {
						li.setAttribute('x-data', '{ open: false }');
						let ol = li.querySelector('ol');
						ol.setAttribute('x-show', 'open');
						ol.setAttribute('x-transition', '');
						let closeEl = document.importNode(this.$refs.headerCloseButton.content.querySelector('button'), true);
						li.appendChild(closeEl);
					}
				});
			}
			ol.replaceChildren(olFragment);
		},
		toggleOpen: function () {
			this.$store.nav.open.toc = !this.$store.nav.open.toc;
		},
		close: function () {
			if (this.$store.nav.open.toc) {
				this.$store.nav.open.toc = false;
			}
		},
		closeIfMobile: function () {
			if (isMobile()) {
				this.close();
			}
		},
		onHashchange: function () {
			let id = document.location.hash.slice(1);
			let self = this;
			this.headerEls().forEach((el) => {
				if (el.id === id) {
					setProgress(self, el);
				}
			});
		},
		onScroll: function () {
			if (!this.enabled) {
				return;
			}
			if (!this.isActive()) {
				return;
			}
			let scrollpos = window.scrollY;
			let self = this;
			document.activeElement.blur();

			this.headerEls().forEach((el) => {
				let offset = el.offsetTop;

				if (offset > scrollpos && offset < scrollpos + 200) {
					let ol = this.$refs.ol;
					ol.querySelectorAll('li').forEach((liEl) => {
						let a = liEl.querySelector('a');
						if (!a.attributes || !a.attributes.href) {
							return;
						}
						let hash = `#${el.id}`;

						if (a.attributes.href.value === hash) {
							liEl.classList.add('active');
						} else {
							liEl.classList.remove('active');
						}
					});
					setProgress(self, el);
				}

				if (window.innerHeight + scrollpos >= document.body.offsetHeight) {
					this.activeHeading.progress = 100;
				}
			});
		},
	};
}
