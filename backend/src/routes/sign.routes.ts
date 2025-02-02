import { Router } from "express";
import  signup  from "../controllers/sign.controller/signup.controller";
import  signin  from "../controllers/sign.controller/signin.controller";
const router = Router();

router.post("/signup", signup );
router.get("/signin", signin );

export default router;