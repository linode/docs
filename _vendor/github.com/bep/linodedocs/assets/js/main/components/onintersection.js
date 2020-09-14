var lnOnIntersection = {};

(function(ctx) {
	'use strict';

	ctx.New = function() {
		return {
			visible: false,
			init: function() {
				var self = this;
				const el = this.$el;
				const onIntersection = ([ { isIntersecting, target } ]) => {
					if (isIntersecting) {
						self.visible = true;
					}
				};
				const io = new IntersectionObserver(onIntersection, { threshold: 1 });
				io.observe(el);
			}
		};
	};
})(lnOnIntersection);
