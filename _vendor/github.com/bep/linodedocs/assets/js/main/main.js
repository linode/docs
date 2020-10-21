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

		var noTurbolink =
			anchorElement.hash &&
			anchorElement.origin === window.location.origin &&
			anchorElement.pathname === window.location.pathname;

		if (noTurbolink) {
			event.preventDefault();
		}
	});
})();
