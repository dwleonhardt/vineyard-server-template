import { requestTypes, responseTypes } from './api-types';
import { UserLogic } from '../../logic/logic';
export declare const userRequestHandler: {
    loginUser: (userService: any) => (req: requestTypes.LoginUserRequest) => Promise<responseTypes.LoginUserResponse>;
    registerUser: (userLogic: UserLogic, userService: any) => (req: requestTypes.RegisterUserRequest) => Promise<responseTypes.RegisterUserResponse>;
    logoutUser: (userService: any) => (req: requestTypes.LogoutUserRequest) => Promise<responseTypes.LogoutUserResponse>;
};