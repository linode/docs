/**
 * This adds a set of event listeners that, if Alpine is present,
 * prepares/cleans the AlpineJS state.
 * 
 * Most importantly, it pauses Alpin's mutation observer so Turbolinks can
 * do its work without interuption.
 *  See https://github.com/alpinejs/alpine/issues/372
 *  See https://github.com/alpinejs/alpine/issues/372
 */
(function() {
	document.addEventListener('turbolinks:before-cache', () => {
		if (!Alpine) return;
		Alpine.pauseMutationObserver = true;
		walk(document.body, (el) => {
			if (el.hasAttribute('x-for')) {
				let nextEl = el.nextElementSibling;

				while (nextEl && nextEl.__x_for_key !== 'undefined') {
					const currEl = nextEl;
					nextEl = nextEl.nextElementSibling;
					currEl.setAttribute('x-generated', true);
				}
			} else if (el.hasAttribute('x-if')) {
				const ifEl = el.nextElementSibling;

				if (ifEl && typeof ifEl.__x_inserted_me !== 'undefined') {
					ifEl.setAttribute('x-generated', true);
				}
			}

			return true;
		});
	});

	document.addEventListener('turbolinks:before-render', (event) => {
		if (!Alpine) return;
		Alpine.pauseMutationObserver = true;
		event.data.newBody.querySelectorAll('[x-generated]').forEach((el) => {
			el.removeAttribute('x-generated');
			if (typeof el.__x_for_key === 'undefined' && typeof el.__x_inserted_me === 'undefined') {
				el.remove();
			}
		});
	});

	document.addEventListener('turbolinks:load', () => {
		if (!Alpine) return;
		Alpine.pauseMutationObserver = true;
	});

	document.addEventListener('turbolinks:render', () => {
		if (!Alpine) return;
		Alpine.pauseMutationObserver = false;
	});

	function walk(el, callback) {
		if (callback(el) === false) {
			return;
		}

		let node = el.firstElementChild;

		while (node) {
			walk(node, callback);

			node = node.nextElementSibling;
		}
	}
})();
