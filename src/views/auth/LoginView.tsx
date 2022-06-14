import React, {useState} from "react";
import {Navigate} from "react-router-dom";
import {useAppSelector} from "../../store/hooks";
import {selectAuth} from "../../store/reducers/authSlice";
import {styled} from "@mui/material/styles";
import {
    Alert,
    Box,
    Card,
    CardContent,
    CardMedia,
    Container,
    Divider,
    Typography
} from "@mui/material";
import LoginForm from "./LoginForm";
import Page from "../../components/Page";

const Root = styled('div')(({ theme }) => ({
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    minHeight: '100%',
    flexDirection: 'column',
    paddingBottom: 80,
    paddingTop: 80
}))

const StyledCard = styled(Card)(() => ({
    overflow: 'visible',
    display: 'flex',
    position: 'relative',
    '& > *': {
        flexGrow: 1,
        flexBasis: '50%',
        width: '50%'
    }
}))

const StyledCardMedia = styled(CardMedia)(({theme}) => ({
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    padding: theme.spacing(3),
    color: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
        display: 'none'
    }
}))

const StyledCardContent = styled(CardContent)(({theme}) => ({
    padding: theme.spacing(8, 4, 3, 4)
}))

const LoginView: React.FC = () => {
    const auth = useAppSelector(selectAuth)
    const [failureMessage, setFailureMessage] = useState<string | null>(null)

    if (auth.isAuthenticated) {
        return <Navigate to="/" />;
    }

    const handleSubmitFailure = (message: string) => {
        setFailureMessage(message)
    };

    return (
        <>
            <Page title="Логин" />
            <Root>
                <Container maxWidth="md">
                    <StyledCard>
                        <StyledCardMedia
                            image="/static/auth.png"
                            title="DuobTMS | Abad Technologies"
                        />
                        <StyledCardContent>
                            <Typography variant="h5" color="textPrimary">
                                Добро пожаловать
                            </Typography>
                            {
                                failureMessage && (
                                    <Box mt={2}>
                                        <Alert severity="error">
                                            <div>
                                                {failureMessage}
                                            </div>
                                        </Alert>
                                    </Box>
                                )
                            }
                            <Box mt={3}>
                                <LoginForm onSubmitFailure={handleSubmitFailure} />
                            </Box>
                            <Box my={2}>
                                <Divider />
                            </Box>
                        </StyledCardContent>
                    </StyledCard>
                </Container>
            </Root>
        </>
    );
};

export default LoginView;
