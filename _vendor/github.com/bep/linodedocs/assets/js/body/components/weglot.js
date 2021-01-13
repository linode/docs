export function initWeglot(apiKey) {
	Weglot.initialize({
		api_key: apiKey,
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
}
