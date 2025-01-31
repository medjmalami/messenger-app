const {validator }= require('validator');
import { SigninReq } from "../../../shared/signin.types";
import { Errors } from "../../../shared/signin.types";
const signupValidator = (data : SigninReq) => {


    const { email, password } = data;
    let errors : Errors = {};
    if (validator.isEmpty(email)) {
        errors.email = "Email is required";
    }
    if (!validator.isEmail(email)) {
        errors.email = "Email is invalid";
    }
    if (validator.isEmpty(password)) {
        errors.password = "Password is required";
    }
    if (password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    }
    return errors;

    
}

export default signupValidator;