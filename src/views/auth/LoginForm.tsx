import React from 'react';
import {Box, Button, CircularProgress, TextField} from "@mui/material";
import {styled} from "@mui/material/styles";
import authService from "../../services/AuthService";
import * as Yup from 'yup';
import {Formik, FormikProps} from "formik";
import errorMessageHandler from "../../utils/errorMessageHandler";

const StyledCircularProgress = styled(CircularProgress)(() => ({
    color: "secondary",
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
}))

type IFormInput = {
    login: string;
    password: string;
};

const loginValidationSchema = Yup.object().shape({
    login: Yup.string().max(255).required('Имя пользователя обязательное поле!'),
    password: Yup.string().max(255).required('Введите пароль')
});

const LoginForm: React.FC<{onSubmitFailure: (message: string) => void}> = ({onSubmitFailure}) => {
    return (
        <Formik
            initialValues={{login: '', password: ''}}
            validationSchema={loginValidationSchema}
            onSubmit={async (values, {setStatus, setSubmitting}) => {
                try {
                    await authService.login(values.login, values.password)
                    window.location.reload()
                } catch (error: any) {
                    setStatus({ success: false });
                    onSubmitFailure(errorMessageHandler(error))
                    setSubmitting(false);
                }
            }}
        >
            {(props: FormikProps<IFormInput>) => (
                <form noValidate onSubmit={props.handleSubmit}>
                    <TextField
                        error={Boolean(props.touched.login && props.errors.login)}
                        fullWidth
                        helperText={props.touched.login && props.errors.login}
                        label="Логин(Телефон)"
                        margin="normal"
                        name="login"
                        autoComplete="on"
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                        type="text"
                        value={props.values.login}
                        variant="outlined"
                    />
                    <TextField
                        error={Boolean(props.touched.password && props.errors.password)}
                        fullWidth
                        helperText={props.touched.password && props.errors.password}
                        label="Пароль"
                        margin="normal"
                        name="password"
                        autoComplete="on"
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                        type="password"
                        value={props.values.password}
                        variant="outlined"

                    />
                    <Box mt={2} sx={{position: 'relative'}}>
                        <Button
                            color="secondary"
                            disabled={props.isSubmitting}
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                        >
                            Войти
                        </Button>
                        {props.isSubmitting && (<StyledCircularProgress size={24} />)}
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default LoginForm;
