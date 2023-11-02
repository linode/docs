'use strict';

import { isMobile } from '../helpers';

var debug = 0 ? console.log.bind(console, '[svg-viewer]') : function () {};

const getTransformParameters = (element) => {
	const transform = element.style.transform;
	let scale = 1,
		j;
	(x = 0), (y = 0);
	if (transform.includes('scale')) scale = parseFloat(transform.slice(transform.indexOf('scale') + 6));
	if (transform.includes('translateX')) x = parseInt(transform.slice(transform.indexOf('translateX') + 11));
	if (transform.includes('translateY')) y = parseInt(transform.slice(transform.indexOf('translateY') + 11));
	return { scale, x, y };
};

const animationClass = 'diagram-animate';

const getTransformString = (scale, x, y) => 'scale(' + scale + ') ' + 'translateX(' + x + 'px) translateY(' + y + 'px)';

const maxZoom = 7;
const minZoom = 0.75;

class SvgViewer {
	constructor(container, el) {
		this.el = el;
		this.container = container;

		this.dragState = {
			dragging: false,
			lastX: 0,
			lastY: 0,
		};

		this.zoomState = {
			zooming: false,
		};
	}

	zoom(dscale) {
		let svg = this.el;
		const { scale, x, y } = getTransformParameters(svg);

		let newScale = scale + dscale;

		if (newScale > maxZoom || newScale < minZoom) {
			return;
		}

		svg.style.transform = getTransformString(newScale, x, y);
	}

	panDirection(direction) {
		let dx = 0,
			dy = 0;

		const speed = 30;

		switch (direction) {
			case 'left':
				dx = speed;
				break;
			case 'right':
				dx = -speed;
				break;
			case 'up':
				dy = speed;
				break;
			case 'down':
				dy = -speed;
				break;
		}

		let svg = this.el;
		const { scale, x, y } = getTransformParameters(svg);
		svg.style.transform = getTransformString(scale, x + dx, y + dy);
	}

	pan(clientX, clientY) {
		if (!this.dragState.dragging) {
			return;
		}
		let svg = this.el;
		const { scale, x, y } = getTransformParameters(svg);

		let dx = clientX - this.dragState.lastX;
		let dy = clientY - this.dragState.lastY;

		this.dragState.lastX = clientX;
		this.dragState.lastY = clientY;

		svg.style.transform = getTransformString(scale, x + dx, y + dy);
	}

	activate() {
		if (this.active) {
			return;
		}
		this.active = true;
		this.el.classList.remove(animationClass);
		// This is hard to get right on small screens, so let them use the buttons.
		if (!isMobile()) {
			// Zooming.
			this.container.addEventListener('wheel', (e) => {
				e.preventDefault();
				let scale = e.deltaY < 0 ? 0.1 : -0.1;
				this.zoom(scale);
			});

			this.el.addEventListener(
				'mousedown',
				(e) => {
					this.dragState.dragging = true;
					this.dragState.lastX = e.clientX;
					this.dragState.lastY = e.clientY;
				},
				{ passive: true }
			);

			document.addEventListener(
				'mousemove',
				(e) => {
					this.pan(e.clientX, e.clientY);
				},
				{ passive: true }
			);

			document.addEventListener(
				'mouseup',
				(e) => {
					this.dragState.dragging = false;
				},
				{ passive: true }
			);
		}
	}
}

export function newSVGViewerController(opts) {
	let { diagramDescriptionID } = opts;
	let diagramDescriptionEl = document.getElementById(diagramDescriptionID);

	return {
		svgViewer: null,
		tooltip: {
			show: false,
			content: '',
			style: '',
		},
		activate() {
			this.svgViewer.activate();
		},
		zoom(n) {
			this.svgViewer.zoom(n / 3);
		},
		pan(direction) {
			this.svgViewer.panDirection(direction);
		},
		init: function () {
			this.$nextTick(() => {
				let container = this.$el;
				let svg = this.$el.querySelector('.large-diagram-svg-container');

				if (!isMobile()) {
					let bullets = svg.querySelectorAll('.bullet');
					let bulletsArray = Array.from(bullets);
					bulletsArray.forEach((bullet) => {
						bullet.addEventListener('mouseleave', () => {
							this.tooltip.show = false;
						});
						bullet.addEventListener('mouseover', (e) => {
							if (this.tooltip.show) {
								return;
							}
							let l1 = 0;
							let l2 = 0;
							let classNames = bullet.classList;
							classNames.forEach((className) => {
								if (className.match(/bullet-\d/)) {
									let parts = className.split('-');
									// This is either on the form bullet-1 or bullet-1-1.
									// bullet-1-1 matches the first bullet first sub bullet.
									// bullet-1 matches the first bullet and so on.
									if (parts.length === 2) {
										l1 = parseInt(parts[1]);
									} else if (parts.length === 3) {
										l1 = parseInt(parts[1]);
										l2 = parseInt(parts[2]);
									}
								}
							});
							if (l1 > 0) {
								// Find the nth li in the diagram description.
								let diagramDescriptionList = diagramDescriptionEl.querySelectorAll('li');
								let diagramDescriptionListArray = Array.from(diagramDescriptionList);
								let idx = l1 - 1;
								if (idx >= 0 && idx < diagramDescriptionListArray.length) {
									let targetLi = diagramDescriptionListArray[idx];
									if (l2 > 0) {
										let subListItems = targetLi.querySelectorAll('li');
										if (subListItems) {
											let subListItemsArray = Array.from(subListItems);
											let subIdx = l2 - 1;
											if (subIdx >= 0 && subIdx < subListItemsArray.length) {
												targetLi = subListItemsArray[subIdx];
											}
										}
									}
									let clone = targetLi.cloneNode(true);
									// Remove nested OLs.
									let nestedLists = clone.querySelectorAll('ol');
									nestedLists.forEach((nestedList) => {
										nestedList.parentNode.removeChild(nestedList);
									});
									// Add the targetLi content to the tooltip.
									this.tooltip.content = clone.innerHTML;
									if (l2 > 0) {
										this.tooltip.number = `${l1}${numberToLowerAlpha(l2)}`;
									} else {
										this.tooltip.number = l1;
									}

									let x = e.clientX,
										y = e.clientY;

									this.tooltip.style = `top: ${y - 50}px; left: ${x + 50}px;`;
									// Show the tooltip.
									this.tooltip.show = true;
								}
							}
						});
					});
				}

				this.svgViewer = new SvgViewer(container, svg);
			});
		},
	};
}

function numberToLowerAlpha(n) {
	let a = 'a'.charCodeAt(0);
	return String.fromCharCode(a + n - 1);
}
