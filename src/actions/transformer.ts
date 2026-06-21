// Transforms the registration form payload coming from the component layer
// into the exact shape the backend's register API expects.
//
// Backend register API contract:
//   firstname, lastname, email, mobile, address, state, city,
//   aadhar (Aadhar number for citizens, Admin ID for admins),
//   password, role ('admin' | 'citizen')

/** Hardcoded Admin ID an admin must supply to register as an admin. */
export const VALID_ADMIN_ID = 'ADMIN-2024';

export type UserRole = 'admin' | 'citizen';

/**
 * Raw payload produced by the Registration component (FormData-derived).
 * Field names mirror what `handleRegister` collects.
 */
export interface RegisterFormPayload {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    state: string;
    city: string;
    role: UserRole;
    password: string;
    confirmPassword: string;
    // Present for citizens
    aadharNumber?: string;
    // Present for admins
    adminId?: string;
}

/** Exact payload the backend register API consumes. */
export interface RegisterApiPayload {
    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
    address: string;
    state: string;
    city: string;
    aadhar: string;
    password: string;
    role: UserRole;
}

export class RegisterTransformError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RegisterTransformError';
    }
}

/**
 * Validates and maps a registration form payload to the backend API payload.
 *
 * Rules:
 *  - password must match confirmPassword.
 *  - role 'admin'  -> `aadhar` is the supplied Admin ID, which must equal VALID_ADMIN_ID.
 *  - role 'citizen'-> `aadhar` is the supplied Aadhar number.
 *  - `phone` is mapped to `mobile`.
 *
 * Throws RegisterTransformError when validation fails.
 */
export function transformRegisterPayload(
    form: RegisterFormPayload,
): RegisterApiPayload {
    // Password confirmation
    if (form.password !== form.confirmPassword) {
        throw new RegisterTransformError('Password and confirm password do not match.');
    }

    // Resolve the `aadhar` field based on role
    let aadhar: string;
    if (form.role === 'admin') {
        const adminId = (form.adminId ?? '').trim();
        if (adminId !== VALID_ADMIN_ID) {
            throw new RegisterTransformError('Invalid Admin ID.');
        }
        aadhar = adminId;
    } else {
        const aadharNumber = (form.aadharNumber ?? '').trim();
        if (!aadharNumber) {
            throw new RegisterTransformError('Aadhar number is required.');
        }
        aadhar = aadharNumber;
    }

    return {
        firstname: form.firstName.trim(),
        lastname: form.lastName.trim(),
        email: form.email.trim(),
        mobile: form.phone.trim(),
        address: form.address.trim(),
        state: form.state.trim(),
        city: form.city.trim(),
        aadhar,
        password: form.password,
        role: form.role,
    };
}
