import AxiosMockAdapter from "axios-mock-adapter";
import api from "./api";

const instance = new AxiosMockAdapter(api, {delayResponse: 500})

export default instance