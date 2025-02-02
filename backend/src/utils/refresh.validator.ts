import { RefreshReq } from "../../../shared/refresh.types";
import { Errors } from "../../../shared/refresh.types";
import { RefreshRes } from "../../../shared/refresh.types";
import { RefreshResSchema } from "../../../shared/refresh.types";

const refreshValidator = (data : RefreshReq) => {


    const { refreshToken, email } = data;
    let errors : Errors = {};


    
}

export default refreshValidator;