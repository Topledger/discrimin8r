module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        colors: {
            // Light theme
            lbp: "#ffffff", //  Primary background
            lbs: "#f7f7f8", //  Secondary background
            lbt: "#efeff1", //  Tertiary background
            ltp: "#0e0e10", //  Primary text
            lts: "#53535f", //  Secondary text
            ltt: "#1f1f23", //  Tertiary text
            lbr: "#0000001a", //  Border
            // Dark theme
            dbp: "#18181b", //  Primary background
            dbs: "#0e0e10", //  Secondary background
            dbt: "#1f1f23", //  Tertiary background
            dtp: "#efeff1", //  Primary text
            dts: "#adadb8", //  Secondary text
            dtt: "#dedee3", //  Tertiary text
            dbr: "#ffffff1a", //  Border
            // Generic
            lightaccent: "#eefdff", //  Brand accent
            accent: "#085ED4", //  Brand accent
            darkaccent: "#007176",
            bgsuccess: "#ecffeb", // Green
            success: "#379634", // Green
            bgdanger: '#ffebeb',
            danger: "#FF4000", // Red
            warning: "#F5853F", // Orange
            white: "white", // White
            black: "black", // Black
            transparent: "transparent",
        },
        container: {
            center: true,
        },
        borderRadius: {
            none: "0",
            sm: ".25rem",
            DEFAULT: ".5rem",
            lg: "1rem",
            full: "9999px",
        },
        extend: {},
    },
    plugins: [require("@tailwindcss/line-clamp")],
};
