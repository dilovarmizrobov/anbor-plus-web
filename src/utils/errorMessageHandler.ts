import {AxiosError} from "axios";

export default function errorMessageHandler(error: AxiosError<{title: string}>): string {
    let message: string

    if (error.response) {
        switch (error.response.status) {
            case 400:
                message = 'Что-то пошло не так. Попробуйте снова.';
                break;
            case 401:
                message = 'Имя пользователя или пароль недействительны. Попробуйте еще раз!';
                break;
            case 403:
                message = 'Доступ запрещён';
                break;
            case 409:
            case 406:
                message = `Произошла ошибка. ${error.response.data.title}`
                break
            default:
                message = `Ошибка сервера. Код ответа ${error.response.status}`
        }
    }
    else if (error.request) message = 'Нет подключения к Интернету'
    else message = `Произошла ошибка. ${error.message}`

    return message
}
