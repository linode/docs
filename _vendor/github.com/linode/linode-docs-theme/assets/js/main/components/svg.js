'use strict';

var debug = 0 ? console.log.bind(console, '[svg]') : function() {};

export function alpineRegisterDirectiveSVG(Alpine) {
	Alpine.directive('svg', (el, { expression }, { effect, cleanup, evaluateLater }) => {
		let evaluate = evaluateLater(expression);

		effect(() => {
			evaluate((src) => {
				if (!src) {
					return '';
				}

				if (src.includes('<svg')) {
					// Already inlined.
					replaceIn(el, src);
					return;
				}

				if (src.startsWith('http')) {
					createImgEl(el, src);
					return;
				}

				if (!src.endsWith('svg')) {
					replaceIn(el, '');
					return;
				}

				fetch(src)
					.then((response) => response.text())
					.then((response) => {
						const str = response;

						if (str.indexOf('svg') === -1) {
							return;
						}

						replaceIn(el, str);
					})
					.catch((e) => {
						console.warn(e);
					});
			});
		});
	});

	const replaceIn = function(el, str) {
		let newEl;

		if (str) {
			let template = document.createElement('template');
			template.innerHTML = str;
			newEl = template.content.querySelector('svg');
		}

		if (!newEl) {
			newEl = document.createElement('div');
		}

		newEl.setAttribute('ln-created-by-me', '');

		let clazz = el.getAttribute('class');
		newEl.setAttribute('class', clazz);

		el.replaceWith(newEl);
	};

	const createImgEl = function(el, str) {
		let img = document.createElement('img');
		let clazz = el.getAttribute('class');
		img.setAttribute('class', clazz);
		img.setAttribute('src', str);
		el.replaceWith(img);
	};
}
