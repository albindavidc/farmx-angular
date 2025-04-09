import { User } from "./auth-state.model";

export interface SignupRequestModel {
    email: string;
    name: string;
    password: string;
    phone?: string;
}

export interface SignupResponseModel {
    success: boolean,
    message?: string;
    tempUser?: Partial<User>;
}