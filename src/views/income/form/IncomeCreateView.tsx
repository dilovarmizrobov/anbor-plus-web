import React from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import Header from "./Header";
import {Box, Container} from "@mui/material";
import Form from "./Form";

const Root = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const IncomeCreateView = () => {
    return (
        <>
            <Page title="Создание прихода"/>
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

export default IncomeCreateView;