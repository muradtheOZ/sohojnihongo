import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {},
    },
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    plugins: [require("daisyui")],
    daisyui: {
        themes: [
            {
                shohoj: {
                    "primary": "#2D5A88", // Deep Autumn Sky Blue
                    "primary-content": "#ffffff",

                    "secondary": "#F5F1E8", // Warm Beige / Light Tatami
                    "secondary-content": "#333333",

                    "accent": "#E8743E", // Burnt Orange / Persimmon
                    "accent-content": "#ffffff",

                    // Use golden yellow for success/progress highlights
                    "success": "#FCCA46",
                    "success-content": "#1f2937",

                    "info": "#2D5A88",
                    "warning": "#E8743E",
                    "error": "#ef4444",

                    // Base/background and text
                    "base-100": "#F5F1E8",
                    "base-200": "#efeae0",
                    "base-300": "#e7e2d8",
                    "base-content": "#333333",
                }
            }
        ],
        darkTheme: "shohoj",
    },
}
export default config