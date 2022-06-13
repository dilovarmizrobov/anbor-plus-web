import {GlobalStyles} from "@mui/material";

const globalStyles = <GlobalStyles styles={{
    '*': {
        boxSizing: 'border-box',
        margin: 0,
        padding: 0
    },
    html: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        height: '100%',
        width: '100%'
    },
    body: {
        height: '100%',
        width: '100%'
    },
    '#root': {
        height: '100%',
        width: '100%'
    }
}} />;

export default globalStyles