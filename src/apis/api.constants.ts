export const BASE_URL = ""; // Vite proxy forwards /auth, /user, /admin etc. to localhost:3000

export class APIConstants {
    AUTH = {
        LOGIN: `/auth/login`,
        REGISTER: `/auth/signup`, // Backend uses '/auth/signup'
        LOGOUT: `/auth/logout`,
    };
    USERS = {
        GET_USER_HOME: `/user/home`,
        REGISTER_USER_COMPLAINTS: `/user/register`,
        GET_COMPLAINT_DETAILS: (complaintId: string | number) => `/user/complaintDetails/${complaintId}`,
    };
    ADMIN = {
        GET_ADMIN_HOME: `/admin/home`,
        GET_COMPLAINT_DETAILS: (complaintId: string | number) => `/admin/complaintDetails/${complaintId}`,
        ADMIN_UPDATE_COMPLAINTS_STATUS: (complaintId: string | number) => `/admin/statusUpdate/${complaintId}`,
    };
    IMAGES = {
        GET_PHOTO: (photoId: string | number) => `/photo/${photoId}`,
    };
}