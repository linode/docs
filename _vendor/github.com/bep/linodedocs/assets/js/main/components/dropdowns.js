var lnDropdowns = {};

(function(ctx) {
	'use strict';

	var debug =
		(typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0 ? console.log.bind(console, '[dropdowns]') : function() {};

	ctx.New = function(dropdowns) {
		return {
			dropdowns: dropdowns,
			init: function() {
				if (document.body.classList.contains('is-topbar-pinned')) {
					this.dropdowns.forEach((e) => {
						if (e.hideWhenPinned) {
							e.hidden = true;
						}
					});
				}
			},
			toggleOpen: function(idx) {
				let wasOpen = this.dropdowns[idx].open;
				this.dropdowns[idx].open = !wasOpen;

				if (wasOpen) {
					return;
				}

				// Only 1 open at a time.
				for (let i in dropdowns) {
					if (i != idx) {
						this.dropdowns[i].open = false;
					}
				}
			},
			closeAll: function() {
				this.dropdowns.forEach((e) => {
					e.open = false;
				});
			},
			isOpen: function(idx) {
				return this.dropdowns[idx].open;
			},
			isHidden: function(idx) {
				return this.dropdowns[idx].hidden;
			},
			receiveToggle: function(detail) {
				debug('receiveToggle', detail);
				switch (detail.what) {
					case 'topbar-pinned':
						this.dropdowns.forEach((e) => {
							if (e.hideWhenPinned) {
								e.hidden = detail.open;
							}
						});
						break;
					default:
					// Ignore
				}
			}
		};
	};
})(lnDropdowns);
