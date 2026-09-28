import animate from 'tailwindcss-animate';
import plugin from 'tailwindcss/plugin';

// `can-hover:` applies only on devices with a real mouse. Buttons that appear on hover there
// (can-hover:opacity-0 can-hover:group-hover:opacity-100) stay visible on phones and tablets.
const canHover = plugin(({ addVariant }) => {
    addVariant('can-hover', '@media (hover: hover) and (pointer: fine)');
});

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: { extend: {} },
    plugins: [animate, canHover], // animate: the animate-in / fade-in / slide-in-from-* classes
}

