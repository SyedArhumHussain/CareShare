import React from 'react';
import { ThemeProvider as MuiThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Import the theme
import theme from '../theme';

/**
 * CareShare Theme Provider Component
 * 
 * This component provides the CareShare design system theme to the entire application.
 * It wraps the application with MUI's ThemeProvider and applies the custom theme.
 * 
 * The component also includes CssBaseline which normalizes styles across browsers
 * and provides a consistent base to build upon.
 */
const ThemeProvider = ({ children }) => {
  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeProvider; 