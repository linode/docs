var lnCopyToClipBoard = {};

(function(ctx) {
	'use strict';

	var debug =
		(typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0
			? console.log.bind(console, '[copy-to-clipboard]')
			: function() {};

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

	ctx.New = function() {
		return {
			copy: function(el) {
				let text = el.innerText;
				debug('copy', text);
				copyToClipboard(text);
			},
			isScrollX: function() {
				let elem = this.$el;
				return elem.clientWidth < elem.scrollWidth;
			}
		};
	};
})(lnCopyToClipBoard);
