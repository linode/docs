'use strict';

var debug = 0 ? console.log.bind(console, '[copy-to-clipboard]') : function() {};

var copyToClipboard = function(text) {
	if (window.clipboardData && window.clipboardData.setData) {
		return clipboardData.setData('Text', text);
	}

	if (!document.queryCommandSupported || !document.queryCommandSupported('copy')) {
		return false;
	}

	var textarea = document.createElement('textarea');
	textarea.textContent = text;
	textarea.style.position = 'fixed';
	document.body.appendChild(textarea);
	textarea.select();
	try {
		return document.execCommand('copy');
	} catch (ex) {
		console.warn('Copy to clipboard failed:', ex);
		return false;
	} finally {
		document.body.removeChild(textarea);
	}
};

export function newClipboardController() {
	return {
		copy: function(el) {
			let lntds = el.querySelectorAll('.lntable .lntd');
			let text;
			if (lntds && lntds.length === 2) {
				// A table with line numbers, the code is in the second column.
				text = lntds[1].innerText;
			} else {
				text = el.innerText;
			}

			debug('copy', text);
			copyToClipboard(text);
		},
		isScrollX: function(elem = this.$el) {
			return elem.clientWidth < elem.scrollWidth;
		}
	};
}
