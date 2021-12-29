'use strict';

import { isMobile } from '../helpers';

export function alpineRegisterMagicHelpers(Alpine) {
	// $copy is a magic helper that copys the content of the current or the supplied element to the clipboard.
	Alpine.magic('copy', (currentEl) => {
		return function(el) {
			if (!el) {
				el = currentEl;
			}
			let lntds = el.querySelectorAll('.lntable .lntd');
			let text;
			if (lntds && lntds.length === 2) {
				// A table with line numbers, the code is in the second column.
				text = lntds[1].innerText;
			} else {
				text = el.innerText;
			}
			navigator.clipboard.writeText(text);
		};
	});

	// $isScollX magic helper that reports whether the current or the supplied element is scrolling on the x axis.
	Alpine.magic('isScrollX', (currentEl) => {
		return function(el) {
			if (!el) {
				el = currentEl;
			}
			return el.clientWidth < el.scrollWidth;
		};
	});

	// $isMobile magic helpers that reports whether this is a mobile (smalll) device.
	Alpine.magic('isMobile', (currentEl) => {
		return function() {
			return isMobile();
		};
	});
}
