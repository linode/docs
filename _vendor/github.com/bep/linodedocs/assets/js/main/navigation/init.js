var lnInitController = {};

(function(ctx) {
	'use strict';

	var debug =
		(typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0 ? console.log.bind(console, '[init]') : function() {};

	ctx.New = function() {
		const dispatcher = lnSearchEventDispatcher.New();

		return {
			// init will run after Alpine has made its initial updates to the DOM,
			// and this is the init function for the last component on the page.
			// We do any scroll to hash location here, because Turbolinks's implementation
			// of the same is buggy; most likely because they do it too early.
			init: function() {
				return function() {
					if (window.location.hash) {
						debug('init:', window.location.hash);
						try {
							let el = document.querySelector(window.location.hash);
							if (el) {
								var elTop = el.offsetTop;

								window.scrollTo({
									left: 0,
									top: elTop - 80
								});
							}
						} catch (e) {}
					}

					// Send the static page info to components who need it.
					dispatcher.sendPageInfo(lnPageInfo);
				};
			}
		};
	};
})(lnInitController);
