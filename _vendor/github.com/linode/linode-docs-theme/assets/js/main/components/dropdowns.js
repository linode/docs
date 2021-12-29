'use strict';

var debug = 0 ? console.log.bind(console, '[dropdowns]') : function() {};

export function newDropdownsController(dropdowns) {
	return {
		dropdowns: dropdowns,
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
		}
	};
}
