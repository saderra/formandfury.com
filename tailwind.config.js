const twtype = require('@tailwindcss/typography');
const twforms = require('@tailwindcss/forms');

module.exports = {
  content: ["./src/**/*.{html,js,njk,md}"],
  theme: {
    container: {
			center: true,
			padding: {
				DEFAULT: '.8rem',
				sm: '1.5rem'
			  },
			screens: {
				sm: "100%",
				md: "100%",
				lg: "1140px",
				xl: "1380px",
				"2xl": "1540px"
			}
		},
    extend: {
		backgroundImage: theme => ({
			'home-cover': "url('/assets/images/mast/home.jpg')",
		}),
		maxWidth: {
			xxs: '200px',
		},
		fontFamily: {
			sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			heading: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
			serif: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
		},
      	colors: {
			brand: {
				light: '#F4EAE4',
				bright: '#8A8078',
				DEFAULT: '#211D1B',
				dark: '#171412',
				darker: '#171412',
				border: '#E7DFD8',
			},
			subtle: {
					DEFAULT: '#F8F3EF',
					dark: '#F4EAE4'
				},
			ivory: '#FBF7F3',
			blush: '#F4EAE4',
			line: '#E7DFD8',
			accent: {
				DEFAULT: '#9C3049',
				soft: '#F1DCDD',
			},
		},
    },
  },

  plugins: [ twtype, twforms ]
}