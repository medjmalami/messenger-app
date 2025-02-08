import { Router } from "express";
import  signup  from "../controllers/sign.controller/signup.controller";
import  signin  from "../controllers/sign.controller/signin.controller";
import logout from "../controllers/sign.controller/logout.controller";
const router = Router();

router.post("/signup", signup );
router.post("/signin", signin );
router.post("/logout", logout );

export default router;