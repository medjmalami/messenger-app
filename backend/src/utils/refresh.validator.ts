const {validator }= require('validator');
import { RefreshReq } from "../../../shared/refresh.types";
import { Errors } from "../../../shared/refresh.types";
const refreshValidator = (data : RefreshReq) => {


    const { refreshToken, email } = data;
    let errors : Errors = {};
    if (validator.isEmpty(refreshToken)) {
        errors.refreshToken = "Refresh token is required";
    }
    if (validator.isEmpty(email)) {
        errors.email = "Email is required";
    }
    if (!validator.isEmail(email)) {
        errors.email = "Email is invalid";
    }
    if (validator.isJWT(refreshToken)) {
        errors.refreshToken = "Refresh token is invalid";
    }
    return errors;

    
}

export default refreshValidator;