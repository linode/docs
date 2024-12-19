var debug = 0 ? console.log.bind(console, '[file-issue-button]') : function () {};

import { getOffsetTop, isMobile } from '../helpers/helpers';

export function newFileIssueButton(conf) {
	return {
		isHovered: false,
		hoveredEl: null,
		isHoveredButton: false,
		timeoutID: null,

		// The issue items presented to the user.
		items: [],

		show() {
			return this.isHoveredButton || this.isHovered;
		},

		hoverButton() {
			// Prepare the issue items.
			// First clear any existing items.
			this.items.length = 0;

			for (let item of conf.issue_templates) {
				let info = window.lnPageInfo;
				let file = '';
				if (info.path) {
					file = `https://github.com/linode/docs/blob/develop/docs/${info.path}`;
				}
				let context = this.hoveredEl.textContent.trim();
				debug('context:', context);
				let href = `${conf.repo_url}/issues/new?&template=${item.id}&file=${encodeURIComponent(
					file,
				)}&context=${encodeURIComponent(context)}`;
				this.items.push({ title: item.title, href: href });
			}

			// This will show the issue items dropdown.
			this.isHoveredButton = true;
		},

		hoverOn(hoveredEl) {
			if (this.isHovered) {
				debug('hoverOn:', hoveredEl.tagName, 'vs', this.hoveredEl.tagName);

				if (hoveredEl.tagName !== this.hoveredEl.tagName) {
					// Check if we're hovering over the same element or an ancestor.
					if (hoveredEl.contains(this.hoveredEl)) {
						debug('skip');
						return;
					}
				} else {
					if (hoveredEl.tagName == 'TD' || hoveredEl.tagName == 'TH') {
						debug('skip');
						return;
					}
				}
			}
			if (this.isHoveredButton) {
				this.isHoveredButton = false;
			}
			if (this.timeoutID) {
				clearTimeout(this.timeoutID);
			}
			debug('hoverOn:', hoveredEl.tagName);

			if (hoveredEl.tagName === 'PRE') {
				// If the parent is a TD we need to select the second column, the first is line numbers.
				let parent = hoveredEl.parentNode;
				if (parent.tagName === 'TD') {
					hoveredEl = parent.parentNode.parentNode;
					let tds = hoveredEl.querySelectorAll('td');
					// Select last td.
					hoveredEl = tds[tds.length - 1];
				}
			}

			this.isHovered = true;
			this.hoveredEl = hoveredEl;

			let el = this.$el;
			let container = el.parentNode;
			let distance = getOffsetTop(container, hoveredEl);

			// Position el relative to hoveredEl.
			el.style.position = 'absolute';
			el.style.top = distance + 'px';
			el.style.left = '0';
			el.style.zIndex = 5;

			this.timeoutID = setTimeout(() => {
				this.isHovered = false;
			}, 2500);
		},

		init() {
			return this.$nextTick(() => {
				if (isMobile()) {
					return;
				}
				let mainContentEl = document.getElementById('main__content');
				if (!mainContentEl) {
					return;
				}

				mainContentEl.querySelectorAll('.content').forEach((contentEl) => {
					contentEl.addEventListener(
						'mouseover',
						(e) => {
							switch (e.target.tagName) {
								case 'DL':
								case 'LI':
								case 'P':
								case 'PRE':
								case 'TD':
								case 'TH':
									this.hoverOn(e.target);
									break;
								case 'SPAN':
								case 'CODE':
									// Check if we're in a pre block.
									let pre = e.target.closest('pre');
									if (pre) {
										this.hoverOn(pre);
									}
									break;
								case 'DIV':
									// This class is set in the tabs component etc,
									// to avoid getting many false positives on the DIVS.
									let whitelist = ['file-issue-button-content', 'note', 'code'];
									for (let w of whitelist) {
										if (e.target.classList.contains(w)) {
											this.hoverOn(e.target);
											break;
										}
									}
									break;
								default:
									debug('default:', e.target.tagName);
									break;
							}
						},
						{ passive: true },
					);
				});
			});
		},
	};
}
