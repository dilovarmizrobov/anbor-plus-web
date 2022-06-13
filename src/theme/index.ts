import {colors, createTheme, responsiveFontSizes, ThemeOptions} from "@mui/material";
import {Shadows} from "@mui/material/styles/shadows";
import {softShadows} from "./shadows";

const baseConfig: ThemeOptions = {
    direction: 'ltr',
    palette: {
        mode: 'light',
        action: {
            active: colors.blueGrey[600]
        },
        background: {
            default: '#f4f6f8',
            paper: colors.common.white
        },
        primary: {
            main: colors.indigo[600]
        },
        secondary: {
            main: '#5850EC'
        },
        text: {
            primary: colors.blueGrey[900],
            secondary: colors.blueGrey[600]
        }
    },
    shadows: softShadows as Shadows
};

const createGlobalTheme = () => {
    return responsiveFontSizes(createTheme(baseConfig))
}

export default createGlobalTheme