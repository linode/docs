var lnTocController = {};

(function(ctx) {
	'use strict';

	var debug = (typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0 ? console.log.bind(console, '[toc]') : function() {};

	const setOpenStatus = function(self, open) {
		debug('setOpenStatus', open);
		self.open = open;
		self.$nextTick(() => {
			sendEvent('nav:toggle', { what: 'toc', open: self.open });
		});
	};

	const headerEls = () => document.querySelectorAll('.main__content h2, .main__content h3, .main__content h4');

	const setProgress = function(self, el) {
		let mainEl = document.querySelector('.main__content');
		let mainHeight = mainEl.offsetHeight;
		let mainStart = mainEl.offsetTop;
		let progress = Math.round((el.offsetTop - mainStart) / mainHeight * 100);
		self.activeHeading.title = el.innerText;
		self.activeHeading.progress = progress;
	};

	ctx.New = function() {
		return {
			activeHeading: {
				title: '',
				progress: 0
			},
			open: false,
			enabled: false,
			showHeading: true,
			initData: {},
			init: function(initData) {
				this.initData = initData;
				this.createTOC();
			},
			createTOC: function() {
				var self = this;
				self.activeHeading.title = '';
				var nav = this.$el.querySelector('.toc__inner');
				nav.innerHTML = '';
				var ol = document.createElement('ol');
				var row = [];

				headerEls().forEach((el) => {
					// Skip hidden elements and headers without ID.
					if (!el || el.offsetParent === null || !el.id) {
						return;
					}
					self.enabled = true;
					let id = el.id;
					let level = parseInt(el.nodeName.substring(1), 10);

					var li = document.createElement('li');

					li.classList.add(`level-${level}`);
					li.classList.add('truncate');

					var a = document.createElement('a');

					a.setAttribute('href', `#${id}`);
					a.addEventListener('click', (e) => {
						const { href } = e.target;
						const targetUrl = new URL(href);
						let heading = document.getElementById(targetUrl.hash.substring(1));
						self.closeIfMobile();
						if (heading) {
							e.preventDefault();
							window.scrollTo({
								left: 0,
								top: heading.offsetTop - 80,
								behavior: 'smooth'
							});
						}
					});
					if (a.attributes.href.value === window.location.hash) {
						li.classList.add('active');
						setProgress(self, el);
					}
					a.innerHTML = el.innerText;

					let wrapper = document.createElement('span');
					wrapper.appendChild(a);
					let span = document.createElement('span');
					a.appendChild(span);
					li.appendChild(wrapper);

					if (level == 2) {
						let ol2 = document.createElement('ol');
						li.appendChild(ol2);
						row.length = 0;
						row.push(ol2);
						ol.appendChild(li);
					} else if (row.length > 0) {
						// Attach it to the closest parent.
						let relativeLevel = level - 2;
						let rowIdx = Math.min(relativeLevel - 1, row.length - 1);
						if (row.length <= relativeLevel) {
							let ol2 = document.createElement('ol');
							li.appendChild(ol2);
							row.push(ol2);
						}
						let ol3 = row[rowIdx];
						ol3.appendChild(li);
					}
				});
				if (!this.enabled) {
					toggleBooleanClass('toc', document.body, false);
					return;
				}

				// On mobile, add close/open to h2 headers with descendants.
				if (isMobile()) {
					ol.querySelectorAll('.level-2').forEach((li) => {
						if (li.querySelector('li') !== null) {
							li.setAttribute('x-data', '{ open: false }');
							let wrapper = li.querySelector('span');
							let ol = li.querySelector('ol');
							ol.setAttribute('x-show.transition', 'open');
							let closeEl = document.importNode(
								this.initData.headerCloseButton.content.querySelector('button'),
								true
							);
							wrapper.appendChild(closeEl);
						}
					});
				}
				nav.appendChild(ol);
			},
			toggleOpen: function() {
				setOpenStatus(this, !this.open);
			},
			close: function() {
				if (this.open) {
					setOpenStatus(this, false);
				}
			},
			closeIfMobile: function() {
				if (isMobile()) {
					this.close();
				}
			},
			receiveToggle: function(detail) {
				debug('receiveToggle', detail);
				switch (detail.what) {
					case 'search-input':
						this.showHeading = !detail.open;
						if (detail.open) {
							setOpenStatus(this, false);
						}
						break;
					case 'toc':
						this.open = detail.open;
						break;
					default:
					// Ignore
				}
			},
			onTurbolinksRender: function(data) {
				// Rebuild ToC if needed.
				this.createTOC();
			},
			onHashchange: function() {
				let id = document.location.hash.slice(1);
				let self = this;
				headerEls().forEach((el) => {
					if (el.id === id) {
						setProgress(self, el);
					}
				});
			},
			onScroll: function() {
				if (!this.enabled) {
					return;
				}
				let scrollpos = window.scrollY;
				var self = this;

				headerEls().forEach((el) => {
					let offset = el.offsetTop;

					if (offset > scrollpos && offset < scrollpos + 200) {
						var toc = self.$el.querySelector('.toc__inner');
						toc.querySelectorAll('li').forEach((liEl) => {
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
			}
		};
	};
})(lnTocController);
