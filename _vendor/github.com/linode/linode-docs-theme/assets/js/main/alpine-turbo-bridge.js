export function bridgeTurboAndAlpine(Alpine) {
	document.addEventListener('turbo:render', () => {
		if (document.documentElement.hasAttribute('data-turbo-preview')) {
			return;
		}

		// Restart Alpine.
		Alpine.start();
	});

	// Cleanup Alpine state on navigation.
	document.addEventListener('turbo:before-cache', () => {
		Alpine.stopObservingMutations();

		document.body.querySelectorAll('[x-data]').forEach((el) => {
			if (el.hasAttribute('data-turbo-permanent')) {
				el._x_ignore = true;
			} else {
				Alpine.destroyTree(el);

				// Turbo leaks DOM elements via their data-turbo-permanent handling.
				// That needs to be fixed upstream, but until then.
				let clone = el.cloneNode(true);
				el.replaceWith(clone);
			}
		});
	});
}
