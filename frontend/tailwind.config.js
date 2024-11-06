/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./src/**/*.{html,ts,js}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#542ED8",
                   
          "secondary": "#000000",
                   
          "accent": "#00B1FF",
                   
          "neutral": "#FFFFFF",
          
          "base-100": "#EEEEEE",
                   
          "info": "#21abb5",
                   
          "success": "#3daf2c",
                   
          "warning": "#e08d10",
                   
          "error": "#ff5c5c",

          "--rounded-box": "1.5rem", // card and other large boxes border radius

          "--rounded-btn": "1.5rem" // buttons and similar elements border radius

          // rounded-sm:  0.125rem
          // rounded-md:  0.375rem
          // rounded-lg:  0.5rem
          // rounded-xl:  0.75rem
          // rounded-2xl: 1rem
          // rounded-3xl: 1.5rem       
        },

        dark: {
          "primary": "#8c7aff",
           
          "secondary": "#FFFFFF",
                   
          "accent": "#00B1FF",
                   
          "neutral": "#212121",
                   
          "base-100": "#181818",
                   
          "info": "#21abb5",
                   
          "success": "#3daf2c",
                   
          "warning": "#e08d10",
                   
          "error": "#ff5c5c",

          "--rounded-box": "0.125rem", // cards and other large boxes border radius
          "--rounded-btn": "0.125rem", // buttons and similar elements border radius
        
          // rounded-sm:  0.125rem
          // rounded-md:  0.375rem
          // rounded-lg:  0.5rem
          // rounded-xl:  0.75rem
          // rounded-2xl: 1rem
          // rounded-3xl: 1.5rem
        },

        alr_light: {
          "primary": "#8D6D3A",
                   
          "secondary": "#000000",
                   
          "accent": "#00B1FF",
                   
          "neutral": "#FFFFFF",
                   
          "base-100": "#EEEEEE",
                   
          "info": "#21abb5",
                   
          "success": "#3daf2c",
                   
          "warning": "#e08d10",
                   
          "error": "#ff5c5c",
          "--rounded-box": "1.5rem", // card and other large boxes border radius

          "--rounded-btn": "1.5rem" // buttons and similar elements border radius

          // rounded-sm:  0.125rem
          // rounded-md:  0.375rem
          // rounded-lg:  0.5rem
          // rounded-xl:  0.75rem
          // rounded-2xl: 1rem
          // rounded-3xl: 1.5rem       
        },

        alr_dark: {
          "primary": "#BB9D5C",
           
          "secondary": "#FFFFFF",
                   
          "accent": "#00B1FF",
                   
          "neutral": "#262626",
                   
          "base-100": "#181818",
                   
          "info": "#21abb5",
                   
          "success": "#3daf2c",
                   
          "warning": "#e08d10",
                   
          "error": "#ff5c5c",

          "--rounded-box": "0.125rem", // cards and other large boxes border radius
          "--rounded-btn": "0.125rem", // buttons and similar elements border radius
        
          // rounded-sm:  0.125rem
          // rounded-md:  0.375rem
          // rounded-lg:  0.5rem
          // rounded-xl:  0.75rem
          // rounded-2xl: 1rem
          // rounded-3xl: 1.5rem
        }
      }
    ]
  }
};
