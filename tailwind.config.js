/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				"primary-500": "#5D6BFF",
				"primary-400": "#7885FF",
				"primary-600": "#4B58E6",
				"primary-700": "#3D46B2",

				"secondary-500": "#11A7FC",
				"secondary-400": "#33B7FF",
				"secondary-600": "#0092DA",
				"secondary-700": "#007CB8",

				"off-white": "#F0F0FF",
				"red": "#FF5A5A",
				"dark-1": "#000000",
				"dark-2": "#121214",
				"dark-3": "#202024",
				"dark-4": "#2C2C34",

				"light-1": "#FFFFFF",
				"light-2": "#F5F5F5",
				"light-3": "#D9DAE8",
				"light-4": "#B8B9C7",
			},
			screens: {
				xs: "480px",
			},
			width: {
				420: "420px",
				465: "465px",
			},
			fontFamily: {
				inter: ["Inter", "sans-serif"],
			},
			keyframes: {
				"accordion-down": {
					from: { height: 0 },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: 0 },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [import("tailwindcss-animate")],
};
