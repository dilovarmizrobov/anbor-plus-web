import React from 'react';
import {styled} from "@mui/material/styles";
import {CircularProgress, Typography} from "@mui/material";

const Root = styled('div')(() => ({
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '250px',
}))

const LoadingLayout: React.FC<{loading: boolean, error: boolean}> = ({loading, error}) => {
    return (
        <Root>
            {loading && <CircularProgress size={48} />}
            {error && <Typography>Произошла непредвиденная ошибка. Повторите попытку позже</Typography>}
        </Root>
    );
}

export default LoadingLayout;
