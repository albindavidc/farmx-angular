import { User } from "./auth-state.model";

export interface SignupRequestModel {
    name: string;
    email: string;
    phone: string;
    role: string;
    password: string;
}

export interface SignupResponseModel {
    success: boolean,
    message?: string;
    data?: Partial<User>;
}