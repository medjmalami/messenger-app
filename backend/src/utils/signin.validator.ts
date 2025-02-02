import { SigninReq } from "../../../shared/signin.types";
import { Errors } from "../../../shared/signin.types";
export const signinValidator = (data : SigninReq) => {


    const { email, password } = data;
    let errors : Errors = {};
    
    
}
