/*

Note that we currently use Hugo's concat (it's fast...) to create our JS bundle, so no require, no import. For now.

*/

// Toggle this to show debug information in the console.
var LN_DEBUG = 0;

(function() {
	// Prevent turbolinks from handling anchor links.
	// See https://github.com/turbolinks/turbolinks/issues/75
	document.addEventListener('turbolinks:click', function(event) {
		const anchorElement = event.target.closest('a');

		// Turbolinks intercepts all clicks on <a href> links to the same domain.
		// The documentation is hosted at linode.com/docs, but there are links
		// to other sections of that same domain, so prevent Turbolinks from handling those.
		// pathname is a USVString containing an initial '/' followed by the path of the URL
		//(or the empty string if there is no path).
		var noTurbolink = !anchorElement.pathname.startsWith('/docs/');

		if (noTurbolink) {
			// Prepare a clean state for when the user comes back.
			Turbolinks.clearCache();
		}

		if (!noTurbolink) {
			// Prevent Turbolinks from handling #hash locations on the same page.
			noTurbolink =
				anchorElement.hash &&
				anchorElement.origin === window.location.origin &&
				anchorElement.pathname === window.location.pathname;
		}

		if (noTurbolink) {
			event.preventDefault();
		}
	});
})();
