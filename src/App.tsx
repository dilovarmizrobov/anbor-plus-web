import React from 'react';
import {BrowserRouter} from "react-router-dom";
import {SnackbarProvider} from "notistack";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import globalStyles from "./GlobalStyles";

import createGlobalTheme from "./theme";
import Routes from "./Routes";

function App() {
    return (
        <ThemeProvider theme={createGlobalTheme()}>
            {globalStyles}
            <CssBaseline/>
            <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
                <BrowserRouter>
                    <Routes/>
                </BrowserRouter>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
