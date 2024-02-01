import { createTheme } from "@mui/material/styles";
// import { responsiveFontSizes } from "@mui/material/styles";

// https://mui.com/material-ui/customization/theming/#typescript
// declare module '@mui/material/styles' {
//   interface Theme {
//     status: {
//       danger: string;
//     };
//   }
//   // allow configuration using `createTheme`
//   interface ThemeOptions {
//     status?: {
//       danger?: string;
//     };
//   }
// }

// A custom theme for this app
let theme = createTheme({
  palette: { mode: 'dark' },
  typography: {
    /*
    The main font, used for the section titles is called BondiSvtyITCTT-Bold
    "Name", "Player", etc is a version of Cormorant as is most of the other fonts on the official sheet
    Health, Willpower, etc is Gill Sans.  
    font-family: 'Bodoni Moda', serif;
    font-family: 'Cormorant', serif;
    font-family: 'Cormorant Garamond', serif;
    font-family: 'EB Garamond', serif;
    font-family: 'Lato', sans-serif; (Gill Sans Nova substitute)
    */
    fontFamily: "Lato, sans-serif",
    h1: {
      fontFamily: "Bodoni Moda, serif",
    },
    h2: {
      fontFamily: "Bodoni Moda, serif",
    },
    body2: {
      fontFamily: "Cormorant, serif",
    }
  },
});

// adds responsive font sizes for mobile
// theme = responsiveFontSizes(theme, {factor: 3});

// log theme details for customization
// console.debug(theme);

export default theme;
