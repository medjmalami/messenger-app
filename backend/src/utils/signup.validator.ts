const {validator }= require('validator');
import { SignupReq } from "../../../shared/signup.types";
import { Errors } from "../../../shared/signup.types";
const signupValidator = (data : SignupReq) => {


    const { username, email, password } = data;
    let errors : Errors = {};
    if (validator.isEmpty(username)) {
        errors.username = "Username is required";
    }
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