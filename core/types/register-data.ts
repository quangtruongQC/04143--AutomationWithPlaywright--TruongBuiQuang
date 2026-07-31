/** Fields required by the "required fields only" registration flow. */
export interface RegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    mobile: string;
}

/** Full registration flow requires every field. */
export interface FullRegisterFormData extends RegisterFormData {
    dateOfBirth: string;
    subject: string;
    hobbies: string[];
    address: string;
    state: string;
    city: string;
}
