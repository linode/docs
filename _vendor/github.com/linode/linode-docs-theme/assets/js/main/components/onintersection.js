'use strict';

const observe = function(self, el) {
	const onIntersection = ([ { isIntersecting, target } ]) => {
		if (!self.visible && isIntersecting) {
			self.visible = true;
		}
	};
	const io = new IntersectionObserver(onIntersection, { threshold: 0 });
	io.observe(el);
};

export function newOnIntersectionController() {
	return {
		visible: false,
		init: function() {
			observe(this, this.$el);
		}
	};
}
