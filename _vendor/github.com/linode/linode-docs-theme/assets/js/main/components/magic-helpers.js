'use strict';

import { isDesktop, isMobile } from '../helpers';

export function alpineRegisterMagicHelpers(Alpine) {
	// $copy is a magic helper that copys the content of the current or the supplied element to the clipboard.
	Alpine.magic('copy', (currentEl) => {
		return function (el) {
			if (!el) {
				el = currentEl;
			}
			let lntds = el.querySelectorAll('.lntable .lntd');
			if (lntds && lntds.length === 2) {
				// A table with line numbers, the code is in the second column.
				el = lntds[1];
			}

			// Chroma, Hugo's highlighter, recently made the line span elements block elements (to make them go full width).
			// This makes results  el.innerText having extra newlines.
			// textContent, however, ignores any styling, which is what we want.
			navigator.clipboard.writeText(el.textContent);
		};
	});

	// $isScollX magic helper that reports whether the current or the supplied element is scrolling on the x axis.
	Alpine.magic('isScrollX', (currentEl) => {
		return function (el) {
			if (!el) {
				el = currentEl;
			}
			return el.clientWidth < el.scrollWidth;
		};
	});

	// $isMobile magic helpers that reports whether this is a mobile (smalll) device.
	Alpine.magic('isMobile', (currentEl) => {
		return function () {
			return isMobile();
		};
	});

	// $isDesktop magic helpers that reports whether this is a desktop (larger) device.
	Alpine.magic('isDesktop', (currentEl) => {
		return function () {
			return isDesktop();
		};
	});
}
