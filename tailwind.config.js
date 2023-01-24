/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            keyframes: {
                "fill-in": {
                    "0%": { transform: "scale(0.2)" },
                    "100%": { transform: "scale(1)" },
                },
            },
            animation: {
                "fill-in": "fill-in 0.5s ease-out",
            },
        },
    },
    plugins: [],
};
