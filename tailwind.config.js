/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./index.html", "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors:{
        primary:"#20599E",
        secondary:"#FF4423",//rouge
        darck:"#F4F4F4",
        ddd:"#F09C0A",
        sss:"#E8EAED",
        JJJ:"#49A146",//VERS 
        TTT:"#F09C0A",  //pour la couleur jaune de status et urgence 

        boxShadow:{
          'custom-shadow':'10px 0px 20px rgba(0,0,0,0.3)   '
        }

       
      },
    },
  },
  plugins: [],
};

