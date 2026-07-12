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
        password,
        aadharNumber,
        adminId,
    } = params;

    const response = await apiBaseFMCClient.post(apiConstants.AUTH.REGISTER, {
        // Map to the field names the backend User model expects
        firstname: firstName,
        lastname: lastName,
        email,
        mobile: phone,
        address,
        state,
        city,
        role,
        password,
        // Backend model uses 'aadhar' for both citizen and admin identifier
        aadhar: role === 'Admin' ? adminId : aadharNumber,
    });

    return response.data;
}

export const postLogin = async (params: { email: string; password: string; role: string }) => {
    const { email, password, role } = params;

    const response = await apiBaseFMCClient.post(apiConstants.AUTH.LOGIN, {
        email,
        password,
        role,
    });

    return response.data;
}

export const getUserHome = async (params: { userId: string; role: string }) => {
    const { userId, role } = params;
    const response = await apiBaseFMCClient.get(apiConstants.USERS.GET_USER_HOME, {
        headers: {
            Authorization: `${userId}:${role}`
        }
    });
    return response.data;
};

export const getAdminHome = async (params: { userId: string; role: string }) => {
    const { userId, role } = params;
    const response = await apiBaseFMCClient.get(apiConstants.ADMIN.GET_ADMIN_HOME, {
        headers: {
            Authorization: `${userId}:${role}`
        }
    });
    return response.data;
};

export const postLogout = async () => {
    const response = await apiBaseFMCClient.post(apiConstants.AUTH.LOGOUT);
    return response.data;
};

export const postRegisterComplaint = async (params: { formData: FormData; userId: string; role: string }) => {
    const { formData, userId, role } = params;
    const response = await apiBaseFMCClient.post(apiConstants.USERS.REGISTER_USER_COMPLAINTS, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${userId}:${role}`
        }
    });
    return response.data;
};

export const postUpdateStatus = async (params: { complaintId: string | number; formData: FormData; userId: string; role: string }) => {
    const { complaintId, formData, userId, role } = params;
    const response = await apiBaseFMCClient.post(apiConstants.ADMIN.ADMIN_UPDATE_COMPLAINTS_STATUS(complaintId), formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${userId}:${role}`
        }
    });
    return response.data;
};

export const getComplaintDetails = async (params: { complaintId: string | number; role: 'admin' | 'citizen' | 'superadmin'; userId: string }) => {
    const { complaintId, role, userId } = params;
    const endpoint = (role === 'admin' || role === 'superadmin') 
        ? apiConstants.ADMIN.GET_COMPLAINT_DETAILS(complaintId)
        : apiConstants.USERS.GET_COMPLAINT_DETAILS(complaintId);
        
    const response = await apiBaseFMCClient.get(endpoint, {
        headers: {
            Authorization: `${userId}:${role}`
        }
    });
    return response.data;
};

export const getProfile = async (params: { role: string; userId: string }) => {
    const { role, userId } = params;
    const endpoint = (role === 'admin' || role === 'superadmin') ? '/admin/profile' : '/user/profile';
    const response = await apiBaseFMCClient.get(endpoint, {
        headers: {
            Authorization: `${userId}:${role}`
        }
    });
    return response.data;
};

export const postUpdateProfile = async (params: { role: string; userId: string; profileData: any }) => {
    const { role, userId, profileData } = params;
    const endpoint = (role === 'admin' || role === 'superadmin') ? '/admin/profile/update' : '/user/profile/update';
    const response = await apiBaseFMCClient.post(endpoint, profileData, {
        headers: {
            Authorization: `${userId}:${role}`
        }
    });
    return response.data;
};


