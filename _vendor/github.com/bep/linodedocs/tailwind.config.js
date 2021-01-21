/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-process-env */
const theme = require('tailwindcss/defaultTheme');
const typography = require('@tailwindcss/typography');
const customform = require('@tailwindcss/custom-forms');

// Colors
/*
Palette (as a reference from Invisionn:

brand: #02B159
titlecolor: #32363B
textcolor: #5E6065
divider: #EAEAEB
basicGray: #A9AAB0

Grays:

500: '#D9DBE1', // Darker gray border.
700: '#616266', // Dropdown text.


*/
const colorBrand = 'var(--color-brand)'; // Green;
const colorTitle = 'var(--color-title)'; // Dark gray text, e.g. title.;
const colorBodyText = 'var(--color-body-text)'; // Lighter gray, body text etc.;
const colorBasicGray = '#A9AAB0'; // Slightly darker than body, used for byline text etc.
const colorDivider = 'var(--color-divider)'; // Light gray border.

// Screen sizes
const maxWidthXl = 1280;
const maxWidthLg = 992;
const maxWidthMd = 768;
const maxWidthSm = 640;

// Utils
const round = (num) => num.toFixed(7).replace(/(\.[0-9]+?)0+$/, '$1').replace(/\.0$/, '');
const rem = (px) => `${round(px / 16)}rem`;
const em = (px, base) => `${round(px / base)}em`;
const px = (px) => `${px}px`;

module.exports = {
	experimental: {
		// See https://github.com/tailwindlabs/tailwindcss/pull/2159
		applyComplexClasses: true
	},
	purge: {
		enabled: process.env.HUGO_ENVIRONMENT === 'production',
		content: [ './hugo_stats.json' ],
		options: {
			whitelist: [ 'pl-1', 'pl-3' ],
			defaultExtractor: (content) => {
				let els = JSON.parse(content).htmlElements;
				els = els.tags.concat(els.classes, els.ids);
				return els;
			}
		}
	},
	corePlugins: {
		container: false
	},
	plugins: [
		function({ addComponents }) {
			addComponents({
				// See https://github.com/tailwindlabs/tailwindcss/issues/1102
				'.container': {
					width: '100%',
					paddingLeft: '1rem',
					paddingRight: '1rem',
					'@screen sm': {
						paddingLeft: '1rem',
						paddingRight: '1rem',
						maxWidth: px(maxWidthSm)
					},
					'@screen md': {
						paddingLeft: '1.5rem',
						paddingRight: '1.5rem',
						maxWidth: px(maxWidthMd)
					},
					'@screen tablet': {
						paddingLeft: '1.5rem',
						paddingRight: '1.5rem',
						maxWidth: px(maxWidthLg + 6)
					},
					'@screen lg': {
						paddingLeft: '4.5rem',
						paddingRight: '4.5rem',
						// Given the padding above, this will give a
						// 956px wide main content area.
						maxWidth: px(maxWidthLg + 104)
					},
					'@screen xl': {
						maxWidth: px(maxWidthLg + 104)
					}
				}
			});
		},
		customform,
		typography
	],
	variants: {
		backgroundColor: [ 'first', 'odd', 'responsive', 'hover', 'focus' ]
	},
	important: '#ln-docs',
	theme: {
		// See https://tailwindcss-custom-forms.netlify.app/
		customForms: {
			default: {
				input: {
					'&::placeholder': {
						color: colorBasicGray,
						opacity: '1'
					},
					'&:focus': {
						outline: 'none',
						boxShadow: 'none',
						borderColor: 'none'
					}
				},
				checkbox: {
					icon: (iconColor) =>
						`<svg fill="${iconColor}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M435.848 83.466L172.804 346.51l-96.652-96.652c-4.686-4.686-12.284-4.686-16.971 0l-28.284 28.284c-4.686 4.686-4.686 12.284 0 16.971l133.421 133.421c4.686 4.686 12.284 4.686 16.971 0l299.813-299.813c4.686-4.686 4.686-12.284 0-16.971l-28.284-28.284c-4.686-4.686-12.284-4.686-16.97 0z"/></svg>`,
					iconColor: '#02b159',
					borderRadius: '0px'
				}
			}
		},
		// See https://github.com/tailwindcss/typography/blob/master/src/styles.js
		typography: {
			default: {
				css: {
					color: colorBodyText,
					fontWeight: '400',
					strong: {
						fontWeight: '600'
					},
					a: {
						color: colorBrand,
						textDecoration: 'none'
					},
					h1: {
						color: colorTitle,
						fontWeight: '400'
					},
					h2: {
						color: colorTitle,
						fontWeight: '600'
					},
					h3: {
						color: colorTitle,
						fontWeight: '600'
					},
					h4: {
						color: colorTitle,
						fontWeight: '600'
					},
					blockquote: {
						fontWeight: '400',
						fontStyle: 'normal',
						color: colorBodyText,
						borderLeftWidth: '0.25rem',
						borderLeftColor: theme.colors.gray[300],
						quotes: '"\\201C""\\201D""\\2018""\\2019"'
					},
					code: {
						color: colorBodyText,
						backgroundColor: theme.colors.gray[200],
						fontWeight: '400',
						padding: '0.2em',
						margin: 0,
						fontSize: '85%',
						borderRadius: '3px'
					},
					'code::before': {
						content: ''
					},
					'code::after': {
						content: ''
					},
					pre: {
						fontSize: em(14, 16),
						lineHeight: round(24 / 14),
						marginTop: em(24, 14),
						marginBottom: em(24, 14),
						borderRadius: rem(6),
						paddingTop: em(4, 14),
						paddingRight: em(16, 14),
						paddingBottom: em(4, 14),
						paddingLeft: em(16, 14)
					}
				}
			},
			sm: {
				css: {
					fontSize: rem(14),
					h2: {
						fontSize: em(24, 12),
						letterSpacing: '-0.38px',
						marginTop: em(8, 12),
						marginBottom: em(6, 12)
					},
					'tbody td:first-child': {
						paddingLeft: rem(21)
					},
					'tbody td:last-child': {
						paddingRight: rem(21)
					},
					'thead th:first-child': {
						paddingLeft: rem(21)
					},
					'thead th:last-child': {
						paddingRight: rem(21)
					},
					'thead th': {
						fontSize: rem(14)
					},
					table: {
						fontSize: rem(14),
						lineHeight: round(24 / 16)
					}
				}
			},
			lg: {
				css: {
					fontSize: rem(16),
					h2: {
						fontSize: em(32, 16),
						lineHeight: round(40 / 32),
						letterSpacing: '-0.5px',
						marginTop: em(32, 16),
						marginBottom: em(20, 16)
					},
					table: {
						fontSize: rem(14),
						lineHeight: round(24 / 16)
					},
					'tbody td:first-child': {
						paddingLeft: rem(21)
					},
					'tbody td:last-child': {
						paddingRight: rem(21)
					},
					'thead th': {
						fontSize: rem(18)
					}
				}
			}
		},
		screens: {
			// eslint-disable-next-line lines-around-comment
			/* Mobile: 0px … 767px
			   Tablet: 768px … 991px
			   Desktop: 992px … :infinity:
			*/
			xl: px(maxWidthXl),
			lg: px(maxWidthLg), // Desktop
			md: px(maxWidthMd),
			sm: px(maxWidthSm),
			small: { max: '991px' }, // Common term for mobile, tablets etc. They are small.
			tablet: { min: '768px', max: '991px' },
			mobile: { max: '767px' }
		},
		fontFamily: {
			...theme.fontFamily,
			sans: [ 'Source Sans Pro', ...theme.fontFamily.sans ]
		},

		fontSize: {
			xxs: '0.65625rem',
			xs: '0.75rem',
			sm: '0.85714rem',
			base: '1rem',
			lg: [ '1.125rem', { letterSpacing: '-0.01111111em', lineHeight: '1.333333em' } ],
			xl: [ '1.25rem', { letterSpacing: '-0.011111111em', lineHeight: '1.333333em' } ],
			'2': [ '2rem', { letterSpacing: '-0.02em', lineHeight: '1.2em' } ],
			'2xl': [ '1.5rem', { letterSpacing: '-0.02em', lineHeight: '1.2em' } ],
			'3': [ '1.7142857rem', { letterSpacing: '-0.016666666666667em', lineHeight: '1.333333em' } ],
			'3xl': [ '2rem', { letterSpacing: '-0.015625em', lineHeight: '1.2em' } ],
			'4xl': [ '2.25rem', { letterSpacing: '-.03125em', lineHeight: '1.2em' } ],
			'5xl': [ '3rem', { letterSpacing: '-.03125em', lineHeight: '1.2em' } ],
			'6xl': [ '4rem', { letterSpacing: '-.03125em', lineHeight: '1.2em' } ]
		},
		letterSpacing: {
			tighter: '-.05em',
			tight: '-.03125em',
			normal: '0'
		},
		extend: {
			spacing: {
				'2-5': '0.625rem',
				'7': '1.75rem',
				'9': '2.25rem',
				'14': '3.5rem',
				'18': '4.5rem',
				'36': '9rem',
				'62': '15.5rem',
				// For images
				'14/9': '62.99%',
				'16/9': '56.25%',
				'20/9': '45.20%',
				'30/9': '30.13%'
			},
			maxWidth: {
				xxs: '8rem;'
			},
			colors: {
				brand: colorBrand, // Explorer icons highlight etc.
				backgroundcolor: '#FAFAFC', // Body background etc.
				titlecolor: colorTitle, // Titles etc.
				basicgray: colorBasicGray, // Light text, explorer counter.
				textcolor: colorBodyText, // Body text.
				divider: colorDivider, // Borders.
				selected: '#F2F2F7', // Selected item.
				icongray: '#737373',

				gray: {
					...theme.colors.gray,
					400: colorBasicGray,
					500: '#D9DBE1', // Darker gray border.
					600: colorBodyText,
					700: '#616266', // Dropdown text.
					800: colorTitle
				},
				// Generated on https://javisperez.github.io/tailwindcolorshades/#/?green=02B159&tv=1
				green: {
					50: '#F2FBF7',
					100: '#E6F7EE',
					200: '#C0ECD6',
					300: '#9AE0BD',
					400: '#4EC88B',
					500: '#02B159',
					600: '#029F50',
					700: '#016A35',
					800: '#015028',
					900: '#01351B'
				}
			}
		}
	}
};
