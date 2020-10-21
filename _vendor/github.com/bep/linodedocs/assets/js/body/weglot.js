(function() {
	Weglot.initialize({
		api_key: lnWeglotApiKey, // see loader/load.js
		switchers: [
			{
				styleOpt: {
					fullname: true,
					withname: true,
					is_dropdown: true,
					with_flags: true,
					invert_flags: true
				},
				target: 'div.weglot-nav',
				sibling: null
			}
		]
	});
})();
