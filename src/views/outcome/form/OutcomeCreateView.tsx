import React from 'react';
import Page from "../../../components/Page";
import {styled} from "@mui/material/styles";
import {Box, Container} from "@mui/material";
import Header from "./Header";
import Form from "./Form";

const Root = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const OutcomeCreateView = () => {
    return (
        <>
            <Page title="Создание расхода" />
            <Root>
                <Container maxWidth="xl">
                    <Header />
                    <Box mt={3}>
                        <Form/>
                    </Box>
                </Container>
            </Root>
        </>
    );
};

export default OutcomeCreateView;
