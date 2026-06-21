import { apiBaseFMCClient } from "./axios.baseClient"
import { APIConstants } from "./api.constants"

const apiConstants = new APIConstants();

export const postRegister = async (params: any) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        address,
        state,
        city,
        role,
    } = params;

    const response = await apiBaseFMCClient.post(apiConstants.AUTH.REGISTER, {
        firstName,
        lastName,
        email,
        phone,
        address,
        state,
        city,
        role,
    });

    return response.data;
}
