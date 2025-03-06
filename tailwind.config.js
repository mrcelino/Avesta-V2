import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.tsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Poppins", ...defaultTheme.fontFamily.sans], // Set Poppins sebagai default font-sans
            },
            backgroundImage: {
                "hero-bg": "url('/image/bghero.png')",
            },
            colors: {
                pink: "#FB657A",
                heading: "#F14C4C",
                cInput: "#F4F4F4",
            },
        },
    },

    plugins: [forms],
};
