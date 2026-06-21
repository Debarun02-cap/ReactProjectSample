import axios from "axios";
import { BASE_URL } from "./api.constants";

export const apiBaseFMCClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        withCredentials: true,
    }
})