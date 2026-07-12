import axios from "axios";
import { BASE_URL } from "./api.constants";

export const apiBaseFMCClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});