var lnSvgLoader = {};

(function(ctx) {
	'use strict';

	var debug =
		(typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0 ? console.log.bind(console, '[svgloader]') : function() {};

	const replaceIn = function(el, str) {
		var newEl;
		if (str) {
			var template = document.createElement('template');
			template.innerHTML = str;
			newEl = template.content.querySelector('svg');
		}

		if (!newEl) {
			newEl = document.createElement('div');
		}

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

	ctx.Load = function(el, src) {
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

		// The fetching above may be delayed; return an empty string as a temporary placeholder.
		return '';
	};
})(lnSvgLoader);
