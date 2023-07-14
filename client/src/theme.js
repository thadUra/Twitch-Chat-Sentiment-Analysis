import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import Sora from './Sora-Regular.ttf';

let theme = createTheme({
  palette: {
    primary: {
      light: '#b09fd2',
      main: '#6441a5',
      dark: '#503496',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ca9ad3',
      main: '#9641a5',
      dark: '#783695',
      contrastText: '#fff',
    },
    background: {
        default: '#6441a5'
    }
  },
  typography: {
    fontFamily: 'Sora',
  }
  ,
  components: {
    MuiCssBaseline: {
        styleOverrides: `
            @font-face {
                font-family: Sora;
                src: url(${Sora});
            }`,
    }
  }
});
theme = responsiveFontSizes(theme);

export default theme;